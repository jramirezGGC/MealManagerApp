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

import React, { useImperativeHandle, forwardRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Platform, ActivityIndicator } from "react-native";
import { FIREBASE_STORAGE } from "../lib/firebaseConfig";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";

interface UploadImageComponentProps {
    onImageUploaded?: (url: string) => void;
    storagePath?: string;
}

export interface UploadImageComponentRef {
    resetComponent: () => void;
}

// Helper function to fix Firebase Storage URLs
function fixFirebaseStorageUrl(url: string): string {
    if (!url) return url;
    
    // Check if URL is a Firebase Storage URL
    if (!url.includes('firebasestorage.googleapis.com/v0/b/')) {
        return url;
    }
    
    // Split URL at /o/ to get the base and path parts
    const parts = url.split('/o/');
    if (parts.length !== 2) return url;
    
    const basePart = parts[0];
    const pathAndQuery = parts[1];
    
    // Split path and query
    const pathQueryParts = pathAndQuery.split('?');
    if (pathQueryParts.length !== 2) return url;
    
    // Replace all forward slashes with %2F
    const path = pathQueryParts[0];
    const encodedPath = path.replace(/\//g, '%2F');
    const query = pathQueryParts[1];
    
    // Reconstruct the URL
    const fixedUrl = `${basePart}/o/${encodedPath}?${query}`;
    
    return fixedUrl;
}

const UploadImageComponent = forwardRef<UploadImageComponentRef, UploadImageComponentProps>(({ 
    onImageUploaded, 
    storagePath = "uploads"
}, ref) => {
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        resetComponent: () => {
            setPreviewUri(null);
            setShowConfirmation(false);
            setIsUploading(false);
        }
    }));

    const resetComponent = () => {
        setPreviewUri(null);
        setShowConfirmation(false);
        setIsUploading(false);
    };

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
                setShowConfirmation(true);
            }
        } catch (error: unknown) {
            // Silently handle errors without alerts
        }
    };

    const takePhoto = async () => {
        try {
            // Request camera permissions first
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
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
                setShowConfirmation(true);
            }
        } catch (error: unknown) {
            // Silently handle errors without alerts
        }
    };

    const confirmImage = async () => {
        if (!previewUri) return;
        
        try {
            setIsUploading(true);
            
            let downloadURL = await uploadImageToFirebase(previewUri);
            
            // Fix the URL to ensure proper encoding
            downloadURL = fixFirebaseStorageUrl(downloadURL);
            
            // Add a delay to ensure Firebase has processed the image
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verify the image is accessible after the delay
            const isAccessible = await verifyImageUrl(downloadURL);
            if (!isAccessible) {
                console.error("Image URL is not accessible after upload");
                setIsUploading(false);
                return;
            }
            
            if (downloadURL && onImageUploaded) {
                // Call the parent component's callback
                onImageUploaded(downloadURL);
                // Clear image state after successful upload
                resetComponent();
            } else {
                console.error("Image upload completed but no valid URL or callback");
                setIsUploading(false);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setIsUploading(false);
            // Reset to selection state
            setPreviewUri(null);
            setShowConfirmation(false);
        }
    };

    // Helper function to verify the image URL is accessible
    const verifyImageUrl = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const cancelConfirmation = () => {
        resetComponent();
    };

    const uploadImageToFirebase = async (uri: string) => {
        try {
            console.log("Starting image upload process...");
            
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error(`Failed to fetch image from URI: ${response.status}`);
            }
            
            const blob = await response.blob();
            console.log(`Image blob created: ${blob.size} bytes`);
            
            // Generate a unique filename with timestamp to avoid conflicts
            const timestamp = new Date().getTime();
            const randomString = Math.random().toString(36).substring(2, 8);
            const filename = `image_${timestamp}_${randomString}.jpg`;
            
            // Create storage path and properly format it for Firebase
            const fullStoragePath = `${storagePath}/${filename}`;
            console.log(`Storage path: ${fullStoragePath}`);
            
            const firebaseStorageRef = storageRef(FIREBASE_STORAGE, fullStoragePath);

            // Set metadata to make the file publicly accessible
            const metadata = {
                contentType: 'image/jpeg',
                cacheControl: 'public, max-age=31536000',
            };

            console.log("Uploading to Firebase Storage...");
            await uploadBytes(firebaseStorageRef, blob, metadata);
            console.log("Upload successful, getting download URL...");
            
            // Get the download URL with a long-lived token
            let downloadURL = await getDownloadURL(firebaseStorageRef);
            console.log(`Raw download URL: ${downloadURL}`);
            
            // DIRECT APPROACH: If the URL contains '/o/meals/' pattern, fix it immediately
            if (downloadURL.includes('/o/meals/')) {
                downloadURL = downloadURL.replace('/o/meals/', '/o/meals%2F');
                console.log(`Fixed URL pattern: ${downloadURL}`);
            } else {
                // Apply the general fix function
                const previousUrl = downloadURL;
                downloadURL = fixFirebaseStorageUrl(downloadURL);
                if (previousUrl !== downloadURL) {
                    console.log(`URL encoding fixed: ${downloadURL}`);
                }
            }
            
            return downloadURL;
        } catch (error: any) {
            console.error("Error in uploadImageToFirebase:", error?.message || error);
            // Re-throw for the calling function to handle
            throw error;
        }
    };

    return (
        <View style={styles.content}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Upload Image</Text>
                </View>
                <Text style={styles.headerSubtitle}>Select or take a photo for your meal</Text>
            </View>

            {previewUri && (
                <View style={styles.previewContainer}>
                    <Image 
                        source={{ uri: previewUri }}
                        style={styles.previewImage}
                    />
                </View>
            )}

            {showConfirmation && previewUri ? (
                <View style={styles.buttonsContainer}>
                    {isUploading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.loadingText}>Uploading image...</Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.confirmText}>Use this image?</Text>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={confirmImage}
                            >
                                <Text style={styles.primaryButtonText}>Yes, Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={cancelConfirmation}
                            >
                                <Text style={styles.secondaryButtonText}>No, Try Again</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={pickImage}
                    >
                        <Text style={styles.primaryButtonText}>Choose from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={takePhoto}
                    >
                        <Text style={styles.primaryButtonText}>Take a Photo</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
});

export default UploadImageComponent;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: "center",
        width: "100%",
        paddingVertical: 20,
    },
    headerContainer: {
        paddingHorizontal: 24,
        marginBottom: 30,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    buttonsContainer: {
        width: "100%",
        paddingHorizontal: 24,
        gap: 16,
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    secondaryButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: "600",
    },
    previewContainer: {
        marginVertical: 30,
        width: "85%",
        alignItems: "center",
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    previewImage: {
        width: 300,
        height: 300,
        borderRadius: 8
    },
    confirmText: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.textPrimary,
        textAlign: "center",
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: Colors.textSecondary,
    }
}); 