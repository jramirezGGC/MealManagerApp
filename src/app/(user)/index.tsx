import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavButton from '@/src/components/NavButton';
import { RelativePathString } from 'expo-router'; 

const buttonsData = [
  { key: '1', text: 'Confirm Meal', href: '/(user)/ConfirmMeal' },
  { key: '2', text: 'Sign Up', href: '/(auth)/sign-up' },
  { key: '3', text: 'Sign In', href: '/(auth)/sign-in' },
  { key: '4', text: 'Edit Meal', href: '/(user)/EditMeal' },
  { key: '5', text: 'Edit Profile', href: '/(user)/EditProfile' },
  { key: '6', text: 'Fridge', href: '/(user)/Fridge' },
  { key: '7', text: 'Inventory', href: '/(user)/Inventory' },
  { key: '8', text: 'Main Dashboard', href: '/(user)/MainDashboard' },
  { key: '9', text: 'Manage Household', href: '/(user)/ManageHousehold' },
  { key: '10', text: 'Move Meals', href: '/(user)/MoveMeals' },
  { key: '11', text:  'Create Meal', href: '/(user)/CreateMeal'},
  { key: '12', text: 'Profile', href: '/(user)/Profile' },
  { key: '13', text: 'Recover Password', href: '/(user)/RecoverPassword' },
  { key: '14', text: 'Saved Meals', href: '/(user)/SavedMeals' }
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
