import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, FindOptionsWhere } from "typeorm";
import { Workout } from "./workout.entity";
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  WorkoutQueryDto,
} from "./dto/workout.dto";

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private workoutRepository: Repository<Workout>,
  ) {}

  async findAll(userId: string, filters?: WorkoutQueryDto): Promise<Workout[]> {
    const where: FindOptionsWhere<Workout> = { userId };

    if (filters?.from && filters?.to) {
      where.date = Between(filters.from, filters.to);
    }

    return this.workoutRepository.find({
      where,
      relations: ["exercises", "exercises.exercise", "exercises.sets"],
      order: { date: "DESC", startTime: "DESC" },
    });
  }

  async findById(id: string, userId: string): Promise<Workout> {
    const workout = await this.workoutRepository.findOne({
      where: { id, userId },
      relations: ["exercises", "exercises.exercise", "exercises.sets"],
    });

    if (!workout) {
      throw new NotFoundException("Workout not found");
    }

    return workout;
  }

  async create(userId: string, data: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutRepository.create({
      ...data,
      userId,
    });

    return this.workoutRepository.save(workout);
  }

  async update(
    id: string,
    userId: string,
    data: UpdateWorkoutDto,
  ): Promise<Workout> {
    await this.workoutRepository.update({ id, userId }, data);
    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.workoutRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException("Workout not found");
    }
  }

  async syncWorkouts(userId: string, workouts: CreateWorkoutDto[]) {
    let synced = 0;
    for (const workoutData of workouts) {
      try {
        await this.create(userId, workoutData);
        synced++;
      } catch (error) {
        console.error("Failed to sync workout:", error);
      }
    }
    return { synced };
  }
}
