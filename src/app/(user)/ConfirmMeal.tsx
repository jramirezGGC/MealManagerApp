import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ConfirmMealScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Back Button */}
            <Pressable style={styles.goBackButton} onPress={() => {}}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>

            {/* Title */}
            <Text style={styles.screenTitle}>Confirm Meal</Text>
          </View>

          {/* Main Section */}
          <View style={styles.mainContent}>
            {/* Placeholder Image */}
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.mealImage} />

            {/* Meal Information Fields */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Meal Name</Text>
              <Text style={styles.placeholder}>Example Meal Name</Text>

              <Text style={styles.label}>Meal Description</Text>
              <Text style={styles.placeholder}>This is a delicious meal...</Text>

              <Text style={styles.label}>Ingredients</Text>
              <Text style={styles.placeholder}>Ingredient 1, Ingredient 2...</Text>

              <Text style={styles.label}>Number of Meals</Text>
              <Text style={styles.placeholder}>2</Text>

              <Text style={styles.label}>Placed Into</Text>
              <Text style={styles.placeholder}>Freezer</Text>
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
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
  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
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
    backgroundColor: '#4CAF50',
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

export default ConfirmMealScreen;
