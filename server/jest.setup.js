// Load test environment variables
require("./testEnv");
const { execSync } = require("child_process");

// Import Jest globals if not running in Jest environment
const { beforeAll, beforeEach, afterAll } = global;

// Push test schema to in-memory SQLite database before tests run
execSync(
  'DATABASE_URL="file:dev.db?mode=memory&cache=shared" npx prisma db push --schema=prisma/schema.test.prisma'
);

const app = require("./app");

const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const prisma = require("./db");

/**
 * Generate a JWT token for testing with a unique Auth0 subject.
 * @returns {Promise<string>} JWT token
 */
async function getTestToken() {
  const uid = randomUUID();

  const mockPayload = {
    sub: `auth0|${uid}`,
    email: `${uid}@example.com`,
    aud: process.env.AUDIENCE,
    iss: process.env.ISSUER_BASE_URL,
  };

  return jwt.sign(mockPayload, process.env.AUTH0_TEST_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}

// Make getTestToken globally available in tests
global.getTestToken = getTestToken;

// Connect to the database and start the server before all tests
beforeAll(async () => {
  await prisma.$connect();
  global.server = app.listen();
});

// Generate a new test token before each test
beforeEach(async () => {
  global.token = await getTestToken();
});

/**
 * Close the server after all tests are executed.
 */
afterAll(async () => {
  if (global.server) {
    await new Promise((resolve) => global.server.close(resolve));
  }
});
