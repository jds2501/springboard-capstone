const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Trust proxy for production deployment (needed for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

const userRoutes = require("./routes/users");
const entryRoutes = require("./routes/entries");
const apiLimiter = require("./middleware/rateLimiter");
const corsOptions = require("./middleware/corsOptions");
const {
  notFoundHandler,
  generalErrorHandler,
} = require("./middleware/errorHandlers");
const getAuthMiddleware = require("./middleware/authMiddleware");

// Regex to match all routes except those starting with /api
const apiPathRegex = /^\/(?!api).*/;

// Protected API routes setup
const apiRouter = express.Router();

// Parse JSON bodies for API requests
apiRouter.use(express.json());
// Require authentication for all API routes
apiRouter.use(getAuthMiddleware());
// Add security headers
apiRouter.use(helmet());
// Enable CORS with custom options
apiRouter.use(cors(corsOptions));
// Mount user and entry routes
apiRouter.use("/users", userRoutes);
apiRouter.use("/entries", entryRoutes);
// Handle 404s for API routes
apiRouter.use(notFoundHandler);
// General error handler for API routes
apiRouter.use(generalErrorHandler);

// Apply rate limiting and mount API router under /api
app.use(
  "/api",
  (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.path}`);
    console.log(
      "Headers:",
      req.headers.authorization ? "Bearer token present" : "No auth header"
    );
    next();
  },
  apiLimiter,
  apiRouter
);

// Serve React frontend if the build exists
const buildPath = path.resolve(
  __dirname,
  process.env.REACT_BUILD_PATH || "../client/build"
);
const indexPath = path.resolve(buildPath, "index.html");

// If the React build exists, serve static files and index.html for non-API routes
if (fs.existsSync(indexPath)) {
  app.use(express.static(buildPath));

  // Serve index.html for all non-API routes (for client-side routing)
  app.get(apiPathRegex, (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

module.exports = app;
