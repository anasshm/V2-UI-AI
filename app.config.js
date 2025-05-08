module.exports = {
  expo: {
    name: "foodnsap",
    slug: "foodnsap",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "foodnsap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.foodnsap.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.foodnsap.app",
      permissions: ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Foodnsap to access your camera to take photos of food for nutritional analysis.",
          "microphonePermission": "Allow Foodnsap to access your microphone."
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Allow Foodnsap to access your photos to save captured food images.",
          "savePhotosPermission": "Allow Foodnsap to save photos to your photo library.",
          "isAccessMediaLocationEnabled": true
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      supabaseUrl: "https://zytvlzdocsiqnyhjhcbs.supabase.co",
      supabaseAnon: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dHZsemRvY3NpcW55aGpoY2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTc5NzUsImV4cCI6MjA2MTM3Mzk3NX0.QqNoGgZEZhwmFj6CegGI2nf__FiKeWhVcLyPDItP_XE",
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
