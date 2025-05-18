const express = require('express');
const path = require('path');
const fs = require('fs');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const userRoutes = require('./routes/users');

// Parse JSON
app.use(express.json());

// Protected API routes
const apiRouter = express.Router();
apiRouter.use(auth());
apiRouter.use('/users', userRoutes);
app.use('/api', apiRouter);

// Serve React frontend if the build exists
const buildPath = path.resolve(__dirname, '../../client/build');
const indexPath = path.resolve(buildPath, 'index.html');

if (fs.existsSync(indexPath)) {
    app.use(express.static(buildPath));

    // Fallback: send index.html for any route not starting with /api
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(indexPath);
    });
}

module.exports = app;
