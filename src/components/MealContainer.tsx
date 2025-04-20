import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList, type ViewStyle, Image, Modal, Alert, TextInput } from "react-native"
import Colors from "@/src/constants/Colors"
import type { Meal } from "../types"
import { useMeals } from "@/src/context/MealsContext"
import type { Router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore"
import { FIREBASE_DB } from "@/src/lib/firebaseConfig"

interface MealContainerProp {
  meals: Meal[]
  ListHeaderComponent?: React.ReactElement | null
  contentContainerStyle?: ViewStyle
  router?: Router
}

function MealContainer({ meals, ListHeaderComponent, contentContainerStyle, router }: MealContainerProp) {
  const { updateMeal, syncWithDatabase, deleteMeal } = useMeals();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [takeQuantity, setTakeQuantity] = useState("1");
  const [quantityError, setQuantityError] = useState("");

  const handleMenuPress = (mealId: string) => {
    // Navigate to meal details page if router is available
    if (router) {
      router.push(`/(user)/${mealId}`);
    } else {
      console.log("Router not available, cannot navigate to meal details:", mealId);
    }
  }

  const handleTakeMultiple = (meal: Meal) => {
    setSelectedMeal(meal);
    setTakeQuantity("1");
    setQuantityError("");
    setQuantityModalVisible(true);
  }

  const handleTakeMeal = (mealId: string) => {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;
    
    Alert.alert(
      "Take Meal",
      `Do you want to take 1 ${meal.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: async () => {
            await takeMeal(meal, 1);
          }
        }
      ]
    );
  }
  
  const validateQuantity = (quantity: string): boolean => {
    const numQuantity = parseInt(quantity);
    
    // Check if it's a valid number
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setQuantityError("Please enter a valid number greater than 0");
      return false;
    }
    
    // Check if quantity is available
    if (numQuantity > (selectedMeal?.numInFridge || 0)) {
      setQuantityError(`You only have ${selectedMeal?.numInFridge} servings available`);
      return false;
    }
    
    // Clear error if validation passes
    setQuantityError("");
    return true;
  }

  const handleQuantityChange = (value: string) => {
    setTakeQuantity(value);
    validateQuantity(value);
  }

  const handleQuantitySubmit = async () => {
    if (!selectedMeal) return;
    
    // Validate quantity before proceeding
    if (!validateQuantity(takeQuantity)) {
      return;
    }
    
    const quantity = parseInt(takeQuantity) || 1;
    
    // Hide modal
    setQuantityModalVisible(false);
    
    // Take the meal
    await takeMeal(selectedMeal, quantity);
  }
  
  const takeMeal = async (meal: Meal, quantity: number) => {
    try {
      // Ensure we don't take more than available
      const takeCount = Math.min(quantity, meal.numInFridge || 0);
      
      let newNumInFridge = (meal.numInFridge || 0) - takeCount;
      
      // First update the meal to set numInFridge to 0
      if (newNumInFridge === 0 && (meal.numInFreezer || 0) === 0) {
        // Update meal with zero quantity first
        await updateMeal(meal.id, {
          numInFridge: 0
        });
        
        Alert.alert(
          "Meal Consumed",
          `All ${meal.name} has been consumed. It will be removed from your inventory but remain in your saved meals.`,
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  // Use setTimeout to ensure React rendering cycle completes before deletion
                  setTimeout(async () => {
                    try {
                      // Delete from inventory when both fridge and freezer are empty
                      await deleteMeal(meal.id);
                      
                      // Force a sync to ensure Firebase is updated
                      await syncWithDatabase();
                      
                      // Additional check: after sync attempt, verify the meal was deleted
                      const householdID = await AsyncStorage.getItem("householdID");
                      if (householdID) {
                        // Get a reference to the Firebase data document
                        const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
                        const snapshot = await getDoc(dataDocRef);
                        
                        if (snapshot.exists()) {
                          const data = snapshot.data();
                          
                          // If the meal still exists in inventory, force remove it
                          if (data.inventory && data.inventory[meal.id]) {
                            await updateDoc(dataDocRef, {
                              [`inventory.${meal.id}`]: deleteField()
                            });
                            console.log(`Meal ${meal.id} forcibly removed from Firebase`);
                          }
                        }
                      }
                    } catch (error) {
                      console.error("Error removing consumed meal:", error);
                    }
                  }, 300); // Short delay to ensure React has completed its rendering cycle
                } catch (error) {
                  console.error("Error initiating meal deletion:", error);
                  Alert.alert("Error", "There was an issue removing the meal. Please try again.");
                }
              }
            }
          ]
        );
      } else {
        // Just update the meal if it's not completely consumed
        await updateMeal(meal.id, {
          numInFridge: newNumInFridge
        });
        
        await syncWithDatabase();
      }
    } catch (error) {
      console.error("Error taking meal:", error);
      Alert.alert("Error", "Failed to take meal. Please try again.");
    }
  }

  const renderMealItem = ({ item }: { item: Meal }) => {
    return (
      <View style={styles.mealItem}>
        <View style={styles.mealContent}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.mealImage}
              defaultSource={require('@/assets/images/defaultmeal.png')}
            />
          ) : (
            <View style={styles.mealImage}>
              <Text style={styles.mealImagePlaceholder}>🍲</Text>
            </View>
          )}
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealServings}>
              {item.numInFridge || 0} servings in fridge
              {item.numInFreezer > 0 && `, ${item.numInFreezer} in freezer`}
            </Text>
          </View>
        </View>
        <View style={styles.mealActions}>
          <TouchableOpacity 
            style={styles.takeMealButton} 
            onPress={() => handleTakeMeal(item.id)}
          >
            <Text style={styles.takeMealText}>Take Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.takeMultipleButton} 
            onPress={() => handleTakeMultiple(item)}
          >
            <Text style={styles.takeMultipleText}>Take Multiple</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton} onPress={() => handleMenuPress(item.id)}>
            <Text style={styles.menuButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Create a combined header that includes both the passed ListHeaderComponent and our section title
  const combinedHeader = () => (
    <>
      {ListHeaderComponent}
      <Text style={styles.sectionTitle}>Meals in Fridge</Text>
    </>
  )

  return (
    <>
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={combinedHeader()}
      />
      
      {/* Quantity Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quantityModalVisible}
        onRequestClose={() => setQuantityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How many servings?</Text>
            <Text style={styles.modalSubtitle}>
              {selectedMeal?.name || "Meal"} ({selectedMeal?.numInFridge || 0} available)
            </Text>
            
            <View style={styles.modalForm}>
              <Text style={styles.modalLabel}>
                Servings to take:
              </Text>
              <TextInput
                style={[styles.quantityInput, quantityError ? styles.quantityInputError : null]}
                keyboardType="numeric"
                value={takeQuantity}
                onChangeText={handleQuantityChange}
                maxLength={2}
              />
              {quantityError ? (
                <Text style={styles.errorText}>{quantityError}</Text>
              ) : null}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setQuantityModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalConfirmButton,
                  (quantityError || parseInt(takeQuantity) <= 0 || parseInt(takeQuantity) > (selectedMeal?.numInFridge || 0)) ? 
                    styles.modalConfirmButtonDisabled : null
                ]}
                onPress={handleQuantitySubmit}
                disabled={!!quantityError || parseInt(takeQuantity) <= 0 || parseInt(takeQuantity) > (selectedMeal?.numInFridge || 0)}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default MealContainer

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra padding for bottom nav
  },
  mealItem: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 70,
    height: 70,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mealImagePlaceholder: {
    fontSize: 30,
    color: Colors.textSecondary,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  mealServings: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mealTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  mealTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  mealActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  takeMealButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  takeMealText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  takeMultipleButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  takeMultipleText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  menuButtonText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalForm: {
    marginBottom: 24,
    marginTop: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: Colors.background,
  },
  quantityInputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  modalConfirmButtonDisabled: {
    backgroundColor: '#BCC0D6',
    opacity: 0.7,
  },
  modalConfirmText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
})
