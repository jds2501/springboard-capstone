const axios = require("axios");

async function getTestToken() {
    console.log(process.env.ISSUER_BASE_URL);

    const res = await axios.post(`${process.env.ISSUER_BASE_URL}/oauth/token`, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials"
    });

    return res.data.access_token;
}

module.exports = getTestToken;