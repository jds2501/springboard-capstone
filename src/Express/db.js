const { PrismaClient } = require('./prisma/generated/prod-client');
const prisma = new PrismaClient();


module.exports = prisma;