import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Define the type for an option
type GoalOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Define options for the goal screen with explicit typing
const GOAL_OPTIONS: GoalOption[] = [
  { id: 'lose', label: 'Lose weight', icon: 'trending-down-outline' },
  { id: 'maintain', label: 'Maintain', icon: 'remove-outline' }, // Placeholder icon
  { id: 'gain', label: 'Gain weight', icon: 'trending-up-outline' },
];

export default function Step6GoalScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const goToNextStep = () => {
    if (selectedGoal) {
      console.log('Goal selected:', selectedGoal);
      router.push('/(onboarding)/step7_diet'); // Navigate to Diet step
    }
  };

  // Reusable component for rendering options - type matches GoalOption
  const renderOption = (option: GoalOption) => {
    const isSelected = selectedGoal === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        className={`flex-row items-center p-4 border rounded-lg mb-4 ${isSelected ? 'bg-onboarding-primary border-onboarding-primary' : 'bg-white border-gray-300'}`}
        onPress={() => handleSelectGoal(option.id)}
      >
        <Ionicons 
          name={option.icon} 
          size={20} 
          color={isSelected ? 'white' : '#333'} 
          className="mr-3"
        />
        <Text 
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
        <Text className="text-3xl font-bold mb-2 text-gray-800">
          What is your goal?
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          This helps us generate a plan for your calorie intake.
        </Text>

        {/* Container for options - This view expands and centers the buttons */}
        <View className="flex-1 justify-center">
          {GOAL_OPTIONS.map(renderOption)}
        </View>

      </ScrollView>

      {/* Fixed Continue Button at the bottom */}
      <View className="absolute bottom-1 left-0 right-0 px-7 py-10 bg-white border-t border-gray-200">
        <TouchableOpacity
          className={`py-5 px-4 rounded-full items-center ${selectedGoal ? 'bg-onboarding-primary' : 'bg-gray-300'}`}
          onPress={goToNextStep}
          disabled={!selectedGoal}
        >
          <Text className={`text-lg font-semibold ${selectedGoal ? 'text-white' : 'text-gray-500'}`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
