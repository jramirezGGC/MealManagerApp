import { useState } from "react";
import { StyleSheet, SafeAreaView, Text, Button, TextInput, Image, View, Pressable, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';


export default function CreateMealScreen() {

    const [mealName, setMealName] = useState('');
    const [description, setDescription] = useState('');
    const [Ingredients, setIngredients] = useState('');
    const [numberOfMeals, setNumberOfMeals] = useState('');

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
                    <Image source={require('../../../assets/images/favicon.png')}/>
                
                    <Text style={styles.title}>Meal Name:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={ setMealName }
                        value={ mealName }
                        placeholder="Name"
                    />

                    <Text style={styles.title}>Meal Description:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={ setDescription }
                        value={ description }
                        placeholder="Description"
                    />

                    {/* Ingredients field is temporary, until we figure out how we want to do ingredient input*/}

                    <Text style={styles.title}>Ingredients:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={ setIngredients }
                        value={ Ingredients }
                        placeholder="Ingredients"
                    />

                    <Text style={styles.title}>Number of Meals:</Text>
                    <TextInput 
                        style={styles.input}
                        onChangeText={ setNumberOfMeals }
                        value={ numberOfMeals }
                        placeholder="#"
                    />
                
                    {/* temporary in place of proper dropdown*/}
                    <TextInput 
                        style={styles.input}
                        onChangeText={ setNumberOfMeals }
                        value={ numberOfMeals }
                        placeholder="Place Into"
                    />

                    <Button onPress={() => {}} title="Create Meal"/>
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
        color: 'white',
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
        width: '80%'
    },
    input: {
        color: 'white',
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
