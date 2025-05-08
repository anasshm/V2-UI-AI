import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/services/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  // User data state
  const [userData, setUserData] = useState({
    name: 'Guest User',
    email: '',
    notifications: true,
    darkMode: false,
  });
  
  // Update user data when auth state changes
  useEffect(() => {
    if (user) {
      console.log('User data updated from auth state:', user);
      setUserData({
        ...userData,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      });
    } else {
      console.log('No user found, using guest data');
      setUserData({
        ...userData,
        name: 'Guest User',
        email: '',
      });
    }
  }, [user]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('Attempting to log out');
      await signOut();
      console.log('Logout successful');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const renderSettingItem = (
    title: string, 
    value?: string | number,
    hasToggle = false,
    toggleValue = false,
    onToggleChange?: (value: boolean) => void
  ) => {
    return (
      <View className="flex-row items-center py-3 px-4">
        <View className="w-8 h-8 rounded-full bg-card-border mr-3 items-center justify-center">
          <View className="w-4 h-4 rounded-full bg-blue-500" />
        </View>
        
        <View className="flex-1">
          <Text className="text-text-primary text-base">{title}</Text>
          {value && <Text className="text-text-secondary text-sm">{value}</Text>}
        </View>
        
        {hasToggle && (
          <Switch
            value={toggleValue}
            onValueChange={onToggleChange}
            trackColor={{ 
              false: '#767577', 
              true: '#4A90E2' 
            }}
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-app-bg">
      <View className="px-4 pt-12 pb-4">
        <Text className="text-text-primary text-2xl font-bold">Profile</Text>
      </View>
      
      <ScrollView className="flex-1">
        {!user ? (
          <View className="p-4 items-center">
            <Text className="text-text-primary text-lg mb-4 text-center">Sign in to track your nutrition</Text>
            <TouchableOpacity 
              className="bg-blue-500 py-3 px-6 rounded-lg"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-white font-semibold text-base">Sign In / Register</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="items-center p-4 mb-4">
              <View className="w-20 h-20 rounded-full bg-blue-500 justify-center items-center mb-3">
                <Text className="text-white text-3xl font-bold">
                  {userData.name.charAt(0)}
                </Text>
              </View>
              <Text className="text-text-primary text-xl font-bold mb-1">{userData.name}</Text>
              {userData.email && <Text className="text-text-secondary">{userData.email}</Text>}
            </View>
          </>
        )}
        
        <View className="mb-6">
          <Text className="text-text-primary text-lg font-semibold px-4 mb-2">App Settings</Text>
          <View className="bg-card-bg rounded-card border border-card-border mb-4">
            {renderSettingItem(
              'Notifications', 
              undefined, 
              true, 
              userData.notifications,
              (value) => setUserData({...userData, notifications: value})
            )}
          </View>
        </View>
        
        {user && (
          <View className="px-4 pb-8">
            <TouchableOpacity 
              className="bg-red-500 py-4 rounded-lg items-center shadow"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold text-base">Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
