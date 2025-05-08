export interface FoodItem {
  id?: string;
  user_id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at?: string;
}

export interface Meal {
  id?: string;
  user_id?: string;
  meal_time?: string;
  items: MealItem[];
}

export interface MealItem {
  food_id: string;
  portion_mult: number; // e.g. 0.5 for half-portion, 2 for double
}
