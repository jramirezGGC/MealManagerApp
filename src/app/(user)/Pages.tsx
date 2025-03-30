import NavButton from "@/src/components/NavButton";
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { RelativePathString } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, FlatList, TextInput, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";

const buttonsData = [
  { key: "1", text: "Confirm Meal", href: "/(user)/ConfirmMeal" },
  { key: "2", text: "Meal Details", href: "/(user)/MealDetails" },
  { key: "3", text: "Sign Up", href: "/(auth)/sign-up" },
  { key: "4", text: "Sign In", href: "/(auth)/sign-in" },
  { key: "5", text: "Edit Meal", href: "/(user)/EditMeal" },
  { key: "6", text: "Edit Profile", href: "/(user)/EditProfile" },
  { key: "7", text: "Fridge", href: "/(user)/Fridge" },
  { key: "8", text: "Inventory", href: "/(user)/Inventory" },
  { key: "9", text: "Main Dashboard", href: "/(user)/MainDashboard" },
  { key: "10", text: "Manage Household", href: "/(user)/ManageHousehold" },
  { key: "11", text: "Move Meals", href: "/(user)/MoveMeals" },
  { key: "12", text: "Create Meal", href: "/(user)/CreateMeal" },
  { key: "13", text: "Profile", href: "/(user)/Profile" },
  { key: "14", text: "Recover Password", href: "/(user)/RecoverPassword" },
  { key: "15", text: "Saved Meals", href: "/(user)/SavedMeals" },
  { key: "16", text: "Gallery", href: "/(user)/Gallery" },
  { key: "17", text: "Recreate Meal", href: "/(user)/RecreateMeal" },
];

export default function Pages() {
  const [fieldText, setFieldText] = useState("");
  const db = FIREBASE_DB;

  const addTextToDb = async (fieldText: string) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: fieldText,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={buttonsData}
        renderItem={({ item }) => (
          <NavButton text={item.text} href={item.href as RelativePathString} />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View >
        <TextInput
          placeholder="text for db test"
          value={fieldText}
          onChangeText={setFieldText}
        />
        <Button title="Test Firestore" onPress={() => addTextToDb(fieldText)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
});
