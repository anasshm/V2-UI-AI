import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { listMeals } from '@/services/mealService';
import { Meal } from '@/models/meal';
import VerticalMealCardNW from '@/components/VerticalMealCardNW';



export default function HistoryScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch meals
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      // Get all meals for the history
      const allMeals = await listMeals(50, 0); // Get up to 50 meals
      setMeals(allMeals);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load meals when component mounts
  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <View className="flex-1 bg-app-bg">
      <View className="px-4 pt-12 pb-4">
        <Text className="text-text-primary text-2xl font-bold">Meal History</Text>
      </View>
      
      <FlatList
        data={meals}
        renderItem={({ item }) => <VerticalMealCardNW meal={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMeals}
            tintColor="#000"
          />
        }
        ListEmptyComponent={
          <View className="bg-card-bg rounded-card p-4 mx-4 border border-card-border">
            <Text className="text-text-secondary text-center">
              {loading ? 'Loading meals...' : 'No meals logged yet. Tap the Camera tab to log your first meal!'}
            </Text>
          </View>
        }
      />
    </View>
  );

}
