import { View, Text, ScrollView, RefreshControl, FlatList } from 'react-native';
import { listMeals, getTodaysMeals } from '@/services/mealService';
import { format } from 'date-fns';
import { Meal } from '@/models/meal';
import React, { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';

// Import our new NativeWind styled components
import NutritionSummaryCard from '@/components/NutritionSummaryCard';
import RecentMealCard from '@/components/RecentMealCard';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Function to fetch meals
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all meals for the Recently Eaten section
      const allMeals = await listMeals();
      setMeals(allMeals);
      
      // Fetch today's meals for the nutrition summary
      const mealsFromToday = await getTodaysMeals();
      setTodaysMeals(mealsFromToday);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load meals on component mount
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);
  
  // Calculate nutrition totals
  const nutritionTotals = {
    calories: todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
    protein: todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
    carbs: todaysMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
    fat: todaysMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0),
  };

  return (
    <View className="flex-1 bg-app-bg">
      <View className="px-4 pt-12 pb-4">
        <Text className="text-text-primary text-2xl font-bold">Dashboard</Text>
        <Text className="text-text-secondary">Today, {format(new Date(), 'MMMM d')}</Text>
      </View>
      
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMeals}
            tintColor="#000"
          />
        }
      >
        {/* Nutrition Summary Card */}
        <NutritionSummaryCard 
          calories={nutritionTotals.calories}
          protein={nutritionTotals.protein}
          carbs={nutritionTotals.carbs}
          fat={nutritionTotals.fat}
        />
        
        {/* Recently Eaten Section */}
        <View className="mb-4">
          <Text className="text-text-primary text-lg font-semibold mb-2">Recently Eaten</Text>
          
          {meals.length === 0 ? (
            <View className="bg-card-bg rounded-card p-4 border border-card-border">
              <Text className="text-text-secondary text-center">
                No meals logged yet. Tap the Camera tab to log your first meal!
              </Text>
            </View>
          ) : (
            <FlatList
              data={meals.slice(0, 4)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RecentMealCard meal={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
        
        {/* Nutrition Tips Section */}
        <View className="bg-card-bg rounded-card p-4 mb-4 border border-card-border">
          <Text className="text-text-primary text-lg font-semibold mb-2">Nutrition Tips</Text>
          <Text className="text-text-secondary">
            Try to include protein with every meal to help maintain muscle mass and keep you feeling full longer.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
