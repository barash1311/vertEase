import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../../api/AuthContext";
import { StatusBar } from "expo-status-bar";
import Button from "../../components/shared/Button";
import { useRouter } from "expo-router";

export default function PatientHome() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // ProtectedRoute will handle the redirection
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.displayName?.split(" ")[0] || "Patient"}
        </Text>
        <Text style={styles.title}>Patient Portal</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Image 
          source={require("../../assets/images/under-development.png")} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.developmentText}>
          Patient Portal Under Development
        </Text>
        
        <Text style={styles.descriptionText}>
          We're working hard to bring you the best experience. The patient portal will be available soon with features to track your recovery progress, communicate with your practitioner, and more.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            text="Go to Profile" 
            onPress={() => router.push("/(tabs)/profile")} 
            variant="outlined"
          />
          
          <Button 
            text="Log Out" 
            onPress={handleLogout} 
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  developmentText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
});