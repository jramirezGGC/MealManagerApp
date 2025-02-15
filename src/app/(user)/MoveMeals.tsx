import { StyleSheet, Text, SafeAreaView, Button } from "react-native";
import { FlatList, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import tempMeals from "@/assets/data/tempMeals";
import { tempMeal } from "@/src/types";

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
            <SafeAreaView style={styles.container}>
                <Text>List of Meals</Text>
                <FlatList 
                    data={tempMeals}
                    renderItem={renderItem}
                    keyExtractor={(items, index) => index.toString()}                    
                />

                <Button title="Move Meal(s)" onPress={() => console.log('Move Meals Pressed')} />
                
            </SafeAreaView>
        </SafeAreaProvider>
    )   
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    mealContainer: {

    }
  });