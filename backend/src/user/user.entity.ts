import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Workout } from "../workout/workout.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  oauthProvider: string;

  @Column({ nullable: true })
  oauthId: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: "float", nullable: true })
  heightCm: number;

  @Column({ type: "float", nullable: true })
  weightKg: number;

  @Column({ nullable: true })
  goal: string;

  @Column({ nullable: true })
  activityLevel: string;

  @Column({ default: "UTC" })
  timezone: string;

  @Column({ default: "en" })
  locale: string;

  @OneToMany(() => Workout, (workout) => workout.user)
  workouts: Workout[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
