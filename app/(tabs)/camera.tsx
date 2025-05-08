import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { CameraOverlay } from '@/src/components/camera/CameraOverlay';
import { CameraControls } from '@/src/components/camera/CameraControls';
import { processImageForAI } from '@/src/utils/imageProcessor';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define styles for the camera screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  analyzingContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  analyzingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  guideToggleButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
});

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const isFocused = useIsFocused(); // Check if this screen is currently focused
  
  // Permission states
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
  
  // Camera states
  const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisTimeout, setAnalysisTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // UI states
  const [showGuide, setShowGuide] = useState(true);
  
  // Use the camera permissions hook
  const [permission, requestPermission] = useCameraPermissions();
  
  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      // Request camera permissions
      if (permission) {
        setHasCameraPermission(permission.granted);
      } else {
        const result = await requestPermission();
        setHasCameraPermission(result.granted);
      }
      
      // Request media library permissions
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      
      // Request image picker permissions
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);
  
  // Toggle camera guide visibility
  const toggleGuide = () => {
    setShowGuide(prev => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle opening the gallery
  const handleGalleryOpen = async () => {
    try {
      // Check if we have permission
      if (!hasGalleryPermission) {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!galleryStatus.granted) {
          Alert.alert('Permission required', 'We need access to your photo gallery to select images.');
          return;
        }
        setHasGalleryPermission(galleryStatus.status === 'granted');
      }
      
      // Launch image picker without forcing cropping
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing/cropping to use full photos
        quality: 0.9,
        allowsMultipleSelection: false,
        exif: true, // Include EXIF data if available
      });
      
      // Handle result
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Create a photo object from the selected image
        const photo = {
          uri: selectedImage.uri,
          width: selectedImage.width || 800,
          height: selectedImage.height || 600,
          exif: selectedImage.exif,
          base64: selectedImage.base64 || undefined
        };
        
        // Provide haptic feedback for image selection
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Process and analyze the image immediately
        await processAndAnalyzeImage(photo);
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  
  const handleFlashToggle = () => {
    setFlashMode((current: 'on' | 'off' | 'auto') => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };
  

  
  // Camera action handlers
  
  // Take a picture with the camera and analyze it immediately
  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Use lower quality and disable base64 encoding for faster capture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: false,
        exif: false,
        skipProcessing: true
      });
      
      setIsCapturing(false);
      
      // Provide haptic feedback for photo capture
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Process and analyze the image immediately instead of showing preview
      await processAndAnalyzeImage(photo);
      
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsCapturing(false);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };
  
  // Cancel analysis and reset the camera
  const handleCancelAnalysis = () => {
    // Clear any existing timeout
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
      setAnalysisTimeout(null);
    }
    
    // Reset analyzing state
    setIsAnalyzing(false);
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Process and analyze image in one step
  const processAndAnalyzeImage = async (photo: {
    uri: string;
    width: number;
    height: number;
    exif?: any;
    base64?: string;
  }) => {
    try {
      setIsAnalyzing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Process the image for AI analysis
      const processedImageUri = await processImageForAI(photo.uri);
      
      // Set a timeout to automatically reset to camera if navigation doesn't happen
      // This prevents the app from getting stuck if there's an issue with navigation
      const timeout = setTimeout(() => {
        console.log('Analysis timeout reached, resetting camera');
        setIsAnalyzing(false);
      }, 30000); // 30 seconds timeout
      
      setAnalysisTimeout(timeout);
      
      // Navigate to results screen with the processed image URI
      router.push({
        pathname: "/results",
        params: { imageUri: processedImageUri }
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsAnalyzing(false);
      Alert.alert("Error", "Failed to analyze image. Please try again.");
    }
  };
  

  
  // Render loading state while permissions are being checked
  if (hasCameraPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <ThemedText style={styles.permissionText}>Requesting camera permissions...</ThemedText>
      </ThemedView>
    );
  }
  
  // Render permission request if camera permission is not granted
  if (hasCameraPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.permissionText}>
          We need camera permission to take photos of your food.
        </ThemedText>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
  
  // Render camera view
  return (
    <ThemedView style={styles.container}>
      {/* Only render camera when tab is focused */}
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          videoStabilizationMode="off"
          zoom={0}
          flash={flashMode}
        />
      ) : (
        <View style={styles.camera} />
      )}
      
      {/* UI elements as siblings, not children of CameraView */}
      {isFocused && (
        <View style={StyleSheet.absoluteFill}>
          {/* Camera overlay with guides */}
          <CameraOverlay showGuide={showGuide} />
          
          {/* Camera controls */}
          <CameraControls
            onCapture={takePicture}
            onFlashToggle={handleFlashToggle}
            onGalleryOpen={handleGalleryOpen}
            flashMode={flashMode}
            isCapturing={isCapturing}
          />
        </View>
      )}
      
      {/* Analyzing overlay */}
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <View style={styles.analyzingContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <ThemedText style={styles.analyzingText}>Analyzing your food...</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}
