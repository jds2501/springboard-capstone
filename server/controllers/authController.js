

async function registerNewAccount(req, res, next) {
    return res.status(200).json({ "message": "Test" });
}


module.exports = {
    registerNewAccount,
};