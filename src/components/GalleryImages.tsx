import { router, Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Image,
  Pressable,
} from "react-native";
import { Meal } from "../types";
import Colors from "../constants/Colors";
import { Images } from "../constants/Images";
import { useState } from "react";

const MealItem = ({ item }: { item: Meal }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/${item.id}`} asChild>
      <Pressable
        style={styles.mealItem}
      >
        <View style={styles.imageContainer}>
          <Image
            source={!imageError && item.image ? { uri: item.image } : Images.defaultMeal}
            style={styles.imagePlaceholder}
            onError={() => setImageError(true)}
            onLoadStart={() => setImageError(false)}
          />
        </View>
        <Text style={styles.mealName} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    </Link>
  );
};

function GalleryImages({ meals } : { meals: Meal[]}) {
  return (
    <FlatList
      data={meals}
      renderItem={({ item }) => <MealItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
    />
  );
}

export default GalleryImages;

const styles = StyleSheet.create({
  mealItem: {
    width: "48%", // Slightly less than 50% to allow for spacing
    marginBottom: 16,
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Makes it square
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 16,
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  mealName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    textAlign: "center",
    paddingHorizontal: 4,
  },
});
