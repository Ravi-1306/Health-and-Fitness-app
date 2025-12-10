import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { RootStackParamList, MainTabParamList } from './types';

// Screens
import SplashScreen from '../screens/SplashScreen';
import ContinueScreen from '../screens/ContinueScreen';
import GoalSelectionScreen from '../screens/GoalSelectionScreen';
import ProfileInputScreen from '../screens/ProfileInputScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import DashboardScreen from '../screens/DashboardScreen';
import WorkoutLoggerScreen from '../screens/WorkoutLoggerScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import AICoachScreen from '../screens/AICoachScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14B8A6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text>🏠</Text> }}
      />
      <Tab.Screen
        name="WorkoutHistory"
        component={WorkoutHistoryScreen}
        options={{ tabBarLabel: 'History', tabBarIcon: () => <Text>📊</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: () => <Text>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <Stack.Navigator
          initialRouteName="Continue"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A192F' },
          }}
        >
          <Stack.Screen name="Continue" component={ContinueScreen} />
          <Stack.Screen name="GoalSelection" component={GoalSelectionScreen} />
          <Stack.Screen name="ProfileInput" component={ProfileInputScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A192F' },
          }}
        >
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="WorkoutLogger"
            component={WorkoutLoggerScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="WorkoutDetail"
            component={WorkoutDetailScreen}
          />
          <Stack.Screen
            name="AICoach"
            component={AICoachScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
