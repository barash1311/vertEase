import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Profile: React.FC = () => {
  // Sample user data (Replace with actual API/user context)
  const user = {
    name: "Dr. John Doe",
    userId: "123456789XYZ",
    email: "example@gmail.com",
    patientsCount: 1,
    profileImage: "https://via.placeholder.com/100",
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.info}>User ID: {user.userId}</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>Total Patients: {user.patientsCount}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 5,
  },
  button: {
    width: "80%",
    padding: 12,
    backgroundColor: "#00796B",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
