export type Meal = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  calories: number | 0;
  date: Date | null;
  ingredients: Ingredient[] | [];
  numInFridge: number;
  numInFreezer: number;
};

// export type SavedMeal = {
//   id: string;
//   name: string;
//   description: string;
//   ingredients: Ingredient[] | [];
//   image: string | null;
// }

export type Ingredient = {
  id: string;
  name: string;
  amount: string | null;
  calories: string | null;
};

export type User = {
  name: string;
}


