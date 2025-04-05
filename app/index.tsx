import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../api/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { user, loading } = useAuth();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean | null>(null);
  const [checkingStorage, setCheckingStorage] = useState(true);
  
  useEffect(() => {
    const checkDisclaimer = async () => {
      try {
        const value = await AsyncStorage.getItem("disclaimerAccepted");
        setDisclaimerAccepted(value === "true");
      } catch (error) {
        console.error("Error checking disclaimer:", error);
      } finally {
        setCheckingStorage(false);
      }
    };
    
    checkDisclaimer();
  }, []);
  
  if (loading || checkingStorage) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }
  
  // Redirect logic
  if (user) {
    return <Redirect href="/(tabs)/Home" />;
  } else if (disclaimerAccepted) {
    return <Redirect href="/landing" />;
  } else {
    return <Redirect href="/disclaimer" />;
  }
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
