import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { supabase, signInWithEmail, signUpWithEmail, signOut as supabaseSignOut, getCurrentUser, getCurrentSession } from './supabase';

// Define the shape of our auth context
interface AuthContextType {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: { name?: string }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount and set up auth state listener
  useEffect(() => {
    // Get the current user and session asynchronously
    const fetchUserAndSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log('Current user on mount:', currentUser);
        
        const currentSession = await getCurrentSession();
        console.log('Current session on mount:', currentSession);
        
        setUser(currentUser);
        setSession(currentSession);
      } catch (error) {
        console.error('Error fetching auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndSession();

    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session });
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Sign in function using our helper function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      const { user, session, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful:', { user, session });
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  // Sign up function using our helper function
  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      console.log('Attempting sign up with:', { email });
      const { user, error, session } = await signUpWithEmail(email, password, metadata);
      
      console.log('Sign up response:', { 
        user: user ? 'User exists' : 'No user', 
        error: error ? error.message : 'No error',
        session: session ? 'Session exists' : 'No session'
      });
      
      if (user) {
        // Manually update the state
        setUser(user);
        setSession(session);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  // Sign out function using our helper function
  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      const { error } = await supabaseSignOut();
      
      if (!error) {
        // Manually clear the state
        setUser(null);
        setSession(null);
        console.log('Sign out successful');
      } else {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Reset password function using Supabase v2
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'foodnsap://reset-password',
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
