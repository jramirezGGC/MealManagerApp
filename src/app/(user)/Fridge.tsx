import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function FridgeScreen() {

    const Meal = ({ text }: { text: string }) => {
        return (
            <View style={styles.meal}>
                <Image source={require('../../../assets/images/favicon.png')} />
                <View>
                    <Text style={styles.h1}>{text}</Text>
                    <Text style={styles.h1}>kal? | date</Text>
                    <Button onPress={() => {}} title="Edit"/>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Fridge Management</Text>
                <Text style={styles.h1}>List of meals:</Text>
                <Meal text="Sphagetti" />
                <Meal text="Hamburger" />
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
        width: '80%',
    },
    h1: {
        color: 'white',
        fontWeight: '600',
        alignItems: 'flex-start',
    },
    meal: {

        flexDirection: 'row',
    },
});
