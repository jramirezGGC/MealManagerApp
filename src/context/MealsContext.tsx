import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteField, setDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "@/src/types";
import { collection, getDocs } from "firebase/firestore";
import { ref, get } from "firebase/database";

// Keys for AsyncStorage
const MEALS_STORAGE_KEY = "meals";
const SAVED_MEALS_STORAGE_KEY = "savedMeals";
const PENDING_CHANGES_KEY = "pendingMealsChanges";

interface PendingChanges {
  meals: {
    added: Meal[];
    updated: Meal[];
    deleted: string[];
  };
  savedMeals: {
    added: Meal[];
    updated: Meal[];
    deleted: string[];
  };
  inventory?: Record<string, Meal>;
}

interface MealsContextType {
  meals: Meal[];
  savedMeals: Meal[];
  loading: boolean;
  error: string | null;
  updateMeal: (mealId: string, updatedMeal: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  saveMeal: (meal: Meal) => Promise<string>;
  refreshMeals: () => Promise<void>;
  fetchSavedMeals: () => Promise<void>;
  fetchMeals: () => Promise<void>;
  syncWithDatabase: () => Promise<void>;
  hasPendingChanges: () => Promise<boolean>;
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  addMealToInventory: (meal: Meal, fridgeQuantity: number, freezerQuantity: number) => Promise<string>;
}

const MealsContext = createContext<MealsContextType | undefined>(undefined);

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMealsState] = useState<Meal[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    meals: { added: [], updated: [], deleted: [] },
    savedMeals: { added: [], updated: [], deleted: [] },
    inventory: {}
  });

  // Save meals to AsyncStorage
  const saveMealsToStorage = async (mealsData: Meal[]) => {
    try {
      await AsyncStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(mealsData));
    } catch (err) {
      console.error("Error saving meals to AsyncStorage:", err);
    }
  };

  // Save saved meals to AsyncStorage
  const saveSavedMealsToStorage = async (savedMealsData: Meal[]) => {
    try {
      await AsyncStorage.setItem(SAVED_MEALS_STORAGE_KEY, JSON.stringify(savedMealsData));
    } catch (err) {
      console.error("Error saving saved meals to AsyncStorage:", err);
    }
  };

  // Save pending changes to AsyncStorage
  const savePendingChangesToStorage = async () => {
    try {
      await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges));
    } catch (err) {
      console.error("Error saving pending changes to AsyncStorage:", err);
    }
  };

  // Load cached data from AsyncStorage
  const loadFromCache = async () => {
    try {
      const mealsData = await AsyncStorage.getItem(MEALS_STORAGE_KEY);
      const savedMealsData = await AsyncStorage.getItem(SAVED_MEALS_STORAGE_KEY);
      const pendingChangesData = await AsyncStorage.getItem(PENDING_CHANGES_KEY);

      if (mealsData) {
        setMealsState(JSON.parse(mealsData));
      }
      
      if (savedMealsData) {
        setSavedMeals(JSON.parse(savedMealsData));
      }

      if (pendingChangesData) {
        setPendingChanges(JSON.parse(pendingChangesData));
      }
    } catch (err) {
      console.error("Error loading cached data from AsyncStorage:", err);
    }
  };

  // Check if there are pending changes
  const hasPendingChanges = async (): Promise<boolean> => {
    try {
      const pendingChangesData = await AsyncStorage.getItem(PENDING_CHANGES_KEY);
      if (!pendingChangesData) return false;
      
      const changes = JSON.parse(pendingChangesData) as PendingChanges;
      return (
        changes.meals.added.length > 0 || 
        changes.meals.updated.length > 0 || 
        changes.meals.deleted.length > 0 ||
        changes.savedMeals.added.length > 0 || 
        changes.savedMeals.updated.length > 0 || 
        changes.savedMeals.deleted.length > 0
      );
    } catch (err) {
      console.error("Error checking pending changes:", err);
      return false;
    }
  };

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const householdID = await AsyncStorage.getItem("householdID");
      
      if (!householdID) {
        setError("No household ID found");
        return;
      }
      
      const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
      const snapshot = await getDoc(dataDocRef);
      
      if (!snapshot.exists()) {
        setMeals([]);
        return;
      }
      
      const data = snapshot.data();
      
      if (!data.inventory) {
        setMeals([]);
        return;
      }
      
      // Get all meals directly from inventory
      const inventoryObj = data.inventory;
      
      // Filter out non-meal properties if any
      const meals = Object.values(inventoryObj).filter(item => 
        item && typeof item === 'object' && 'id' in item && 'name' in item
      ) as Meal[];
      
      // Further filter to only include meals with quantities > 0
      const filteredMeals = meals.filter(meal => 
        (meal.numInFridge && meal.numInFridge > 0) || 
        (meal.numInFreezer && meal.numInFreezer > 0)
      );
      
      setMeals(filteredMeals);
      
      // Save to storage
      await AsyncStorage.setItem('meals', JSON.stringify(filteredMeals));
    } catch (error) {
      console.error("Error fetching meals:", error);
      setError("Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedMeals = async () => {
    try {
      const householdID = await AsyncStorage.getItem("householdID");
      if (!householdID) {
        setError("No household ID found");
        return;
      }

      // Get the data document that contains the savedMeals field
      const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
      const snapshot = await getDoc(dataDocRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        // Check if the savedMeals field exists
        if (data && data.savedMeals) {
          const fetchedMeals: Meal[] = [];
          
          // Convert the object to an array of meals
          Object.entries(data.savedMeals).forEach(([id, mealData]) => {
            fetchedMeals.push({
              id,
              ...mealData as any
            } as Meal);
          });
          
          setSavedMeals(fetchedMeals);
          saveSavedMealsToStorage(fetchedMeals);
        } else {
          setSavedMeals([]);
          saveSavedMealsToStorage([]);
        }
      } else {
        setSavedMeals([]);
        saveSavedMealsToStorage([]);
      }
    } catch (err) {
      console.error("Error fetching saved meals:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const refreshMeals = async () => {
    setLoading(true);
    try {
      await fetchMeals();
      await fetchSavedMeals();
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // First try to load from cache for immediate UI display
      await loadFromCache();
      
      // Then fetch fresh data from database
      await refreshMeals();
    };
    
    initialize();
  }, []);

  // Effect to save changes to AsyncStorage when meals state changes
  useEffect(() => {
    if (meals.length > 0) {
      saveMealsToStorage(meals);
    }
  }, [meals]);

  // Effect to save changes to AsyncStorage when savedMeals state changes
  useEffect(() => {
    if (savedMeals.length > 0) {
      saveSavedMealsToStorage(savedMeals);
    }
  }, [savedMeals]);

  // Effect to save pending changes
  useEffect(() => {
    savePendingChangesToStorage();
  }, [pendingChanges]);

  const updateMeal = async (mealId: string, updatedMeal: Partial<Meal>) => {
    try {
      // Update local state
      setMealsState(prevMeals => {
        const updatedMeals = [...prevMeals];
        const mealIndex = updatedMeals.findIndex(meal => meal.id === mealId);
        
        if (mealIndex !== -1) {
          updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            ...updatedMeal
          };
        }
        
        return updatedMeals;
      });

      // Add to pending changes
      setPendingChanges(prev => {
        const updated = [...prev.meals.updated];
        const existingIndex = updated.findIndex(meal => meal.id === mealId);
        
        if (existingIndex !== -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...updatedMeal
          };
        } else {
          const meal = meals.find(m => m.id === mealId);
          if (meal) {
            updated.push({
              ...meal,
              ...updatedMeal
            });
          }
        }
        
        return {
          ...prev,
          meals: {
            ...prev.meals,
            updated
          }
        };
      });
    } catch (error) {
      console.error("Error updating meal locally:", error);
      throw error;
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      // Update local state
      setMealsState(prevMeals => prevMeals.filter(meal => meal.id !== mealId));

      // Add to pending changes
      setPendingChanges(prev => {
        // Remove from added or updated if it was there
        const added = prev.meals.added.filter(meal => meal.id !== mealId);
        const updated = prev.meals.updated.filter(meal => meal.id !== mealId);
        const deleted = [...prev.meals.deleted];
        
        // Only add to deleted if it wasn't just added locally
        if (!prev.meals.added.some(meal => meal.id === mealId)) {
          deleted.push(mealId);
        }
        
        return {
          ...prev,
          meals: {
            added,
            updated,
            deleted
          }
        };
      });
    } catch (error) {
      console.error("Error deleting meal locally:", error);
      throw error;
    }
  };

  const saveMeal = async (meal: Meal) => {
    try {
      // If no ID, generate a temporary one
      const mealWithId = meal.id ? meal : { ...meal, id: `local_${Date.now()}` };
      
      // Ensure the meal has zero quantities for savedMeals
      const recipeMeal = {
        ...mealWithId,
        numInFridge: 0,
        numInFreezer: 0
      };
      
      // Update local state
      setSavedMeals(prevMeals => [
        ...prevMeals,
        recipeMeal
      ]);

      // Add to pending changes (this is for backward compatibility)
      setPendingChanges(prev => ({
        ...prev,
        savedMeals: {
          ...prev.savedMeals,
          added: [...prev.savedMeals.added, recipeMeal]
        }
      }));
      
      // ALSO update Firestore directly with the new savedMeal
      try {
        // Get the householdID
        const householdID = await AsyncStorage.getItem("householdID");
        if (!householdID) {
          throw new Error("No household ID found");
        }
        
        // Get a direct reference to the data document
        const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
        const snapshot = await getDoc(dataDocRef);
        
        // Get current data or create new object
        const currentData = snapshot.exists() ? snapshot.data() : {};
        
        // Make sure savedMeals structure exists
        const savedMealsObj = currentData.savedMeals || {};
        
        // Add the meal directly to savedMeals
        savedMealsObj[recipeMeal.id] = recipeMeal;
        
        // Update the database structure
        currentData.savedMeals = savedMealsObj;
        
        // Update the Firestore document with the new savedMeals
        await updateDoc(dataDocRef, {
          savedMeals: savedMealsObj
        });
      } catch (error) {
        console.error("Error directly updating savedMeals in Firestore:", error);
        // Continue and return the ID even if direct update fails
        // It will be synced later
      }

      return recipeMeal.id;
    } catch (error) {
      console.error("Error saving meal locally:", error);
      throw error;
    }
  };

  // Custom setMeals function that also updates AsyncStorage and tracks pending changes
  const setMeals = (newMeals: React.SetStateAction<Meal[]>) => {
    setMealsState(prevMeals => {
      // Handle both function and direct value updates
      const actualNewMeals = typeof newMeals === 'function' 
        ? newMeals(prevMeals) 
        : newMeals;
      
      // Save to AsyncStorage immediately
      saveMealsToStorage(actualNewMeals);

      // Track changes in pendingChanges
      // Find new meals that weren't in previous state
      const newlyAddedMeals = actualNewMeals.filter(
        newMeal => !prevMeals.some(oldMeal => oldMeal.id === newMeal.id)
      );

      // Find updated meals (same id but different data)
      const updatedMeals = actualNewMeals.filter(newMeal => {
        const oldMeal = prevMeals.find(m => m.id === newMeal.id);
        if (!oldMeal) return false; // Not an update if it didn't exist before
        
        // Check if any relevant properties changed
        return (
          oldMeal.numInFridge !== newMeal.numInFridge ||
          oldMeal.numInFreezer !== newMeal.numInFreezer
        );
      });

      // Find deleted meals
      const deletedMealIds = prevMeals
        .filter(oldMeal => !actualNewMeals.some(newMeal => newMeal.id === oldMeal.id))
        .map(meal => meal.id);

      // Update pendingChanges
      if (newlyAddedMeals.length > 0 || updatedMeals.length > 0 || deletedMealIds.length > 0) {
        setPendingChanges(prev => {
          // For additions, avoid duplicates
          const added = [...prev.meals.added];
          newlyAddedMeals.forEach(meal => {
            if (!added.some(m => m.id === meal.id)) {
              added.push(meal);
            }
          });
          
          // For updates, replace or add
          const updated = [...prev.meals.updated];
          updatedMeals.forEach(meal => {
            const existingIndex = updated.findIndex(m => m.id === meal.id);
            if (existingIndex !== -1) {
              updated[existingIndex] = meal;
            } else {
              updated.push(meal);
            }
          });
          
          // For deletions, add to list (avoiding duplicates)
          const deleted = [...prev.meals.deleted];
          deletedMealIds.forEach(id => {
            if (!deleted.includes(id) && !prev.meals.added.some(m => m.id === id)) {
              deleted.push(id);
            }
          });
          
          return {
            ...prev,
            meals: { added, updated, deleted }
          };
        });
      }
      
      return actualNewMeals;
    });
  };

  // Sync all pending changes with the database
  const syncWithDatabase = async () => {
    try {
      setLoading(true);
      const householdID = await AsyncStorage.getItem("householdID");
      if (!householdID) {
        throw new Error("No household ID found");
      }
      
      // Get the data document reference
      const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
      const snapshot = await getDoc(dataDocRef);
      
      // Get current data or create a new object
      const currentData = snapshot.exists() ? snapshot.data() : {};
      
      // Make sure the structure is correct
      if (!currentData.inventory) {
        currentData.inventory = {};
      }
      
      if (!currentData.savedMeals) {
        currentData.savedMeals = {};
      }
      
      // STEP 1: Process savedMeals from memory and pending changes
      const savedMealsObj = { ...currentData.savedMeals };
      
      // Add pending saved meals - always with zero quantities
      for (const meal of pendingChanges.savedMeals.added) {
        const recipeMeal = { ...meal, numInFridge: 0, numInFreezer: 0 };
        savedMealsObj[meal.id] = recipeMeal;
      }
      
      // Update pending saved meals - always with zero quantities
      for (const meal of pendingChanges.savedMeals.updated) {
        if (savedMealsObj[meal.id]) {
          savedMealsObj[meal.id] = {
            ...savedMealsObj[meal.id],
            ...meal,
            numInFridge: 0,
            numInFreezer: 0
          };
        }
      }
      
      // Remove deleted saved meals
      for (const mealId of pendingChanges.savedMeals.deleted) {
        if (savedMealsObj[mealId]) {
          delete savedMealsObj[mealId];
        }
      }
      
      // Add all savedMeals from memory that aren't already in the object - with zero quantities
      savedMeals.forEach(meal => {
        if (!savedMealsObj[meal.id]) {
          savedMealsObj[meal.id] = {
            ...meal,
            numInFridge: 0,
            numInFreezer: 0
          };
        }
      });
      
      // STEP 2: Create inventory object from pendingChanges.inventory
      // Start with the current inventory directly
      const inventoryObj = currentData.inventory || {};
      
      // If we have pending inventory changes, apply them directly 
      if (pendingChanges.inventory) {
        // Add/update meals from pendingChanges.inventory
        for (const [mealId, mealData] of Object.entries(pendingChanges.inventory)) {
          inventoryObj[mealId] = mealData;
        }
      }
      
      // Update the database structure
      currentData.savedMeals = savedMealsObj;
      currentData.inventory = inventoryObj;  // Store meals directly in inventory
      
      // Update the document in Firestore
      await setDoc(dataDocRef, currentData);
      
      // Reset pending changes
      setPendingChanges({
        meals: { added: [], updated: [], deleted: [] },
        savedMeals: { added: [], updated: [], deleted: [] },
        inventory: {}
      });
      
      // Also need to update fetchMeals to handle the new object format
      await refreshMeals();
    } catch (error) {
      console.error("Error syncing with database:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function specifically for adding a meal to inventory during meal creation
  const addMealToInventory = async (meal: Meal, fridgeQuantity: number, freezerQuantity: number) => {
    try {
      // Create a meal object with the specified quantities
      const inventoryMeal: Meal = {
        ...meal,
        numInFridge: fridgeQuantity,
        numInFreezer: freezerQuantity
      };
      
      // Also update the local meals array for immediate display
      setMealsState(prevMeals => {
        const existingIndex = prevMeals.findIndex(m => m.id === meal.id);
        if (existingIndex >= 0) {
          const updatedMeals = [...prevMeals];
          updatedMeals[existingIndex] = inventoryMeal;
          return updatedMeals;
        } else {
          return [...prevMeals, inventoryMeal];
        }
      });
      
      // Get the householdID
      const householdID = await AsyncStorage.getItem("householdID");
      if (!householdID) {
        throw new Error("No household ID found");
      }
      
      // Get a direct reference to the data document
      const dataDocRef = doc(FIREBASE_DB, `households/${householdID}/data/data`);
      const snapshot = await getDoc(dataDocRef);
      
      // Get current data or create new object
      const currentData = snapshot.exists() ? snapshot.data() : {};
      
      // Make sure inventory structure exists
      const inventoryObj = currentData.inventory || {};
      
      // Add the meal directly to inventory
      inventoryObj[meal.id] = inventoryMeal;
      
      // Update the database structure
      currentData.inventory = inventoryObj;
      
      // Update the Firestore document with the new inventory
      await updateDoc(dataDocRef, {
        inventory: inventoryObj
      });
      
      return meal.id;
    } catch (error) {
      console.error("Error adding meal to inventory:", error);
      throw error;
    }
  };

  return (
    <MealsContext.Provider value={{ 
      meals, 
      savedMeals, 
      loading, 
      error, 
      updateMeal, 
      deleteMeal, 
      saveMeal,
      refreshMeals, 
      fetchSavedMeals, 
      fetchMeals,
      syncWithDatabase,
      hasPendingChanges,
      setMeals,
      addMealToInventory
    }}>
      {children}
    </MealsContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealsContext);
  if (context === undefined) {
    throw new Error('useMeals must be used within a MealsProvider');
  }
  return context;
}

export function useSavedMeals() {
  const context = useContext(MealsContext);
  if (context === undefined) {
    throw new Error('useSavedMeals must be used within a MealsProvider');
  }
  return { 
    savedMeals: context.savedMeals, 
    loading: context.loading, 
    error: context.error, 
    fetchSavedMeals: context.fetchSavedMeals,
    saveMeal: context.saveMeal,
    deleteMeal: context.deleteMeal
  };
} 