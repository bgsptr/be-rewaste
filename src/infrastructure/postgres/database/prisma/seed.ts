import { PrismaClient } from '@prisma/client';
import { Hasher } from 'src/utils/static/hasher';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { roleId: "1" },
    update: {},
    create: {
      roleId: "1",
      name: "Viewer",
    },
  });

  await prisma.role.upsert({
    where: { roleId: "2" },
    update: {},
    create: {
      roleId: "2",
      name: "Admin",
    },
  });

  for (let i = 1; i <= 5; i++) {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        userId,
        username: `viewer_user_${i}`,
        password: await Hasher.hashPassword('viewer123'),
        UserRole: {
          create: {
            roleId: "1",
          },
        },
      },
    });
  }

  for (let i = 1; i <= 2; i++) {
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        userId,
        username: `admin_user_${i}`,
        password: await Hasher.hashPassword('admin123'),
        UserRole: {
          create: {
            roleId: "2",
          },
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log('Seeding selesai!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Seeding gagal:', e);
    return prisma.$disconnect();
  });
