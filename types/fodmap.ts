export type FodmapLevel = "low" | "medium" | "high";

export type FodmapType =
  | "fructose"
  | "lactose"
  | "fructans"
  | "GOS"
  | "polyols";

export interface FodmapAnalysis {
  id?: string;
  food: string;
  portion: number;
  level: FodmapLevel;
  fodmaps: FodmapType[];
  safe_portion: number;
  tips: string;
}

export interface FoodEntry {
  name: string;
  level: FodmapLevel;
  fodmaps: FodmapType[];
  safe_portion: number;
  tips: string;
}

export interface Meal {
    name: string;
    ingredients: string[];
    tips: string;
  }
  
  export interface DayPlan {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  }
  
  export interface MealPlan {
    days: DayPlan[];
  }
  
  export interface MealPlanConfig {
    days: number;
    preferences: string;
    restrictions: string[];
  }

  // Ajouter à la suite du fichier existant
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
  }