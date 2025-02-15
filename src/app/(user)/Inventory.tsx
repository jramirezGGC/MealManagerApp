import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

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
            <SafeAreaView style={styles.container}>
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
});
