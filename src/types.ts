export type Meal = {
  id: number;
  name: string;
  image: string | null;
  calories: number;
  date: Date;
  ingredients: Ingredient[];
};

export type Ingredient = {
  name: string;
  amount: string | null;
  calories: number | null;
};
