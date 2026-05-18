import { create } from 'zustand';
import { AppState, TrainingDay, Workout, Meal, ShoppingItem, StockItem, WeightRecord, Exercise, Ingredient } from '../types';
import { INITIAL_WORKOUTS, MENU_TEMPLATES, INITIAL_SHOPPING_LIST, INITIAL_STOCK, WEEKLY_BUDGET_LIMIT } from '../constants/mockData';

// Helper to format key for workouts (week_day)
const getWorkoutKey = (week: number, day: TrainingDay) => `${week}_${day}`;

// Helper to determine base calories and protein based on week number
const getBaseTargets = (week: number) => {
  if (week <= 4) {
    return { calories: 3200, protein: 155 };
  } else if (week <= 8) {
    return { calories: 3300, protein: 165 };
  } else {
    return { calories: 3400, protein: 170 };
  }
};

// Helper to calculate if calorie adjustment is needed based on weight history
const calculateWeightStallCalorieBonus = (history: WeightRecord[]): number => {
  if (history.length < 3) return 0;
  
  // Sort weight entries by date descending to get the last 3 weeks
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const w1 = sorted[0].weight;
  const w2 = sorted[1].weight;
  const w3 = sorted[2].weight;
  
  // If weight stalled or decreased over 2 consecutive weigh-ins (3 weeks of data)
  if (w1 <= w2 && w2 <= w3) {
    return 200; // Increase target by +200 kcal
  }
  
  return 0;
};

// Populate initial workouts for all 12 weeks
const createInitialWorkoutsState = (): Record<string, Workout> => {
  const state: Record<string, Workout> = {};
  
  for (let week = 1; week <= 12; week++) {
    const isDeload = week % 4 === 0;
    
    Object.keys(INITIAL_WORKOUTS).forEach((dayKey) => {
      const day = dayKey as TrainingDay;
      const baseWorkout = INITIAL_WORKOUTS[day];
      
      const exercises: Exercise[] = baseWorkout.exercises.map((ex) => {
        let weight = ex.targetWeightKg;
        let distance = ex.distanceMeters;
        
        // Calculate progressive overload based on week index (excluding deload weeks)
        // Salı & Cuma compound movements increase by 2.5 kg per active week
        if (ex.isCompound && weight !== undefined) {
          const activeWeeksBefore = Array.from({ length: week - 1 }, (_, idx) => idx + 1)
            .filter((w) => w % 4 !== 0).length;
          weight = weight + (activeWeeksBefore * 2.5);
        }
        
        // Saturday long run increases by 500m per active week
        if (day === TrainingDay.CUMARTESI && distance !== undefined) {
          const activeWeeksBefore = Array.from({ length: week - 1 }, (_, idx) => idx + 1)
            .filter((w) => w % 4 !== 0).length;
          distance = distance + (activeWeeksBefore * 500);
        }
        
        // Apply deload reduction if this week is a deload week
        if (isDeload) {
          if (weight !== undefined) weight = Math.round((weight * 0.5) * 10) / 10;
          if (distance !== undefined) distance = Math.round((distance * 0.5) * 10) / 10;
        }
        
        const repsText = day === TrainingDay.CUMARTESI && distance !== undefined 
          ? `${(distance / 1000).toFixed(1)} km` 
          : ex.reps;
          
        return {
          ...ex,
          targetWeightKg: weight,
          distanceMeters: distance,
          reps: repsText,
          completed: false
        };
      });
      
      state[getWorkoutKey(week, day)] = {
        day,
        name: baseWorkout.name,
        exercises,
        completed: false
      };
    });
  }
  
  return state;
};

