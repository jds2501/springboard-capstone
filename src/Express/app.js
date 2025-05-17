const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const userRoutes = require('./routes/users');

app.use(auth());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);

app.use("/api", apiRouter);

module.exports = app;