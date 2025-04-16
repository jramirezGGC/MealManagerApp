import React, { useState, useEffect } from "react";
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
} from "react-native";
// import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/src/constants/Colors";
// Comment out Firebase imports for testing
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { AutoId } from "@/src/lib/util";

export default function CreateMealScreen() {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealImageUrl, setMealImageUrl] = useState<string | null>(null);

  const params = useLocalSearchParams();

  // Check for image URL from navigation params
  useEffect(() => {
    if (params.imageUrl) {
      let imageUrl = params.imageUrl as string;
      
      // Direct fix for Firebase storage URLs - force correct encoding
      if (imageUrl.includes('/o/meals/')) {
        imageUrl = imageUrl.replace('/o/meals/', '/o/meals%2F');
      }
      
      // Set the image URL directly without testing
      setMealImageUrl(imageUrl);
    }
  }, [params]);  


  const handleCreateMeal = async () => {
    // Add your meal creation logic here

    let householdID;

    try {
      householdID = await AsyncStorage.getItem("householdID");
    } catch (error) {
      console.error("Async Storage could not get householdID", error);
    }

    const mealsDoc = doc(
      FIREBASE_DB,
      `households/${householdID}/savedMeals/savedMeals`
    );

    const mealID = AutoId();

    await updateDoc(mealsDoc, {
      [mealID]: {
        name: mealName,

        description: description,

        ingredients: [ingredients], // once we have input for multiple ingredients, break this into an array

        imageUrl: mealImageUrl,
      },
    });


    console.log({ mealName, description, ingredients });

    router.back();
  };

  const handleSelectImage = () => {
    router.push("/UploadImage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Meal</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Add a new meal to your collection
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Meal Image */}
            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.imagePlaceholder}
                onPress={handleSelectImage}
              >
                {mealImageUrl ? (
                  <Image
                    source={{ uri: mealImageUrl }}
                    style={styles.mealImage}
                  />
                ) : (
                  <Text style={styles.imagePlaceholderText}>📷</Text>
                )}

                {/* Always show edit icon */}
                <View
                  style={[
                    styles.editIconContainer,
                    mealImageUrl
                      ? { position: "absolute", bottom: 0, right: 0 }
                      : {},
                  ]}
                >
                  <Text style={styles.editIcon}>✎</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.imageLabel}>Meal Picture</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Meal Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter meal name"
                    value={mealName}
                    onChangeText={setMealName}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your meal"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={Platform.OS === "ios" ? undefined : 4}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ingredients</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="List ingredients, separated by commas"
                    value={ingredients}
                    onChangeText={setIngredients}
                    multiline
                    numberOfLines={Platform.OS === "ios" ? undefined : 4}
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                loading && styles.createButtonDisabled,
              ]}
              onPress={handleCreateMeal}
              disabled={loading}
            >
              <Text style={styles.createButtonText}>
                {loading ? "Creating..." : "Create Meal"}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 16 : 0,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIcon: {
    fontSize: 20,
    color: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholderText: {
    fontSize: 40,
    color: Colors.textSecondary,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  editIcon: {
    color: Colors.white,
    fontSize: 18,
  },
  imageLabel: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
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
    backgroundColor: Colors.primary,
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  mealImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0", // Light background to show loading state
  },
});
