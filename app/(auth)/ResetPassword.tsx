import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/shared/Button";
import { useAuth } from "../../api/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await resetPassword(email);
      setSuccess(true);
      
      // Show success alert
      Alert.alert(
        "Password Reset Email Sent",
        "Check your email for instructions to reset your password.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subHeader}>
        Enter your email address to receive a password reset link
      </Text>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Success Message */}
      {success ? (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          <Text style={styles.successText}>
            Please check your email for instructions to reset your password
          </Text>
        </View>
      ) : (
        <>
          {/* Input Field */}
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Reset Button */}
          <Button
            text="Send Reset Link"
            onPress={handleResetPassword}
            disabled={isLoading}
          />
        </>
      )}

      {/* Back to Sign In */}
      <TouchableOpacity
        style={styles.signInLink}
        onPress={() => router.replace("/(auth)/SignIn")}
      >
        <Text style={styles.signInText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 15,
    textAlign: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    marginTop: 10,
    color: "#10B981",
    textAlign: "center",
    fontSize: 16,
  },
  signInLink: {
    marginTop: 30,
  },
  signInText: {
    fontSize: 16,
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
});