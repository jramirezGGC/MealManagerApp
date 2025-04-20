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
  Modal,
  FlatList,
  Alert,
} from "react-native";
// import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/src/constants/Colors";
// Comment out Firebase imports for testing
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { AutoId } from "@/src/lib/util";
import { useMeals } from "@/src/context/MealsContext";
import { Ingredient, Meal } from "@/src/types";

// We don't need a separate form interface anymore since Ingredient has the id field

export default function CreateMealScreen() {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [mealImageUrl, setMealImageUrl] = useState<string | null>(null);
  
  // Ingredient modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    id: '',
    name: '',
    amount: '',
    calories: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Quantity selection modal state
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [fridgeQuantity, setFridgeQuantity] = useState("0");
  const [freezerQuantity, setFreezerQuantity] = useState("0");
  const [createdMeal, setCreatedMeal] = useState<Meal | null>(null);
  
  const { saveMeal, syncWithDatabase, addMealToInventory, savedMeals } = useMeals();

  const params = useLocalSearchParams();

  // Add a cleanup effect that runs when the component mounts
  useEffect(() => {
    const resetImageState = async () => {
      // If we're not coming from UploadImage or template, clear everything
      if (!params.imageUrl && !params.savedMealId) {
        console.log("Clearing image state on CreateMeal mount");
        // Clear the image URL state
        setMealImageUrl(null);
        // Clear from AsyncStorage
        try {
          await AsyncStorage.removeItem('tempMealImage');
        } catch (error) {
          console.error("Error clearing image from storage:", error);
        }
      }
    };
    
    resetImageState();
    
    // Also clear when component unmounts to prevent persistence
    return () => {
      if (!params.imageUrl && !params.savedMealId) {
        AsyncStorage.removeItem('tempMealImage')
          .catch(error => console.error("Error clearing image on unmount:", error));
      }
    };
  }, []);

  // Load saved meal data when creating from a template
  useEffect(() => {
    const loadSavedMealData = async () => {
      if (params.savedMealId) {
        const savedMealId = params.savedMealId as string;
        
        // Find the meal in savedMeals
        const savedMeal = savedMeals.find(meal => meal.id === savedMealId);
        
        if (savedMeal) {
          // Set all the form fields with data from the saved meal
          setMealName(savedMeal.name || "");
          setDescription(savedMeal.description || "");
          setIngredients(savedMeal.ingredients || []);
          
          if (savedMeal.image) {
            // Clean up the image URL
            let imageUrl = savedMeal.image;
            // Direct fix for Firebase storage URLs - force correct encoding
            if (imageUrl.includes('/o/meals/')) {
              imageUrl = imageUrl.replace('/o/meals/', '/o/meals%2F');
            }
            setMealImageUrl(imageUrl);
          }
        } else {
          console.warn(`Saved meal with ID ${savedMealId} not found`);
        }
      }
    };
    
    loadSavedMealData();
  }, [params.savedMealId, savedMeals]);

  // Check for image URL from navigation params - keep this for backward compatibility
  useEffect(() => {
    if (params.imageUrl && !mealImageUrl) {
      let imageUrl = params.imageUrl as string;
      
      // Direct fix for Firebase storage URLs - force correct encoding
      if (imageUrl.includes('/o/meals/')) {
        imageUrl = imageUrl.replace('/o/meals/', '/o/meals%2F');
      }
      
      // Set the image URL directly without testing
      setMealImageUrl(imageUrl);
    }
  }, [params.imageUrl, mealImageUrl]);

  // Add function to clear the image from storage
  const clearImageFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('tempMealImage');
    } catch (error) {
      console.error("Error clearing image from storage:", error);
    }
  };

  const handleCreateMeal = async () => {
    setLoading(true);
    try {
      // Calculate total calories
      const totalCalories = ingredients.reduce((sum, ing) => {
        const calNum = parseInt(ing.calories || '0') || 0;
        return sum + calNum;
      }, 0);
      
      // Check if we're creating from an existing saved meal template
      const isFromTemplate = params.savedMealId ? true : false;
      
      // Create a Meal object - use existing ID if from template
      const newMeal: Meal = {
        id: isFromTemplate ? (params.savedMealId as string) : AutoId(),
        name: mealName,
        description: description,
        ingredients: ingredients,
        image: mealImageUrl || '',
        calories: totalCalories,
        date: new Date(),
        numInFridge: 0,  // Explicitly zero for savedMeals
        numInFreezer: 0  // Explicitly zero for savedMeals
      };
      
      // Only save to savedMeals if this is NOT from a template
      if (!isFromTemplate) {
        await saveMeal(newMeal);
      }
      
      // Store the created meal and show quantity selection modal
      setCreatedMeal(newMeal);
      setQuantityModalVisible(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating meal:", error);
      Alert.alert(
        "Error",
        "Failed to create meal. Please try again."
      );
      setLoading(false);
    }
  };
  
  const handleQuantitySubmit = async () => {
    if (!createdMeal) return;
    
    setLoading(true);
    try {
      // Get the user-specified quantities
      const fridgeCount = parseInt(fridgeQuantity) || 0;
      const freezerCount = parseInt(freezerQuantity) || 0;
      
      // If we have quantities > 0, add to inventory as well
      if (fridgeCount > 0 || freezerCount > 0) {
        // Use the dedicated function to add to inventory directly
        await addMealToInventory(createdMeal, fridgeCount, freezerCount);
      } else {
        // If both quantities are 0, just show a message that meal was saved
        Alert.alert(
          "Meal Saved",
          "The meal has been added to your saved meals collection."
        );
      }
      
      setQuantityModalVisible(false);
      
      // Clear form and navigate back
      clearForm();
      // Clear the image from storage
      await clearImageFromStorage();
      router.replace("/(user)/MainDashboard");
      setLoading(false);
    } catch (error) {
      console.error("Error updating meal quantities:", error);
      Alert.alert(
        "Error",
        "Failed to update meal quantities. Your meal is still saved."
      );
      setLoading(false);
    }
  };

  // Function to clear all form data
  const clearForm = () => {
    setMealName("");
    setDescription("");
    setIngredients([]);
    setMealImageUrl(null);
    setFridgeQuantity("0");
    setFreezerQuantity("0");
    setCreatedMeal(null);
  };

  const handleSelectImage = () => {
    router.push({
      pathname: "/UploadImage",
      params: { fromCreate: "true" }
    });
  };
  
  // Open the modal to add a new ingredient
  const handleAddIngredient = () => {
    setCurrentIngredient({
      id: AutoId(),
      name: '',
      amount: '',
      calories: ''
    });
    setIsEditing(false);
    setModalVisible(true);
  };
  
  // Open the modal to edit an existing ingredient
  const handleEditIngredient = (ingredient: Ingredient) => {
    setCurrentIngredient(ingredient);
    setIsEditing(true);
    setModalVisible(true);
  };
  
  // Delete an ingredient from the list
  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };
  
  // Save the current ingredient (add new or update existing)
  const handleSaveIngredient = () => {
    if (!currentIngredient.name.trim()) {
      // Don't save if name is empty
      return;
    }
    
    if (isEditing) {
      // Update existing ingredient
      setIngredients(ingredients.map(ing => 
        ing.id === currentIngredient.id ? currentIngredient : ing
      ));
    } else {
      // Add new ingredient
      setIngredients([...ingredients, currentIngredient]);
    }
    
    setModalVisible(false);
  };
  
  // Render an ingredient item in the list
  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientDetails}>
          {item.amount} • {item.calories} cal
        </Text>
      </View>
      <View style={styles.ingredientActions}>
        <TouchableOpacity
          style={styles.editIngredientButton}
          onPress={() => handleEditIngredient(item)}
        >
          <Text style={styles.editIngredientButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteIngredientButton}
          onPress={() => handleDeleteIngredient(item.id)}
        >
          <Text style={styles.deleteIngredientButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

              {/* Ingredients Section */}
              <View style={styles.inputGroup}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.label}>Ingredients</Text>
                  <TouchableOpacity
                    style={styles.addIngredientButton}
                    onPress={handleAddIngredient}
                  >
                    <Text style={styles.addIngredientButtonText}>+ Add Ingredient</Text>
                  </TouchableOpacity>
                </View>
                
                {ingredients.length === 0 ? (
                  <View style={styles.emptyIngredientsContainer}>
                    <Text style={styles.emptyIngredientsText}>
                      No ingredients added yet. Tap "Add Ingredient" to get started.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.ingredientsList}>
                    <FlatList
                      data={ingredients}
                      renderItem={renderIngredientItem}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                (loading || !mealName.trim()) && styles.createButtonDisabled,
              ]}
              onPress={handleCreateMeal}
              disabled={loading || !mealName.trim()}
            >
              <Text style={styles.createButtonText}>
                {loading ? "Creating..." : "Create Meal"}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={async () => {
                clearForm();
                await clearImageFromStorage();
                router.replace("/(user)/MainDashboard");
              }}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Ingredient Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Ingredient" : "Add Ingredient"}
            </Text>
            
            <View style={styles.modalForm}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Chicken Breast"
                  value={currentIngredient.name}
                  onChangeText={(text) => 
                    setCurrentIngredient({...currentIngredient, name: text})
                  }
                />
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Amount</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 2 cups"
                  value={currentIngredient.amount || ''}
                  onChangeText={(text) => 
                    setCurrentIngredient({...currentIngredient, amount: text})
                  }
                />
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Calories</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 200"
                  value={currentIngredient.calories || ''}
                  onChangeText={(text) => 
                    setCurrentIngredient({...currentIngredient, calories: text})
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalSaveButton, !currentIngredient.name.trim() && styles.modalSaveButtonDisabled]}
                onPress={handleSaveIngredient}
                disabled={!currentIngredient.name.trim()}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Quantity Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quantityModalVisible}
        onRequestClose={() => setQuantityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Servings
            </Text>
            <Text style={styles.modalSubtitle}>
              How many servings would you like to add to your fridge and freezer?
            </Text>
            
            <Text style={styles.modalNote}>
              Leave both servings at 0 if you would like to only add this to saved meals.
            </Text>
            
            <View style={styles.modalForm}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Fridge Servings</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="0"
                  value={fridgeQuantity}
                  onChangeText={setFridgeQuantity}
                  keyboardType="numeric"
                  onFocus={() => {
                    if (fridgeQuantity === "0") {
                      setFridgeQuantity("");
                    }
                  }}
                />
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Freezer Servings</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="0"
                  value={freezerQuantity}
                  onChangeText={setFreezerQuantity}
                  keyboardType="numeric"
                  onFocus={() => {
                    if (freezerQuantity === "0") {
                      setFreezerQuantity("");
                    }
                  }}
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  // Reset quantities and close modal without navigating
                  setFridgeQuantity("0");
                  setFreezerQuantity("0");
                  setQuantityModalVisible(false);
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleQuantitySubmit}
              >
                <Text style={styles.modalSaveButtonText}>Add Servings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addIngredientButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  addIngredientButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyIngredientsContainer: {
    padding: 16,
    backgroundColor: '#f9faf7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyIngredientsText: {
    color: Colors.textTertiary,
    textAlign: 'center',
    fontSize: 14,
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ingredientDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ingredientActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIngredientButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  editIngredientButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteIngredientButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF3B30", // Standard iOS error color
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIngredientButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalForm: {
    marginBottom: 20,
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f9faf7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  modalCancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalSaveButtonDisabled: {
    opacity: 0.7,
  },
  modalSaveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalNote: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
