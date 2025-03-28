// screens/TypeOfUser.tsx
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function TypeOfUser() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Role</Text>
            <TouchableOpacity
                style={[styles.button, styles.patientButton]}
                onPress={() => router.push("/(auth)/SignUp")}
            >
                <Text style={styles.buttonText}>Patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.practitionerButton]}
                onPress={() => router.push("/(auth)/SignUp")}
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
        padding: 20,
        backgroundColor: "#F9FAFB", // Light gray background
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1F2937", // Tailwind gray-800
        marginBottom: 30,
        textAlign: "center",
    },
    button: {
        width: "80%",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
    },
    patientButton: {
        backgroundColor: "#3B82F6", // Tailwind blue-500
    },
    practitionerButton: {
        backgroundColor: "#10B981", // Tailwind green-500
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF", // White text
    },
});
