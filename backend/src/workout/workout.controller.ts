import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkoutService } from "./workout.service";
import {
  CreateWorkoutDto,
  SyncWorkoutsDto,
  UpdateWorkoutDto,
  WorkoutQueryDto,
} from "./dto/workout.dto";
import type { AuthenticatedRequest } from "../common/types/authenticated-request";

@Controller("workouts")
@UseGuards(AuthGuard("jwt"))
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get()
  async list(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Query() filters: WorkoutQueryDto,
  ) {
    const workouts = await this.workoutService.findAll(req.user.id, filters);
    return { data: workouts };
  }

  @Get(":id")
  async getById(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Param("id") id: string,
  ) {
    const workout = await this.workoutService.findById(id, req.user.id);
    return { data: workout };
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Body() data: CreateWorkoutDto,
  ) {
    const workout = await this.workoutService.create(req.user.id, data);
    return { data: workout, message: "Workout created successfully" };
  }

  @Patch(":id")
  async update(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Param("id") id: string,
    @Body() data: UpdateWorkoutDto,
  ) {
    const workout = await this.workoutService.update(id, req.user.id, data);
    return { data: workout, message: "Workout updated successfully" };
  }

  @Delete(":id")
  async delete(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Param("id") id: string,
  ) {
    await this.workoutService.delete(id, req.user.id);
    return { message: "Workout deleted successfully" };
  }

  @Post("sync")
  async sync(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Body() body: SyncWorkoutsDto,
  ) {
    const result = await this.workoutService.syncWorkouts(
      req.user.id,
      body.workouts,
    );
    return { data: result, message: "Workouts synced successfully" };
  }
}
