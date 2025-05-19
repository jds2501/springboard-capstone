const isTest = process.env.NODE_ENV === 'test';

const { PrismaClient } = isTest
    ? require('./prisma/generated/test-client') // ✅ Test Prisma client
    : require('./prisma/generated/prod-client'); // ✅ Production Prisma client

const prisma = new PrismaClient();

module.exports = prisma;