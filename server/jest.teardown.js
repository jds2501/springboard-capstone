const prisma = require('./db');

require('./testEnv');

module.exports = async () => {
    await prisma.entry.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.$disconnect();
};