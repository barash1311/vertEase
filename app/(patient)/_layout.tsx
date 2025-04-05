import React from "react";
import { Stack } from "expo-router";

export default function PatientLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="PatientHome" 
        options={{ 
          headerShown: false,
        }}
      />
      
      {/* Add other patient-specific screens here */}
    </Stack>
  );
}