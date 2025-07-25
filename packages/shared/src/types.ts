// Common types used across the application

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  displayName: string;
}

export interface WorkoutForm {
  name: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{
      reps: number;
      weight?: number;
    }>;
  }>;
}

// Workout input types for API operations
export interface CreateWorkoutInput {
  userId: string;
  name: string;
  date: Date;
  durationMinutes: number;
  exercises: Array<{
    exerciseId: string;
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      completed: boolean;
    }>;
  }>;
}

export interface UpdateWorkoutInput {
  name?: string;
  date?: Date;
  durationMinutes?: number;
  exercises?: Array<{
    exerciseId: string;
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      completed: boolean;
    }>;
  }>;
}

export interface AddExerciseToWorkoutInput {
  exerciseId: string;
  name: string;
  sets: Array<{
    reps: number;
    weight?: number;
    completed: boolean;
  }>;
}

export interface UpdateExerciseLogInput {
  exerciseIndex: number;
  setIndex: number;
  reps?: number;
  weight?: number;
  completed?: boolean;
}

// Health & Medical Tracking Types
export interface HealthLog {
  id: string;
  userId: string;
  date: string;
  type: 'menstrual' | 'pain' | 'illness' | 'bloodPressure' | 'bloodGlucose';
  data: MenstrualData | PainData | IllnessData | BloodPressureData | BloodGlucoseData;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenstrualData {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  flow: 'light' | 'medium' | 'heavy' | 'spotting' | 'none';
  symptoms: MenstrualSymptom[];
  energy: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  cramps: boolean;
  bloating: boolean;
  breastTenderness: boolean;
  backPain: boolean;
  fatigue: boolean;
  foodCravings: boolean;
}

export interface MenstrualSymptom {
  type: 'cramps' | 'bloating' | 'breastTenderness' | 'backPain' | 'fatigue' | 'foodCravings' | 'moodSwings' | 'acne' | 'headache' | 'nausea';
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
}

export interface PainData {
  location: PainLocation[];
  intensity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // 1 = very mild, 10 = unbearable
  type: 'soreness' | 'sharp' | 'dull' | 'throbbing' | 'burning' | 'tingling' | 'numbness';
  duration: 'acute' | 'chronic' | 'intermittent';
  triggers?: string[];
  alleviatingFactors?: string[];
  affectsWorkout: boolean;
  notes?: string;
}

export interface PainLocation {
  area: 'head' | 'neck' | 'shoulders' | 'arms' | 'hands' | 'chest' | 'back' | 'abdomen' | 'hips' | 'legs' | 'knees' | 'feet' | 'other';
  side?: 'left' | 'right' | 'both';
  specificLocation?: string;
}

export interface IllnessData {
  symptoms: IllnessSymptom[];
  severity: 'mild' | 'moderate' | 'severe';
  affectsWorkout: boolean;
  medication?: string[];
  notes?: string;
}

export interface IllnessSymptom {
  type: 'fever' | 'headache' | 'cough' | 'soreThroat' | 'runnyNose' | 'congestion' | 'fatigue' | 'bodyAches' | 'nausea' | 'vomiting' | 'diarrhea' | 'lossOfAppetite' | 'insomnia' | 'other';
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
  notes?: string;
}

export interface BloodPressureData {
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse: number; // bpm
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  position: 'sitting' | 'standing' | 'lying';
  medicationTaken: boolean;
  notes?: string;
}

export interface BloodGlucoseData {
  reading: number; // mg/dL
  timeOfDay: 'fasting' | 'beforeMeal' | 'afterMeal' | 'bedtime' | 'other';
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  medicationTaken: boolean;
  notes?: string;
}

// Health Insights and Correlations
export interface HealthInsight {
  id: string;
  userId: string;
  type: 'correlation' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  dataPoints: {
    healthMetric: string;
    fitnessMetric: string;
    correlation: number; // -1 to 1
    sampleSize: number;
  };
  severity: 'info' | 'warning' | 'alert';
  actionable: boolean;
  recommendations?: string[];
  createdAt: Date;
  dismissed: boolean;
}

export interface HealthCorrelation {
  healthMetric: string;
  fitnessMetric: string;
  correlation: number;
  confidence: number;
  sampleSize: number;
  trend: 'positive' | 'negative' | 'neutral';
  description: string;
}

// Health Dashboard Data
export interface HealthDashboardData {
  recentLogs: HealthLog[];
  insights: HealthInsight[];
  correlations: HealthCorrelation[];
  trends: {
    menstrual?: {
      cycleLength: number;
      averageFlow: string;
      commonSymptoms: string[];
    };
    pain?: {
      mostCommonLocation: string;
      averageIntensity: number;
      frequency: string;
    };
    illness?: {
      frequency: string;
      commonSymptoms: string[];
      averageRecoveryTime: number;
    };
    bloodPressure?: {
      averageSystolic: number;
      averageDiastolic: number;
      trend: 'stable' | 'increasing' | 'decreasing';
    };
    bloodGlucose?: {
      averageReading: number;
      range: { min: number; max: number };
      trend: 'stable' | 'increasing' | 'decreasing';
    };
  };
} 