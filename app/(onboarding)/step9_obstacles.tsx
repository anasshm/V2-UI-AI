import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Define the type for an option
type ObstacleOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Define options for the obstacles screen with explicit typing
const OBSTACLE_OPTIONS: ObstacleOption[] = [
  { id: 'consistency', label: 'Lack of consistency', icon: 'repeat-outline' },
  { id: 'habits', label: 'Unhealthy eating habits', icon: 'fast-food-outline' },
  { id: 'support', label: 'Lack of support', icon: 'people-outline' },
  { id: 'schedule', label: 'Busy schedule', icon: 'calendar-outline' },
  { id: 'inspiration', label: 'Lack of meal inspiration', icon: 'bulb-outline' },
];

export default function Step9ObstaclesScreen() {
  const router = useRouter();
  const [selectedObstacle, setSelectedObstacle] = useState<string | null>(null);

  const handleSelectObstacle = (obstacleId: string) => {
    setSelectedObstacle(obstacleId);
  };

  const goToNextStep = () => {
    if (selectedObstacle) {
      console.log('Obstacle selected:', selectedObstacle);
      router.push('/(onboarding)/paywall'); // Navigate to Paywall (final step)
    }
  };

  // Reusable component for rendering options - type matches ObstacleOption
  const renderOption = (option: ObstacleOption) => {
    const isSelected = selectedObstacle === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        // Apply exact styling from step2
        className={`flex-row items-center p-4 border rounded-lg mb-4 ${isSelected ? 'bg-onboarding-primary border-onboarding-primary' : 'bg-white border-gray-300'}`}
        onPress={() => handleSelectObstacle(option.id)}
      >
        <Ionicons 
          name={option.icon} 
          size={20} // Target size
          color={isSelected ? 'white' : '#333'} // Target colors
          className="mr-3" // Target margin
        />
        <Text 
          // Target text styling
          className={`${isSelected ? 'text-white' : 'text-gray-800'} text-base font-medium`}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: () => null, headerLeft: () => null }} />
      
      <ScrollView 
        className="flex-1 p-6"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} // Ensure it can grow, bottom padding for button
      >
        {/* Title and Description stay at the top */}
        <Text className="text-3xl font-bold mb-8 text-gray-800">
          What's stopping you from reaching your goals?
        </Text>

        {/* Container for options - This view expands and centers the buttons */}
        <View className="flex-1 justify-center">
          {OBSTACLE_OPTIONS.map(renderOption)}
        </View>

      </ScrollView>

      {/* Fixed Continue Button at the bottom */}
      <View className="absolute bottom-1 left-0 right-0 px-7 py-10 bg-white border-t border-gray-200">
        <TouchableOpacity
          className={`py-5 px-4 rounded-full items-center ${selectedObstacle ? 'bg-onboarding-primary' : 'bg-gray-300'}`}
          onPress={goToNextStep}
          disabled={!selectedObstacle}
        >
          <Text className={`text-lg font-semibold ${selectedObstacle ? 'text-white' : 'text-gray-500'}`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
