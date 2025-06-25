import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { CustomConflict } from "src/core/exceptions/custom-conflict.exception";
import { IUserRepository } from "src/core/interfaces/repositories/users.repository.interface";
import PrismaService from "src/core/services/prisma/prisma.service";
import { roleNumber } from "src/utils/enum/role.enum";
import DayConvertion from "src/utils/static/dayjs";

@Injectable()
class UsersRepository implements IUserRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async create(data: { userId: string; username: string; password: string; }): Promise<User> {
        return await this.prisma.user.create({
            data
        });
    }

    async getAccountByUsername(username: string) {
        return await this.prisma.user.findFirst({
            where: {
                username
            }
        });
    }
}

export default UsersRepository;