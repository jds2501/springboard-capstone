# Auth0 Integration

This doc summarizes how React and Express will integrate with Auth0 in the emotional regulation journal.

## Auth0
Will define a SPA application containing:
* An Auth0 provided domain & client secret
* Each of the following need URLs for local dev / production
   * Allowed callback URLs - where we go when a user logs in
   * Allowed Logout URLs - where we go when a user logs out
   * Allowed Web Origins - needed for cross-origin authentication
* Will define Applications -> APIs with the local dev / production domains with /api in audience

## React
* Will utilize @auth0-auth0-react library
* Key components:
  * .env = should define the auth0 domain & client ID
  * Auth0Provider - React Auth0 context that should wrap the entire app with the domain & client ID provided
  * useAuth0 - main hook to use for Auth0 integration:
    * isAuthenticated - tells you if the user is auth'd
    * loginWithRedirect - allows you to trigger a login
    * logout - allows you to logout
    * user - the user data provided by Auth0 on the user logged in
    * getAccessTokenSilently - requests the JWT from auth0, uses audience
* Calls POST /users if user is Authenticated to see if the user
  needs to be created on our side or not with the JWT in an
  authorization header

# Express
* POST /users
  * Either finds and returns the user corresponding to the Auth0 ID in the JWT, or creates a new user if none exists.
  * Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
* Returns:
  * 200: User already exists — `{ id, isNewUser: false }`
  * 201: New user created — `{ id, isNewUser: true }`
  * 400: Missing required fields (e.g., auth0_id)
  * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
  * 500: Internal error — `{ error: "Internal error occurred" }`
* Other routes should go thorugh a common auth middleware to enforce token validation against the configured Auth0 issuer and audience
