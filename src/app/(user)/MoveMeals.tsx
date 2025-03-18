import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import * as SQLite from 'expo-sqlite';
import Colors from '@/src/constants/Colors';

interface Meal {
  id: number
  name: string
  calories: string
  date: string
}

export default function MoveMealsScreen() {
  const [selectedMeals, setSelectedMeals] = useState<number[]>([])
  const db = SQLite.useSQLiteContext();
  let row: any

  var meals : Meal[] = [];

  const result = db.getAllSync(`SELECT * FROM meals`);
  console.log("Move Meals Database Loading...")
  for (row of result){
    console.log(row.id,row.name,row.description)
    meals.push({ id: row.id, name: row.name, calories: "kal?", date: "date?"})
  }

  const toggleMealSelection = (mealId: number) => {
    setSelectedMeals((prev) => (prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]))
  }

  const handleMoveMeals = () => {
    console.log("Moving meals:", selectedMeals)
    const statement = db.prepareSync('UPDATE inventory SET is_fridge = ? WHERE ID = ?');
    selectedMeals.forEach( mealID =>
    {
      console.log(mealID);
      statement.executeSync(true, mealID);
    })
    statement.finalizeAsync();
    let result = db.getAllSync(`SELECT * FROM inventory`);
    
    let row: any
    for (row of result){
      console.log(row.id,row.is_fridge)
    }

  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealContent}>
        <View style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealDetails}>
            <Text style={styles.mealDetailText}>{item.calories}</Text>
            <Text style={styles.mealDetailSeparator}>|</Text>
            <Text style={styles.mealDetailText}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.mealsLeft}>Meals Left: #{item.id}</Text>
      </View>
      <TouchableOpacity
        style={[styles.selectButton, selectedMeals.includes(item.id) && styles.selectedButton]}
        onPress={() => toggleMealSelection(item.id)}
      >
        <Text style={styles.selectButtonText}>{selectedMeals.includes(item.id) ? "Selected" : "Select Meal"}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View/>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Move Meals</Text>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => <Text style={styles.sectionTitle}>List of Meals:</Text>}
      />

      <TouchableOpacity
        style={[styles.moveButton, selectedMeals.length === 0 && styles.moveButtonDisabled]}
        onPress={handleMoveMeals}
        disabled={selectedMeals.length === 0}
      >
        <Text style={styles.moveButtonText}>MOVE MEAL{selectedMeals.length !== 1 ? "(S)" : ""}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
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
    marginLeft: 8,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginBottom: 16,
  },
  mealItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 16,
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  mealDetailSeparator: {
    marginHorizontal: 8,
    color: Colors.textTertiary,
  },
  mealsLeft: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginLeft: 12,
  },
  selectButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  selectedButton: {
    backgroundColor: Colors.primary,
  },
  selectButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  moveButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  moveButtonDisabled: {
    opacity: 0.6,
  },
  moveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})