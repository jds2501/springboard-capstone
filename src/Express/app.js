const express = require('express');

const app = express();
const userRoutes = require('./routes/users');

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);

app.use("/api", apiRouter);

module.exports = app;