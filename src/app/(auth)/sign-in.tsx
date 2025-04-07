import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
  Button,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from '@/src/constants/Colors';
import { FIREBASE_AUTH } from '@/src/lib/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';




// function test() {
//   FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'SQLite/')
//     .then(files => {
//       console.log('SQLite databases:', files);
//     })
//     .catch(error => {
//       console.error('Error reading directory:', error);
//     });
// }

// function test2() {
//   SQLite.deleteDatabaseAsync("App.db")
// }


export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false); 
  const auth = FIREBASE_AUTH;

  // const db = SQLite.useSQLiteContext();
  // const result = db.getAllSync(`SELECT * FROM users`);

  // let row: any
  // for (row of result){
  //   console.log(row.id,row.user)
  // }


  const signIn = async () => {
    setLoading(true);
    try{
      const user = await signInWithEmailAndPassword(auth, email, password);
      if(user) {
        router.replace(`/(user)/MainDashboard`);
      }
    } catch (error: any){
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
    setLoading(false);
  }
  
  // const [DBLoaded, setDBLoaded] = React.useState<boolean>(false);


  /*
  const handleForgotPassword = () => {
    router.push("/forgot-password")
  }
  */
  const handleCreateAccount = () => {
    router.push("/(auth)/sign-up")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity style={styles.visibilityToggle} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.visibilityIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity /*onPress={handleForgotPassword}*/ style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={signIn}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.createAccountPrompt}>
              <Text style={styles.createAccountPromptText}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.createAccountLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 32,
    color: Colors.primary,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#f9faf7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: {
    padding: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  passwordInput: {
    paddingRight: 50,
  },
  visibilityToggle: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  visibilityIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  createAccountPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  createAccountPromptText: {
    color: Colors.textSecondary,
    marginRight: 4,
  },
  createAccountLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
})

