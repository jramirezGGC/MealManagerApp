import { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, TextInput, Button } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function EditMealScreen(){

    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfMeals, setNumberOfMeals] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Image source={require('../../../assets/images/favicon.png')}/>
                
                <Text>Edit Meal Name:</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={ setText }
                    value={ text }
                    placeholder="Name"
                />

                <Text>Edit Description:</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={ setDescription }
                    value={ description }
                    placeholder="Description"
                />

                <Text>Number of Meals:</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={ setNumberOfMeals }
                    value={ numberOfMeals }
                    placeholder="#"
                />

                <Button onPress={() => {}} title="Save"/>


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
    input: {

    }
  });