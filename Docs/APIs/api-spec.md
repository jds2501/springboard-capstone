# Express API

This doc summarizes Express-specific APIs that don't depend on Together AI or Auth0. See those docs for how we integrate with those services and the routes present with them.

## POST /entries
* Adds a new journal entry for the authenticated user based on the title, date, and description provided in the body
* Body {title: String, date: Date, description: String}
* Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
* Returns:
   * 201: Successful creation of a journal entry with body of {id, title, date, description}
   * 400: Body is missing name, date, or description {error: "Missing name, date, and/or description"} or date is not of date format
   * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
   * 500: Internal error — `{ error: "Internal error occurred" }`

## POST /entries/import
* Imports the target MD file for the authenticate user and adds it to the DB
* Body:
 * Content-Type: multipart/form-data
 * file - the file object uploaded
* Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
* Returns:
 * 201: Successful creation of a journal entry with body of {id, title, date, description}
 * 400: File object is invalid with an error in the response based on the kind of issue:
  * "Could not parse markdown"
  * "Missing metadata: Title and/or date"
  * "File too large"
 * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
 * 500: Internal error — `{ error: "Internal error occurred" }`

## DELETE /entries/:id
* Deletes the specified journal entry for the authenticated user
* Requires: 
 * A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
 * The journal entry must be owned by the authenticated user
* Returns:
 * 200: Successful deletion of journal entry for the authenticated user with {message: "Successful deletion of entry"}
 * 400: ID doesn't exist
 * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
 * 403: If the entry is not owned by the authenticated user {error: "Authenticated user does not own entry"}
 * 404: If the entry ID cannot be found
 * 500: Internal error — `{ error: "Internal error occurred" }`

# GET /entries?page={number}&limit={number}
* Returns a paginated list of entries for the authenticated user
* Default: page is set to 1 and limit is set to 20 if either are not set
* Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
* Returns:
 * 200: Successful retrieval of target page & limit (default: all) of entries with body of {"entries": [{id, title, date}, ...], "pagination": {page, limit, totalPages, totalResults}}
 * 400: If page or limit were provided as a not a number {error: "Page and/or limit must be numbers"}
 * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
 * 500: Internal error — `{ error: "Internal error occurred" }`

# GET /entries/:id
* Gets a target journal entry provided for the authenticated user
* Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
* Returns:
 * 200: Successful request of a journal entry with body of {id, title, date, description}
 * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
 * 403: If the entry is not owned by the authenticated user {error: "Authenticated user does not own entry"}
 * 404: If the entry ID cannot be found
 * 500: Internal error — `{ error: "Internal error occurred" }`

# PATCH /entries/:id
* Edits an existing journal entry provided for the authenticated user by modifying the entry for the fields that changed only
* Body: 0 or more of the following:
 * title: String
 * date: Date
 * description: String
* Requires: 
 * A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
 * The journal entry must be owned by the authenticated user
* Returns:
 * 200: Successful edit of a journal entry with body of {id, title, date, description}
 * 400: date is not of date format in body
 * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
 * 403: If the entry is not owned by the authenticated user {error: "Authenticated user does not own entry"}
 * 404: If the entry ID cannot be found
 * 500: Internal error — `{ error: "Internal error occurred" }`

# API Packages / Tools
* cors: Will be used for configuring specified frontend domains that are allowed to consume this API with credentials set to true
* helmet: Will set standard security-related HTTP headers to protect against common web vulnerabilities
* express-rate-limit: Will limit number of requests per a set time per IP (e.g. 100 requests per 15 min per IP)
* dotenv: Used for accessing secrets from .env
* multer - used for handling imported md files
* gray-matter - used for extracting metadata from MD files
* sanitize-html - used on imported MD file descriptions
* jest & supertest: Used for unit & integration testing of API
* Insomnia: Used for manual API verification, will include as exported collection
* express.json: Used to ensure requests are parsed into JSON
