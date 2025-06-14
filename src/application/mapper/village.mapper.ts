import { AccountStatus, Village } from "@prisma/client";
import { CreateVillageDto } from "src/application/dto/villages/create_village.dto";
import { ResponseVillageDto } from "src/application/dto/villages/response_village.dto";
import { IMapper } from "src/core/interfaces/mappers/mapper";
import { RolesEnum } from "src/shared/constants/roles.contants";
import { roleNumber } from "src/utils/enum/role.enum";
import { generateIdForRole, RoleIdGenerate } from "src/utils/generator";

export class VillageMapper implements IMapper<CreateVillageDto, Village, ResponseVillageDto> {
    toEntity(dto: CreateVillageDto): Village {
        return {
            id: generateIdForRole(RoleIdGenerate.village),
            villageName: dto.villageName,
            province: dto.province,
            district: dto.district,
            regency: dto.regency,
            description: "",
            status: AccountStatus.active,
            createdAt: new Date(),
            userVerificatorId: null,
            // kkT: dto.kkTotal
        };
    }

    toResponse(entity: Village): ResponseVillageDto {
        return {
            villageId: entity.id,
            villageName: entity.villageName,
            district: entity.district,
            status: entity.status,
            // logo: entity.villageLogo,
            // website: entity.villageWebsiteUrl,
        };
    }
}
