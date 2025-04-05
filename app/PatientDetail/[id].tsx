import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatField = (key, value) => {
  if (value === null || value === undefined || value === "") return "Not specified";
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "None";
  }
  
  // Handle objects (like duration)
  if (typeof value === "object") {
    const parts = [];
    for (const [unit, amount] of Object.entries(value)) {
      if (amount && amount !== "0" && amount !== "") {
        parts.push(`${amount} ${unit}`);
      }
    }
    return parts.length > 0 ? parts.join(", ") : "None";
  }
  
  // Return simple values
  return value.toString();
};

const getFieldLabel = (key) => {
  const labels = {
    id: "Patient ID",
    name: "Name",
    age: "Age",
    sex: "Sex",
    cause: "Cause",
    vertigo: "Vertigo Description",
    onset: "Vertigo Onset",
    vertigoSensation: "Vertigo Sensation Type",
    episodicOrPersistent: "Pattern",
    duration: "Duration of Vertigo",
    episodeDuration: "Episode Duration",
    remission: "Remission Between Episodes",
    triggers: "Triggers",
    headMovementEffect: "Head Movement Effect",
    headInjury: "Recent Head Injury",
    symptoms: "Associated Symptoms",
    earSymptoms: "Ear Symptoms",
    hearingLossSide: "Hearing Loss Side",
    hearingLossOnset: "Hearing Loss Onset",
    hearingLossDuration: "Hearing Loss Duration",
    hearingLossProgression: "Hearing Loss Progression",
    cerebellumSymptoms: "Cerebellar Symptoms",
    cranialNerveSymptoms: "Cranial Nerve Symptoms",
    comorbidities: "Comorbidities",
    antiepileptics: "Antiepileptic Medications",
    antipsychotics: "Antipsychotic Medications",
    ototoxicDrugs: "Ototoxic Drugs",
    medicationsTaken: "Medications Taken for Vertigo",
  };
  
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
};

const PatientDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadPatientData();
  }, [id]);
  
  const loadPatientData = async () => {
    try {
      setLoading(true);
      const patientData = await AsyncStorage.getItem(`patient-${id}`);
      
      if (patientData) {
        setPatient(JSON.parse(patientData));
      } else {
        // Fallback to check in patients list
        const allPatients = await AsyncStorage.getItem("patients");
        if (allPatients) {
          const patients = JSON.parse(allPatients);
          const foundPatient = patients.find(p => p.id === id);
          if (foundPatient) {
            setPatient(foundPatient);
          }
        }
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#429D7E" />
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }
  
  if (!patient) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Patient not found</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Fields to exclude from rendering
  const excludeFields = ['id'];
  
  // Group fields logically
  const fieldGroups = [
    {
      title: "Basic Information",
      fields: ['name', 'age', 'sex', 'cause']
    },
    {
      title: "Vertigo Characteristics",
      fields: ['vertigo', 'onset', 'vertigoSensation', 'episodicOrPersistent', 'duration']
    },
    {
      title: "Episode Details",
      fields: ['episodeDuration', 'remission']
    },
    {
      title: "Triggers & Factors",
      fields: ['triggers', 'headMovementEffect', 'headInjury']
    },
    {
      title: "Associated Symptoms",
      fields: ['symptoms', 'earSymptoms', 'hearingLossSide', 'hearingLossOnset', 'hearingLossDuration', 'hearingLossProgression']
    },
    {
      title: "Neurological Symptoms",
      fields: ['cerebellumSymptoms', 'cranialNerveSymptoms']
    },
    {
      title: "Medical History",
      fields: ['comorbidities', 'antiepileptics', 'antipsychotics', 'ototoxicDrugs', 'medicationsTaken']
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.patientName}>{patient.name || "Patient"}</Text>
        <Text style={styles.patientId}>ID: {patient.id}</Text>
      </View>
      
      {fieldGroups.map((group, groupIndex) => {
        // Check if group has any non-empty fields to display
        const hasContent = group.fields.some(
          field => patient[field] !== undefined && 
                  patient[field] !== null && 
                  patient[field] !== '' && 
                  !excludeFields.includes(field)
        );
        
        if (!hasContent) return null;
        
        return (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            
            {group.fields.map((field, fieldIndex) => {
              // Skip if field is empty or in exclude list
              if (
                patient[field] === undefined || 
                patient[field] === null || 
                patient[field] === '' || 
                excludeFields.includes(field)
              ) return null;
              
              return (
                <View key={fieldIndex} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{getFieldLabel(field)}:</Text>
                  <Text style={styles.fieldValue}>{formatField(field, patient[field])}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#429D7E",
    padding: 20,
    paddingTop: 60,
  },
  patientName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  patientId: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  section: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#429D7E",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 8,
  },
  fieldRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#555555",
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#429D7E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  }
});

export default PatientDetail;