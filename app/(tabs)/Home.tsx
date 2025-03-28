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
  const router=useRouter();
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>vertigo user</Text>
          <Text style={styles.doctorName}>Dr. Harrisson</Text>
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage ? { uri: profileImage } : DEFAULT_PROFILE_IMAGE
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter patient Id"
          value={search}
          onChangeText={setSearch}
        />
        <Button text="Search" onPress={() => console.log("Search:", search)} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest patients</Text>
        {patients.slice(0, 2).map((patient: Patient) => (
          <Text key={patient.id} style={styles.patientItem}>
            {patient.name}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient List</Text>
        {patients.map((patient: Patient) => (
          <Text key={patient.id} style={styles.patientItem}>
            {patient.name}: {patient.cause}
          </Text>
        ))}
        <Button text="+" onPress={() => router.push('/AddPatient')} />
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
    color: "#10B981",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  doctorName: {
    fontSize: 16,
    color: "#6B7280",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    marginRight: 10,
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
  patientItem: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 5,
  },
});

export default HomePage;