// Initial state creator
const getInitialState = () => {
  const initialWeek = 1;
  const { calories, protein } = getBaseTargets(initialWeek);
  
  // Set up initial stock, shopping list and initial workouts
  const workouts = createInitialWorkoutsState();
  const activeMenuId = "tavuklu";
  const activeDay = TrainingDay.PAZARTESI;
  
  // Initial date strings for tracking meals
  const todayStr = new Date().toISOString().split('T')[0];
  const activeMenu = MENU_TEMPLATES.find(m => m.id === activeMenuId) || MENU_TEMPLATES[0];
  const dailyMeals: Record<string, Meal[]> = {
    [todayStr]: activeMenu.meals.map(m => ({ ...m, completed: false }))
  };
  
  return {
    currentWeek: initialWeek,
    isDeloadWeek: false,
    dailyCalorieTarget: calories,
    dailyProteinTarget: protein,
    weightHistory: [
      { date: "2026-05-04", weight: 78.0 }, // Week 1 weigh-in
    ],
    activeMenuId,
    activeDay,
    workouts,
    dailyMeals,
    shoppingList: INITIAL_SHOPPING_LIST,
    stock: INITIAL_STOCK,
    weeklyBudgetSpent: 0,
    weeklyBudgetLimit: WEEKLY_BUDGET_LIMIT,
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  ...getInitialState(),
  
  setWeek: (week: number) => {
    if (week < 1 || week > 12) return;
    const isDeload = week % 4 === 0;
    const { calories, protein } = getBaseTargets(week);
    
    // Add calorie stall bonus if applicable
    const bonus = calculateWeightStallCalorieBonus(get().weightHistory);
    
    set({
      currentWeek: week,
      isDeloadWeek: isDeload,
      dailyCalorieTarget: calories + bonus,
      dailyProteinTarget: protein
    });
  },
  
  addWeightRecord: (weight: number) => {
    if (weight <= 0) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Prevent double entries for the same date, overwrite if exists
    const filteredHistory = get().weightHistory.filter(w => w.date !== todayStr);
    const newRecord: WeightRecord = { date: todayStr, weight };
    const updatedHistory = [...filteredHistory, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Re-calculate targets with potential stall bonus
    const { currentWeek } = get();
    const { calories, protein } = getBaseTargets(currentWeek);
    const bonus = calculateWeightStallCalorieBonus(updatedHistory);
    
    set({
      weightHistory: updatedHistory,
      dailyCalorieTarget: calories + bonus
    });
  },
  
  toggleExercise: (day: TrainingDay, exerciseId: string) => {
    const { currentWeek, workouts } = get();
    const key = getWorkoutKey(currentWeek, day);
    const workout = workouts[key];
    
    if (!workout) return;
    
    let compoundWeightIncreased = false;
    let runDistanceIncreased = false;
    
    const updatedExercises = workout.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const nextState = !ex.completed;
        
        // Handle trigger events: weight progression & run increments
        if (nextState) {
          // Check Salı / Cuma compounds for weight progression
          if (ex.isCompound && (day === TrainingDay.SALI || day === TrainingDay.CUMA)) {
            compoundWeightIncreased = true;
          }
          // Check Saturday running distance increment
          if (day === TrainingDay.CUMARTESI && ex.id === "sat_long_run") {
            runDistanceIncreased = true;
          }
        }
        
        return { ...ex, completed: nextState };
      }
      return ex;
    });
    
    const allCompleted = updatedExercises.every(ex => ex.completed);
    
    const updatedWorkouts = {
      ...workouts,
      [key]: {
        ...workout,
        exercises: updatedExercises,
        completed: allCompleted
      }
    };
    
    // Apply progressive overload to FUTURE weeks (week + 1 to 12)
    if (compoundWeightIncreased || runDistanceIncreased) {
      for (let nextW = currentWeek + 1; nextW <= 12; nextW++) {
        // Skip modifying future deload weeks directly as they are already scaled down
        const isNextDeload = nextW % 4 === 0;
        const nextKey = getWorkoutKey(nextW, day);
        const nextWorkout = updatedWorkouts[nextKey];
        
        if (nextWorkout) {
          const nextExercises = nextWorkout.exercises.map((ex) => {
            let nextWeight = ex.targetWeightKg;
            let nextDistance = ex.distanceMeters;
            
            if (compoundWeightIncreased && ex.isCompound && nextWeight !== undefined) {
              // Increase by 2.5 kg (if not a deload week, if deload, increase the base then apply %50)
              const increase = isNextDeload ? 1.25 : 2.5; 
              nextWeight = nextWeight + increase;
            }
            
            if (runDistanceIncreased && day === TrainingDay.CUMARTESI && nextDistance !== undefined) {
              // Increase running distance by 500m
              const increase = isNextDeload ? 250 : 500;
              nextDistance = nextDistance + increase;
            }
            
            const repsText = day === TrainingDay.CUMARTESI && nextDistance !== undefined 
              ? `${(nextDistance / 1000).toFixed(1)} km` 
              : ex.reps;
              
            return {
              ...ex,
              targetWeightKg: nextWeight,
              distanceMeters: nextDistance,
              reps: repsText
            };
          });
          
          updatedWorkouts[nextKey] = {
            ...nextWorkout,
            exercises: nextExercises
          };
        }
      }
    }
    
    set({ workouts: updatedWorkouts });
  },
  
  toggleMeal: (mealIndex: number, completed: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const { dailyMeals, stock } = get();
    const meals = dailyMeals[todayStr];
    
    if (!meals || !meals[mealIndex]) return;
    
    const targetMeal = meals[mealIndex];
    
    // Check if state is actually changing
    if (targetMeal.completed === completed) return;
    
    // Update meal completed state
    const updatedMeals = [...meals];
    updatedMeals[mealIndex] = { ...targetMeal, completed };
    
    // Handle Inventory stock dynamic updates
    const updatedStock = { ...stock };
    targetMeal.ingredients.forEach((ing: Ingredient) => {
      if (ing.stockUnit && ing.stockDeductionAmount) {
        const item = updatedStock[ing.stockUnit];
        if (item) {
          if (completed) {
            // Deduct stock
            item.quantity = Math.max(0, item.quantity - ing.stockDeductionAmount);
          } else {
            // Uncheck meal: Return stock
            item.quantity = item.quantity + ing.stockDeductionAmount;
          }
        }
      }
    });
    
    set({
      dailyMeals: {
        ...dailyMeals,
        [todayStr]: updatedMeals
      },
      stock: updatedStock
    });
  },
  
  selectMenu: (menuId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const { dailyMeals } = get();
    
    const template = MENU_TEMPLATES.find(m => m.id === menuId);
    if (!template) return;
    
    // Create new meal records for today, marked incomplete
    const newMeals = template.meals.map(m => ({ ...m, completed: false }));
    
    set({
      activeMenuId: menuId,
      dailyMeals: {
        ...dailyMeals,
        [todayStr]: newMeals
      }
    });
  },
  
  toggleShoppingItem: (id: string) => {
    const { shoppingList, stock, weeklyBudgetSpent } = get();
    let budgetDelta = 0;
    const updatedStock = { ...stock };
    
    const updatedList = shoppingList.map((item) => {
      if (item.id === id) {
        const nextPurchased = !item.purchased;
        budgetDelta = nextPurchased ? item.price : -item.price;
        
        // Add to digital cumulative stock if purchased, or deduct if unchecked
        if (item.stockItemName) {
          const stockItem = updatedStock[item.stockItemName];
          if (stockItem) {
            if (nextPurchased) {
              stockItem.quantity = stockItem.quantity + item.stockAmountToAdd;
            } else {
              stockItem.quantity = Math.max(0, stockItem.quantity - item.stockAmountToAdd);
            }
          }
        }
        
        return { ...item, purchased: nextPurchased };
      }
      return item;
    });
    
    set({
      shoppingList: updatedList,
      stock: updatedStock,
      weeklyBudgetSpent: Math.max(0, weeklyBudgetSpent + budgetDelta)
    });
  },
  
  updateShoppingItemPrice: (id: string, price: number) => {
    if (price < 0) return;
    const { shoppingList, weeklyBudgetSpent } = get();
    
    let budgetDelta = 0;
    const updatedList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.purchased) {
          budgetDelta = price - item.price;
        }
        return { ...item, price };
      }
      return item;
    });
    
    set({
      shoppingList: updatedList,
      weeklyBudgetSpent: Math.max(0, weeklyBudgetSpent + budgetDelta)
    });
  },
  
  updateShoppingItemNotes: (id: string, notes: string) => {
    const { shoppingList } = get();
    const updatedList = shoppingList.map((item) => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    set({ shoppingList: updatedList });
  },
  
  updateStockQuantity: (name: string, quantity: number) => {
    if (quantity < 0) return;
    const { stock } = get();
    const updatedStock = { ...stock };
    
    if (updatedStock[name]) {
      updatedStock[name].quantity = quantity;
      set({ stock: updatedStock });
    }
  },
  
  resetWeeklyBudget: () => {
    // Reset all shopping items purchased state and reset weekly spent budget
    const { shoppingList } = get();
    const resetList = shoppingList.map(item => ({ ...item, purchased: false }));
    set({
      shoppingList: resetList,
      weeklyBudgetSpent: 0
    });
  }
}));
