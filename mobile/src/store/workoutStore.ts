import { create } from 'zustand';
import { Workout, WorkoutExercise, Exercise, Set } from '../types';
import { workoutStorage } from '../services/storage';
import { workoutApi } from '../services/api';
import uuid from 'react-native-uuid';

const createId = () => uuid.v4() as string;

interface WorkoutState {
  currentWorkout: Workout;
  workouts: Workout[];
  isLoading: boolean;

  // Current workout actions
  startNewWorkout: () => void;
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseId: string, set: Omit<Set, 'id' | 'workoutExerciseId'>) => void;
  updateSet: (exerciseId: string, setId: string, data: Partial<Set>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  removeExercise: (exerciseId: string) => void;
  saveWorkout: (data: {
    date: string;
    startTime: string;
    endTime: string;
    durationSeconds: number;
  }) => Promise<void>;

  // History actions
  loadWorkouts: () => Promise<void>;
  syncWorkouts: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentWorkout: createEmptyWorkout(),
  workouts: [],
  isLoading: false,

  startNewWorkout: () => {
    set({ currentWorkout: createEmptyWorkout() });
  },

  addExercise: (exercise: Exercise) => {
    const current = get().currentWorkout;
    const workoutExercise: WorkoutExercise = {
      id: createId(),
      exerciseId: exercise.id,
      exercise,
      order: current.exercises.length,
      sets: [
        {
          id: createId(),
          setIndex: 1,
          weightKg: 0,
          reps: 0,
          completed: false,
        } as Set,
      ],
    };

    set({
      currentWorkout: {
        ...current,
        exercises: [...current.exercises, workoutExercise],
      },
    });
  },

  addSet: (exerciseId: string, setData: Omit<Set, 'id' | 'workoutExerciseId'>) => {
    const current = get().currentWorkout;
    const exercises = current.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const newSet: Set = {
          ...setData,
          id: createId(),
          workoutExerciseId: exerciseId,
        } as Set;
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    });

    set({ currentWorkout: { ...current, exercises } });
  },

  updateSet: (exerciseId: string, setId: string, data: Partial<Set>) => {
    const current = get().currentWorkout;
    const exercises = current.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const sets = ex.sets.map((s) => (s.id === setId ? { ...s, ...data } : s));
        return { ...ex, sets };
      }
      return ex;
    });

    set({ currentWorkout: { ...current, exercises } });
  },

  removeSet: (exerciseId: string, setId: string) => {
    const current = get().currentWorkout;
    const exercises = current.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter((s) => s.id !== setId) };
      }
      return ex;
    });

    set({ currentWorkout: { ...current, exercises } });
  },

  removeExercise: (exerciseId: string) => {
    const current = get().currentWorkout;
    set({
      currentWorkout: {
        ...current,
        exercises: current.exercises.filter((ex) => ex.id !== exerciseId),
      },
    });
  },

  saveWorkout: async (data) => {
    const current = get().currentWorkout;
    const workout: Workout = {
      ...current,
      ...data,
      synced: false,
    };

    // Save locally first
    await workoutStorage.save(workout);

    // Try to sync to server
    try {
      // Transform workout data for backend (remove exercise objects, keep only exerciseId)
      const workoutData = {
        date: workout.date,
        startTime: workout.startTime,
        endTime: workout.endTime,
        durationSeconds: workout.durationSeconds,
        notes: workout.notes,
        exercises: workout.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
          sets: ex.sets.map(set => ({
            setIndex: set.setIndex,
            reps: set.reps,
            weightKg: set.weightKg || 0,
            completed: set.completed,
            rpe: set.rpe,
            restSeconds: set.restSeconds,
          })),
        })),
      };
      
      const response = await workoutApi.create(workoutData);
      workout.id = response.data.id;
      workout.synced = true;
      await workoutStorage.update(workout);
    } catch (error) {
      console.log('Workout saved offline, will sync later', error);
    }

    // Add to workouts list
    set((state) => ({
      workouts: [workout, ...state.workouts],
      currentWorkout: createEmptyWorkout(),
    }));
  },

  loadWorkouts: async () => {
    set({ isLoading: true });
    try {
      const localWorkouts = await workoutStorage.getAll();
      set({ workouts: localWorkouts, isLoading: false });
    } catch (error) {
      console.error('Failed to load workouts:', error);
      set({ isLoading: false });
    }
  },

  syncWorkouts: async () => {
    const unsyncedWorkouts = get().workouts.filter((w) => !w.synced);

    for (const workout of unsyncedWorkouts) {
      try {
        // Transform workout data for backend (remove exercise objects, keep only exerciseId)
        const workoutData = {
          date: workout.date,
          startTime: workout.startTime,
          endTime: workout.endTime,
          durationSeconds: workout.durationSeconds,
          notes: workout.notes,
          exercises: workout.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            sets: ex.sets.map(set => ({
              setIndex: set.setIndex,
              reps: set.reps,
              weightKg: set.weightKg || 0,
              completed: set.completed,
              rpe: set.rpe,
              restSeconds: set.restSeconds,
            })),
          })),
        };
        
        const response = await workoutApi.create(workoutData);
        workout.id = response.data.id;
        workout.synced = true;
        await workoutStorage.update(workout);
      } catch (error) {
        console.error('Failed to sync workout:', error);
      }
    }

    // Reload from local storage
    await get().loadWorkouts();
  },
}));

function createEmptyWorkout(): Workout {
  return {
    id: createId(),
    userId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: new Date().toTimeString().split(' ')[0],
    exercises: [],
    synced: false,
  };
}
