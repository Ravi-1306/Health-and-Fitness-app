import { NavigatorScreenParams } from '@react-navigation/native';
import { Workout } from '../types';

export type MainTabParamList = {
  Dashboard: undefined;
  WorkoutHistory: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Continue: undefined;
  GoalSelection: undefined;
  ProfileInput: undefined;
  CreateAccount: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  WorkoutLogger: undefined;
  WorkoutDetail: { workout: Workout };
  AICoach: undefined;
};
