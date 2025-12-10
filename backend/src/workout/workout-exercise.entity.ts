import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Workout } from "./workout.entity";
import { Exercise } from "./exercise.entity";
import { Set } from "./set.entity";

@Entity("workout_exercises")
export class WorkoutExercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  workoutId: string;

  @ManyToOne(() => Workout, (workout) => workout.exercises, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "workoutId" })
  workout: Workout;

  @Column()
  exerciseId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: "exerciseId" })
  exercise: Exercise;

  @Column({ type: "int" })
  order: number;

  @OneToMany(() => Set, (set) => set.workoutExercise, { cascade: true })
  sets: Set[];
}
