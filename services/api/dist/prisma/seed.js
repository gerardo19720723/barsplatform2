"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando siembra de datos iniciales...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bars.com' },
        update: {},
        create: {
            email: 'admin@bars.com',
            password: hashedPassword,
            role: 'PLATFORM_ADMIN',
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
//# sourceMappingURL=seed.js.map