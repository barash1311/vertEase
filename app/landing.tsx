// screens/LandingPage.tsx
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
      <Text style={styles.title}>
        Vertigo <Text style={styles.plus}>+</Text>
      </Text>
      <Image
        source={require("../assets/images/favicon.png")}
        style={styles.image}
      />
      <Text style={styles.subtitle}>CONSULT SPECIALIST DOCTORS</Text>
      <Text style={styles.subtitle}>SECURELY | PRIVATELY</Text>
      <Button text="Get Started" onPress={handleGetStarted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E5E7EB", // Light gray background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10B981", // Tailwind green-500
    marginBottom: 10,
  },
  plus: {
    color: "#10B981",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151", // Tailwind gray-700
    textAlign: "center",
    marginVertical: 2,
  },
});

export default LandingPage;