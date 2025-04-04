import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function TypeOfUser() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.subtitle}>
        Choose how you want to use the application.
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.patientButton]}
        onPress={() => router.push("/(auth)/SignUp")}
        activeOpacity={0.8} // Reduce opacity on press for feedback
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.practitionerButton]}
        onPress={() => router.push("/(auth)/SignUp")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Practitioner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F9FAFB", // Tailwind light gray
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F2937", // Tailwind gray-800
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280", // Tailwind gray-500
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "85%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000", // Button shadow for better visibility
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4, // Android shadow
  },
  patientButton: {
    backgroundColor: "#3B82F6", // Tailwind blue-500
  },
  practitionerButton: {
    backgroundColor: "#10B981", // Tailwind green-500
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
    textTransform: "uppercase",
    letterSpacing: 1, // Slight letter spacing for readability
  },
});
