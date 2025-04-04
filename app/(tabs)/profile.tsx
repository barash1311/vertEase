import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Profile: React.FC = () => {
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
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#429D7E",
    marginBottom: 20,
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  info: {
    fontSize: 17,
    color: "#444",
    marginBottom: 6,
  },
  button: {
    width: "90%",
    padding: 15,
    backgroundColor: "#429D7E",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Profile;