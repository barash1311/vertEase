import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/shared/Button";
import { useAuth } from "../../api/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signIn } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }
    
    if (!password) {
      setError("Please enter your password");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      console.log("Sign in successful");
      // Navigation will be handled by ProtectedRoute component based on role
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/ResetPassword");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Sign in to continue</Text>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Input Fields */}
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

        {/* Forgot Password */}
        <Pressable onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>

        {/* Sign In Button */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Signing in...</Text>
          </View>
        ) : (
          <Button text="Sign In" onPress={handleSignIn} disabled={isLoading} />
        )}

        {/* Sign Up Navigation */}
        <Pressable onPress={() => router.push("/typeOfUser")} disabled={isLoading}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </Pressable>
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
    backgroundColor: "#F9FAFB", // Soft background
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
    marginBottom: 20,
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
  forgotPasswordText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  signUpText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#EF4444", // Red
    marginBottom: 15,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
  },
});


