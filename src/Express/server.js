require('dotenv').config();
const prisma = require('./db');
const app = require('./app');

/**
 * Starts an express server and establishes a connection to the MongoDB database.
 */
async function startServer() {
    try {
        const users = await prisma.user.findMany();
        console.log(users);
        app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error starting server: ", err.message);
    }
}

startServer();