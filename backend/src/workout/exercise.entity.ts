import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("exercises")
export class Exercise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  muscleGroup: string;

  @Column()
  equipment: string;

  @Column({ default: false })
  isBodyweight: boolean;

  @Column({ nullable: true })
  instructionUrl: string;

  @Column({ type: "text", nullable: true })
  description: string;
}
