import { Button, Pressable, StyleSheet } from 'react-native';
import NavButton from '@/src/components/NavButton';


import { Text, View } from '@/src/components/Themed';
import { Link, RelativePathString, useRouter } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';

export default function IndexScreen() {
  return (
    <View style={styles.container}>      
      <NavButton text='Confirm Meal' href={`/(tabs)/ConfirmMeal` as RelativePathString} />
    </View>
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
