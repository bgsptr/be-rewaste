import { Module } from "@nestjs/common";
import { AuthService } from "src/core/services/auth/auth.service";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import UserRoleRepository from "src/infrastructure/postgres/repositories/user-role.repository";
import UsersRepository from "src/infrastructure/postgres/repositories/users.repository";
import AuthController from "src/modules/auth/auth.controller";

@Module({
    providers: [AuthService, UsersRepository, UserRoleRepository],
    controllers: [AuthController],
})

export class AuthModule {}