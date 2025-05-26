const prisma = require("../db");

async function findOrCreateUserByAuth0Id(req, res) {
  const sub = req.auth.payload.sub;

  let user = await prisma.user.findUnique({
    where: { auth0Id: sub },
  });

  let isNewUser = false;

  if (user) {
    isNewUser = false;
  } else {
    user = await prisma.user.create({
      data: { auth0Id: sub },
    });
    isNewUser = true;
  }

  return res.status(isNewUser ? 201 : 200).json({
    id: user.id,
    isNewUser,
  });
}

module.exports = {
  findOrCreateUserByAuth0Id,
};
