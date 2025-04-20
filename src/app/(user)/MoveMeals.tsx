/*
 * This file is part of Meal Manager.
 *
 * Meal Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meal Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meal Manager. If not, see <http://www.gnu.org/licenses/>.
 */

import { act, useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Alert, Image, ScrollView, Modal, TextInput } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from "@/src/constants/Colors"
import type { Meal } from "@/src/types"
import { useMeals } from "@/src/context/MealsContext"

export default function MoveMealsScreen() {
  const [activeTab, setActiveTab] = useState("fridge")
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [displayMeals, setDisplayMeals] = useState<Meal[]>([])
  const { meals, loading, updateMeal, syncWithDatabase } = useMeals();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Quantity selection modal state
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [moveQuantity, setMoveQuantity] = useState("1");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState("");
  
  // Confirmation modal state
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [mealQuantities, setMealQuantities] = useState<Record<string, number>>({});

  // Calculate total servings for the current tab
  const calculateTotalServings = () => {
    if (activeTab === "fridge") {
      return displayMeals.reduce((total, meal) => total + (meal.numInFridge || 0), 0);
    } else {
      return displayMeals.reduce((total, meal) => total + (meal.numInFreezer || 0), 0);
    }
  }

  function switchTab(tab: string) {
    setDisplayMeals(filterMeals(tab))
    setActiveTab(tab)
    setSelectedMeals([])
  }

  // Filter meals based on active tab
  const filterMeals = (tab: string) => {
    if (tab === "fridge") {
      return meals.filter(meal => meal.numInFridge > 0);
    } else {
      return meals.filter(meal => meal.numInFreezer > 0);
    }
  }

  const toggleMealSelection = (mealId: string) => {
    // Find the meal object
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    // Check if the meal is already selected
    const isAlreadySelected = selectedMeals.includes(mealId);

    // Show quantity modal for this meal
    setSelectedMeal(meal);
    setAvailableQuantity(activeTab === "fridge" ? (meal.numInFridge || 0) : (meal.numInFreezer || 0));
    
    if (isAlreadySelected) {
      // If already selected, pre-fill with current quantity
      setMoveQuantity(String(mealQuantities[mealId] || 1));
    } else {
      // New selection, default to 1
      setMoveQuantity("1");
    }
    
    setQuantityError(""); // Clear any previous errors
    setQuantityModalVisible(true);
  }

  const validateQuantity = (quantity: string): boolean => {
    const numQuantity = parseInt(quantity);
    
    // Check if it's a valid number
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setQuantityError("Please enter a valid number greater than 0");
      return false;
    }
    
    // Check if quantity is available
    if (numQuantity > availableQuantity) {
      setQuantityError(`You only have ${availableQuantity} servings available`);
      return false;
    }
    
    // Clear error if validation passes
    setQuantityError("");
    return true;
  }

  const handleQuantityChange = (value: string) => {
    setMoveQuantity(value);
    validateQuantity(value);
  }

  const handleMoveQuantityConfirm = () => {
    if (!selectedMeal) return;
    
    // Validate quantity before proceeding
    if (!validateQuantity(moveQuantity)) {
      return;
    }
    
    const quantity = parseInt(moveQuantity) || 1;
    
    // Save the quantity for this meal
    setMealQuantities(prev => ({
      ...prev,
      [selectedMeal.id]: quantity
    }));

    // Add to selected meals if not already selected
    if (!selectedMeals.includes(selectedMeal.id)) {
      setSelectedMeals(prev => [...prev, selectedMeal.id]);
    }
    
    // Hide modal
    setQuantityModalVisible(false);
  }

  const handleRemoveMeal = () => {
    if (!selectedMeal) return;
    
    // Remove the meal from selected meals
    setSelectedMeals(prev => prev.filter(id => id !== selectedMeal.id));
    
    // Remove the quantity for this meal
    setMealQuantities(prev => {
      const newQuantities = {...prev};
      delete newQuantities[selectedMeal.id];
      return newQuantities;
    });
    
    // Hide modal
    setQuantityModalVisible(false);
  }

  const handleClearAllSelections = () => {
    // Clear all selected meals and quantities
    setSelectedMeals([]);
    setMealQuantities({});
    // Close the confirmation modal
    setConfirmationModalVisible(false);
  }

  const handleMoveMeals = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert("No Meals Selected", "Please select at least one meal to move")
      return
    }
    
    // Show confirmation dialog instead of moving immediately
    setConfirmationModalVisible(true);
  }
  
  const confirmMoveMeals = async () => {
    setConfirmationModalVisible(false);
    
    try {
      selectedMeals.forEach(async (mealId) => {
        const meal = meals.find((m) => m.id === mealId);
        if (!meal) return;
        
        // Get the quantity from our stored quantities
        const quantity = mealQuantities[mealId] || 1;
        
        if (activeTab === "fridge") {
          // Ensure we don't move more than available
          const moveCount = Math.min(quantity, meal.numInFridge || 0);
          
          let newNumInFridge = meal.numInFridge - moveCount;
          let newNumInFreezer = meal.numInFreezer + moveCount;
          
          await updateMeal(mealId, {
            numInFridge: newNumInFridge,
            numInFreezer: newNumInFreezer,
          })
        }
        else {
          // Ensure we don't move more than available
          const moveCount = Math.min(quantity, meal.numInFreezer || 0);
          
          let newNumInFridge = meal.numInFridge + moveCount;
          let newNumInFreezer = meal.numInFreezer - moveCount;
          
          await updateMeal(mealId, {
            numInFridge: newNumInFridge,
            numInFreezer: newNumInFreezer,
          })
        }
      });
      
      await syncWithDatabase();
      
      // Show success message
      Alert.alert(
        "Success",
        `Meals moved from ${activeTab} to ${activeTab === "fridge" ? "freezer" : "fridge"} successfully.`,
        [{ text: "OK" }]
      );
      
      // Clear selection after successful move
      setSelectedMeals([]);
      setMealQuantities({});
    } catch (error) {
      console.error("Error moving meals:", error)
      Alert.alert("Error", "Failed to move meals. Please try again.")
    }
  }

  const handleImageError = (mealId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [mealId]: true
    }));
  };

  const renderMealItem = ({ item }: { item: Meal }) => {
    const isSelected = selectedMeals.includes(item.id)
    const hasImageError = imageErrors[item.id] || !item.image;
    const selectedQuantity = mealQuantities[item.id];

    return (
      <TouchableOpacity
        style={[styles.mealItem, isSelected && styles.selectedMealItem]}
        onPress={() => toggleMealSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.mealContent}>
          {!hasImageError && item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.mealImage}
              onError={() => handleImageError(item.id)}
            />
          ) : (
            <View style={styles.mealImage}>
              <Text style={styles.mealImagePlaceholder}>🍲</Text>
            </View>
          )}
          <View style={styles.mealInfo}>
            <Text style={[
              styles.mealName, 
              isSelected && styles.selectedText
            ]}>
              {item.name}
            </Text>
            <View style={styles.mealDetails}>
              <Text style={[
                styles.mealDetailText,
                isSelected && styles.selectedText
              ]}>
                {activeTab === "fridge"
                  ? `${item.numInFridge} servings in Fridge`
                  : `${item.numInFreezer} servings in Freezer`}
              </Text>
              {isSelected && selectedQuantity && (
                <Text style={[styles.selectedQuantityText, styles.selectedText]}>
                  {` (Moving ${selectedQuantity})`}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    // Apply filters based on initial tab
    setDisplayMeals(filterMeals(activeTab))
  }, [meals])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Main content with header tabs
  const ListHeaderComponent = () => (
    <View style={styles.tabsOuterContainer}>
      {/* Tabs and Total Count */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "fridge" && styles.activeTab]}
          onPress={() => switchTab("fridge")}
        >
          <Text style={[styles.tabText, activeTab === "fridge" && styles.activeTabText]}>Fridge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "freezer" && styles.activeTab]}
          onPress={() => switchTab("freezer")}
        >
          <Text style={[styles.tabText, activeTab === "freezer" && styles.activeTabText]}>Freezer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.totalMealsContainer}>
        <Text style={styles.totalMealsValue}>{calculateTotalServings()}</Text>
        <Text style={styles.totalMealsLabel}>
          Total Servings in {activeTab === "fridge" ? "Fridge" : "Freezer"}
        </Text>
        {selectedMeals.length > 0 && (
          <Text style={styles.selectionText}>{selectedMeals.length} meals selected</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section with Dynamic Title */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Move Meals</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Select meals to move from {activeTab} to {activeTab === "fridge" ? "freezer" : "fridge"}
        </Text>
      </View>

      {/* ScrollView wraps everything to make the whole page scrollable */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <ListHeaderComponent />
          
          {/* Meal List */}
          {displayMeals.length > 0 ? (
            displayMeals.map((item) => (
              <View key={item.id}>
                {renderMealItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meals found in {activeTab}</Text>
            </View>
          )}
          
          {/* Move Button - Now inside ScrollView to be scrollable */}
          {selectedMeals.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.moveButton} onPress={handleMoveMeals}>
                <Text style={styles.moveButtonText}>
                  Move to {activeTab === "fridge" ? "Freezer" : "Fridge"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelMoveButton} 
                onPress={handleClearAllSelections}
              >
                <Text style={styles.cancelMoveText}>Cancel Move</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Extra space at bottom to ensure everything is scrollable */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

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
              {selectedMeal?.name || "Meal"} ({availableQuantity} available)
            </Text>
            
            {selectedMeal && selectedMeals.includes(selectedMeal.id) && (
              <Text style={styles.currentlyMovingText}>
                Currently moving {mealQuantities[selectedMeal.id] || 1}
              </Text>
            )}
            
            <View style={styles.modalForm}>
              <Text style={styles.modalLabel}>
                Servings to move to {activeTab === "fridge" ? "Freezer" : "Fridge"}:
              </Text>
              <TextInput
                style={[styles.quantityInput, quantityError ? styles.quantityInputError : null]}
                keyboardType="numeric"
                value={moveQuantity}
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
                  (quantityError || parseInt(moveQuantity) <= 0 || parseInt(moveQuantity) > availableQuantity) ? 
                    styles.modalConfirmButtonDisabled : null
                ]}
                onPress={handleMoveQuantityConfirm}
                disabled={!!quantityError || parseInt(moveQuantity) <= 0 || parseInt(moveQuantity) > availableQuantity}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
            
            {selectedMeal && selectedMeals.includes(selectedMeal.id) && (
              <TouchableOpacity 
                style={styles.modalCancelMoveButton}
                onPress={handleRemoveMeal}
              >
                <Text style={styles.modalConfirmText}>Cancel Move</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.modalTitle}>Confirm Move</Text>
            <Text style={styles.modalSubtitle}>
              The following meals will be moved:
            </Text>
            
            <ScrollView style={styles.confirmMealList}>
              {selectedMeals.map(mealId => {
                const meal = meals.find(m => m.id === mealId);
                const quantity = mealQuantities[mealId] || 1;
                if (!meal) return null;
                
                return (
                  <View key={mealId} style={styles.confirmMealItem}>
                    <Text style={styles.confirmMealName}>{meal.name}</Text>
                    <Text style={styles.confirmMealQuantity}>
                      {quantity} {quantity === 1 ? 'serving' : 'servings'} to {activeTab === "fridge" ? "Freezer" : "Fridge"}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setConfirmationModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmMoveMeals}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelMoveModalButton}
              onPress={handleClearAllSelections}
            >
              <Text style={styles.cancelMoveModalText}>Cancel Move</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabsOuterContainer: {
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: "600",
  },
  totalMealsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalMealsValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  totalMealsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  mealItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedMealItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primary, // Now using primary color (same as Move button)
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 8,
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
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textTertiary,
    textAlign: "center",
  },
  buttonContainer: {
    marginVertical: 24,
  },
  moveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  cancelMoveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  moveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelMoveText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
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
  currentlyMovingText: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalForm: {
    marginBottom: 24,
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
  selectedText: {
    color: Colors.white,
  },
  selectedQuantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  confirmModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmMealList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  confirmMealItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: 12,
  },
  confirmMealName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  confirmMealQuantity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cancelMoveModalButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelMoveModalText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  modalCancelMoveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
})
