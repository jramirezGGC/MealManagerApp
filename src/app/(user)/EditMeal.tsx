import { useState } from "react";
import { StyleSheet, Text, SafeAreaView, Image, TextInput, Button, Pressable, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

export default function EditMealScreen(){

    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
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
                        <Text style={styles.screenTitle}>Edit Meal</Text>
                        </View>
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
        backgroundColor: Colors.backgroundColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
        paddingBottom: 10,
    },
    screenTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 40, // Balancing centered title
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