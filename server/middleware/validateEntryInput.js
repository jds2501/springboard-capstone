const ExpressError = require("./expressError");
const prisma = require('../db');

async function validateEntryInput(req, res, next) {
    const sub = req.auth.payload.sub;
    const { title, date, description } = req.body || {};

    if (title === "") {
        return next(new ExpressError("Title cannot be empty string", 400));
    }

    if (date) {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return next(new ExpressError("Invalid date format", 400));
        }

        req.parsedDate = parsedDate;
    }

    if (description === "") {
        return next(new ExpressError("Description cannot be empty string", 400));
    }

    const user = await prisma.user.findUnique({
        where: { auth0Id: sub },
    });

    if (!user) {
        return next(new ExpressError("User not found", 404));
    }

    req.user_id = user.id;

    return next();
}

module.exports = validateEntryInput;