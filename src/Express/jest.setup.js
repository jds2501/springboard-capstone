require('dotenv').config();

process.env.DATABASE_URL = 'file:dev.db?mode=memory&cache=shared';
const { execSync } = require('child_process');
execSync('DATABASE_URL="file:dev.db?mode=memory&cache=shared" npx prisma db push --schema=prisma/schema.test.prisma');

const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
const app = require('./app');

const axios = require("axios");

async function getTestToken() {
    const res = await axios.post(`${process.env.ISSUER_BASE_URL}/oauth/token`, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials"
    });

    return res.data.access_token;
}

/**
 * Create an in memory Mongo DB database and launch
 * the server with it.
 */
beforeAll(async () => {
    await prisma.$connect();
    global.token = await getTestToken();
    global.server = app.listen();
});

/**
 * Wipe out in the in memory database between tests.
 */
afterEach(async () => {
    await prisma.entry.deleteMany({});
    await prisma.user.deleteMany({});
});

/**
 * Close the server & DB connection after all tests are executed.
 */
afterAll(async () => {
    if (server) {
        await new Promise((resolve) => global.server.close(resolve));
    }
    await prisma.$disconnect();
});