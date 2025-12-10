export interface User {
  id: string;
  email: string;
  createdAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  weightKg?: number;
  goal?: FitnessGoal;
  activityLevel?: ActivityLevel;
}

export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'maintain'
  | 'tone'
  | 'improve_endurance';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export interface Workout {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  synced: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  isBodyweight: boolean;
  instructionUrl?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  order: number;
  sets: Set[];
}

export interface Set {
  id: string;
  setIndex: number;
  weightKg: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  completed: boolean;
  timestamp?: string;
}

export interface OnboardingData {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goal?: FitnessGoal;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
