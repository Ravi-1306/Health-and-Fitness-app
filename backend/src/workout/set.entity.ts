import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { WorkoutExercise } from "./workout-exercise.entity";

@Entity("sets")
export class Set {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  workoutExerciseId: string;

  @ManyToOne(() => WorkoutExercise, (exercise) => exercise.sets, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "workoutExerciseId" })
  workoutExercise: WorkoutExercise;

  @Column({ type: "int" })
  setIndex: number;

  @Column({ type: "float" })
  weightKg: number;

  @Column({ type: "int" })
  reps: number;

  @Column({ type: "int", nullable: true })
  rpe: number;

  @Column({ type: "int", nullable: true })
  restSeconds: number;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
