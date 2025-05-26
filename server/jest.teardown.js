const prisma = require("./db");

require("./testEnv");

// Jest global teardown: clean up test database and disconnect Prisma
module.exports = async () => {
  // Remove all entries and users from the test database
  await prisma.entry.deleteMany({});
  await prisma.user.deleteMany({});
  // Disconnect Prisma client
  await prisma.$disconnect();
};
