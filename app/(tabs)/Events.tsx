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
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/api/firebaseConfig";
import { useAuth } from "../../api/AuthContext";

const Events: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [patients, setPatients] = useState<
    { id: string; name: string; cause: string; firestoreId?: string }[]
  >([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (user?.uid) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    try {
      // Get the current user's ID to use as practitionerId
      const userId = user?.uid;
      
      if (!userId) {
        console.log("No user ID found");
        return;
      }
      
      console.log("Loading patients for practitioner ID:", userId);
      
      // Query Firestore for patients with this practitioner ID
      const q = query(collection(db, "patients"), where("practitionerId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      console.log("Found patients count:", querySnapshot.docs.length);
      
      const patientsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: data.id || doc.id,
          name: data.name || "Unknown Name",
          cause: data.cause || "Unknown cause",
          firestoreId: doc.id,  // Store the Firebase document ID for deletion
        };
      });
      
      // Update state with the fetched patients
      setPatients(patientsList);
      
      // Also update AsyncStorage for offline access
      await AsyncStorage.setItem('patients', JSON.stringify(patientsList));
    } catch (error) {
      console.error("Error loading patients from Firestore:", error);
      
      // Fall back to AsyncStorage if Firestore fails
      try {
        const storedPatientsString = await AsyncStorage.getItem("patients");
        if (storedPatientsString) {
          setPatients(JSON.parse(storedPatientsString));
        }
      } catch (storageError) {
        console.error("Failed to load patients from AsyncStorage:", storageError);
      }
    }
  };

  // Update the deletePatient function to trigger a refresh
  const deletePatient = async (id: string, firestoreId?: string) => {
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
            try {
              // Delete from Firestore first
              if (firestoreId) {
                await deleteDoc(doc(db, "patients", firestoreId));
                console.log("Patient deleted from Firestore:", firestoreId);
              } else {
                console.warn("No Firestore ID available for deletion");
              }
              
              // Update local state and AsyncStorage
              const updatedPatients = patients.filter(
                (patient) => patient.id !== id
              );
              setPatients(updatedPatients);
              await AsyncStorage.setItem(
                "patients",
                JSON.stringify(updatedPatients)
              );
              
              // Also delete the detailed patient data from AsyncStorage
              await AsyncStorage.removeItem(`patient-${id}`);
              
              // Set a flag to indicate data change for other screens to detect
              await AsyncStorage.setItem('patientsLastUpdated', new Date().toISOString());
              
              Alert.alert("Success", "Patient deleted successfully");
            } catch (error) {
              console.error("Error deleting patient:", error);
              Alert.alert("Error", "Failed to delete patient. Please try again.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const goToAddPatient = () => {
    if (user?.uid) {
      // Store the current user ID as practitionerId for consistency
      AsyncStorage.setItem('practitionerId', user.uid).then(() => {
        router.push("/AddPatient");
      });
    } else {
      Alert.alert("Error", "You must be logged in to add patients");
    }
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
      {patients.length > 0 ? (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.patientCard}
              onPress={() => router.push(`/PatientDetail/${item.id}`)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.patientName}>{item.name}</Text>
                <Text style={styles.patientCause}>Cause: {item.cause}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent onPress
                  deletePatient(item.id, item.firestoreId);
                }}
              >
                <Ionicons name="trash" size={22} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No patients found</Text>
          <Text style={styles.emptySubtext}>Add a new patient to get started</Text>
        </View>
      )}

      {/* Bottom Navigation Bar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={goToAddPatient}
      >
        <Text style={styles.addButtonText}>+ Add Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add to Styles
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
});

export default Events;
