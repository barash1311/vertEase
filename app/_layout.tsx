import { Stack } from "expo-router";
import { AuthProvider } from "../api/AuthContext";
import { useEffect } from "react";
import { LogBox } from "react-native";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function RootLayout() {
  // Ignore specific warnings if needed
  useEffect(() => {
    LogBox.ignoreLogs([
      "AsyncStorage has been extracted from react-native core",
      // Add any other warnings you want to suppress
    ]);
  }, []);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <Stack>
          {/* Public screens */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="disclaimer" options={{ headerShown: false }} />
          <Stack.Screen name="landing" options={{ headerShown: false }} />
          <Stack.Screen name="typeOfUser" options={{ headerShown: false }} />
          
          {/* Auth screens */}
          <Stack.Screen name="(auth)/SignIn" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/ResetPassword" options={{ headerShown: false }} />
          
          {/* Patient screens */}
          <Stack.Screen name="(patient)" options={{ headerShown: false }} />
          
          {/* Practitioner (tabs) screens */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Make sure AddPatient is not in the protected routes section */}
          <Stack.Screen 
            name="AddPatient" 
            options={{ 
              headerShown: true, 
              title: "Add Patient",
              headerStyle: { backgroundColor: "#4db6ac" },
              headerTintColor: "#fff"
            }}
          />
          <Stack.Screen 
            name="PatientDetail/[id]" 
            options={{ headerShown: true, title: "Patient Details" }}
          />
        </Stack>
      </ProtectedRoute>
    </AuthProvider>
  );
}
