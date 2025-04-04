import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Events: React.FC = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<
    { id: string; name: string; cause: string }[]
  >([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const storedPatients = await AsyncStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  };

  const deletePatient = async (id: string) => {
    Alert.alert(
      "Delete Patient",
      "Are you sure you want to delete this patient?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const updatedPatients = patients.filter(
              (patient) => patient.id !== id
            );
            setPatients(updatedPatients);
            await AsyncStorage.setItem(
              "patients",
              JSON.stringify(updatedPatients)
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients List</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patient..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <View style={styles.cardContent}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientCause}>Cause: {item.cause}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePatient(item.id)}
            >
              <Ionicons name="trash" size={22} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/AddPatient")}
      >
        <Text style={styles.addButtonText}>+ Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E5E5E5" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#00856F",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderColor: "#00856F",
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  patientName: { fontSize: 20, fontWeight: "bold", color: "#429D7E" },
  patientCause: { fontSize: 16, color: "#429D7E" },
  deleteButton: {
    backgroundColor: "#D90429",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#429D7E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
});

export default Events;
