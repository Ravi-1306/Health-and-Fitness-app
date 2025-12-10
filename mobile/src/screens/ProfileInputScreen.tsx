import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useOnboardingStore } from '../store/onboardingStore';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

type ProfileInputNavigation = StackNavigationProp<RootStackParamList, 'ProfileInput'>;

export default function ProfileInputScreen() {
  const navigation = useNavigation<ProfileInputNavigation>();
  const { data, updateData } = useOnboardingStore();
  const [age, setAge] = useState(data.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(data.gender);
  const [heightCm, setHeightCm] = useState(data.heightCm?.toString() || '');
  const [weightKg, setWeightKg] = useState(data.weightKg?.toString() || '');
  const [activityLevel, setActivityLevel] = useState(data.activityLevel);

  const handleNext = () => {
    const profileData = {
      age: age ? parseInt(age, 10) : undefined,
      gender,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      activityLevel,
    };

    if (
      profileData.age &&
      profileData.gender &&
      profileData.heightCm &&
      profileData.weightKg &&
      profileData.activityLevel
    ) {
      updateData(profileData);
      navigation.navigate('CreateAccount');
    }
  };

  const isValid = age && gender && heightCm && weightKg && activityLevel;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ProgressBar current={2} total={4} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>This helps us personalize your experience</Text>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor={theme.colors.textSecondary}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'male' && styles.optionButtonSelected]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.optionText, gender === 'male' && styles.optionTextSelected]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'female' && styles.optionButtonSelected]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.optionText, gender === 'female' && styles.optionTextSelected]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'other' && styles.optionButtonSelected]}
              onPress={() => setGender('other')}
            >
              <Text style={[styles.optionText, gender === 'other' && styles.optionTextSelected]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 170"
            placeholderTextColor={theme.colors.textSecondary}
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="numeric"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 67"
            placeholderTextColor={theme.colors.textSecondary}
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="numeric"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.activityContainer}>
            {[
              { value: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
              {
                value: 'lightly_active',
                label: 'Lightly Active',
                desc: 'Light exercise 1-3 days/week',
              },
              {
                value: 'moderately_active',
                label: 'Moderately Active',
                desc: 'Moderate exercise 3-5 days/week',
              },
              { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
            ].map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.activityCard,
                  activityLevel === level.value && styles.activityCardSelected,
                ]}
                onPress={() => setActivityLevel(level.value as any)}
              >
                <Text style={styles.activityLabel}>{level.label}</Text>
                <Text style={styles.activityDesc}>{level.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextSecondary}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, !isValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.buttonTextPrimary}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceLight,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  activityContainer: {
    gap: theme.spacing.sm,
  },
  activityCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activityCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceLight,
  },
  activityLabel: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  activityDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
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
