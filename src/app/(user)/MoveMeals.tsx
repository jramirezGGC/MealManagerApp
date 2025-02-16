import { StyleSheet, Text, SafeAreaView, Button, View, Pressable, Platform } from "react-native";
import { FlatList, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import tempMeals from "@/assets/data/tempMeals";
import { tempMeal } from "@/src/types";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

export default function MoveMealsScreen(){

    
    const renderItem = ({ item }: {item: tempMeal}) => (
        <SafeAreaView style = {styles.mealContainer}>
            <SafeAreaView style={styles.mealContainer}>
                <Image source={require('../../../assets/images/favicon.png')}/>
                <Text >{item.name || 'Meal Name'}</Text>
                <Text >cal? | date?</Text>
                <Text >Meals Left: {item.count}</Text>
                <Button title="Select Meal" onPress={() => console.log('Meal selected')} />
            </SafeAreaView>
        </SafeAreaView>
    )

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
                        <Text style={styles.screenTitle}>Inventory</Text>
                    </View>
                    <Text>List of Meals</Text>
                    <FlatList 
                        data={tempMeals}
                        renderItem={renderItem}
                        keyExtractor={(items, index) => index.toString()}                    
                    />
                    <Button title="Move Meal(s)" onPress={() => console.log('Move Meals Pressed')} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )   
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    screenTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 40, // Balancing centered title
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    mealContainer: {

    },
    goBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
  });