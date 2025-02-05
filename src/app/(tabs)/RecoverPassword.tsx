import { StyleSheet, View, Text } from "react-native";

export default function RecoverPasswordScreen(){
    return (
        <View style={styles.container}>
            {/* No reference given on Figma*/}
            <Text>Recover Password Screen</Text>
            <Text>No Reference given on Figma</Text>
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