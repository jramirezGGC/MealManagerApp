// src/components/CustomTabBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomTabbar(props: BottomTabBarProps) {
  const pathname = usePathname();

  const showOnScreens = ["/(user)/MainDashboard"]

  const shouldShowNav = showOnScreens.some((screen) => pathname.includes(screen.replace("/(user)/", "")))

  if (!shouldShowNav) {
    return null
  }
  
  // Handle creating a new meal - ensure we clear any stored image first
  const handleCreateMeal = async () => {
    try {
      // Clear any stored image to ensure a fresh start
      await AsyncStorage.removeItem('tempMealImage');
      console.log("Cleared stored image before starting new meal creation");
      // Then navigate to the create meal screen
      router.push("/(user)/CreateMeal");
    } catch (error) {
      console.error("Error clearing stored image:", error);
      // Still navigate even if there was an error
      router.push("/(user)/CreateMeal");
    }
  };
  
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => router.push("/(user)/Fridge")}
      >
        <Text style={[
          styles.navIcon,
          pathname.includes('/(user)/Fridge') && styles.activeNavIcon
        ]}>🗄️</Text>
        <Text style={[
          styles.navText,
          pathname.includes('/(user)/Fridge') && styles.activeNavText
        ]}>Fridge</Text>        
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleCreateMeal}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => router.push("/(user)/Settings")}
      >
        <Text style={[
          styles.navIcon,
          pathname.includes('/(user)/Settings') && styles.activeNavIcon
        ]}>⚙️</Text>
        <Text style={[
          styles.navText,
          pathname.includes('/(user)/Settings') && styles.activeNavText
        ]}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/(user)/Pages')}
      >
      <Text style={[
          styles.navText,
          pathname.includes('/(user)/Pages') && styles.activeNavText
        ]}>Pages</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    width: 80,
  },
  navIcon: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 4,
  },
  activeNavIcon: {
    color: Colors.secondary,
  },
  navText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activeNavText: {
    color: Colors.secondary,
    fontWeight: "600",
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: "300",
  },
});