// screens/Disclaimer.tsx
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Button from "../components/shared/Button";
import { useRouter } from "expo-router";

export default function Disclaimer() {
  const router = useRouter();

  const handleAccept = () => {
    router.push("/landing");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Disclaimer</Text>
      <Text style={styles.content}>
        This is where your disclaimer text will go. You can add as much text as
        needed to cover all necessary legal information.
      </Text>
      <Button text="Accept" onPress={handleAccept} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  content: {
    fontSize: 14,
    color: "#6B7280", // Tailwind gray-500
    textAlign: "center",
    marginBottom: 20,
  },
});
