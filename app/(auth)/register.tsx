import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/src/services/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

// Create styled components with NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    };

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid; // Keep validation logic for now, though it's not used by the button
  };

  const handleRegister = async () => {
    setLoading(true);
    // Instead of signing up, navigate to the first onboarding step
    router.push('/(onboarding)/step_height_weight'); // Corrected: Start with Height & Weight step
    setLoading(false);
  };

  return (
    <StyledView className="flex-1 bg-white px-6 py-10 justify-center">
      {/* Logo and Title */}
      <StyledView className="items-center mb-8">
        <StyledView className="w-16 h-16 bg-blue-500 rounded-xl items-center justify-center mb-6">
          <Ionicons name="flash" size={32} color="white" />
        </StyledView>
        <StyledText className="text-3xl font-bold text-center mb-2">Brace Yourself</StyledText>
        <StyledText className="text-2xl font-bold text-center">for What's Next</StyledText>
      </StyledView>
      
      {/* Sign up button */}
      <StyledTouchableOpacity 
        className="bg-blue-500 py-4 rounded-lg items-center mb-4"
        onPress={handleRegister}
      >
        <StyledText className="text-white font-semibold text-lg">Get Started</StyledText>
      </StyledTouchableOpacity>
      
      {/* Google login button */}
      <StyledTouchableOpacity 
        className="flex-row bg-white border border-gray-300 py-4 rounded-lg items-center justify-center mb-4"
        onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available in a future update.')}
      >
        <StyledView className="w-5 h-5 mr-2 items-center justify-center">
          <Ionicons name="logo-google" size={18} color="#4285F4" />
        </StyledView>
        <StyledText className="text-black font-semibold">Continue with Google</StyledText>
      </StyledTouchableOpacity>
      
      {/* Apple login button */}
      <StyledTouchableOpacity 
        className="flex-row bg-white border border-gray-300 py-4 rounded-lg items-center justify-center mb-8"
        onPress={() => Alert.alert('Coming Soon', 'Apple sign-in will be available in a future update.')}
      >
        <StyledView className="w-5 h-5 mr-2 items-center justify-center">
          <Ionicons name="logo-apple" size={18} color="#000000" />
        </StyledView>
        <StyledText className="text-black font-semibold">Continue with Apple</StyledText>
      </StyledTouchableOpacity>
      
      {/* Login link */}
      <StyledView className="items-center">
        <StyledTouchableOpacity onPress={() => router.push('/(auth)/login')}> 
          <StyledText className="text-blue-500 font-semibold">Log in</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}

// Styles are now handled by NativeWind classes
