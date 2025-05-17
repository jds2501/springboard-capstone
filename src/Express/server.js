require('dotenv').config();
const { connectToDb } = require('./db');
const app = require('./app');

/**
 * Starts an express server and establishes a connection to the MongoDB database.
 */
async function startServer() {
    try {
        await connectToDb();
        app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error starting server: ", err.message);
    }
}

startServer();