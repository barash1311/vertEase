// screens/SignIn.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import Button from "../../components/shared/Button";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Handle sign-in logic here
    router.push("/(tabs)/Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable onPress={() => console.log("Forgot Password pressed")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(auth)/SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </Pressable>
      <Button text="Sign In" onPress={handleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6", // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827", // Tailwind gray-900
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: "#D1D5DB", // Tailwind gray-300
    borderWidth: 1,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginBottom: 10,
  },
  signUpText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginBottom: 20,
  },
});
