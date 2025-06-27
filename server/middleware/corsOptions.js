const ExpressError = require("./expressError");

// Origins allowed - this would be updated to include origins where frontend code is hosted
const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "https://springboard-capstone-9dcz.onrender.com",
];

const corsOptions = {
  /**
   * Enables cors if no origin is defined (e.g. Insomnia) or if the origin is present in allowed
   * origins.
   *
   * @param origin the origin of the request
   * @param callback the cors callback function containing an error object (on error) and whether
   * to allow or deny the request (boolean)
   */
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new ExpressError("Not allowed by CORS", 403), false);
    }
  },
  credentials: true,
};

module.exports = corsOptions;
