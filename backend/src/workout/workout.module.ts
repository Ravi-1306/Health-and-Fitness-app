import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workout } from "./workout.entity";
import { WorkoutExercise } from "./workout-exercise.entity";
import { Exercise } from "./exercise.entity";
import { Set } from "./set.entity";
import { WorkoutController } from "./workout.controller";
import { WorkoutService } from "./workout.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutExercise, Exercise, Set]),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}
