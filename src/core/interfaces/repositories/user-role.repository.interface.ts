import { UserRole } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IUserRoleRepository extends Repository<UserRole> {
    fetchAll(): Promise<UserRole>;
    addRole(userId: string, roleId: string): void;
    getRoles(userId: string): Promise<String[]>;
}