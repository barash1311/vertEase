import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Events: React.FC = () => {
  const navigation = useNavigation();
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

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search patient..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientCause}>Cause: {item.cause}</Text>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/AddPatient")}
        >
          <Text style={styles.buttonText}>➕ Add Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={loadPatients}>
          <Text style={styles.buttonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  patientCard: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
  },
  patientName: { fontSize: 18, fontWeight: "bold" },
  patientCause: { fontSize: 14, color: "gray" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#00796B",
  },
  navButton: { padding: 10 },
  buttonText: { color: "white", fontSize: 16 },
});

export default Events;
