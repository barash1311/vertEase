import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../../api/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Enhanced logging
    console.log("ProtectedRoute - Navigation check");
    console.log("Current segments:", segments);
    console.log("User authenticated:", !!user);
    if (user) {
      console.log("User role:", user.role);
      console.log("User ID:", user.uid);
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inPatientGroup = segments[0] === "(patient)";
    const inTabsGroup = segments[0] === "(tabs)";
    
    // Add AddPatient as allowed route for practitioners
    const isPractitionerAllowedRoute = segments[0] === "AddPatient" || 
                                      (segments[0] === "PatientDetail" && segments.length > 1);
    
    const isPublicRoute = 
      segments[0] === "landing" || 
      segments[0] === "disclaimer" || 
      segments[0] === "typeOfUser" ||
      segments.length === 0 ||
      segments[0] === "index";

    if (!user) {
      // Not logged in user trying to access protected routes
      if (!inAuthGroup && !isPublicRoute) {
        console.log("Redirecting unauthenticated user to sign in");
        router.replace("/(auth)/SignIn");
      }
    } else {
      // User is logged in
      
      // First, handle users in auth group (they've just logged in)
      if (inAuthGroup) {
        console.log("Authenticated user in auth group, redirecting based on role");
        
        // Critical fix: Explicitly check for patient role and redirect
        if (user.role === "patient") {
          console.log("Authenticated PATIENT redirecting to patient home");
          router.replace("/(patient)/PatientHome");
        } else {
          console.log("Authenticated NON-PATIENT redirecting to tabs home");
          router.replace("/(tabs)/Home");
        }
      }
      // Next, handle role-specific redirection for misplaced users
      else if (user.role === "patient" && !inPatientGroup && !isPublicRoute) {
        // Patient accessing non-patient, non-public routes
        console.log("Patient attempting to access non-patient area, redirecting to patient home");
        router.replace("/(patient)/PatientHome");
      }
      else if (user.role === "practitioner" && !inTabsGroup && !isPublicRoute && !isPractitionerAllowedRoute) {
        // Practitioner accessing non-tabs, non-public routes that aren't explicitly allowed
        console.log("Practitioner attempting to access non-tabs area, redirecting to tabs");
        console.log("Current segments:", segments);
        router.replace("/(tabs)/Home");
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 16,
  },
});

export default ProtectedRoute;