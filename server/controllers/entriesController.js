const prisma = require('../db');
const ExpressError = require("../middleware/expressError");

async function addEntry(req, res, next) {
    const { title, date, description } = req.body || {};

    if (!title || !description || !date) {
        return next(new ExpressError("Missing title, date, and/or description", 400));
    }

    const entry = await prisma.entry.create({
        data: {
            title,
            description,
            date: req.parsedDate,
            user_id: req.user_id,
        },
    });

    return res.status(201).json(entry);
}

module.exports = {
    addEntry
};