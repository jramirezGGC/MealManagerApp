import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "@/src/types";
import { collection, getDocs } from "firebase/firestore";


console.log("MealsContext is being initialized");

interface MealsContextType {
  meals: Meal[];
  savedMeals: Meal[];
  loading: boolean;
  error: string | null;
  updateMeal: (mealId: string, updatedMeal: Partial<Meal>, storageUnit: string) => Promise<void>;
  deleteMeal: (mealId: string, storageUnit: string) => Promise<void>;
}

const MealsContext = createContext<MealsContextType | undefined>(undefined);

export function MealsProvider({ children }: { children: React.ReactNode }) {
  console.log("MealsProvider is being rendered");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("MealsProvider useEffect is running");
    const fetchMeals = async () => {
      try {
        console.log("Attempting to fetch meals");
        const householdID = await AsyncStorage.getItem("householdID");
        if (!householdID) {
          console.log("No householdID found");
          setError("No household ID found");
          return;
        }

        console.log("Fetching meals for household:", householdID);
        const mealsDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
        const snapshot = await getDoc(mealsDoc);
        
        if (snapshot.exists()) {
          console.log("Meals document exists");
          const docData = snapshot.data();
          const dict = { ...docData.meals };
          
          setMeals(prevMeals => {
            const updatedMeals = [...prevMeals];
            
            for (const key in dict) {
              if (dict.hasOwnProperty(key)) {
                const existingMealIndex = updatedMeals.findIndex(obj => obj.id === key);
                
                if (existingMealIndex === -1) {
                  updatedMeals.push({
                    id: key,
                    name: dict[key].name,
                    description: dict[key].description,
                    image: dict[key].image,
                    ingredients: dict[key].ingredients,
                    ...(storageUnit === "fridge1"
                      ? { numInFridge: dict[key].servings }
                      : { numInFreezer: dict[key].servings })
                  } as Meal);
                } else {
                  const meal = updatedMeals[existingMealIndex];
                  if (storageUnit === "fridge1") {
                    meal.numInFridge = dict[key].servings;
                  } else {
                    meal.numInFreezer = dict[key].servings;
                  }
                }
              }
            }
            
            return updatedMeals;
          });
        } else {
          console.log("No meals document found");
        }
      } catch (err) {
        console.error("Error in fetchMeals:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
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

        const mealsDoc = doc(FIREBASE_DB, `households/${householdID}/savedMeals/savedMeals`);
        const snapshot = await getDoc(mealsDoc);
        
        if (snapshot.exists()) {
          const data = snapshot.data();
          const mealsArray = Object.entries(data).map(([id, mealData]) => ({
            id,
            ...mealData,
          })) as Meal[];
          setSavedMeals(mealsArray);
        } else {
          setSavedMeals([]);
        }
      } catch (err) {
        console.error("Error fetching saved meals:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchMeals();
    fetchSavedMeals();
  }, []);

  const loadMeals = async (storageUnit: string) => {
    console.log("loadMeals called for storage unit:", storageUnit);
    let householdID;
    try {
      householdID = await AsyncStorage.getItem("householdID");
      console.log("Got householdID:", householdID);
    } catch (error) {
      console.error("Async Storage could not get householdID", error);
      return;
    }

    try {
      console.log("Fetching meals for household:", householdID);
      const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
      const snapshot = await getDoc(userDoc);
      
      if (snapshot.exists()) {
        console.log("Meals document exists");
        const docData = snapshot.data();
        const dict = { ...docData.meals };
        
        setMeals(prevMeals => {
          const updatedMeals = [...prevMeals];
          
          for (const key in dict) {
            if (dict.hasOwnProperty(key)) {
              const existingMealIndex = updatedMeals.findIndex(obj => obj.id === key);
              
              if (existingMealIndex === -1) {
                updatedMeals.push({
                  id: key,
                  name: dict[key].name,
                  description: dict[key].description,
                  image: dict[key].image,
                  ingredients: dict[key].ingredients,
                  ...(storageUnit === "fridge1"
                    ? { numInFridge: dict[key].servings }
                    : { numInFreezer: dict[key].servings })
                } as Meal);
              } else {
                const meal = updatedMeals[existingMealIndex];
                if (storageUnit === "fridge1") {
                  meal.numInFridge = dict[key].servings;
                } else {
                  meal.numInFreezer = dict[key].servings;
                }
              }
            }
          }
          
          return updatedMeals;
        });
      } else {
        console.log("No meals document found");
      }
    } catch (error) {
      console.error("Error loading meals:", error);
    }
  };

  const updateMeal = async (mealId: string, updatedMeal: Partial<Meal>, storageUnit: string) => {
    let householdID;
    try {
      householdID = await AsyncStorage.getItem("householdID");
    } catch (error) {
      console.error("Async Storage could not get householdID", error);
      return;
    }

    const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
    
    try {
      // Update Firebase
      await updateDoc(userDoc, {
        [`meals.${mealId}`]: {
          name: updatedMeal.name,
          description: updatedMeal.description,
          image: updatedMeal.image,
          ingredients: updatedMeal.ingredients,
          servings: storageUnit === "fridge1" ? updatedMeal.numInFridge : updatedMeal.numInFreezer
        }
      });

      // Update local state
      setMeals(prevMeals => {
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
    } catch (error) {
      console.error("Error updating meal:", error);
      throw error;
    }
  };

  const deleteMeal = async (mealId: string, storageUnit: string) => {
    let householdID;
    try {
      householdID = await AsyncStorage.getItem("householdID");
    } catch (error) {
      console.error("Async Storage could not get householdID", error);
      return;
    }

    const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
    
    try {
      // Delete from Firebase
      await updateDoc(userDoc, {
        [`meals.${mealId}`]: deleteField()
      });

      // Update local state
      setMeals(prevMeals => {
        return prevMeals.filter(meal => meal.id !== mealId);
      });
    } catch (error) {
      console.error("Error deleting meal:", error);
      throw error;
    }
  };

  const refreshMeals = async () => {
    setLoading(true);
    try {
      setMeals([]); // Clear existing meals
      await loadMeals("fridge1");
      await loadMeals("freezer1");
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMeals();
  }, []);

  return (
    <MealsContext.Provider value={{ meals, savedMeals, loading, error, updateMeal, deleteMeal }}>
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
  return { savedMeals: context.savedMeals, loading: context.loading, error: context.error };
} 