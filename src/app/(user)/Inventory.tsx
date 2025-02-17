import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image, Pressable, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

const ButtonList = () => {
    return (
        <View style={styles.buttonList}>
            <WideButton text="Manage Household"></WideButton>
            <WideButton text="Create Meals"></WideButton>
            <WideButton text="Move Meals"></WideButton>
        </View>
    );
}

const WideButton = ({ text }: { text: string }) => {
    return (
        <View style={styles.wideButton}>
            <Image source={require('../../../assets/images/favicon.png')}></Image>
            <Button
                title={text}
                onPress={() => Alert.alert('Button Pressed!')}
            />
            <Text style={styles.title}>&gt;</Text>
        </View>
    );
}

export default function InventoryScreen() {
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
                    <Text style={styles.title}>Inventory</Text>
                    <ButtonList></ButtonList>
                    <View style= {styles.bottomButtons}>
                        <Button
                            title='Fridge'
                            onPress={() => Alert.alert('Button Pressed!')}
                        />
                        <Button
                            title='Freezer'
                            onPress={() => Alert.alert('Button Pressed!')}
                        />
                    </View>
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
    wideButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomButtons: {
        backgroundColor: 'green',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: 20,
    },
    buttonList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
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
