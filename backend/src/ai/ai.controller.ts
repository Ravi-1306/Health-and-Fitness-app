import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AiService } from "./ai.service";
import {
  ChatRequestDto,
  GeneratePlanDto,
  WorkoutSuggestionRequestDto,
} from "./dto/ai.dto";

@Controller("ai")
@UseGuards(AuthGuard("jwt"))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate-plan")
  async generatePlan(@Body() userData: GeneratePlanDto) {
    const plan = await this.aiService.generateWorkoutPlan(userData);
    return { data: { plan } };
  }

  @Post("chat")
  async chat(@Body() body: ChatRequestDto) {
    const response = await this.aiService.chatWithCoach(
      body.message,
      body.context,
    );
    return { data: { response } };
  }

  @Post("workout-suggestion")
  async workoutSuggestion(@Body() body: WorkoutSuggestionRequestDto) {
    const suggestion = await this.aiService.getWorkoutSuggestion(
      body.workoutHistory,
    );
    return { data: { suggestion } };
  }
}
