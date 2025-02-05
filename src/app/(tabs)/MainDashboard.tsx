import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function MainDashboardScreen(){
    return (
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
              <Text>Fridge Items</Text>
              {/*
              This flatlist will contain the meals.  Will have to add dummy data to test
              <FlatList/>  

              The flatlist items will need to be pressables so the user can click on them
              and press take meal
              */}
                    
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