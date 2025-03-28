import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";

const AddPatient: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    onset: "",
    duration: { minutes: "", hours: "", days: "", months: "", years: "" },
    sensation: "",
    episodic: "",
    episodeDuration: "",
    remission: "",
    persistentDuration: { minutes: "", hours: "", days: "" },
    triggers: [],
    symptoms: [],
    drugHistory: [],
    medicationsTaken: [],
    headInjury: "",
    comorbidities: [],
    condition: "",
  });

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Vertigo Questionnaire</Text>

      {/* Step 1: Basic Details */}
      {step === 1 && (
        <>
          <Text style={styles.label}>Enter the following details</Text>
          <TextInput
            style={styles.input}
            placeholder="Age (years)"
            keyboardType="numeric"
            onChangeText={(text) => handleRadioChange("age", text)}
          />
          <Text style={styles.label}>Sex</Text>
          <RadioButton.Group
            onValueChange={(value) => handleRadioChange("sex", value)}
            value={formData.sex}
          >
            <View style={styles.radioButton}>
              <RadioButton value="Male" />
              <Text>Male</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Female" />
              <Text>Female</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Others" />
              <Text>Others</Text>
            </View>
          </RadioButton.Group>
        </>
      )}

      {/* Step 2: Comorbidities */}
      {step === 2 && (
        <>
          <Text style={styles.label}>
            Is your patient suffering from comorbidities?
          </Text>
          {[
            "Diabetes",
            "Hypertension",
            "Migraine",
            "Anxiety or stress disorders",
            "Autoimmune disorders",
            "Panic episodes",
            "Anaemia",
            "Cardiac arrhythmia",
          ].map((condition) => (
            <View key={condition} style={styles.checkboxContainer}>
              <Checkbox
                status={
                  formData.comorbidities.includes(condition) ? "checked" : "unchecked"
                }
                onPress={() => handleCheckboxChange("comorbidities", condition)}
              />
              <Text>{condition}</Text>
            </View>
          ))}
        </>
      )}

      {/* Step 3: Condition Suffering From */}
      {step === 3 && (
        <>
          <Text style={styles.label}>Is your patient suffering from:</Text>
          <RadioButton.Group
            onValueChange={(value) => handleRadioChange("condition", value)}
            value={formData.condition}
          >
            <View style={styles.radioButton}>
              <RadioButton value="Vertigo" />
              <Text>Vertigo</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Dizziness" />
              <Text>Dizziness/Lightheadedness</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Unsteadiness" />
              <Text>Unsteadiness</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Oscillopsia" />
              <Text>Oscillopsia</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Not sure" />
              <Text>Not sure</Text>
            </View>
          </RadioButton.Group>
        </>
      )}

      {/* Step 4: Onset */}
      {step === 4 && (
        <>
          <Text style={styles.label}>Was the onset of vertigo sudden or gradual?</Text>
          <RadioButton.Group
            onValueChange={(value) => handleRadioChange("onset", value)}
            value={formData.onset}
          >
            <View style={styles.radioButton}>
              <RadioButton value="Sudden" />
              <Text>Sudden</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Gradual" />
              <Text>Gradual</Text>
            </View>
          </RadioButton.Group>
        </>
      )}

      {/* Step 5: Duration */}
      {step === 5 && (
        <>
          <Text style={styles.label}>How long has the patient had vertigo?</Text>
          {["minutes", "hours", "days", "months", "years"].map((unit) => (
            <TextInput
              key={unit}
              style={styles.input}
              placeholder={unit.charAt(0).toUpperCase() + unit.slice(1)}
              keyboardType="numeric"
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  duration: { ...formData.duration, [unit]: text },
                })
              }
            />
          ))}
        </>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} style={styles.navButton}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {step < 5 ? (
          <TouchableOpacity onPress={nextStep} style={styles.navButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.navButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2f2f2" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5, backgroundColor: "white" },
  radioButton: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  navButton: { padding: 10, backgroundColor: "#00796B", borderRadius: 5 },
  buttonText: { color: "white", fontSize: 18 },
});

export default AddPatient;
