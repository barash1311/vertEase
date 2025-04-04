import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../components/shared/Button";

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSignUp = () => {
    console.log("Sign Up pressed");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subHeader}>Your information is safe with us</Text>

      {/* Profile Image Picker */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="photo-camera" size={28} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign In Navigation */}
      <Pressable onPress={() => router.push("/(auth)/SignIn")}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </Pressable>

      {/* Sign Up Button */}
      <Button text="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB", // Light background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937", // Dark gray
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: "#6B7280", // Medium gray
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#429D7E", // Tailwind green-500
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB", // Light gray
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB", // Tailwind gray-300
  },
  placeholderText: {
    fontSize: 12,
    color: "#6B7280", // Tailwind gray-500
    marginTop: 5,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#D1D5DB", // Tailwind gray-300
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  signInText: {
    fontSize: 14,
    color: "#3B82F6", // Tailwind blue-500
    marginBottom: 20,
    textDecorationLine: "underline",
  },
});


