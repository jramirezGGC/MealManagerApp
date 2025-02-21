import { StyleSheet, Text, Image, Pressable, Button, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';


const loadDatabase = async () => {
  const dbName = "App.db";
  const dbAsset = require("../../lib/App.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
    console.log('done')
  }
}

function test() {
  FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'SQLite/')
    .then(files => {
      console.log('SQLite databases:', files);
    })
    .catch(error => {
      console.error('Error reading directory:', error);
    });
}

function test2() {
  SQLite.deleteDatabaseAsync("App.db")
}

function Test3() {
  const db = SQLite.useSQLiteContext();
  const result = db.getAllSync(`SELECT * FROM users`);
  console.log("???")
  for (const row of result){
    console.log(row.id,row.user)
  }
  

  return <Text>???</Text>
}

export default function OnboardingScreen() {
  const [DBLoaded, setDBLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDBLoaded(true))
      .catch((e) => console.error(e));
  }, [])




  return (
    <SQLiteProvider databaseName="App.db" onInit={loadDatabase}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* We can either use a static image, or have it
                    rotate between a few
                */}
          <Image source={require('../../../assets/images/favicon.png')} />
          <Text>All your favorites</Text>
          <Text>Have all of your meal preparations saved on the cloud!</Text>
          <Button onPress={() => test()} title="Log In" />
          <Pressable onPress={() => test2()}>
            <Text>Create Account</Text>
          </Pressable>
          <Test3/>
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
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