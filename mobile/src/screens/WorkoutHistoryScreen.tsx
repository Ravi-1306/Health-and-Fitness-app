import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { Workout } from '../types';

export default function WorkoutHistoryScreen({ navigation }: any) {
  const { workouts, loadWorkouts, syncWorkouts } = useWorkoutStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncWorkouts();
    await loadWorkouts();
    setRefreshing(false);
  };

  const renderWorkoutCard = ({ item, index }: { item: Workout; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <TouchableOpacity
        style={styles.workoutCard}
        onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
      >
        <View style={styles.workoutHeader}>
          <View>
            <Text style={styles.workoutDate}>{formatDate(item.date)}</Text>
            <Text style={styles.workoutTime}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          {!item.synced && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          )}
        </View>

        <View style={styles.workoutStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.exercises.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {item.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(item.durationSeconds || 0)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        <View style={styles.exerciseList}>
          {item.exercises.slice(0, 3).map((ex) => (
            <Text key={ex.id} style={styles.exerciseName}>
              • {ex.exercise.name}
            </Text>
          ))}
          {item.exercises.length > 3 && (
            <Text style={styles.moreText}>+{item.exercises.length - 3} more</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout History</Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Start logging your first workout!</Text>
          </View>
        }
      />
    </View>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.lg,
  },
  workoutCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  workoutDate: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  workoutTime: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  offlineBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  offlineText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontSize: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.surfaceLight,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  exerciseList: {
    marginTop: theme.spacing.md,
  },
  exerciseName: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  moreText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
