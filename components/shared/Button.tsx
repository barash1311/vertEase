// components/Shared/Button.tsx
import React from "react";
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";

type ButtonProps = {
    text: string;
    onPress: (event: GestureResponderEvent) => void; // Explicitly typing the event
};

const Button: React.FC<ButtonProps> = ({ text, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#34D399", // Tailwind green-400
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Button;
