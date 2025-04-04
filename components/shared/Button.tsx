// components/Shared/Button.tsx
import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type ButtonProps = {
  text: string;
  onPress: (event: GestureResponderEvent) => void; // Explicitly typing the event
};

const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "85%",
    backgroundColor: "#10B981", // Tailwind Green-500
    paddingVertical: 14,
    borderRadius: 30, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.8,
  },
});

export default Button;
