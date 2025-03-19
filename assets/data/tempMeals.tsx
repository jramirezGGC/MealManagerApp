import { Meal } from "@/src/types";

const tempMeals: Meal[] = [
  {
    id: 1,
    name: "Beef Burrito",
    image: require("../../assets/images/dummyMealImages/beefburrito.jpg"),
    calories: 650,
    date: new Date(2025, 2, 26),
    ingredients: [
      { name: "Steak", amount: "12g", calories: 300 },
      { name: "Cheese", amount: "6g", calories: 300 },
      { name: "Lettuce", amount: "5g", calories: 25 },
      { name: "Corn", amount: "4g", calories: 25 },
    ],
  },
  {
    id: 2,
    name: "Chicken and Broccoli",
    image: require("../../assets/images/dummyMealImages/chickenandbroccoli.jpg"),
    calories: 500,
    date: new Date(2025, 2, 27),
    ingredients: [
      { name: "Chicken Breast", amount: "150g", calories: 250 },
      { name: "Broccoli", amount: "100g", calories: 50 },
      { name: "Olive Oil", amount: "1 tbsp", calories: 100 },
      { name: "Garlic", amount: "2g", calories: 5 },
    ],
  },
  {
    id: 3,
    name: "Chicken and Rice",
    image: require("../../assets/images/dummyMealImages/chickenandrice.jpg"),
    calories: 600,
    date: new Date(2025, 2, 28),
    ingredients: [
      { name: "Chicken Breast", amount: "150g", calories: 250 },
      { name: "White Rice", amount: "200g", calories: 250 },
      { name: "Soy Sauce", amount: "1 tbsp", calories: 50 },
      { name: "Carrots", amount: "50g", calories: 50 },
    ],
  },
  {
    id: 4,
    name: "Chilli",
    image: require("../../assets/images/dummyMealImages/chilli.jpg"),
    calories: 700,
    date: new Date(2025, 2, 29),
    ingredients: [
      { name: "Ground Beef", amount: "200g", calories: 400 },
      { name: "Kidney Beans", amount: "150g", calories: 200 },
      { name: "Tomato Sauce", amount: "100ml", calories: 50 },
      { name: "Onion", amount: "50g", calories: 50 },
    ],
  },
  {
    id: 5,
    name: "Eggs, Bacon, and Toast",
    image: require("../../assets/images/dummyMealImages/eggsbaconandtoast.jpg"),
    calories: 550,
    date: new Date(2025, 3, 1),
    ingredients: [
      { name: "Eggs", amount: "2", calories: 150 },
      { name: "Bacon", amount: "3 strips", calories: 250 },
      { name: "Toast", amount: "2 slices", calories: 150 },
    ],
  },
  {
    id: 6,
    name: "Salmon with Sweet Potato and Broccoli",
    image: require("../../assets/images/dummyMealImages/salmonsweetpotatobroccoli.jpg"),
    calories: 600,
    date: new Date(2025, 3, 2),
    ingredients: [
      { name: "Salmon", amount: "200g", calories: 300 },
      { name: "Sweet Potato", amount: "150g", calories: 150 },
      { name: "Broccoli", amount: "100g", calories: 50 },
      { name: "Olive Oil", amount: "1 tbsp", calories: 100 },
    ],
  },
  {
    id: 7,
    name: "Spaghetti",
    image: require("../../assets/images/dummyMealImages/spaghetti.jpg"),
    calories: 650,
    date: new Date(2025, 3, 3),
    ingredients: [
      { name: "Spaghetti Noodles", amount: "200g", calories: 300 },
      { name: "Ground Beef", amount: "150g", calories: 250 },
      { name: "Tomato Sauce", amount: "100ml", calories: 50 },
      { name: "Parmesan Cheese", amount: "20g", calories: 50 },
    ],
  },
  {
    id: 8,
    name: "Steak with Potato and Asparagus",
    image: require("../../assets/images/dummyMealImages/steakpotatoasparagus.jpg"),
    calories: 700,
    date: new Date(2025, 3, 4),
    ingredients: [
      { name: "Steak", amount: "250g", calories: 600 },
      { name: "Potato", amount: "200g", calories: 250 },
      { name: "Asparagus", amount: "100g", calories: 50 },
      { name: "Butter", amount: "1 tbsp", calories: 100 },
    ],
  },
  {
    id: 9,
    name: "Vegetable Soup",
    image: require("../../assets/images/dummyMealImages/vegetablesoup.jpg"),
    calories: 400,
    date: new Date(2025, 3, 5),
    ingredients: [
      { name: "Carrots", amount: "100g", calories: 50 },
      { name: "Potatoes", amount: "150g", calories: 100 },
      { name: "Celery", amount: "50g", calories: 25 },
      { name: "Vegetable Broth", amount: "500ml", calories: 100 },
      { name: "Onion", amount: "50g", calories: 50 },
      { name: "Garlic", amount: "5g", calories: 5 },
    ],
  },
];

export default tempMeals;
