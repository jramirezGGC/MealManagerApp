import React, { useState }from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Image, Platform, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';

export default function ConfirmMealScreen(){

  const [fridgeMeals, setFridgeMeals] = useState('');
  const [freezerMeals, setFreezerMeals] = useState('');

  const totalMeals = (parseInt(fridgeMeals) || 0) + (parseInt(freezerMeals) || 0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Back Button */}
            <Pressable style={styles.goBackButton} onPress={() => {}}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>

            {/* Title */}
            <Text style={styles.screenTitle}>Confirm Meal</Text>
          </View>

          {/* Horizontal Divider */}
          <View style={styles.divider} />

          {/* Main Section */}
          <View style={styles.mainContent}>
            {/* Placeholder Image */}
            {/* Meal Navigation Tab */}
            <Pressable style={styles.mealTab} onPress={() => {}}>
              <Image source={require('../../../assets/images/favicon.png')} style={styles.mealImage} />
              <Text style={styles.mealName}>Meal Name</Text>
              <AntDesign name="right" size={20} color="black" />
            </Pressable>

            {/* Input Fields Section */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}># of Meals to place into Fridge</Text>
              <TextInput
                style={styles.inputField}
                placeholder="##"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
                value={fridgeMeals}
                onChangeText={setFridgeMeals}
              />

              <Text style={styles.label}># of Meals to place into Freezer</Text>
              <TextInput
                style={styles.inputField}
                placeholder="##"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
                value={freezerMeals}
                onChangeText={setFreezerMeals}
              />

              {/* Total Meals Display */}
              <Text style={styles.totalLabel}>Total of Meals added to Inventory</Text>
              <Text style={styles.totalMeals}>{totalMeals || '##'}</Text>
            </View>
          </View>
          {/* Confirm Meal Button */}
          <Pressable style={styles.confirmButton} onPress={() => {}}>
            <Text style={styles.confirmText}>Confirm Meal</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
  },
  divider: {
    width: 375,
    height: 1,
    backgroundColor: Colors.lineDivider,
    alignSelf: 'center',
    marginTop: 10,
  },  
  goBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.goBackButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 40, // Balancing centered title
  },
  mainContent: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mealTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.rectangleBGColor,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginBottom: 5,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginLeft: -40,
  },
  inputContainer: {
    backgroundColor: Colors.rectangleBGColor,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  totalMeals: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  placeholder: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  confirmButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 30 : 50,
    left: '10%',
    right: '10%',
    backgroundColor: Colors.mainBottomButton,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
