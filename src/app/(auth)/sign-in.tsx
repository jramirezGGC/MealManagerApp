"use client"

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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // Add your login logic here
    console.log({ email, password })
  }

  /*
  const handleForgotPassword = () => {
    router.push("/forgot-password")
  }
  */

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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Please Login to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#88a588"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="**********"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#88a588"
                />
                <TouchableOpacity style={styles.visibilityToggle} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.visibilityIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity /*onPress={handleForgotPassword}*/ style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2dc",
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
    color: "#4e752d",
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#32343e",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b6e82",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#74af44",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "#e6f2dc",
    borderRadius: 12,
    padding: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    color: "#32343e",
  },
  passwordContainer: {
    position: "relative",
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
    color: "#6b6e82",
  },
  forgotPassword: {
    alignSelf: "flex-start",
  },
  forgotPasswordText: {
    color: "white",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4e752d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})