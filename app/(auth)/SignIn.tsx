import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/shared/Button";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    router.push("/(tabs)/Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subHeader}>Sign in to continue</Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forgot Password */}
      <Pressable onPress={() => console.log("Forgot Password pressed")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>

      {/* Sign In Button */}
      <Button text="Sign In" onPress={handleSignIn} />

      {/* Sign Up Navigation */}
      <Pressable onPress={() => router.push("/(auth)/SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});


