import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadImageComponent from "../../components/UploadImageComponent";
import { useRouter } from "expo-router";
import { useState } from "react";
import Colors from "@/src/constants/Colors";

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
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    
    const handleImageUploaded = (url: string) => {
        // Make sure the URL has properly encoded slashes
        const fixedUrl = fixFirebaseStorageUrl(url);
        
        // Force the URL pattern to be correct - this is a guaranteed approach
        // Assume structure: https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=xyz
        const forcedUrl = url.indexOf('/o/meals/') > 0 
            ? url.replace('/o/meals/', '/o/meals%2F') 
            : fixedUrl;
        
        setUploadedImageUrl(forcedUrl);
        
        // Use replace instead of navigate to avoid adding to the navigation history
        router.replace({
            pathname: "/CreateMeal",
            params: { imageUrl: forcedUrl }
        });
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <UploadImageComponent 
                onImageUploaded={handleImageUploaded}
                storagePath="meals"
            />
            
            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    bottomContainer: {
        paddingHorizontal: 24,
        paddingBottom: 30,
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