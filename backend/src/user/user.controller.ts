import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import type { AuthenticatedRequest } from "../common/types/authenticated-request";

@Controller("user")
@UseGuards(AuthGuard("jwt"))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  async getProfile(@Request() req: AuthenticatedRequest<{ id: string }>) {
    const user = await this.userService.findById(req.user.id);
    return { data: user };
  }

  @Patch("profile")
  async updateProfile(
    @Request() req: AuthenticatedRequest<{ id: string }>,
    @Body() data: UpdateProfileDto,
  ) {
    const user = await this.userService.updateProfile(req.user.id, data);
    return { data: user, message: "Profile updated successfully" };
  }

  @Delete("profile")
  async deleteAccount(@Request() req: AuthenticatedRequest<{ id: string }>) {
    await this.userService.deleteAccount(req.user.id);
    return { message: "Account deleted successfully" };
  }
}
