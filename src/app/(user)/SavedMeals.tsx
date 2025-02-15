import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Image, FlatList, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const MyMealsScreen = () => {
  const [activeTab, setActiveTab] = useState('Favorites');

  // Sample meals for "Favorites"
  const meals = [
    { id: '1', name: 'Spaghetti Bolognese', image: 'https://via.placeholder.com/80' },
    { id: '2', name: 'Grilled Chicken Salad', image: 'https://via.placeholder.com/80' },
  ];

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
            <Text style={styles.screenTitle}>My Meals</Text>
          </View>

          {/* Navigation Tabs */}
          <View style={styles.navTabs}>
            <Pressable
              style={[styles.navTab, activeTab === 'Favorites' && styles.activeTab]}
              onPress={() => setActiveTab('Favorites')}>
              <Text style={[styles.navText, activeTab === 'Favorites' && styles.activeText]}>Favorites</Text>
            </Pressable>

            <Pressable
              style={[styles.navTab, activeTab === 'History' && styles.activeTab]}
              onPress={() => setActiveTab('History')}>
              <Text style={[styles.navText, activeTab === 'History' && styles.activeText]}>History</Text>
            </Pressable>
          </View>

          {/* Main Section - Display Meals in Favorites */}
          {activeTab === 'Favorites' && (
            <FlatList
              data={meals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.mealContainer}>
                  {/* Meal Image */}
                  <Image source={{ uri: item.image }} style={styles.mealImage} />
                  
                  {/* Meal Details */}
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{item.name}</Text>
                    
                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <Pressable style={styles.createMealButton}>
                        <Text style={styles.createMealText}>Create Meal</Text>
                      </Pressable>
                      <Pressable style={styles.removeButton}>
                        <Text style={styles.removeText}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            />
          )}

          {/* Save New Meal Button */}
          <Pressable style={styles.saveMealButton} onPress={() => {}}>
            <Text style={styles.saveMealText}>Save New Meal</Text>
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
    marginRight: 40, // Adjusting spacing to balance the centered title
  },
  navTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navText: {
    fontSize: 16,
    color: 'gray',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  mealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 15,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  createMealButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  createMealText: {
    color: '#fff',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
  },
  saveMealButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  saveMealText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyMealsScreen;
