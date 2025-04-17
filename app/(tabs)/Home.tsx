import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  AppState,
} from "react-native";
import { patients as samplePatients } from "../../data/sampleData";
import Button from "../../components/shared/Button";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "../../api/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/api/firebaseConfig";
import { useIsFocused } from '@react-navigation/native';

const DEFAULT_PROFILE_IMAGE = require("../../assets/images/favicon.png");

interface Patient {
  id: string;
  name: string;
  cause: string;
}

const PractitionerHome = ({ patients }: { patients: Patient[] }) => {
  return (
    <View style={styles.roleSpecificContainer}>
      <Text style={styles.welcomeText}>Welcome, Doctor!</Text>
      <Text style={styles.subtitle}>Your patient dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{patients.length}</Text>
          <Text style={styles.statLabel}>Active Patients</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Pending Reviews</Text>
        </View>
      </View>
    </View>
  );
};

const PatientHome = () => {
  return (
    <View style={styles.roleSpecificContainer}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subtitle}>Track your recovery progress</Text>
      
      <View style={styles.exerciseContainer}>
        <Text style={styles.sectionTitle}>Your Daily Exercises</Text>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseTitle}>No exercises assigned yet</Text>
          <Text style={styles.exerciseDescription}>
            Your healthcare provider will assign exercises to help with your recovery.
          </Text>
        </View>
      </View>
    </View>
  );
};

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lastUpdateCheck, setLastUpdateCheck] = useState<string>("");
  const isFocused = useIsFocused();
  
  // Check for updates when the component gets focus
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const lastUpdate = await AsyncStorage.getItem('patientsLastUpdated');
        if (lastUpdate && lastUpdate !== lastUpdateCheck) {
          // Data changed, we should refresh
          console.log('Patient data changed, refreshing...');
          setLastUpdateCheck(lastUpdate);
          if (user?.uid) {
            loadPatients();
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };
    
    // Check immediately on mount
    checkForUpdates();
    
    // Set up an interval to check for updates every few seconds
    const interval = setInterval(checkForUpdates, 3000);
    
    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [lastUpdateCheck, user?.uid]);
  
  // Also check when component gets focus
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App came to the foreground
        const checkForUpdates = async () => {
          try {
            const lastUpdate = await AsyncStorage.getItem('patientsLastUpdated');
            if (lastUpdate && lastUpdate !== lastUpdateCheck) {
              // Data changed, we should refresh
              console.log('Patient data changed, refreshing...');
              setLastUpdateCheck(lastUpdate);
              if (user?.uid) {
                loadPatients();
              }
            }
          } catch (error) {
            console.error("Error checking for updates:", error);
          }
        };
        checkForUpdates();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lastUpdateCheck, user?.uid]);
  
  // Update useEffect to depend on user
  useEffect(() => {
    if (user?.uid) {
      loadPatients();
    }
  }, [user]);

  // Add this effect to update the profile image when the component gains focus
  useEffect(() => {
    if (isFocused && user?.photoURL) {
      setProfileImage(user.photoURL);
    }
  }, [isFocused, user?.photoURL]);

  // Update the loadPatients function
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
          firestoreId: doc.id,
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

  // Replace the pickImage function with this one to update auth profile
  const pickImage = useCallback(async () => {
    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in to update your profile picture");
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission Required", "Please allow access to your photo library.");
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setIsLoading(true);
        try {
          const uri = result.assets[0].uri;
          
          // Use the utility function
          const downloadURL = await uploadImageToFirebase(uri, user.uid);
          
          // Update the user's profile
          await updateUserProfile(undefined, downloadURL);
          
          // Update local state
          setProfileImage(downloadURL);
          
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
  }, [user]);

  // Update the goToAddPatient function
  const goToAddPatient = () => {
    if (user?.uid) {
      // Store the current user's ID as practitionerId for consistency
      AsyncStorage.setItem('practitionerId', user.uid).then(() => {
        router.push("/AddPatient");
      });
    } else {
      alert("You must be logged in to add patients");
    }
  };

  // Add handleSearch function after goToAddPatient
  const handleSearch = () => {
    if (!search.trim()) {
      alert("Please enter a patient ID");
      return;
    }
  
    // Try to find the patient in the loaded patients list
    const patient = patients.find(p => 
      p.id.toLowerCase() === search.toLowerCase() || 
      p.id.toLowerCase().includes(search.toLowerCase())
    );
  
    if (patient) {
      // Patient found, navigate to details
      router.push(`/PatientDetail/${patient.id}`);
    } else {
      // Not found in local state, try to fetch from Firestore directly
      searchPatientInFirestore();
    }
  };
  
  // Add the function to search patients in Firestore
  const searchPatientInFirestore = async () => {
    if (!user?.uid || !search.trim()) return;
  
    try {
      // Show loading indicator
      // You could add a state variable for this if you want a loading spinner
      console.log("Searching for patient with ID:", search);
  
      // Query for patients that match the ID and belong to this practitioner
      const q = query(
        collection(db, "patients"),
        where("practitionerId", "==", user.uid),
        where("id", "==", search)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("No patient found with that ID");
        return;
      }
  
      // Get the first matching patient
      const patientDoc = querySnapshot.docs[0];
      const patientData = patientDoc.data();
      
      // Navigate to the patient details
      router.push(`/PatientDetail/${patientData.id}`);
    } catch (error) {
      console.error("Error searching for patient:", error);
      alert("Failed to search for patient. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>VertEase</Text>
      </View>
      
      {user?.role === "practitioner" ? (
        <PractitionerHome patients={patients} />
      ) : user?.role === "patient" ? (
        <PatientHome />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            User role not defined. Please contact support.
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hello,</Text>
          {/* <Text style={styles.username}>
            {user?.displayName || user?.email || "User"}
          </Text> */}
          {user?.role === "practitioner" && (
            <TouchableOpacity style={styles.doctorBadge}>
              <Text style={styles.doctorName}>
                {user?.displayName || "Doctor"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              user?.photoURL 
                ? { uri: user.photoURL } 
                : profileImage 
                  ? { uri: profileImage }
                  : DEFAULT_PROFILE_IMAGE
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter patient ID"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest patients</Text>
        {patients.length > 0 ? (
          patients.slice(0, 2).map((patient: Patient) => (
            <TouchableOpacity 
              key={patient.id} 
              style={styles.patientButton}
              onPress={() => router.push(`/PatientDetail/${patient.id}`)}
            >
              <Text style={styles.patientText}>{patient.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No patients added yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient List</Text>
        {patients.length > 0 ? (
          patients.map((patient: Patient) => (
            <TouchableOpacity 
              key={patient.id} 
              style={styles.patientButton}
              onPress={() => router.push(`/PatientDetail/${patient.id}`)}
            >
              <Text style={styles.patientText}>
                {patient.name}: {patient.cause || "Unknown cause"}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No patients added yet</Text>
        )}
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={goToAddPatient}
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
    marginLeft:4,
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
    alignSelf: "stretch",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roleSpecificContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 25,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  exerciseContainer: {
    marginTop: 10,
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 5,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
    padding: 15,
  },
});
export default HomePage;
