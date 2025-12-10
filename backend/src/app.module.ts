import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { WorkoutModule } from "./workout/workout.module";
import { AiModule } from "./ai/ai.module";

const getDatabaseConfig = () => {
  const isPostgres = process.env.DB_TYPE === "postgres";

  if (isPostgres) {
    return {
      type: "postgres" as const,
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432", 10),
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_DATABASE ?? "postgres",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV === "development",
      logging: process.env.NODE_ENV === "development",
    };
  }

  return {
    type: "sqlite" as const,
    database: process.env.DB_DATABASE ?? "fittrack.db",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    UserModule,
    WorkoutModule,
    AiModule,
  ],
})
export class AppModule {}
