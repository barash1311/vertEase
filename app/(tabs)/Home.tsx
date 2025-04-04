import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { patients } from "../../data/sampleData";
import Button from "../../components/shared/Button";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const DEFAULT_PROFILE_IMAGE = require("../../assets/images/favicon.png");

interface Patient {
  id: string;
  name: string;
  cause: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>vertigo user</Text>
          <TouchableOpacity style={styles.doctorBadge}>
            <Text style={styles.doctorName}>Dr. Harrisson</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : DEFAULT_PROFILE_IMAGE}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter patient Id"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Patients Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest patients</Text>
        {patients.slice(0, 2).map((patient: Patient) => (
          <TouchableOpacity key={patient.id} style={styles.patientButton}>
            <Text style={styles.patientText}>{patient.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Patient List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient List</Text>
        {patients.map((patient: Patient) => (
          <TouchableOpacity key={patient.id} style={styles.patientButton}>
            <Text style={styles.patientText}>
              {patient.name}: {patient.cause}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Improved + Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push("/AddPatient")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    color: "#111827",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#429D7E",
  },
  doctorBadge: {
    backgroundColor: "#429D7E",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  doctorName: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "bold",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  searchButton: {
    padding: 8,
    backgroundColor: "#429D7E",
    borderRadius: 10,
  },
  searchIcon: {
    fontSize: 16,
    color: "#FFF",
  },
  section: {
    width: "100%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  patientButton: {
    backgroundColor: "#429D7E",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  patientText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#429D7E",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch", // Make it match the list width
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1, // Improve readability
  }
});

export default HomePage;
