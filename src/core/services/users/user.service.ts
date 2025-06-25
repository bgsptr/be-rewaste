import { Injectable } from "@nestjs/common";
import { CreateCitizenDto } from "src/application/dto/citizens/create_citizen.dto";
import { CustomForbidden } from "src/core/exceptions/custom-forbidden.exception";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import UserRoleRepository from "src/infrastructure/postgres/repositories/user-role.repository";
import UsersRepository from "src/infrastructure/postgres/repositories/users.repository";
import { credential } from "src/shared/constants/credential.constant";
import { roleNumber } from "src/utils/enum/role.enum";
import { generateIdWithNano } from "src/utils/generator";
import { Hasher } from "src/utils/static/hasher";

@Injectable()
class UserService {
    constructor(
        private userRepository: UsersRepository,

    ) { }

    // asnyc loginService() {
    //     await this
    // }
}

export default UserService;