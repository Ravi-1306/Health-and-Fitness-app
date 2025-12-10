import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
} from "class-validator";

const GOALS = [
  "lose_weight",
  "build_muscle",
  "maintain",
  "tone",
  "improve_endurance",
] as const;

type FitnessGoal = (typeof GOALS)[number];

type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active";

export type ChatContext = Record<string, unknown>;

export class GeneratePlanDto {
  @IsNumber()
  @Min(10)
  @Max(100)
  age: number;

  @IsString()
  gender: string;

  @IsNumber()
  heightCm: number;

  @IsNumber()
  weightKg: number;

  @IsString()
  @IsIn(GOALS as readonly string[])
  goal: FitnessGoal;

  @IsString()
  activityLevel: ActivityLevel;

  @IsNumber()
  @Min(1)
  @Max(7)
  daysPerWeek: number;

  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  equipment: string[];
}

export class ChatRequestDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  context?: ChatContext;
}

export class WorkoutSetHistoryDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  sets: number;

  @IsString()
  reps: string;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  rpe?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class WorkoutHistoryEntryDto {
  @IsString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutSetHistoryDto)
  exercises: WorkoutSetHistoryDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class WorkoutSuggestionRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WorkoutHistoryEntryDto)
  workoutHistory: WorkoutHistoryEntryDto[];
}

export type WorkoutHistoryEntry = WorkoutHistoryEntryDto;
