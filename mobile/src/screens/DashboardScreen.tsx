import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { useAuthStore } from '../store/authStore';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0]}!</Text>
          <Text style={styles.subGreeting}>Ready to workout?</Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.quickStartCard}>
        <TouchableOpacity
          style={styles.quickStartButton}
          onPress={() => navigation.navigate('WorkoutLogger')}
        >
          <Text style={styles.quickStartIcon}>💪</Text>
          <Text style={styles.quickStartText}>Start Workout</Text>
          <Text style={styles.quickStartSubtext}>Begin logging your session</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.statsContainer}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Workouts This Week</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Sets</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.menuContainer}>
        <MenuButton
          icon="📊"
          title="History"
          subtitle="View past workouts"
          onPress={() => navigation.navigate('WorkoutHistory')}
        />
        <MenuButton
          icon="🤖"
          title="AI Coach"
          subtitle="Get personalized plans"
          onPress={() => navigation.navigate('AICoach')}
        />
        <MenuButton
          icon="👤"
          title="Profile"
          subtitle="Settings & goals"
          onPress={() => navigation.navigate('Profile')}
        />
      </Animated.View>
    </View>
  );
}

function MenuButton({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  subGreeting: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  quickStartCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  quickStartButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  quickStartIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  quickStartText: {
    ...theme.typography.h2,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  quickStartSubtext: {
    ...theme.typography.caption,
    color: theme.colors.white,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
});
