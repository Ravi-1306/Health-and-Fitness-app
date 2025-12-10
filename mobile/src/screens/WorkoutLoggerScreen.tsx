import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { theme } from '../theme';
import { Exercise, WorkoutExercise, Set } from '../types';
import { useWorkoutStore } from '../store/workoutStore';

export default function WorkoutLoggerScreen({ navigation }: any) {
  const { currentWorkout, addExercise, saveWorkout } = useWorkoutStore();
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [startTime] = useState(new Date());

  const handleSaveWorkout = async () => {
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    await saveWorkout({
      date: startTime.toISOString().split('T')[0],
      startTime: startTime.toTimeString().split(' ')[0],
      endTime: endTime.toTimeString().split(' ')[0],
      durationSeconds,
    });

    Alert.alert('Success', 'Workout saved!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Workout</Text>
        <TouchableOpacity onPress={handleSaveWorkout}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Duration</Text>
          <WorkoutTimer startTime={startTime} />
        </View>

        <View style={styles.exercisesContainer}>
          {currentWorkout.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setShowExercisePicker(true)}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <ExercisePicker
        visible={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={(exercise) => {
          addExercise(exercise);
          setShowExercisePicker(false);
        }}
      />
    </View>
  );
}

function WorkoutTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <Text style={styles.timer}>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </Text>
  );
}

function ExerciseCard({ exercise, index }: { exercise: WorkoutExercise; index: number }) {
  const { addSet, updateSet } = useWorkoutStore();
  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      const interval = setInterval(() => {
        setRestTimer((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [restTimer]);

  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    addSet(exercise.id, {
      setIndex: exercise.sets.length + 1,
      weightKg: lastSet?.weightKg || 0,
      reps: lastSet?.reps || 0,
      completed: false,
    });
  };

  const handleCompleteSet = (setId: string) => {
    updateSet(exercise.id, setId, { completed: true });
    setRestTimer(90); // Start 90 second rest timer
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View>
          <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
          <Text style={styles.exerciseMuscle}>
            {exercise.exercise.muscleGroup} • {exercise.exercise.equipment}
          </Text>
        </View>
        {restTimer !== null && restTimer > 0 && (
          <View style={styles.restTimer}>
            <Text style={styles.restTimerText}>Rest: {restTimer}s</Text>
          </View>
        )}
      </View>

      <View style={styles.setsHeader}>
        <Text style={[styles.setHeaderText, styles.flexHalf]}>Set</Text>
        <Text style={[styles.setHeaderText, styles.flexOne]}>Weight (kg)</Text>
        <Text style={[styles.setHeaderText, styles.flexOne]}>Reps</Text>
        <Text style={[styles.setHeaderText, styles.flexHalf]}>✓</Text>
      </View>

      {exercise.sets.map((set, setIndex) => (
        <SetRow
          key={set.id}
          set={set}
          setIndex={setIndex}
          exerciseId={exercise.id}
          onComplete={() => handleCompleteSet(set.id)}
        />
      ))}

      <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function SetRow({
  set,
  setIndex,
  exerciseId,
  onComplete,
}: {
  set: Set;
  setIndex: number;
  exerciseId: string;
  onComplete: () => void;
}) {
  const { updateSet } = useWorkoutStore();
  const [weight, setWeight] = useState(set.weightKg.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = parseFloat(value) || 0;
    updateSet(exerciseId, set.id, { weightKg: numValue });
  };

  const handleRepsChange = (value: string) => {
    setReps(value);
    const numValue = parseInt(value, 10) || 0;
    updateSet(exerciseId, set.id, { reps: numValue });
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.setRow, set.completed && styles.setRowCompleted]}
    >
      <Text style={[styles.setNumber, styles.flexHalf]}>{setIndex + 1}</Text>
      <TextInput
        style={[styles.setInput, styles.flexOne]}
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
        editable={!set.completed}
      />
      <TextInput
        style={[styles.setInput, styles.flexOne]}
        value={reps}
        onChangeText={handleRepsChange}
        keyboardType="numeric"
        editable={!set.completed}
      />
      <TouchableOpacity
        style={[styles.checkButton, styles.flexHalf]}
        onPress={onComplete}
        disabled={set.completed}
      >
        <Text style={styles.checkButtonText}>{set.completed ? '✓' : '○'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ExercisePicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}) {
  const [search, setSearch] = useState('');
  const [exercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      isBodyweight: false,
    },
    {
      id: '2',
      name: 'Squat',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      isBodyweight: false,
    },
    {
      id: '3',
      name: 'Deadlift',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      isBodyweight: false,
    },
    {
      id: '4',
      name: 'Overhead Press',
      muscleGroup: 'Shoulders',
      equipment: 'Barbell',
      isBodyweight: false,
    },
    {
      id: '5',
      name: 'Pull-ups',
      muscleGroup: 'Back',
      equipment: 'Bodyweight',
      isBodyweight: true,
    },
    {
      id: '6',
      name: 'Dumbbell Row',
      muscleGroup: 'Back',
      equipment: 'Dumbbells',
      isBodyweight: false,
    },
    {
      id: '7',
      name: 'Leg Press',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      isBodyweight: false,
    },
    {
      id: '8',
      name: 'Lat Pulldown',
      muscleGroup: 'Back',
      equipment: 'Machine',
      isBodyweight: false,
    },
  ]);

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={theme.colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView style={styles.exerciseList}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => onSelect(exercise)}
              >
                <View>
                  <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                  <Text style={styles.exerciseItemMuscle}>
                    {exercise.muscleGroup} • {exercise.equipment}
                  </Text>
                </View>
                <Text style={styles.exerciseItemArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  closeButton: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  saveButton: {
    ...theme.typography.h3,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  timerLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  timer: {
    ...theme.typography.h1,
    fontSize: 48,
    color: theme.colors.primary,
  },
  exercisesContainer: {
    gap: theme.spacing.md,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  exerciseName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  exerciseMuscle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  restTimer: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  restTimerText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: '600',
  },
  setsHeader: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  flexHalf: {
    flex: 0.5,
  },
  flexOne: {
    flex: 1,
  },
  setHeaderText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceLight,
  },
  setRowCompleted: {
    opacity: 0.6,
  },
  setNumber: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
  },
  setInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    textAlign: 'center',
  },
  checkButton: {
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  addSetButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  addSetText: {
    ...theme.typography.body,
    color: theme.colors.primary,
  },
  addExerciseButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  addExerciseText: {
    ...theme.typography.h3,
    color: theme.colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    height: '80%',
    paddingTop: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  exerciseList: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  exerciseItemName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  exerciseItemMuscle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  exerciseItemArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
});
