import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra de datos iniciales...');

  // Generamos el hash de la contraseña
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Creamos o actualizamos el Admin Principal
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bars.com' },
    update: {},
    create: {
      email: 'admin@bars.com',
      password: hashedPassword,
      role: 'PLATFORM_ADMIN',
      // Nota: Platform admin no necesita tenantId
    },
  });

  console.log(`✅ Usuario Admin creado/actualizado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });