export type Meal = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  calories: number | 0;
  date: string | null;
  ingredients: Ingredient[] | [];
  numInFridge: number;
  numInFreezer: number;
};

export type SavedMeal = {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[] | [];
  image: string | null;
}

export type Ingredient = {
  name: string;
  amount: string | null;
  calories: number | null;
};

export type User = {
  name: string;
}


