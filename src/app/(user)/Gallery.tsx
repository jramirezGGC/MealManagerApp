import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  Image,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, Link } from "expo-router";

import * as SQLite from "expo-sqlite";

import Colors from "@/src/constants/Colors";

import GalleryImages from "@/src/components/GalleryImages";

import { Meal } from "../../types";
import { doc, getDoc } from "firebase/firestore"
import {AutoId} from "@/src/lib/util"
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultImage = require("../../../assets/images/defaultmeal.png");

// // Define an interface for the meal item
// interface MealItem {
//   id: string
//   name: string
//   image: string
// }
// This is just a placeholder for now, you can change this however you see fit

let mealsArr : Meal[] = [];

async function loadStuff(storageUnit: string) {
  let householdID  
  try {
    householdID = await AsyncStorage.getItem("householdID");
  } catch (error) {
    console.error("Async Storage could not get householdID", error);
  }
  const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    const docData = snapshot.data();
    const dict = {...docData.meals}
    for (const key in dict) {
      if (dict.hasOwnProperty(key)){
        if (!mealsArr.find(obj => obj.id == key)) {
          mealsArr.push( {
            id: key,
            name: dict[key].name,
            description: dict[key].description,
            image: require("../../../assets/images/dummyMealImages/chickenandrice.jpg"),
            ingredients: dict[key].ingredients,
            ...(storageUnit == "fridge1"
            ? { numInFridge: dict[key].servings }
            : { numInFreezer: dict[key].servings })
          } as Meal);
        }
        else {
          let meal: any = mealsArr.find(obj => obj.id == key);
          storageUnit == "fridge1" ? meal.numInFridge = dict[key].servings : meal.numInFreezer = dict[key].servings
        }
      }
    }

    console.log(`Data: ${JSON.stringify(mealsArr)}`);
  }
  else {
    console.log("IT Broke")
  }
}

export default function MealGalleryScreen() {
  const [loading, setLoading] = useState(true);
  // const db = SQLite.useSQLiteContext();
  // console.log("Gallery Database Loading...");
  // // var meals2 : MealItem[] = []

  // const result = db.getAllSync(`SELECT * FROM meals`);
  // let row: any
  // for (row of result){
  //   console.log(row.id,row.name,row.description)
  //   meals2.push({ id: row.id, name: row.name, image: "placeholder" })
  // }

  // Sample data - replace with your actual meal data
  // const meals: MealItem[] = [
  //   { id: "1", name: "Chicken Pasta", image: "https://placeholder.com/300" },
  //   { id: "2", name: "Vegetable Curry", image: "https://placeholder.com/300" },
  //   { id: "3", name: "Grilled Salmon", image: "https://placeholder.com/300" },
  //   { id: "4", name: "Caesar Salad", image: "https://placeholder.com/300" },
  //   { id: "5", name: "Beef Stir Fry", image: "https://placeholder.com/300" },
  //   { id: "7", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  //   { id: "8", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  //   { id: "9", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  //   { id: "10", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  //   { id: "11", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  // ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadStuff("fridge1");
        await loadStuff("freezer1");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Gallery</Text>
      </View>

      <GalleryImages meals={mealsArr}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: Colors.textPrimary,
  },
});
