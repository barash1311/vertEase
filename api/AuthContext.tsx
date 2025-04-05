import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define user role type
export type UserRole = "patient" | "practitioner";

// Define user type
export interface User extends FirebaseUser {
  role?: UserRole;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole, profileImageURL?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log("User authenticated:", firebaseUser.uid);
          
          // Get user role from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Log the raw data from Firestore
            console.log("Raw user data from Firestore:", userData);
            console.log("Retrieved role from Firestore:", userData.role);
            
            if (!userData.role) {
              console.warn("WARNING: User document exists but role is missing!");
            }
            
            // Create user with role
            const userWithRole = {
              ...firebaseUser,
              role: userData.role as UserRole,
            };
            
            console.log("Setting user with role:", userWithRole.role);
            setUser(userWithRole);
            
            // Store user ID and role in AsyncStorage for persistence
            await AsyncStorage.setItem("userId", firebaseUser.uid);
            await AsyncStorage.setItem("userRole", userData.role || "");
            
            console.log("Auth state updated with role:", userData.role);
          } else {
            console.warn("User document doesn't exist in Firestore");
            setUser(firebaseUser as User);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser as User);
        }
      } else {
        console.log("User signed out");
        setUser(null);
        // Remove user data from AsyncStorage on logout
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("userRole");
      }
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    profileImageURL?: string
  ) => {
    try {
      setLoading(true);
      console.log(`Starting signup with role: ${role}`);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      console.log("User created in Firebase Auth:", newUser.uid);

      // Update user profile with display name and photo URL
      await updateProfile(newUser, {
        displayName: fullName,
        photoURL: profileImageURL || null,
      });
      console.log("Profile updated with name and photo");

      // CRITICAL: Store user role in Firestore - this is where we ensure the role is set
      const userRef = doc(db, "users", newUser.uid);
      const userData = {
        uid: newUser.uid,
        email,
        displayName: fullName,
        role: role, // Explicitly set the role here
        photoURL: profileImageURL || null,
        createdAt: new Date().toISOString(),
      };
      
      // Log the exact data being stored
      console.log("Storing user data with role in Firestore:", userData);
      
      // Store the data
      await setDoc(userRef, userData);
      console.log(`User document created in Firestore with role: ${role}`);

      // Create role-specific documents
      if (role === "patient") {
        const patientRef = doc(db, "patients", newUser.uid);
        await setDoc(patientRef, {
          uid: newUser.uid,
          email,
          displayName: fullName,
          photoURL: profileImageURL || null,
          practitionerId: null,
          createdAt: new Date().toISOString(),
        });
        console.log("Patient document created");
      } else if (role === "practitioner") {
        const practitionerRef = doc(db, "practitioners", newUser.uid);
        await setDoc(practitionerRef, {
          uid: newUser.uid,
          email,
          displayName: fullName,
          photoURL: profileImageURL || null,
          patientsCount: 0,
          patients: [],
          createdAt: new Date().toISOString(),
        });
        console.log("Practitioner document created");
      }

      // Critical: Store role in AsyncStorage immediately and update user state with role
      await AsyncStorage.setItem("userId", newUser.uid);
      await AsyncStorage.setItem("userRole", role);
      
      // Set user with role immediately
      const userWithRole = {
        ...newUser,
        role: role,
      };
      setUser(userWithRole);
      
      console.log(`Account created successfully as ${role}`);
    } catch (error: any) {
      console.error("Signup error:", error);
      // Handle errors...
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Explicitly fetch user role after successful authentication
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role) {
          // Store role in AsyncStorage immediately after sign-in
          await AsyncStorage.setItem("userRole", userData.role);
          console.log("Role fetched and stored during sign-in:", userData.role);
          
          // Update user object with role
          const userWithRole = {
            ...userCredential.user,
            role: userData.role as UserRole,
          };
          
          // Update the user state directly
          setUser(userWithRole);
        } else {
          console.warn("User document exists but role is missing during sign-in!");
        }
      } else {
        console.warn("User document doesn't exist in Firestore during sign-in");
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error("Incorrect email or password.");
      } else {
        throw new Error(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return Promise.resolve();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error("No user found with this email address.");
      } else {
        throw new Error(`Password reset failed: ${error.message}`);
      }
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`Logout failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user.");
      }

      const updateData: {
        displayName?: string;
        photoURL?: string;
      } = {};

      if (displayName) updateData.displayName = displayName;
      if (photoURL) updateData.photoURL = photoURL;

      await updateProfile(auth.currentUser, updateData);

      // Update Firestore user document
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, updateData, { merge: true });

      // Also update in role-specific collection
      if (user?.role) {
        const roleRef = doc(db, `${user.role}s`, auth.currentUser.uid);
        await setDoc(roleRef, updateData, { merge: true });
      }

      // Update local user state
      if (user) {
        setUser({
          ...user,
          displayName: displayName || user.displayName,
          photoURL: photoURL || user.photoURL,
        });
      }
    } catch (error: any) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    resetPassword,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};