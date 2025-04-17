import { useState, useEffect } from "react";
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
  Alert
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"
import Colors from "@/src/constants/Colors"
import { Images } from "@/src/constants/Images"
import { useMeals } from "@/src/context/MealsContext"

export default function EditMealScreen() {
  const { id } = useLocalSearchParams();
  const { meals, updateMeal, syncWithDatabase } = useMeals();
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const meal = meals.find((m) => m.id === id);
  
  if (!meal) {
    return <Text>Meal not found</Text>;
  }

  const [mealName, setMealName] = useState(meal.name);
  const [description, setDescription] = useState(meal.description || "");
  const [fridgeServings, setFridgeServings] = useState(String(meal.numInFridge || 0));
  const [freezerServings, setFreezerServings] = useState(String(meal.numInFreezer || 0));

  const handleSave = async () => {
    // Validate inputs
    if (!mealName.trim()) {
      Alert.alert("Error", "Please enter a meal name");
      return;
    }
    
    // Convert servings to numbers
    const numFridgeServings = parseInt(fridgeServings) || 0;
    const numFreezerServings = parseInt(freezerServings) || 0;
    
    // Show confirmation dialog
    Alert.alert(
      "Confirm Changes",
      "Are you sure you want to save these changes?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: async () => {
            setLoading(true);
            try {
              // Update the meal in inventory
              await updateMeal(meal.id, {
                name: mealName,
                description: description,
                numInFridge: numFridgeServings,
                numInFreezer: numFreezerServings
              });
              
              // Immediately sync with database to update both inventory and savedMeals
              await syncWithDatabase();
              
              Alert.alert("Success", "Your changes have been saved successfully.");
              router.back();
            } catch (error) {
              console.error("Error saving meal:", error);
              Alert.alert("Error", "Failed to save changes. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Edit Meal</Text>
            <Text style={styles.headerSubtitle}>Update your meal details</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Meal Image */}
            <View style={styles.imageContainer}>
              {meal.image && !imageError ? (
                <Image
                  source={{ uri: meal.image }}
                  style={styles.imagePlaceholder}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>🍲</Text>
                </View>
              )}
              <Text style={styles.imageLabel}>Meal Picture</Text>
            </View>

            {/* Form Fields */}
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
                <Text style={styles.label}>Servings in Fridge</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter number of servings"
                    value={fridgeServings}
                    onChangeText={setFridgeServings}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Servings in Freezer</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter number of servings"
                    value={freezerServings}
                    onChangeText={setFreezerServings}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              </View>
            </View>

            {/* Save Button - Moved inside ScrollView */}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                activeOpacity={0.8}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    paddingBottom: 120, // Increased padding to allow for bottom navigation
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
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editIconContainer: {
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
  buttonWrapper: {
    padding: 24,
    paddingBottom: 40,
  },
  saveButton: {
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
