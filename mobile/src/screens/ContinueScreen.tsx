import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';
type ContinueScreenNavigation = StackNavigationProp<RootStackParamList, 'Continue'>;

export default function ContinueScreen() {
  const navigation = useNavigation<ContinueScreenNavigation>();

  const handleContinue = () => {
    navigation.navigate('GoalSelection');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💪</Text>
        </View>

        <Text style={styles.title}>Welcome to FitTrack</Text>
        <Text style={styles.description}>
          Track your workouts, get AI-powered coaching, and achieve your fitness goals with
          personalized training plans.
        </Text>

        <View style={styles.features}>
          <FeatureItem icon="📊" text="Track every rep and set" />
          <FeatureItem icon="🤖" text="AI-powered workout plans" />
          <FeatureItem icon="📈" text="Monitor your progress" />
          <FeatureItem icon="🔒" text="Privacy-first approach" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  features: {
    width: '100%',
    gap: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  featureText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  buttonText: {
    ...theme.typography.h3,
    color: theme.colors.white,
  },
});
