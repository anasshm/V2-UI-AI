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

const heightsFtIn = () => {
  const options = [];
  for (let ft = 3; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      options.push(`${ft}'${inch}"`);
    }
  }
  return options;
};
const weightsLbs = generateRange(60, 440, 1, ' lbs');

const defaultMetricHeight = '165 cm';
const defaultMetricWeight = '52 kg';
const defaultImperialHeight = "5'5\"";
const defaultImperialWeight = '115 lbs';

export default function StepHeightWeightScreen() {
  const router = useRouter();
  const [isMetric, setIsMetric] = useState(true);

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
    calculateInitialIndex(isMetric ? heightsCm : heightsFtIn, isMetric ? defaultMetricHeight : defaultImperialHeight)
  );
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(() =>
    calculateInitialIndex(isMetric ? weightsKg : weightsLbs, isMetric ? defaultMetricWeight : defaultImperialWeight)
  );

  const heightOptions = useMemo(() => (isMetric ? heightsCm : heightsFtIn()), [isMetric]);
  const weightOptions = useMemo(() => (isMetric ? weightsKg : weightsLbs), [isMetric]);

  // Effect for when isMetric changes
  useEffect(() => {
    setSelectedHeightIndex(
      calculateInitialIndex(isMetric ? heightsCm : heightsFtIn, isMetric ? defaultMetricHeight : defaultImperialHeight)
    );
    setSelectedWeightIndex(
      calculateInitialIndex(isMetric ? weightsKg : weightsLbs, isMetric ? defaultMetricWeight : defaultImperialWeight)
    );
  }, [isMetric]);

  const handleContinue = () => {
    // Logic to save height and weight can be added here (e.g., to state management or AsyncStorage)
    console.log('Selected Height:', heightOptions[selectedHeightIndex]);
    console.log('Selected Weight:', weightOptions[selectedWeightIndex]);
    console.log('Units:', isMetric ? 'Metric' : 'Imperial');
    router.push('/(onboarding)/step5_gender'); // Navigate to the next step
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

      <StyledView className="flex-row items-center justify-center mb-8">
        <StyledText className={`text-lg font-medium ${!isMetric ? 'text-gray-700' : 'text-gray-400'}`}>
          Imperial
        </StyledText>
        <StyledSwitch
          trackColor={{ false: '#d1d5db', true: '#2563eb' }} // gray-300, blue-600
          thumbColor={isMetric ? '#ffffff' : '#ffffff'}
          ios_backgroundColor="#e5e7eb" // gray-200
          onValueChange={() => setIsMetric(previousState => !previousState)}
          value={isMetric}
          className="mx-3 scale-110"
        />
        <StyledText className={`text-lg font-medium ${isMetric ? 'text-gray-700' : 'text-gray-400'}`}>
          Metric
        </StyledText>
      </StyledView>

      <StyledView className="flex-row justify-around w-full mb-10 px-5">
        <StyledView className="items-center w-2/5">
          <StyledText className="text-xl font-semibold mb-3 text-gray-700">Height</StyledText>
          <WheelPicker
            key={`${isMetric ? 'metric' : 'imperial'}-height`}
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
            key={`${isMetric ? 'metric' : 'imperial'}-weight`}
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
          className="bg-gray-800 p-4 rounded-full items-center"
          onPress={handleContinue}
        >
          <StyledText className="text-white text-lg font-semibold">Continue</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}
