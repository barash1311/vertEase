import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../components/shared/Button";
import { useAuth, UserRole } from "../../api/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userRole = params.role as UserRole || "patient";
  
  // Debug logs
  console.log("SignUp screen - received role param:", params.role);
  console.log("SignUp screen - using role:", userRole);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signUp } = useAuth();

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return false;
    }
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!password) {
      setError("Please enter a password");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    setError("");
    return true;
  };

  const uploadImage = async (uri: string): Promise<string> => {
    if (!imageFile) return "";
    
    try {
      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create unique filename
      const fileExtension = uri.split('.').pop();
      const fileName = `profile_${Date.now()}.${fileExtension}`;
      
      // Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${fileName}`);
      
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    console.log(`Starting signup process for ${userRole} role`);
    
    try {
      let imageUrl = "";
      if (profileImage) {
        imageUrl = await uploadImage(profileImage);
      }
      
      // Explicitly log the role being used for signup
      console.log(`Creating user with role: ${userRole}`);
      
      await signUp(email, password, fullName, userRole, imageUrl);
      
      Alert.alert(
        "Account Created",
        `Your ${userRole} account has been created successfully!`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/SignIn")
          }
        ]
      );
      
    } catch (error: any) {
      console.error("SignUp error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        setImageFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking image:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subHeader}>
          Register as a {userRole === "practitioner" ? "Healthcare Provider" : "Patient"}
        </Text>

        {/* Role Indicator Badge */}
        <View style={[
          styles.roleBadge, 
          userRole === "practitioner" ? styles.practitionerBadge : styles.patientBadge
        ]}>
          <Text style={styles.roleBadgeText}>
            {userRole === "practitioner" ? "PRACTITIONER" : "PATIENT"}
          </Text>
        </View>

        {/* Profile Image Picker */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="photo-camera" size={28} color="#9CA3AF" />
              <Text style={styles.placeholderText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name(Dr. John Doe)"
          value={fullName}
          onChangeText={setFullName}
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />

        {/* Sign In Navigation */}
        <Pressable onPress={() => router.push("/(auth)/SignIn")} disabled={isLoading}>
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
        </Pressable>

        {/* Sign Up Button */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Creating your account...</Text>
          </View>
        ) : (
          <Button text="Sign Up" onPress={handleSignUp} disabled={isLoading} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB", // Light background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937", // Dark gray
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#6B7280", // Medium gray
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 20,
  },
  practitionerBadge: {
    backgroundColor: "#10B981", // Green
  },
  patientBadge: {
    backgroundColor: "#3B82F6", // Blue
  },
  roleBadgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 1,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#429D7E", // Tailwind green-500
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB", // Light gray
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB", // Tailwind gray-300
  },
  placeholderText: {
    fontSize: 12,
    color: "#6B7280", // Tailwind gray-500
    marginTop: 5,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#D1D5DB", // Tailwind gray-300
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  signInText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#EF4444", // Red
    marginBottom: 15,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
  },
});


