import { StyleSheet, Text, View, Image, Pressable, Button } from 'react-native';

export default function OnboardingScreen() {
    return (
        <View style={styles.container}>
            {/* We can either use a static image, or have it
                rotate between a few
            */}
            <Image source={require('../../../assets/images/favicon.png')}/>
            <Text>All your favorites</Text>
            <Text>Have all of your meal preparations saved on the cloud!</Text>
            <Button onPress={() => {}} title="Log In"/>
            <Pressable onPress={() => {}}>
                <Text>Create Account</Text>
            </Pressable>
        </View>
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
  });