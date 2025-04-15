import { View, Image, StyleSheet, Button, Platform } from "react-native";
import { FIREBASE_STORAGE } from "../lib/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function UploadImageTest() {
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            // Use ImagePicker to select an image from the device
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setPreviewUri(uri);
                await uploadImageToFirebase(uri);
            }
        } catch (error: unknown) {
            console.error("Error in image upload:", error);
            alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error occurred'));
        }
    };

    const takePhoto = async () => {
        try {
            // Request camera permissions first
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to take pictures!');
                return;
            }

            // Launch camera
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                setPreviewUri(uri);
                await uploadImageToFirebase(uri);
            }
        } catch (error: unknown) {
            console.error("Error taking photo:", error);
            alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error occurred'));
        }
    };

    const uploadImageToFirebase = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const storageRef = ref(FIREBASE_STORAGE, `uploads/${filename}`);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            
            console.log('File available at', downloadURL);
            alert('Image uploaded successfully!');
            return downloadURL;
        } catch (error: unknown) {
            console.error("Upload error:", error);
            alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error occurred'));
            throw error;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button 
                    title="Choose from Gallery"
                    onPress={pickImage}
                />
                <Button 
                    title="Take a Photo"
                    onPress={takePhoto}
                />
            </View>
            
            {previewUri && (
                <View style={styles.previewContainer}>
                    <Image 
                        source={{ uri: previewUri }}
                        style={styles.previewImage}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

export default UploadImageTest;

const styles = StyleSheet.create({
    container: {
        // flex: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20
    },
    previewContainer: {
        marginTop: 20,
        width: "100%",
        alignItems: "center"
    },
    previewImage: {
        width: 250,
        height: 250,
        borderRadius: 8
    }
});
  