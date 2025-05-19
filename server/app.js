const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const userRoutes = require('./routes/users');
const apiLimiter = require('./middleware/rateLimiter');
const corsOptions = require('./middleware/corsOptions');
const { notFoundHandler, generalErrorHandler } = require('./middleware/errorHandlers');
const getAuthMiddleware = require('./middleware/authMiddleware');

const apiPathRegex = /^\/(?!api).*/;

// Protected API routes
const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(getAuthMiddleware());
apiRouter.use(helmet());
apiRouter.use(cors(corsOptions));
apiRouter.options(apiPathRegex, cors(corsOptions));

apiRouter.use('/users', userRoutes);
apiRouter.use(notFoundHandler);
apiRouter.use(generalErrorHandler);

app.use('/api', apiLimiter, apiRouter);

// Serve React frontend if the build exists
const buildPath = path.resolve(__dirname, process.env.REACT_BUILD_PATH || '../client/build');
const indexPath = path.resolve(buildPath, 'index.html');

if (fs.existsSync(indexPath)) {
    app.use(express.static(buildPath));

    app.get(apiPathRegex, (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
}


module.exports = app;
