import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.user.deleteMany({ where: { username: 'admin' } });

    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('Admin user created successfully.');    
    // const password = 'Admin12345'; // Cambia esto por una contraseña segura
    // const hashedPassword = bcrypt.hashSync(password, 10);

    // await prisma.user.upsert({
    //     where: { username: 'admin' },
    //     update: {},
    //     create: {
    //         username: 'admin',
    //         passwordHash: hashedPassword,
    //     },
    // });
    // console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });