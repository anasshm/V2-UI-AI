import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CameraOverlayProps {
  showGuide?: boolean;
}

export function CameraOverlay({ showGuide = true }: CameraOverlayProps) {
  if (!showGuide) return null;
  
  return (
    <View style={styles.container}>
      {showGuide && (
        <View style={styles.guideContainer}>
          <ThemedText style={styles.guideText}>
            Capture your entire food in the frame
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideContainer: {
    position: 'absolute',
    top: 80, // Positioned at the top for better visibility
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better readability
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    // Add subtle elevation for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    maxWidth: '80%',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500', // Slightly bolder text for better readability
    textAlign: 'center',
  },
});
