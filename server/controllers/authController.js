const prisma = require("../db");

/**
 * Finds a user by Auth0 ID or creates a new user if not found.
 * Responds with user ID and a flag indicating if the user was newly created.
 */
async function findOrCreateUserByAuth0Id(req, res) {
  console.log("Auth controller reached");
  console.log("req.auth:", req.auth);

  const sub = req.auth.payload.sub;

  // Attempt to find user by Auth0 ID
  let user = await prisma.user.findUnique({
    where: { auth0Id: sub },
  });

  let isNewUser = false;

  // If user does not exist, create a new user
  if (user) {
    isNewUser = false;
  } else {
    user = await prisma.user.create({
      data: { auth0Id: sub },
    });
    isNewUser = true;
  }

  // Respond with user ID and new user status
  return res.status(isNewUser ? 201 : 200).json({
    id: user.id,
    isNewUser,
  });
}

module.exports = {
  findOrCreateUserByAuth0Id,
};
