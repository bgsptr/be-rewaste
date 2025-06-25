// import { User } from '@prisma/client';
// import { RescheduleStatus, AccountStatus, Role } from '@prisma/client';

// export const normalizeUserDefaults = (data: Partial<User>): User => {
//     return {
//         userId: data.userId ?? '',
//         fullName: data.fullName ?? '',
//         email: data.email ?? '',
//         phoneNumber: data.phoneNumber ?? '',
//         password: data.password ?? '',
//         nik: data.nik ?? '',
//         simNo: data.simNo ?? null,
//         qrCode: data.qrCode ?? null,
//         addressId: data.addressId ?? null,
//         rescheduleStatus: data.rescheduleStatus ?? RescheduleStatus.active,
//         accountStatus: AccountStatus.active,
//         villageId: data.villageId ?? null,
//         createdAt: data.createdAt ?? new Date(),
//         transporterId: data.transporterId ?? null,
//         wasteFees: data.wasteFees ?? "",
//         loyaltyId: data.loyaltyId ?? null,
//         lastSeen: data.lastSeen ?? null,
//         rescheduleStopAt: data.rescheduleStopAt ?? null,
//         driverVillageId: data.driverVillageId ?? null,
//     };
// }
