import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { WorkoutExercise } from "./workout-exercise.entity";

@Entity("workouts")
export class Workout {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.workouts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time", nullable: true })
  endTime: string;

  @Column({ type: "int", nullable: true })
  durationSeconds: number;

  @Column({ default: "manual" })
  source: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @OneToMany(() => WorkoutExercise, (exercise) => exercise.workout, {
    cascade: true,
  })
  exercises: WorkoutExercise[];

  @CreateDateColumn()
  createdAt: Date;
}
