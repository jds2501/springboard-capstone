require("dotenv").config();
const app = require("./app");

/**
 * Starts an express server and establishes a connection to the database.
 * The server listens on the port specified in the environment variables.
 */
async function startServer() {
  try {
    // Start the Express server
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    // Log any errors that occur during server startup
    console.error("Error starting server: ", err.message);
  }
}

startServer();
