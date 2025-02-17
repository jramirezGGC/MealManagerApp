import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image, Pressable, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

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
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header Section */}
                        <View style={styles.header}>
                            {/* Back Button */}
                            <Pressable style={styles.goBackButton} onPress={() => {}}>
                                <AntDesign name="arrowleft" size={24} color="black" />
                            </Pressable>
                                                        
                            {/* Title */}
                            <Text style={styles.screenTitle}>Fridge</Text>
                        </View>
                    <Text style={styles.title}>Fridge Management</Text>
                    <Text style={styles.h1}>List of meals:</Text>
                    <Meal text="Sphagetti" />
                    <Meal text="Hamburger" />
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
    goBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
