import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, TextInput, View, Button, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; //placeholder for actualy styling

const TextInputExample = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Go Back Button */}
        <Pressable style={styles.goBackButton} onPress={() => { /* Add navigation logic here */ }}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>

        <SafeAreaView style={styles.formContainer}>
          {/* Title and Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Input Fields */}
          <TextInput
            style={styles.input}
            onChangeText={setName}
            placeholder="Name"
            value={name}
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email Address"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Re-type Password"
            secureTextEntry
          />
        </SafeAreaView>

        {/* Button positioned at the bottom center */}
        <View style={styles.buttonContainer}>
          <Button onPress={() => {}} title="Sign Up" />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: 50,  // Adjust based on your layout
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  // Adds a shadow effect on Android
    shadowColor: '#000', // Adds a shadow effect on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default TextInputExample;
