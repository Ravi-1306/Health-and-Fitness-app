import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;
type WorkoutDetailNavigation = StackNavigationProp<RootStackParamList, 'WorkoutDetail'>;

export default function WorkoutDetailScreen() {
  const navigation = useNavigation<WorkoutDetailNavigation>();
  const route = useRoute<WorkoutDetailRouteProp>();
  const { workout } = route.params;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.date}>{formatDate(workout.date)}</Text>
          <Text style={styles.time}>
            {workout.startTime} - {workout.endTime || 'In Progress'}
          </Text>
          {workout.durationSeconds && (
            <Text style={styles.duration}>
              Duration: {formatDuration(workout.durationSeconds)}
            </Text>
          )}
        </View>

        {workout.exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>
              {index + 1}. {exercise.exercise.name}
            </Text>
            <Text style={styles.muscleGroup}>{exercise.exercise.muscleGroup}</Text>

            <View style={styles.setsContainer}>
              {exercise.sets.map((set) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setText}>Set {set.setIndex}</Text>
                  <Text style={styles.setText}>
                    {set.weightKg}kg × {set.reps} reps
                  </Text>
                  <View style={[styles.badge, set.completed && styles.completedBadge]}>
                    <Text style={[styles.badgeText, set.completed && styles.completedText]}>
                      {set.completed ? '✓' : '○'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Total Sets</Text>
                <Text style={styles.statValue}>{exercise.sets.length}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Total Reps</Text>
                <Text style={styles.statValue}>
                  {exercise.sets.reduce((sum, set) => sum + set.reps, 0)}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Volume</Text>
                <Text style={styles.statValue}>
                  {exercise.sets.reduce((sum, set) => sum + (set.weightKg * set.reps), 0)}kg
                </Text>
              </View>
            </View>
          </View>
        ))}

        {workout.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  muscleGroup: {
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  setsContainer: {
    marginBottom: 16,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  setText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  completedText: {
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  notesCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
});
