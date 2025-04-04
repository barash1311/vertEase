import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Screens that should not show tabs */}
      <Stack.Screen name="disclaimer" options={{ headerShown: false }} />
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="typeOfUser" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignIn" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="AddPatient" options={{ headerShown: false }} />

      {/* Tabs Navigator */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
