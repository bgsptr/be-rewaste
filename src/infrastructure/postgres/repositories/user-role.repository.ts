import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class UserRoleRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async fetchAll(): Promise<UserRole[]> {
        return await this.prisma.userRole.findMany();
    }

    async addRole(userId: string, roleId: string) {
        await this.prisma.userRole.create({
            data: {
                userId,
                roleId
            }
        })
    }

    async getRoles(userId: string) {
        return await this.prisma.userRole.findMany({
            where: {
                userId,
            },
            select: {
                roleId: true,
            }
        });
    }
}

export default UserRoleRepository;