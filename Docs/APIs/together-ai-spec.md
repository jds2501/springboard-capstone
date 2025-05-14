# Together AI Integration

This doc summarizes how Express will integrate with Together AI in the emotional regulation journal.

## Together AI
* Provides a npm package together-ai
* Needs an API key: TOGETHER_API_KEY
* Will use meta-llama/Meta-Llama-3.2-11B as the AI model

## Express
* POST /entries/trend
 * Analyzes the journal entries for the authenticated user against a target date range and returns an analysis from Together AI
 * Body: {from: Date, to: Date}
 * Requires: A valid JWT authorization header that when checked with checkJwt with audience from express-oauth-jwt-bearer, identifies a valid auth0_id for the user
 * Returns:
  * 200: Successful analysis of journal entries with a response body of {analysis: string}
  * 400: Missing required body (e.g. from & to date)
  * 401: Missing or invalid JWT — `{ error: "Authentication required" }`
  * 500: Internal error — `{ error: "Internal error occurred" }`