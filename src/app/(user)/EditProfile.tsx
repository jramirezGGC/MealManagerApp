import { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Button, Alert, Image, TextInput, Pressable, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';

export default function EditProfileScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                            <Text style={styles.screenTitle}>Edit Profile</Text>
                        </View>
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
        backgroundColor: Colors.backgroundColor,
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
