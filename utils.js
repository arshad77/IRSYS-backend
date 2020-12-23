var jwt = require('jsonwebtoken');

function generateToken(user) {
    if (!user) return null;

    var u = {
        userId: user.rid,
        name: user.rname,
        password: user.password,
        apikey: user.apikey
    }


    return jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
    });
}



module.exports = {
    generateToken
}