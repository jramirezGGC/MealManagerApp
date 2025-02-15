import { useState } from "react";
import { StyleSheet, SafeAreaView, Text, Button, TextInput, Image } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function CreateMealScreen() {

    const [mealName, setMealName] = useState('');
    const [description, setDescription] = useState('');
    const [Ingredients, setIngredients] = useState('');
    const [numberOfMeals, setNumberOfMeals] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
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
            </SafeAreaView>
        </SafeAreaProvider>
    );
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
        color: 'white',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%'
    },
    input: {
        color: 'white',
    },
});
