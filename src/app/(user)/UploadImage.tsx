/*
 * This file is part of Meal Manager.
 *
 * Meal Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meal Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meal Manager. If not, see <http://www.gnu.org/licenses/>.
 */

import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadImageComponent, { UploadImageComponentRef } from "../../components/UploadImageComponent";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import Colors from "@/src/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to fix Firebase Storage URLs - same as in UploadImageComponent
function fixFirebaseStorageUrl(url: string): string {
    if (!url) return url;
    
    // DIRECT APPROACH: Forcefully replace the pattern 
    // Look for the pattern /o/meals/filename.jpg and replace with /o/meals%2Ffilename.jpg
    if (url.includes('/o/meals/')) {
        const fixedUrl = url.replace('/o/meals/', '/o/meals%2F');
        return fixedUrl;
    }
    
    // Original approach as fallback
    const parts = url.split('/o/');
    if (parts.length !== 2) return url;
    
    const basePart = parts[0];
    const pathAndQuery = parts[1];
    
    const pathQueryParts = pathAndQuery.split('?');
    if (pathQueryParts.length !== 2) return url;
    
    const path = pathQueryParts[0];
    const encodedPath = path.replace(/\//g, '%2F');
    const query = pathQueryParts[1];
    
    const fixedUrl = `${basePart}/o/${encodedPath}?${query}`;
    
    return fixedUrl;
}

export default function UploadImage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const uploadComponentRef = useRef<UploadImageComponentRef>(null);
    
    // Check for existing image URL in AsyncStorage when component mounts
    useEffect(() => {
        const checkExistingImage = async () => {
            try {
                // Only check for saved image if we're coming from CreateMeal (indicated by a fromCreate param)
                // This prevents showing the previous image when starting a new meal creation flow
                if (params.fromCreate) {
                    const savedImageUrl = await AsyncStorage.getItem('tempMealImage');
                    if (savedImageUrl) {
                        console.log("Found saved image URL:", savedImageUrl);
                        setUploadedImageUrl(savedImageUrl);
                        
                        // Forward to CreateMeal with the saved image
                        router.replace({
                            pathname: "/CreateMeal",
                            params: { imageUrl: savedImageUrl }
                        });
                    }
                } else {
                    // If coming from dashboard or elsewhere, clear any stored image
                    console.log("Clearing image storage on UploadImage mount (not from Create)");
                    await AsyncStorage.removeItem('tempMealImage');
                }
            } catch (error) {
                console.error("Error checking for saved image:", error);
            }
        };
        
        checkExistingImage();
        
        // Clean up when component unmounts
        return () => {
            // If we're not going to CreateMeal (navigation was cancelled), clear the image
            if (!uploadedImageUrl) {
                AsyncStorage.removeItem('tempMealImage')
                    .catch(error => console.error("Error clearing image on unmount:", error));
            }
        };
    }, [params.fromCreate]);
    
    const handleImageUploaded = async (url: string) => {
        try {
            console.log("Image uploaded successfully, processing URL...");
            
            // Make sure the URL has properly encoded slashes
            const fixedUrl = fixFirebaseStorageUrl(url);
            console.log(`Fixed URL: ${fixedUrl}`);
            
            // Force the URL pattern to be correct - this is a guaranteed approach
            // Assume structure: https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=xyz
            const forcedUrl = url.indexOf('/o/meals/') > 0 
                ? url.replace('/o/meals/', '/o/meals%2F') 
                : fixedUrl;
            
            console.log(`Final URL to pass to CreateMeal: ${forcedUrl}`);
            setUploadedImageUrl(forcedUrl);
            
            // Save the image URL to AsyncStorage
            await AsyncStorage.setItem('tempMealImage', forcedUrl);
            
            // Use replace instead of navigate to avoid adding to the navigation history
            router.replace({
                pathname: "/CreateMeal",
                params: { imageUrl: forcedUrl }
            });
        } catch (error) {
            console.error("Error handling uploaded image:", error);
            Alert.alert(
                "Upload Error",
                "There was a problem processing the uploaded image. Please try again."
            );
            
            // Reset component state
            if (uploadComponentRef.current) {
                uploadComponentRef.current.resetComponent();
            }
        }
    };

    const handleCancel = async () => {
        // Clear the image URL state before navigating back
        setUploadedImageUrl(null);
        // Reset the component if ref is available
        if (uploadComponentRef.current) {
            uploadComponentRef.current.resetComponent();
        }
        // Don't clear AsyncStorage here - we want to keep the image if the user
        // just went back accidentally
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <UploadImageComponent 
                    ref={uploadComponentRef}
                    onImageUploaded={handleImageUploaded}
                    storagePath="meals"
                    startWithStoredImage={Boolean(params.fromCreate)}
                />
                
                <View style={styles.bottomContainer}>
                    <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={handleCancel}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    bottomContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    cancelButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: "500",
    },
});