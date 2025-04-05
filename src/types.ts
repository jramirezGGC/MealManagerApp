export type Meal = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  calories: number;
  date: Date;
  ingredients: Ingredient[];
  numInFridge: number;
  numInFreezer: number;
};

export type Ingredient = {
  name: string;
  amount: string | null;
  calories: number | null;
};

// TODO: Create User type
