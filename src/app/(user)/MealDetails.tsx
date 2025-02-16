import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

export default function MealDetailsScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <Pressable style={styles.goBackButton} onPress={() => {}}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>
            <Text style={styles.screenTitle}>Meal Details</Text>
          </View>

          {/* Horizontal Divider */}
          <View style={styles.divider} />

          {/* Meal Image Section */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../../assets/images/favicon.png')} 
              style={styles.mealImage} 
            />
          </View>

          {/* Meal Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Meal Name</Text>
            <Text style={styles.value}>Place here</Text>

            <Text style={styles.label}>Meal Description</Text>
            <Text style={styles.value}>Place here</Text>

            <Text style={styles.label}>Ingredients</Text>
            <Text style={styles.value}>Place here</Text>

            <Text style={styles.label}># of Meals in Fridge</Text>
            <Text style={styles.value}>##</Text>

            <Text style={styles.label}># of Meals in Freezer</Text>
            <Text style={styles.value}>##</Text>

            <Text style={styles.totalLabel}>Total Meals in Inventory</Text>
            <Text style={styles.totalValue}>##</Text>
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
    marginRight: 40, 
  },
  divider: {
      width: 375,
      height: 1,
      backgroundColor: Colors.lineDivider,
      alignSelf: 'center',
      marginTop: 10,
    }, 
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  mealImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: Colors.backGroundColorLight,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 30 : 50,
    left: '10%',
    right: '10%',
    backgroundColor: Colors.mainBottomButton,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
