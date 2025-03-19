import React from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import tempMeals from "@/assets/data/tempMeals";

const defaultImage = require("../../../assets/images/defaultmeal.png");

export default function MealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const meal = tempMeals.find((m) => m.id.toString() === id);

  if (!meal) {
    return <Text>Meal not found</Text>;
  }

  // const handleGoBack = () => {
  //   // You can check for a specific condition to navigate to Gallery or other pages
  //   const previousPage = router.asPath; // Or use router.history to get navigation history

  //   // If you're coming from the Gallery page, go back
  //   if (previousPage.includes("Gallery")) {
  //     router.back();
  //   } else {
  //     router.push("/Gallery"); // Navigate directly to Gallery if not coming from it
  //   }
  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Pressable style={styles.goBackButton} onPress={() => {
              router.back();
            }}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>
            <Text style={styles.screenTitle}>Meal Details</Text>
          </View>

          {/* Horizontal Divider */}
          <View style={styles.divider} />

          {/* Meal Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={meal.image ? meal.image : defaultImage}
              style={styles.mealImage}
            />
          </View>

          {/* Meal Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Meal Name</Text>
            <Text style={styles.value}>{meal.name}</Text>

            <Text style={styles.label}>Meal Description</Text>
            <Text style={styles.value}>{meal.description}</Text>

            <Text style={styles.label}>Ingredients</Text>
            <Text style={styles.value}>
              {meal.ingredients.map((ingredient, index) => (
                <Text key={index}>
                  {ingredient.name}
                  {index < meal.ingredients.length - 1 ? ", " : ""}{" "}
                </Text>
              ))}
            </Text>

            <Text style={styles.label}># of Meals in Fridge</Text>
            <Text style={styles.value}>{meal.numInFridge}</Text>

            <Text style={styles.label}># of Meals in Freezer</Text>
            <Text style={styles.value}>{meal.numInFreezer}</Text>

            <Text style={styles.totalLabel}>Total Meals in Inventory</Text>
            <Text style={styles.totalValue}>
              {meal.numInFridge + meal.numInFreezer}
            </Text>
          </View>

          {/* Edit Button */}
          <Pressable style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editText}>EDIT</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 10,
  },
  goBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backButtonColor,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 40,
  },
  divider: {
    width: 375,
    height: 1,
    backgroundColor: Colors.divider,
    alignSelf: "center",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  mealImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: Colors.inputBackground,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    marginTop: 5,
  },
  editButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 30 : "auto",
    left: "10%",
    right: "10%",
    backgroundColor: Colors.mainBottomButton,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
