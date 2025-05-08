import React from 'react';
import { View, Text, Image } from 'react-native';
import { format } from 'date-fns';
import { Meal } from '@/models/meal';

type RecentMealCardProps = {
  meal: Meal;
};

export default function RecentMealCard({ meal }: RecentMealCardProps) {
  // Format the time
  const formattedTime = meal.meal_time ? format(new Date(meal.meal_time), 'h:mm a') : '';
  
  return (
    <View className="bg-card-bg rounded-card p-4 mb-3 border border-card-border flex-row">
      {/* Meal Image */}
      <View className="w-16 h-16 rounded-xl overflow-hidden mr-3">
        <Image 
          source={{ uri: meal.image_url || 'https://via.placeholder.com/100' }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      
      {/* Meal Details */}
      <View className="flex-1 justify-center">
        <View className="flex-row justify-between items-start">
          <Text className="text-text-primary font-medium text-base">{meal.name || 'Unknown'}</Text>
          <Text className="text-text-secondary text-xs">{formattedTime}</Text>
        </View>
        
        {/* Nutrition Icons */}
        <View className="flex-row mt-2 items-center">
          <View className="flex-row items-center mr-3">
            <View className="w-2 h-2 rounded-full bg-calories mr-1" />
            <Text className="text-text-secondary text-xs">{meal.calories || 0} calories</Text>
          </View>
          
          <View className="flex-row items-center mr-3">
            <View className="w-2 h-2 rounded-full bg-protein mr-1" />
            <Text className="text-text-secondary text-xs">{meal.protein || 0}g</Text>
          </View>
          
          <View className="flex-row items-center mr-3">
            <View className="w-2 h-2 rounded-full bg-carbs mr-1" />
            <Text className="text-text-secondary text-xs">{meal.carbs || 0}g</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-fat mr-1" />
            <Text className="text-text-secondary text-xs">{meal.fat || 0}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
