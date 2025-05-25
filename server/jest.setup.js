require('dotenv').config();

process.env.DATABASE_URL = 'file:dev.db?mode=memory&cache=shared';
const { execSync } = require('child_process');
execSync('DATABASE_URL="file:dev.db?mode=memory&cache=shared" npx prisma db push --schema=prisma/schema.test.prisma');

const app = require('./app');

const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const prisma = require('./db');

async function getTestToken() {
    const username = randomUUID();

    const mockPayload = {
        sub: `auth0|${username}`,
        email: `${username}@example.com`,
        aud: process.env.AUDIENCE,
        iss: process.env.ISSUER_BASE_URL
    };

    return jwt.sign(mockPayload, process.env.AUTH0_TEST_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
}

global.getTestToken = getTestToken;

beforeAll(async () => {
    await prisma.$connect();
    global.server = app.listen();
});

beforeEach(async () => {
    global.token = await getTestToken();
})

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