require('dotenv').config();
const app = require('./app');
const getTestToken = require("./tests/getTestToken");

/**
 * Create an in memory Mongo DB database and launch
 * the server with it.
 */
beforeAll(async () => {
    global.token = await getTestToken();
    global.server = app.listen();
});

/**
 * Wipe out in the in memory database between tests.
 */
afterEach(async () => {

});

/**
 * Close the server & DB connection after all tests are executed.
 */
afterAll(async () => {
    if (server) {
        await new Promise((resolve) => global.server.close(resolve));
    }
});