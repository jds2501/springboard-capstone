const { auth: auth0Auth } = require('express-oauth2-jwt-bearer');
const { expressjwt: jwt } = require('express-jwt');

// Middleware wrapper for test vs production
function getAuthMiddleware() {
    if (process.env.NODE_ENV === 'test') {
        // Return a combined middleware function
        return [
            jwt({
                secret: process.env.AUTH0_TEST_SECRET,
                algorithms: ['HS256'],
                requestProperty: 'auth'
            }),
            (req, res, next) => {
                // Wrap the payload to match the shape from express-oauth2-jwt-bearer
                if (req.auth && typeof req.auth === 'object') {
                    req.auth = { payload: req.auth };
                }
                next();
            }
        ];
    }

    // Production middleware from Auth0
    return auth0Auth({
        audience: process.env.AUDIENCE,
        issuerBaseURL: process.env.ISSUER_BASE_URL
    });
}

module.exports = getAuthMiddleware;
