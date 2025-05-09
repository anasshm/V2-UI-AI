import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WheelPicker from 'react-native-wheely';
import { Stack, useRouter } from 'expo-router';

// Helper to generate a range of numbers
const generateRange = (start: number, end: number, step: number = 1, prefix: string = '', suffix: string = '') => {
  const range = [];
  for (let i = start; i <= end; i += step) {
    range.push(`${prefix}${i}${suffix}`);
  }
  return range;
};

const currentYear = new Date().getFullYear();

// Data for pickers
const dayOptions = generateRange(1, 31);
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const yearOptions = generateRange(1950, 2015);

// Default selections
const defaultDay = '15'; // Changed default day
const defaultMonth = monthNames[5]; // June (0-indexed)
const defaultYear = '2000'; // Changed default year

export default function StepDateOfBirthScreen() {
  const router = useRouter();

  const renderWheelyItem = useCallback((optionText: string) => (
    <Text style={{ fontSize: 18, color: '#1C1C1E' }}>{optionText}</Text>
  ), []);

  const calculateInitialIndex = (options: string[], targetValue: string) => {
    const idx = options.indexOf(targetValue);
    return idx !== -1 ? idx : 0;
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(() =>
    calculateInitialIndex(dayOptions, defaultDay)
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() =>
    calculateInitialIndex(monthNames, defaultMonth)
  );
  const [selectedYearIndex, setSelectedYearIndex] = useState(() =>
    calculateInitialIndex(yearOptions, defaultYear)
  );

  const handleContinue = () => {
    const selectedDate = {
      day: dayOptions[selectedDayIndex],
      month: monthNames[selectedMonthIndex],
      year: yearOptions[selectedYearIndex],
    };
    console.log('Selected Date of Birth:', selectedDate);
    router.push('/(onboarding)/step5_gender'); // Next step after this new screen
  };

  return (
    <View className="flex-1 bg-white pt-10">
      <Stack.Screen options={{ headerTitle: () => null, headerLeft: () => null }} />

      <View className="px-6 mb-8 items-center">
        <Text className="text-3xl font-bold mb-2 text-[#1C1C1E] text-center">When were you born?</Text>
        <Text className="text-base text-[#1C1C1E] text-center">
          This will be used to calibrate your custom plan.
        </Text>
      </View>

      <View className="flex-row justify-around w-full mb-10 px-5">
        <View className="items-center w-1/4">
          <Text className="text-xl font-semibold mb-3 text-[#1C1C1E]">Day</Text>
          <WheelPicker
            key="day-picker"
            selectedIndex={selectedDayIndex}
            options={dayOptions}
            onChange={(index) => setSelectedDayIndex(index)}
            renderItem={renderWheelyItem}
            selectedIndicatorStyle={{ backgroundColor: '#f3f4f6', borderRadius: 8, height: 40 }}
            containerStyle={{ height: 200, width: '100%' }}
            itemHeight={40}
          />
        </View>

        <View className="items-center w-2/5">
          <Text className="text-xl font-semibold mb-3 text-[#1C1C1E]">Month</Text>
          <WheelPicker
            key="month-picker"
            selectedIndex={selectedMonthIndex}
            options={monthNames}
            onChange={(index) => setSelectedMonthIndex(index)}
            renderItem={renderWheelyItem}
            selectedIndicatorStyle={{ backgroundColor: '#f3f4f6', borderRadius: 8, height: 40 }}
            containerStyle={{ height: 200, width: '100%' }}
            itemHeight={40}
          />
        </View>

        <View className="items-center w-1/3">
          <Text className="text-xl font-semibold mb-3 text-[#1C1C1E]">Year</Text>
          <WheelPicker
            key="year-picker"
            selectedIndex={selectedYearIndex}
            options={yearOptions}
            onChange={(index) => setSelectedYearIndex(index)}
            renderItem={renderWheelyItem}
            selectedIndicatorStyle={{ backgroundColor: '#f3f4f6', borderRadius: 8, height: 40 }}
            containerStyle={{ height: 200, width: '100%' }}
            itemHeight={40}
          />
        </View>
      </View>

      <View className="w-full px-6 absolute bottom-10">
        <TouchableOpacity
          className="bg-[#3A82F6] p-4 rounded-full items-center"
          onPress={handleContinue}
        >
          <Text className="text-white text-lg font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
