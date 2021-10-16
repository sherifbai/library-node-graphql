const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        req.isAuth = false;
        return next()
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, "secretKey");
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.id = decodedToken.id;
    req.isAuth = true;
    req.role = decodedToken.role;

    next();
};