require('dotenv').config();
const app = require('./app');
const axios = require("axios");

async function getTestToken() {
    const res = await axios.post(`${process.env.ISSUER_BASE_URL}/oauth/token`, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials"
    });

    return res.data.access_token;
}

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