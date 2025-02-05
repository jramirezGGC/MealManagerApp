import { StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';


export default function MainDashboardScreen(){
    return (
        <View style={styles.container}>
            <Text>Fridge Items</Text>
            {/*
            This flatlist will contain the meals.  Will have to add dummy data to test
            <FlatList/>  

            The flatlist items will need to be pressables so the user can click on them
            and press take meal
            */}
                  
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