import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
} from "class-validator";

export class WorkoutSetDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsUUID()
  workoutExerciseId?: string;

  @IsInt()
  @Min(1)
  setIndex: number;

  @IsInt()
  @Min(0)
  reps: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rpe?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  restSeconds?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class WorkoutExerciseDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  exerciseId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutSetDto)
  sets?: WorkoutSetDto[];
}

export class BaseWorkoutDto {
  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises?: WorkoutExerciseDto[];

  @IsOptional()
  @IsBoolean()
  synced?: boolean;

  @IsOptional()
  @IsString()
  source?: string;
}

export class CreateWorkoutDto extends BaseWorkoutDto {}

export class UpdateWorkoutDto extends BaseWorkoutDto {}

export class SyncWorkoutsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutDto)
  workouts: CreateWorkoutDto[];
}

export class WorkoutQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
