import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';

const STORAGE_KEYS = {
  WORKOUTS: '@fittrack/workouts',
  EXERCISES: '@fittrack/exercises',
  USER_DATA: '@fittrack/user',
};

class WorkoutStorage {
  async save(workout: Workout): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = [workout, ...existing];
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save workout:', error);
      throw error;
    }
  }

  async update(workout: Workout): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = existing.map((w) => (w.id === workout.id ? workout : w));
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update workout:', error);
      throw error;
    }
  }

  async getAll(): Promise<Workout[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get workouts:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Workout | null> {
    try {
      const workouts = await this.getAll();
      return workouts.find((w) => w.id === id) || null;
    } catch (error) {
      console.error('Failed to get workout:', error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = existing.filter((w) => w.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete workout:', error);
      throw error;
    }
  }

  async getUnsyncedWorkouts(): Promise<Workout[]> {
    try {
      const workouts = await this.getAll();
      return workouts.filter((w) => !w.synced);
    } catch (error) {
      console.error('Failed to get unsynced workouts:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    } catch (error) {
      console.error('Failed to clear workouts:', error);
      throw error;
    }
  }
}

export const workoutStorage = new WorkoutStorage();

// Export for other data types if needed
export { STORAGE_KEYS };
