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

const defaultImage = require("../../../assets/images/defaultmeal.png");

// // Define an interface for the meal item
// interface MealItem {
//   id: string
//   name: string
//   image: string
// }
// This is just a placeholder for now, you can change this however you see fit

export default function MealGalleryScreen() {
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

      <GalleryImages />
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
