import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Define gender options
const GENDER_OPTIONS = [
  { id: 'male', text: 'Male' },
  { id: 'female', text: 'Female' },
  { id: 'other', text: 'Other' },
];

export default function Step5GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const goToNextStep = () => {
    if (selectedGender) {
      // TODO: Save the selection
      console.log('User gender:', selectedGender);
      // Navigate to the next screen (final signup/login)
      router.push('/(onboarding)/step4_workouts'); // Navigate to workouts step
    }
  };

  const renderOption = (option: typeof GENDER_OPTIONS[0]) => {
    const isSelected = selectedGender === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        className={`items-center p-4 border rounded-lg mb-3 ${_STYLES.optionBase} ${isSelected ? _STYLES.optionSelected : _STYLES.optionUnselected}`}
        onPress={() => setSelectedGender(option.id)}
      >
        {/* No icon needed here based on example */}
        <Text className={`${isSelected ? 'text-white' : 'text-gray-800'} text-base font-medium`}>{option.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerTitle: () => null, headerLeft: () => null }} />
      
      <ScrollView 
        className="flex-1 p-6"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} 
      >
        <Text className="text-3xl font-bold mb-2 text-gray-800">
          Choose your Gender
        </Text>
        <Text className="text-base text-gray-600 mb-8">
          This will be used to calibrate your custom plan.
        </Text>

        <View className="flex-1 justify-center">
          {GENDER_OPTIONS.map(renderOption)}
        </View>

      </ScrollView>

      <View className="absolute bottom-1 left-0 right-0 px-7 py-10 bg-white border-t border-gray-200">
        <TouchableOpacity
          className={`py-5 px-4 rounded-full items-center ${selectedGender ? 'bg-onboarding-primary' : 'bg-gray-300'}`}
          onPress={goToNextStep}
          disabled={!selectedGender}
        >
          <Text className={`text-lg font-semibold ${selectedGender ? 'text-white' : 'text-gray-500'}`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reusing styles
const _STYLES = {
  optionBase: 'border-gray-200',
  optionUnselected: 'bg-gray-100',
  optionSelected: 'bg-onboarding-primary border-onboarding-primary',
};
