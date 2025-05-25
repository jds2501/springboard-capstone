require('dotenv').config();

process.env.DATABASE_URL = 'file:dev.db?mode=memory&cache=shared';