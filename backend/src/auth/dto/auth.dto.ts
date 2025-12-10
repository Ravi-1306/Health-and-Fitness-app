import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  profile?: {
    age?: number;
    gender?: string;
    heightCm?: number;
    weightKg?: number;
    goal?: string;
    activityLevel?: string;
  };
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
