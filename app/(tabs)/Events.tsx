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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/api/firebaseConfig";
import { useAuth } from "../../api/AuthContext";
import { useFocusEffect } from "expo-router"; // Add this import

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

  // Add this effect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        loadPatients();
      }
    }, [user])
  );

  const loadPatients = async () => {
    try {
      const userId = user?.uid;
      if (!userId) return;

      const q = query(
        collection(db, "patients"),
        where("practitionerId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const patientsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data(),
        name: doc.data().name || "Unknown",
        cause: doc.data().cause || "Not specified",
      }));

      setPatients(patientsList);
    } catch (error) {
      console.error("Error loading patients:", error);
      Alert.alert("Error", "Failed to load patients");
    }
  };

  const deletePatient = async (id: string, firestoreId?: string) => {
    Alert.alert(
      "Delete Patient",
      "Are you sure you want to delete this patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (firestoreId) {
              try {
                await deleteDoc(doc(db, "patients", firestoreId));
                setPatients(patients.filter((patient) => patient.id !== id));
              } catch (error) {
                console.error("Error deleting patient:", error);
                Alert.alert("Error", "Failed to delete patient");
              }
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.patientCard}>
      <View style={styles.cardContent}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientCause}>{item.cause}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: "/AddPatient",
              params: {
                patientId: item.firestoreId,
                isEditing: true,
              },
            })
          }
        >
          <Ionicons name="create-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deletePatient(item.id, item.firestoreId)}
        >
          <Ionicons name="trash-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search patients..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={patients.filter((patient) =>
          patient.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  patientCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  patientCause: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#429D7E",
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 8,
  },
});

export default Events;
