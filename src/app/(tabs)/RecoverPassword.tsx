import { StyleSheet, Text, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RecoverPasswordScreen(){
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* No reference given on Figma*/}
                <Text>Recover Password Screen</Text>
                <Text>No Reference given on Figma</Text>
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
  });