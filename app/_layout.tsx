import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '@/src/services/AuthContext';
import { OnboardingProvider } from './OnboardingContext';
import { useColorScheme } from '@/hooks/useColorScheme';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) { 
        try {
          const onboardingStatus = await AsyncStorage.getItem('onboardingComplete');
          console.log('[RootLayout] Checked onboarding status:', onboardingStatus);
          setIsOnboardingComplete(onboardingStatus === 'true');
        } catch (e) {
          console.error("[RootLayout] Failed to fetch onboarding status", e);
          setIsOnboardingComplete(false); 
        }
      } else {
        setIsOnboardingComplete(null); 
      }
    };

    checkOnboardingStatus();
  }, [user]); 

  useEffect(() => {
    if (isLoading) {
      console.log('[RootLayout] Auth is loading, skipping navigation.');
      return; 
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inPaywallGroup = segments[0] === '(paywall)';
    const isResultsScreen = segments[0] === 'results'; 
    const currentRoute = segments.join('/'); 

    console.log('[RootLayout] Navigation check:', { 
      user: user ? user.id : 'None', 
      isLoading, 
      isOnboardingComplete, 
      inAuthGroup, 
      inAppGroup, 
      inOnboardingGroup,
      inPaywallGroup,
      isResultsScreen,
      currentRoute 
    });

    // --- RE-ENABLE REDIRECTS ---
    
    if (!user) {
      // User is not signed in.
      // Allow them to be in onboarding OR auth.
      // If they are anywhere else, redirect to register.
      if (!inAuthGroup && !inOnboardingGroup) { 
        console.log('[RootLayout] Redirecting unauthenticated user to register...');
        router.replace('/(auth)/register');
      } else {
        console.log('[RootLayout] User not logged in, staying in auth or onboarding group.');
      }
    } else {
      // User IS signed in.
      if (isOnboardingComplete === null) {
        // Still waiting for onboarding status from AsyncStorage
        console.log('[RootLayout] Waiting for onboarding status check...');
        // return; // Return might cause issues if commented out, just don't replace
      } 
      
      if (isOnboardingComplete === false) {
        // User logged in but onboarding NOT complete.
        // Send them to the START of onboarding IF they are not already in the onboarding or paywall group.
        if (!inOnboardingGroup && !inPaywallGroup) { 
          console.log('[RootLayout] User logged in, onboarding incomplete. Redirecting to step_height_weight...');
          router.replace('/(onboarding)/step_height_weight'); 
        } else {
           console.log('[RootLayout] User logged in, onboarding incomplete, already in onboarding/paywall group. Staying.');
        }
      } else if (isOnboardingComplete === true) {
        // User logged in AND onboarding IS complete, go to main app.
        // Do not redirect if user is already in the app group or on the results screen
        if (!inAppGroup && !isResultsScreen) { 
          console.log('[RootLayout] Redirecting to main app (tabs)...');
          router.replace('/(tabs)'); // Go to the main app
        }
      }
    }
    
    // --- END OF RE-ENABLED REDIRECTS ---

  }, [user, isLoading, isOnboardingComplete, segments, router]);

  if (isLoading || isOnboardingComplete === null && user) {
     console.log('[RootLayout] Loading auth or onboarding status, returning null.');
     return null; 
  }

  console.log('[RootLayout] Render Stacks');
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} /> 
      <Stack.Screen name="(paywall)" options={{ headerShown: false }} /> 
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      {/* Define other root-level screens if needed */}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <OnboardingProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}
