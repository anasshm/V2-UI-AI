import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FoodAnalysisCard } from '@/components/food/FoodAnalysisCard';
import { analyzeFoodImage, FoodAnalysisResult } from '@/services/aiVisionService';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { uploadThumbnail, saveMeal } from '@/services/mealService';
import { useAuth } from '@/src/services/AuthContext';
import { syncSupabaseAuth } from '@/services/authUtils';
import { supabase } from '@/services/db';
import { styled } from 'nativewind';

export default function ResultsScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [result, setResult] = useState<FoodAnalysisResult | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  useEffect(() => {
    if (!imageUri) {
      setError('No image provided');
      setIsLoading(false);
      // Navigate back to camera if no image is provided
      setTimeout(() => {
        router.replace('/(tabs)/camera');
      }, 1000);
      return;
    }

    // Analyze the food image
    analyzeFood();

    // Set a timeout to navigate back to camera if analysis takes too long
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Analysis timeout reached, returning to camera');
        router.replace('/(tabs)/camera');
      }
    }, 30000); // 30 seconds timeout

    return () => clearTimeout(timeout);
  }, [imageUri]);

  const analyzeFood = async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      
      // Provide haptic feedback to indicate analysis has started
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Call the AI Vision service
      const analysisResult = await analyzeFoodImage(imageUri as string);
      
      // Update state with the result
      setResult(analysisResult);
      
      // Provide success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Error analyzing food:', err);
      setError('Failed to analyze the food image. Please try again.');
      
      // Provide error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Analysis Error',
        'There was a problem analyzing your food image. Please try again.',
        [{ 
          text: 'OK', 
          onPress: () => {
            // Navigate back to camera on error
            router.replace('/(tabs)/camera');
          }
        }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    analyzeFood();
  };

  const handleBack = () => {
    // Always go back to camera tab to ensure consistent navigation
    router.replace('/(tabs)/camera');
  };

  const handleSaveMeal = async () => {
    console.log('Starting meal save process');
    if (!result || !imageUri || !user) {
      console.log('Missing data:', { hasResult: !!result, hasImageUri: !!imageUri, hasUser: !!user });
      Alert.alert('Error', 'Missing data required to save meal');
      return;
    }

    try {
      setIsSaving(true);
      
      // Provide haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Ensure auth is synchronized
      await syncSupabaseAuth();
      
      let thumbnailUrl = '';
      
      try {
        // Upload thumbnail directly from URI
        const fileUri = imageUri as string;
        thumbnailUrl = await uploadThumbnail(fileUri);
        console.log('Thumbnail uploaded successfully:', thumbnailUrl);
      } catch (uploadError: any) {
        console.error('Error uploading thumbnail:', uploadError);
        // Continue with saving the meal even if thumbnail upload fails
        // Just use a placeholder URL
        thumbnailUrl = 'https://via.placeholder.com/300x200?text=Upload+Failed';
      }
      
      // Try direct SQL insertion to bypass schema cache issues
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Insert using raw SQL to avoid schema cache issues
        console.log('Attempting RPC call with params:', {
          p_name: result.name,
          p_thumbnail_url: thumbnailUrl,
          p_calories: result.calories || 0,
          p_protein: result.protein || 0,
          p_carbs: result.carbs || 0,
          p_fat: result.fat || 0
        });
        
        const { data, error } = await supabase.rpc('insert_meal', {
          p_name: result.name,
          p_thumbnail_url: thumbnailUrl,
          p_calories: Math.round(Number(result.calories)) || 0,
          p_protein: Math.round(Number(result.protein)) || 0,
          p_carbs: Math.round(Number(result.carbs)) || 0,
          p_fat: Math.round(Number(result.fat)) || 0
        });
        
        if (error) throw error;
        
        console.log('Meal saved successfully via RPC:', data);
      } catch (sqlError: any) {
        console.error('Error with RPC insert:', sqlError);
        
        // Fallback to regular insert with all required fields
        console.log('Attempting fallback insert with correct column names');
        const { data, error } = await supabase
          .from('meals')
          .insert({
            name: result.name,
            user_id: user.id,
            calories: Math.round(Number(result.calories)) || 0,
            protein: Math.round(Number(result.protein)) || 0,
            carbs: Math.round(Number(result.carbs)) || 0,
            fat: Math.round(Number(result.fat)) || 0,
            image_url: thumbnailUrl,
            meal_time: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        console.log('Meal saved with fallback method:', data);
      }
      
      // Set saving state to false
      setIsSaving(false);
      
      // Success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Meal saved successfully');
      
      // Navigate to dashboard
      console.log('Navigating back to dashboard');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Error saving meal:', err);
      
      // Error feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', `Failed to save meal: ${err?.message || 'Unknown error'}`);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Navigate to dashboard without saving
    router.replace('/(tabs)');
  };

  const StyledView = styled(View);
  const StyledText = styled(Text);
  const StyledTouchableOpacity = styled(TouchableOpacity);
  
  return (
    <StyledView className="flex-1 bg-gray-50">
      <StyledView className="flex-1 px-4 pt-14">
        <ScrollView showsVerticalScrollIndicator={false}>
          {imageUri ? (
            <StyledView className="pb-8">
              <FoodAnalysisCard
                result={result}
                isLoading={isLoading}
              />
              
              {/* Action buttons */}
              {!isLoading && result && (
                <StyledView className="flex-row justify-between mt-6 mb-10 mx-auto w-11/12">
                  <StyledTouchableOpacity 
                    className="flex-1 py-4 rounded-lg items-center justify-center mx-2 bg-gray-400"
                    onPress={handleCancel}
                    disabled={isSaving}
                  >
                    <StyledText className="text-white font-semibold text-base">Cancel</StyledText>
                  </StyledTouchableOpacity>
                  
                  <StyledTouchableOpacity 
                    className="flex-1 py-4 rounded-lg items-center justify-center mx-2 bg-green-500"
                    onPress={handleSaveMeal}
                    disabled={isSaving}
                  >
                    <StyledText className="text-white font-semibold text-base">
                      {isSaving ? 'Saving...' : 'Save Meal'}
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              )}
            </StyledView>
          ) : (
            <StyledView className="flex-1 items-center justify-center p-8">
              <Ionicons name="image-outline" size={64} color={colors.text} />
              <StyledText className="mt-4 text-base text-center text-gray-600">No image available</StyledText>
            </StyledView>
          )}
        </ScrollView>
      </StyledView>
    </StyledView>
  );
}

// Styles are now handled by NativeWind classes
