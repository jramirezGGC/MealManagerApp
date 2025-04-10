import React from 'react';
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
import { useMeals } from "@/src/context/MealsContext";

// const defaultImage = require("../../../assets/images/defaultmeal.png");


// let mealsArr : Meal[] = [];

// async function loadStuff(storageUnit: string) {
//   let householdID  
//   try {
//     householdID = await AsyncStorage.getItem("householdID");
//   } catch (error) {
//     console.error("Async Storage could not get householdID", error);
//   }
//   const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
//   const snapshot = await getDoc(userDoc);
//   if (snapshot.exists()) {
//     const docData = snapshot.data();
//     const dict = {...docData.meals}
//     for (const key in dict) {
//       if (dict.hasOwnProperty(key)){
//         if (!mealsArr.find(obj => obj.id == key)) {
//           mealsArr.push( {
//             id: key,
//             name: dict[key].name,
//             description: dict[key].description,
//             image: dict[key].image,
//             ingredients: dict[key].ingredients,
//             ...(storageUnit == "fridge1"
//             ? { numInFridge: dict[key].servings }
//             : { numInFreezer: dict[key].servings })
//           } as Meal);
//         }
//         else {
//           let meal: any = mealsArr.find(obj => obj.id == key);
//           storageUnit == "fridge1" ? meal.numInFridge = dict[key].servings : meal.numInFreezer = dict[key].servings
//         }
//       }
//     }

//     console.log(`Data: ${JSON.stringify(mealsArr)}`);
//   }
//   else {
//     console.error("Gallery Meals loading unsuccessful")
//   }
// }

export default function MealGalleryScreen() {
  const { meals, loading } = useMeals();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Meal Gallery</Text>
          </View>
        </View>
      </View>
      <GalleryImages meals={meals} />
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
});
