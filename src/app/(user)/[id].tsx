"use client"

import { useState } from "react"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { StyleSheet, Text, View, Pressable, Image, Platform, ScrollView } from "react-native"
import Colors from "@/src/constants/Colors"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useMeals } from "@/src/context/MealsContext"
import { Images } from "@/src/constants/Images"

export default function MealDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { meals } = useMeals()
  const [imageError, setImageError] = useState(false)

  const mealId = Array.isArray(id) ? id[0] : id
  const meal = meals.find((m) => m.id === mealId)

  if (!meal) {
    return <Text>Meal not found</Text>
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Meal Details</Text>
                <Text style={styles.headerSubtitle}>View meal information</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {/* Meal Image Section */}
              <View style={styles.imageContainer}>
                <Image
                  source={!imageError && meal.image ? { uri: meal.image } : Images.defaultMeal}
                  style={styles.mealImage}
                  onError={() => setImageError(true)}
                  onLoadStart={() => setImageError(false)}
                />
              </View>

              {/* Meal Information Section */}
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Meal Name</Text>
                  <Text style={styles.value}>{meal.name}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.label}>Meal Description</Text>
                  <Text style={styles.value}>{meal.description}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.label}>Ingredients</Text>
                  <Text style={styles.value}>
                    {meal.ingredients.map((ingredient, index) => (
                      <Text key={index}>
                        {ingredient.name}
                        {index < meal.ingredients.length - 1 ? ", " : ""}{" "}
                      </Text>
                    ))}
                  </Text>
                </View>

                <View style={styles.servingsContainer}>
                  <View style={styles.servingItem}>
                    <Text style={styles.servingLabel}>Fridge</Text>
                    <Text style={styles.servingValue}>{meal.numInFridge || 0}</Text>
                  </View>

                  <View style={styles.servingDivider} />

                  <View style={styles.servingItem}>
                    <Text style={styles.servingLabel}>Freezer</Text>
                    <Text style={styles.servingValue}>{meal.numInFreezer || 0}</Text>
                  </View>
                </View>

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Meals in Inventory</Text>
                  <Text style={styles.totalValue}>
                    {Number(meal.numInFridge || 0) + Number(meal.numInFreezer || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Edit Button */}
          <View style={styles.buttonContainer}>
            <Pressable 
              style={styles.editButton} 
              onPress={() => router.push({
                pathname: "/EditMeal",
                params: { id: mealId }
              })}              
            >
              <Text style={styles.editText}>Edit Meal</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 100,
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
  mealImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    paddingHorizontal: 24,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  servingsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  servingItem: {
    flex: 1,
    alignItems: "center",
  },
  servingLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  servingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  servingDivider: {
    width: 1,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
  },
  totalContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.white,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    zIndex: 1,
    elevation: 5,
  },
  editButton: {
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
  editText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
