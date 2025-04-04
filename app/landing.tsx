import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Button from "../components/shared/Button";
import { useRouter } from "expo-router";

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/typeOfUser");
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        Vertigo<Text style={styles.plus}>+</Text>
      </Text>

      {/* Illustration */}
      <Image
        source={require("../assets/images/favicon.png")} // Replace with correct image
        style={styles.image}
      />

      {/* Subtitle */}
      <Text style={styles.subtitle}>CONSULT SPECIALIST DOCTORS</Text>
      <Text style={styles.subtitle}>SECURELY | PRIVATELY</Text>

      <Button text="Get Started →" onPress={handleGetStarted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    backgroundColor: "#F8FAFC", // Light background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10B981",
    textAlign: "center",
  },
  plus: {
    color: "#10B981",
  },
  image: {
    width: "90%",
    height: 250,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 1,
  },
  button: {
    width: "90%", // Make button full width
  },
});

export default LandingPage;
