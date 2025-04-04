import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Button from "../components/shared/Button";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Disclaimer() {
  const router = useRouter();

  const handleAccept = async () => {
    await AsyncStorage.setItem("disclaimerAccepted", "true");
    router.replace("/landing"); // Prevent going back to disclaimer
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Disclaimer</Text>
        <Text style={styles.content}>
          This application provides general information and is not a substitute
          for professional medical advice.
        </Text>
      </View>
      <Button text="Accept" onPress={handleAccept} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F3F4F6",
  },
  contentWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
});
