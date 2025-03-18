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
import * as SQLite from 'expo-sqlite';

export default function CreateMealScreen() {
  const [mealName, setMealName] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState("")
  const db = SQLite.useSQLiteContext();

  const handleCreateMeal = async () => {
    // Add your meal creation logic here
    try {
      const result2 = await db.runAsync('INSERT INTO meals (name, description, ingredients, user_id) VALUES (?, ?, ?, ?)', [mealName, description, ingredients, 111]);
      console.log(result2.lastInsertRowId);
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
   
    const result = db.getAllSync('SELECT * FROM meals');
    let row: any
    for (row of result){
      console.log(row.id, row.name, row.description, row.ingredients, row.picture, row.user_id)
    }
    console.log({ mealName, description, ingredients })
    router.back()
  }

  const test = () =>{
    
  }

  const handleSelectImage = () => {
    // Add your image picker logic here
    console.log("Select image")
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
            <Text style={styles.headerTitle}>Create Meal</Text>
          </View>

          {/* Meal Image */}
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handleSelectImage}>
              <View style={styles.editIconContainer}>
                <Text style={styles.editIcon}>✎</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.imageLabel}>Meal Picture</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MEAL NAME:</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={mealName}
                onChangeText={setMealName}
                placeholderTextColor="#88a588"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MEAL DESCRIPTION:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={Platform.OS === "ios" ? undefined : 4}
                placeholderTextColor="#88a588"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>INGREDIENTS</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ingredients"
                value={ingredients}
                onChangeText={setIngredients}
                multiline
                numberOfLines={Platform.OS === "ios" ? undefined : 4}
                placeholderTextColor="#88a588"
              />
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateMeal}>
            <Text style={styles.createButtonText}>CREATE MEAL</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#32343e",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4e752d",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#74af44",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    color: "white",
    fontSize: 18,
  },
  imageLabel: {
    marginTop: 8,
    color: "#6b6e82",
    fontSize: 16,
  },
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#32343e",
  },
  input: {
    backgroundColor: "#b4d797",
    borderRadius: 12,
    padding: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    color: "#32343e",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    ...Platform.select({
      ios: {
        paddingTop: 16,
      },
    }),
  },
  createButton: {
    backgroundColor: "#4e752d",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
