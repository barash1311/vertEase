import { Redirect } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Redirecting...</Text>
      <ActivityIndicator size="large" color="#10B981" />
      <Redirect href="/landing" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB", // Light gray background
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280", // Tailwind gray-500
    marginBottom: 10,
  },
});
