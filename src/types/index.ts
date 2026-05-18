export enum TrainingDay {
  PAZARTESI = "Pazartesi",
  SALI = "Salı",
  CARSAMBA = "Çarşamba",
  PERSEMBE = "Perşembe",
  CUMA = "Cuma",
  CUMARTESI = "Cumartesi",
  PAZAR = "Pazar"
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  description: string;
  isCompound: boolean;
  targetWeightKg?: number; // Salı/Cuma compound lifts
  distanceMeters?: number; // Saturday long run
  completed: boolean;
}

export interface Workout {
  day: TrainingDay;
  name: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Ingredient {
  name: string;
  amount: string;
  stockUnit?: string;
  stockDeductionAmount?: number;
}

export interface Meal {
  name: string;
  description: string;
  ingredients: Ingredient[];
  protein: number;
  calories: number;
  completed: boolean;
}

export interface MenuTemplate {
  id: string;
  name: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  market: string;
  quantity: string;
  price: number;
  protein: number;
  purchased: boolean;
  notes: string;
  stockItemName: string;
  stockAmountToAdd: number;
}

export interface StockItem {
  name: string;
  quantity: number;
  unit: string;
  minAlertThreshold: number;
}

export interface WeightRecord {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface AppState {
  currentWeek: number; // 1-12
  isDeloadWeek: boolean;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  weightHistory: WeightRecord[];
  activeMenuId: string; // tavuk, bakliyat, ton_baligi
  activeDay: TrainingDay;
  workouts: Record<string, Workout>; // key format: week_day (e.g. "1_Salı")
  shoppingList: ShoppingItem[];
  stock: Record<string, StockItem>;
  weeklyBudgetSpent: number;
  weeklyBudgetLimit: number;
  dailyMeals: Record<string, Meal[]>;
  
  // Actions
  setWeek: (week: number) => void;
  addWeightRecord: (weight: number) => void;
  toggleExercise: (day: TrainingDay, exerciseId: string) => void;
  toggleMeal: (mealIndex: number, completed: boolean) => void;
  selectMenu: (menuId: string) => void;
  toggleShoppingItem: (id: string) => void;
  updateShoppingItemPrice: (id: string, price: number) => void;
  updateShoppingItemNotes: (id: string, notes: string) => void;
  updateStockQuantity: (name: string, quantity: number) => void;
  resetWeeklyBudget: () => void;
}
