import { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image, TextInput } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function EditProfileScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Personal Info</Text>
                <Image source={require('../../../assets/images/favicon.png')} />
                <Text style={styles.title}>Update Name:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Username"
                />

                <Text style={styles.title}>Update Email:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="email@email.com"
                />

                <Text style={styles.title}>Update Email:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="********"
                />

                <Button onPress={() => { }} title="Save" />
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
    input: {
        color: 'white',
    },
});
