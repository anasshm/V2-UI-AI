import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import WheelPicker from 'react-native-wheely';
import { styled } from 'nativewind';
import { Stack, useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSwitch = styled(Switch);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Helper to generate a range of numbers
const generateRange = (start: number, end: number, step: number = 1, unit: string = '') => {
  const range = [];
  for (let i = start; i <= end; i += step) {
    range.push(`${i}${unit}`);
  }
  return range;
};

// Data for pickers
const heightsCm = generateRange(100, 250, 1, ' cm');
const weightsKg = generateRange(30, 200, 1, ' kg');

const defaultMetricHeight = '165 cm';
const defaultMetricWeight = '52 kg';

export default function StepHeightWeightScreen() {
  const router = useRouter();

  // Memoized renderItem function
  const renderWheelyItem = useCallback((optionText: string) => (
    <Text style={{ fontSize: 18, color: '#6b7280' }}>{optionText}</Text>
  ), []);

  // Helper to calculate index safely
  const calculateInitialIndex = (optionsFuncOrArray: (() => string[]) | string[], targetValue: string) => {
    const options = typeof optionsFuncOrArray === 'function' ? optionsFuncOrArray() : optionsFuncOrArray;
    const idx = options.indexOf(targetValue);
    return idx !== -1 ? idx : 0;
  };

  const [selectedHeightIndex, setSelectedHeightIndex] = useState(() =>
    calculateInitialIndex(heightsCm, defaultMetricHeight)
  );
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(() =>
    calculateInitialIndex(weightsKg, defaultMetricWeight)
  );

  const heightOptions = useMemo(() => heightsCm, []);
  const weightOptions = useMemo(() => weightsKg, []);

  const handleContinue = () => {
    // Logic to save height and weight can be added here (e.g., to state management or AsyncStorage)
    console.log('Selected Height:', heightOptions[selectedHeightIndex]);
    console.log('Selected Weight:', weightOptions[selectedWeightIndex]);
    console.log('Units: Metric');
    router.push('/(onboarding)/step_date_of_birth'); // Navigate to the new date of birth step
  };

  return (
    <StyledView className="flex-1 bg-white pt-10">
      <Stack.Screen options={{ headerTitle: () => null, headerLeft: () => null }} />

      <StyledView className="px-6 mb-8 items-center">
        <StyledText className="text-3xl font-bold mb-2 text-gray-800 text-center">Height & weight</StyledText>
        <StyledText className="text-base text-gray-600 text-center">
          This will be used to calibrate your custom plan.
        </StyledText>
      </StyledView>

      <StyledView className="flex-row justify-around w-full mb-10 px-5">
        <StyledView className="items-center w-2/5">
          <StyledText className="text-xl font-semibold mb-3 text-gray-700">Height</StyledText>
          <WheelPicker
            key="metric-height"
            selectedIndex={selectedHeightIndex}
            options={heightOptions}
            onChange={(index) => setSelectedHeightIndex(index)}
            renderItem={renderWheelyItem}
            selectedIndicatorStyle={{ backgroundColor: '#f3f4f6', borderRadius: 8, height: 40 }} 
            containerStyle={{ height: 200, width: '100%' }}
            itemHeight={40}
          />
        </StyledView>

        <StyledView className="items-center w-2/5">
          <StyledText className="text-xl font-semibold mb-3 text-gray-700">Weight</StyledText>
          <WheelPicker
            key="metric-weight"
            selectedIndex={selectedWeightIndex}
            options={weightOptions}
            onChange={(index) => setSelectedWeightIndex(index)}
            renderItem={renderWheelyItem}
            selectedIndicatorStyle={{ backgroundColor: '#f3f4f6', borderRadius: 8, height: 40 }} 
            containerStyle={{ height: 200, width: '100%' }}
            itemHeight={40}
          />
        </StyledView>
      </StyledView>

      <StyledView className="w-full px-6 absolute bottom-10">
        <StyledTouchableOpacity 
          className="bg-[#3A82F6] p-4 rounded-full items-center"
          onPress={handleContinue}
        >
          <StyledText className="text-white text-lg font-semibold">Continue</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}
