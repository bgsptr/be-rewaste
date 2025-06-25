import { Controller, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CustomUnauthorized } from "src/core/exceptions/custom-unathorized.exception";
import UserRoleRepository from "src/infrastructure/postgres/repositories/user-role.repository";
import UsersRepository from "src/infrastructure/postgres/repositories/users.repository";
import { Hasher } from "src/utils/static/hasher";
import * as jwt from "jsonwebtoken";
import { roleNumber } from "src/utils/enum/role.enum";
import AuthDto from "src/application/dto/auth.dto";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { generateIdWithNano } from "src/utils/generator";
import { CustomConflict } from "src/core/exceptions/custom-conflict.exception";
import { NotFoundException } from "src/core/exceptions/not-found.exception";

interface PayloadJWT {
    userId: string,
    roleString: string[],
    data?: {
        transporterId?: string | null,
        villageId: string | null,
    }
}

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UsersRepository,
        private userRoleRepository: UserRoleRepository,
        private logger: LoggerService,
    ) { }

    async authenticateAccount({ username: usernameDto, password: passwordDto }: AuthDto) {
        try {
            const result = await this.userRepository.getAccountByUsername(usernameDto);

            if (!result?.userId) throw new CustomUnauthorized();

            const { userId, password } = result;

            const passwordIsMatch = await Hasher.comparePassword(passwordDto, password);
            if (!passwordIsMatch) throw new CustomUnauthorized(`password is not match`);

            const roles = await this.userRoleRepository.getRoles(userId);
            const roleString = roles.map(role => role.roleId);
            this.logger.debug(roleString);
            const payload: PayloadJWT = {
                userId,
                roleString,
            }

            const accessToken = await this.generateJwtToken(payload, true);
            this.logger.log("token: ", accessToken);

            const refreshToken = await this.generateJwtToken(payload, false);
            return {
                userId,
                accessToken,
                refreshToken,
            }

        } catch (err) {
            if (err instanceof CustomUnauthorized) throw err;
            if (err instanceof PrismaClientKnownRequestError) throw new CustomUnauthorized(`can't find email of user`);
            throw new InternalServerErrorException();
        }
    }

    async createAccount({ username, password }) {
        const userId = `USER-${generateIdWithNano()}`;

        try {
            const result = await this.userRepository.getAccountByUsername(username);

            if (result?.userId) throw new CustomConflict('user');
            const passwordDto = await Hasher.hashPassword(password);
            const user = await this.userRepository.create({ userId, username, password: passwordDto });
            await this.userRoleRepository.addRole(user.userId, roleNumber.VIEWER);
            return user;
        } catch (err) {
            this.logger.error(err);
            if (err instanceof PrismaClientKnownRequestError) throw new CustomConflict('user');
            throw err;
        }
    }

    private async generateJwtToken(payload: PayloadJWT, accessToken: boolean) {
        return jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN ?? "secret", {
            expiresIn: accessToken ? "1h" : "7h"
        });
    }
}