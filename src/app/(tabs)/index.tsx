import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavButton from '@/src/components/NavButton';
import { RelativePathString } from 'expo-router'; // Assume this is the correct import

const buttonsData = [
  { key: '1', text: 'Confirm Meal', href: '/(tabs)/ConfirmMeal' },
  { key: '2', text: 'Sign Up', href: '/(auth)/sign-up' },
  { key: '3', text: 'Sign In', href: '/(auth)/sign-in' },
  { key: '4', text: 'Edit Meal', href: '/(tabs)/EditMeal' },
  { key: '5', text: 'Edit Profile', href: '/(tabs)/EditProfile' },
  { key: '6', text: 'Fridge', href: '/(tabs)/Fridge' },
  { key: '7', text: 'Inventory', href: '/(tabs)/Inventory' },
  { key: '8', text: 'Main Dashboard', href: '/(tabs)/MainDashboard' },
  { key: '9', text: 'Manage Household', href: '/(tabs)/ManageHousehold' },
  { key: '10', text: 'Move Meals', href: '/(tabs)/MoveMeals' },
  { key: '11', text:  'Create Meal', href: '/(tabs)/CreateMeal'},
  { key: '12', text: 'Profile', href: '/(tabs)/Profile' },
  { key: '13', text: 'Recover Password', href: '/(tabs)/RecoverPassword' },
  { key: '14', text: 'Saved Meals', href: '/(tabs)/SavedMeals' }
];

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={buttonsData}
        renderItem={({ item }) => (
          <NavButton text={item.text} href={item.href as RelativePathString} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
