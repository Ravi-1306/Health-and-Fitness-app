import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerativeModel } from "@google/generative-ai";
import {
  ChatContext,
  GeneratePlanDto,
  WorkoutHistoryEntry,
} from "./dto/ai.dto";

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateWorkoutPlan(userData: GeneratePlanDto) {
    const prompt = `You are FitBuddy, an expert personal trainer. Produce a 4-week progressive resistance training program.

Input: ${JSON.stringify(userData, null, 2)}

Instructions: Provide weekly breakdown, daily exercises with sets/reps, RPE targets, progression rules (how to add weight or reps each week), warm-up and example rest times. Keep language brief and actionable and return valid JSON with this structure:
{
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day": "Mon",
          "type": "Upper Push",
          "exercises": [
            {
              "name": "Barbell Bench Press",
              "sets": 4,
              "reps": "6-8",
              "rpe": 8,
              "progression": "+2.5kg when 4x8 achieved"
            }
          ]
        }
      ]
    }
  ]
}`;

    try {
      const fullPrompt = `You are FitBuddy, an expert personal trainer creating workout plans. Always respond with valid JSON.\n\n${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate workout plan");
    }
  }

  async chatWithCoach(message: string, context?: ChatContext) {
    const systemPrompt = `You are FitBuddy, a friendly and knowledgeable fitness assistant. 
Provide evidence-based, concise advice on workouts, progressive overload, form, and training principles.
Keep responses brief and actionable.`;

    type ChatMessageRole = "system" | "user";
    type ChatMessage = { role: ChatMessageRole; content: string };

    const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

    if (context) {
      messages.push({
        role: "system",
        content: `User context: ${JSON.stringify(context)}`,
      });
    }

    messages.push({ role: "user", content: message });

    try {
      const fullPrompt = messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n\n");

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to get AI response");
    }
  }

  async getWorkoutSuggestion(workoutHistory: WorkoutHistoryEntry[]) {
    const prompt = `You are FitBuddy, analyzing recent workout history to suggest the next session.

Last 3 workouts:
${JSON.stringify(workoutHistory, null, 2)}

Task: Suggest next session adjustments: recommended weights for main lifts, 1 micro advice for form or recovery, and whether to deload. Return JSON:
{
  "suggestions": [
    {"exercise": "Bench Press", "recommendedWeight": 62.5, "reasoning": "Progressive overload from 60kg"},
  ],
  "advice": "Focus on controlling the eccentric phase",
  "shouldDeload": false
}`;

    try {
      const fullPrompt = `You are FitBuddy. Respond with valid JSON only.\n\n${prompt}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to generate workout suggestion");
    }
  }
}
