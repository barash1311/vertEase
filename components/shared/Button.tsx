// components/Shared/Button.tsx
import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator ,
} from "react-native";

type ButtonProps = {
  text: string;
  onPress: (event: GestureResponderEvent) => void; // Explicitly typing the event
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ text, onPress,disabled = false }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
       {disabled ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.text}>{text}</Text>}
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
  disabledButton: {
    backgroundColor: "#9CA3AF", // Gray when disabled
  },
});

export default Button;
