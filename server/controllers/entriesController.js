const prisma = require('../db');

async function addEntry(req, res, next) {
    const sub = req.auth.payload.sub;
    const { title, date, description } = req.body || {};

    if (!title || !description || !date) {
        return res.status(400).json({ error: "Missing title, date, and/or description" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
    }

    const user = await prisma.user.findUnique({
        where: { auth0Id: sub },
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const entry = await prisma.entry.create({
        data: {
            title,
            description,
            date: parsedDate,
            user_id: user.id,
        },
    });

    return res.status(201).json(entry);
}

module.exports = {
    addEntry
};