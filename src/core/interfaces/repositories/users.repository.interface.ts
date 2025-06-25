import { User } from "@prisma/client";
import { Repository } from "src/core/base/repository";

export interface IUserRepository extends Repository<User> {
    getAccountByUsername(username: string, password: string): Promise<any>;
}