import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useOnboardingStore } from '../store/onboardingStore';
import { FitnessGoal } from '../types';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

type GoalSelectionNavigation = StackNavigationProp<RootStackParamList, 'GoalSelection'>;

const GOALS: {
  value: FitnessGoal;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'lose_weight',
    label: 'Lose Weight',
    description: 'Focus on fat loss and calorie deficit',
    icon: '🔥',
  },
  {
    value: 'build_muscle',
    label: 'Build Muscle',
    description: 'Increase strength and muscle mass',
    icon: '💪',
  },
  {
    value: 'maintain',
    label: 'Maintain',
    description: 'Keep current fitness level',
    icon: '⚖️',
  },
  {
    value: 'tone',
    label: 'Tone Up',
    description: 'Define muscles and improve shape',
    icon: '✨',
  },
  {
    value: 'improve_endurance',
    label: 'Improve Endurance',
    description: 'Boost stamina and cardiovascular health',
    icon: '🏃',
  },
];

export default function GoalSelectionScreen() {
  const navigation = useNavigation<GoalSelectionNavigation>();
  const { data, updateData } = useOnboardingStore();
  const [selectedGoal, setSelectedGoal] = React.useState<FitnessGoal | undefined>(data.goal);

  const handleSelect = (goal: FitnessGoal) => {
    setSelectedGoal(goal);
    updateData({ goal });
  };

  const handleNext = () => {
    if (selectedGoal) {
      navigation.navigate('ProfileInput');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={1} total={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What's your fitness goal?</Text>
        <Text style={styles.subtitle}>
          Choose your primary goal to get personalized recommendations
        </Text>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal, index) => (
            <Animated.View key={goal.value} entering={FadeInRight.delay(index * 100).duration(600)}>
              <TouchableOpacity
                style={[styles.goalCard, selectedGoal === goal.value && styles.goalCardSelected]}
                onPress={() => handleSelect(goal.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <View style={styles.goalContent}>
                  <Text style={styles.goalLabel}>{goal.label}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                {selectedGoal === goal.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleBack}>
          <Text style={styles.buttonTextSecondary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, !selectedGoal && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Step {current} of {total}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  goalsContainer: {
    gap: theme.spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceLight,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  goalLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  goalDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextPrimary: {
    ...theme.typography.h3,
    color: theme.colors.white,
  },
  buttonTextSecondary: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
});
