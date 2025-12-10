import { create } from 'zustand';
import { OnboardingData } from '../types';

interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  data: {},
  currentStep: 0,
  totalSteps: 4,

  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  reset: () =>
    set({
      data: {},
      currentStep: 0,
    }),
}));
