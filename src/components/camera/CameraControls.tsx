import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface CameraControlsProps {
  onCapture: () => void;
  onFlashToggle: () => void;
  onGalleryOpen: () => void;
  flashMode: 'on' | 'off' | 'auto';
  isCapturing?: boolean;
}

export function CameraControls({
  onCapture,
  onFlashToggle,
  onGalleryOpen,
  flashMode,
  isCapturing = false,
}: CameraControlsProps) {
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].text;

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'off':
        return 'flash-off';
      case 'auto':
        return 'flash-outline';
      default:
        return 'flash-off';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onFlashToggle} disabled={isCapturing}>
        <Ionicons name={getFlashIcon()} size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.captureButton, isCapturing && styles.disabledButton]} 
        onPress={onCapture}
        disabled={isCapturing}
      >
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>

      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.button} onPress={onGalleryOpen} disabled={isCapturing}>
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Moved up from bottom for better thumb reach
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay for better contrast
    paddingTop: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    // Minimum touch target size (10mm × 10mm as per MIT Touch Lab)
  },
  captureButton: {
    width: 76, // Slightly larger for primary action (minimum 10mm)
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  },
  rightControls: {
    flexDirection: 'row',
  },
});
