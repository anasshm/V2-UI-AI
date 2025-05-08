import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/src/services/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

// Create styled components with NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    console.log('Login form validated, attempting login with:', { email });
    setLoading(true);
    
    try {
      // For testing purposes, let's create a test account if one doesn't exist
      if (email === 'test@example.com' && password === 'password123') {
        // Try to sign up first if the user doesn't exist
        const checkSignUp = await signIn(email, password);
        if (checkSignUp.error && checkSignUp.error.message.includes('Invalid login credentials')) {
          console.log('Test user does not exist, creating test account');
          await signUp(email, password, { name: 'Test User' });
          // Now try to sign in with the newly created account
          await signIn(email, password);
        }
      } else {
        // Normal login flow
        const { error } = await signIn(email, password);
        console.log('Login response received:', { error: error ? 'Error exists' : 'No error' });
        
        if (error) {
          let errorMessage = 'An error occurred during sign in';
          
          if (error.message === 'Invalid login credentials') {
            errorMessage = 'Invalid email or password';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          console.log('Login failed with error:', errorMessage);
          Alert.alert('Login Failed', errorMessage);
          setLoading(false);
          return;
        }
      }
      
      // If we got here, login was successful
      console.log('Login successful, navigating to tabs');
      
      // Force navigation to tabs after a short delay to allow state to update
      setTimeout(() => {
        try {
          router.replace('/(tabs)');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Try alternate navigation method
          router.navigate('/(tabs)');
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Login catch block error:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white">
      <StyledKeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <StyledScrollView 
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with title */}
          <StyledView className="flex-row items-center justify-between mb-10">
            <StyledTouchableOpacity 
              className="p-2" 
              onPress={() => router.back()}
            >
              <StyledText className="text-blue-500 text-base">Cancel</StyledText>
            </StyledTouchableOpacity>
            <StyledText className="text-lg font-semibold">Log In</StyledText>
            <StyledView className="w-14" />
          </StyledView>

          {/* App Logo */}
          <StyledView className="items-center mb-6">
            <StyledView className="w-14 h-14 bg-blue-500 rounded-xl items-center justify-center mb-6">
              <Ionicons name="flash" size={28} color="white" />
            </StyledView>
          </StyledView>
          
          {/* Login form */}
          <StyledView className="mb-4">
            <StyledTextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-md w-full"
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => setTouched({ ...touched, email: true })}
            />
            {touched.email && errors.email ? (
              <StyledText className="text-red-500 mt-1">{errors.email}</StyledText>
            ) : null}
          </StyledView>
          
          <StyledView className="mb-2">
            <StyledTextInput
              className="bg-gray-100 text-gray-800 p-4 rounded-md w-full"
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onBlur={() => setTouched({ ...touched, password: true })}
            />
            {touched.password && errors.password ? (
              <StyledText className="text-red-500 mt-1">{errors.password}</StyledText>
            ) : null}
          </StyledView>
          
          <StyledView className="items-end mb-6">
            <Link href="/(auth)/forgot-password" asChild>
              <StyledTouchableOpacity className="py-2">
                <StyledText className="text-blue-500 text-sm">Forgot Password?</StyledText>
              </StyledTouchableOpacity>
            </Link>
          </StyledView>
          
          <StyledTouchableOpacity 
            className="bg-blue-500 py-4 rounded-lg items-center mb-6"
            onPress={handleLogin}
            disabled={loading}
          >
            <StyledText className="text-white font-semibold text-lg">
              {loading ? 'Logging in...' : 'Log In'}
            </StyledText>
          </StyledTouchableOpacity>
          
          <StyledView className="flex-row items-center mb-6">
            <StyledView className="flex-1 h-px bg-gray-200" />
            <StyledText className="mx-4 text-gray-500 text-sm">OR</StyledText>
            <StyledView className="flex-1 h-px bg-gray-200" />
          </StyledView>
          
          <StyledTouchableOpacity 
            className="flex-row bg-white border border-gray-300 py-4 rounded-lg items-center justify-center mb-4"
            onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available in a future update.')}
          >
            <StyledView className="w-5 h-5 mr-2 items-center justify-center">
              <Ionicons name="logo-google" size={18} color="#4285F4" />
            </StyledView>
            <StyledText className="text-black font-semibold">Continue with Google</StyledText>
          </StyledTouchableOpacity>
          
          <StyledTouchableOpacity 
            className="flex-row bg-white border border-gray-300 py-4 rounded-lg items-center justify-center mb-8"
            onPress={() => Alert.alert('Coming Soon', 'Apple sign-in will be available in a future update.')}
          >
            <StyledView className="w-5 h-5 mr-2 items-center justify-center">
              <Ionicons name="logo-apple" size={18} color="#000000" />
            </StyledView>
            <StyledText className="text-black font-semibold">Continue with Apple</StyledText>
          </StyledTouchableOpacity>
          
          <StyledView className="flex-row justify-center">
            <StyledText className="text-gray-600 mr-1">Don't have an account?</StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/(auth)/register')}> 
              <StyledText className="text-blue-500 font-semibold">Sign Up</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </StyledKeyboardAvoidingView>
    </StyledView>
  );
}

// Styles are now handled by NativeWind classes
