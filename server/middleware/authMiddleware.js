const { auth: auth0Auth } = require("express-oauth2-jwt-bearer");
const { expressjwt: jwt } = require("express-jwt");

// Middleware wrapper for test vs production
function getAuthMiddleware() {
  if (process.env.NODE_ENV === "test") {
    // Return a combined middleware function
    return [
      jwt({
        secret: process.env.AUTH0_TEST_SECRET,
        algorithms: ["HS256"],
        requestProperty: "auth",
      }),
      (req, res, next) => {
        // Wrap the payload to match the shape from express-oauth2-jwt-bearer
        if (req.auth && typeof req.auth === "object") {
          req.auth = { payload: req.auth };
        }
        next();
      },
    ];
  }

  // Production middleware from Auth0
  console.log("Auth middleware config:");
  console.log("- AUDIENCE:", process.env.AUDIENCE);
  console.log("- ISSUER_BASE_URL:", process.env.ISSUER_BASE_URL);
  console.log("- NODE_ENV:", process.env.NODE_ENV);

  const authMiddleware = auth0Auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  });

  // Wrap with error handling
  return (req, res, next) => {
    console.log("Auth middleware called");
    authMiddleware(req, res, (err) => {
      if (err) {
        console.error("Auth middleware error:", err.message);
        console.error("Error details:", err);
        return res
          .status(401)
          .json({ error: "Authentication failed", details: err.message });
      }
      console.log("Auth middleware passed");
      next();
    });
  };
}

module.exports = getAuthMiddleware;
