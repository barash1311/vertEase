import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../api/AuthContext";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../api/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";
import { uploadImageToFirebase } from "../../utils/imageUpload";

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [patientCount, setPatientCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          if (user.role === "practitioner") {
            // Count patients directly from the patients collection
            const q = query(collection(db, "patients"), where("practitionerId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setPatientCount(querySnapshot.size);
            
            console.log(`Found ${querySnapshot.size} patients for practitioner ${user.uid}`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await logout();
              // Navigation will be handled by the ProtectedRoute component
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            } finally {
              setIsLoading(false);
            }
          } 
        }
      ]
    );
  };

  const handleResetPassword = () => {
    router.push("/(auth)/ResetPassword");
  };

  const updateProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission Required", "Please allow access to your photo library to update your profile picture.");
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && user?.uid) {
        setIsLoading(true);
        
        try {
          const uri = result.assets[0].uri;
          
          // Use the utility function
          const downloadURL = await uploadImageToFirebase(uri, user.uid);
          
          // Update user profile
          await updateUserProfile(undefined, downloadURL);
          Alert.alert("Success", "Profile picture updated successfully!");
        } catch (error) {
          console.error("Error updating profile image:", error);
          Alert.alert("Error", "Failed to update profile picture. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#429D7E" />
      </View>
    );
  }

  const getRoleInfo = () => {
    if (user.role === "practitioner") {
      return (
        <View style={styles.roleInfoContainer}>
          <Text style={styles.roleBadge}>Healthcare Provider</Text>
          <Text style={styles.info}>Total Patients: {patientCount}</Text>
        </View>
      );
    } else if (user.role === "patient") {
      return (
        <View style={styles.roleInfoContainer}>
          <Text style={styles.roleBadge}>Patient</Text>
        </View>
      );
    } else {
      return <Text style={styles.info}>Role not specified</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      
      <TouchableOpacity onPress={updateProfileImage}>
        <Image 
          source={{ 
            uri: user.photoURL || "https://via.placeholder.com/100" 
          }} 
          style={styles.profileImage} 
        />
        <View style={styles.editIconContainer}>
          <Text style={styles.editIcon}>✎</Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.userName}>{user.displayName || "User"}</Text>
      
      {getRoleInfo()}
      
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Email: {user.email}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#429D7E",
    marginBottom: 20,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 15,
    right: 0,
    backgroundColor: "#429D7E",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  editIcon: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  roleInfoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  roleBadge: {
    fontSize: 16,
    color: "white",
    backgroundColor: "#429D7E",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  info: {
    fontSize: 16,
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