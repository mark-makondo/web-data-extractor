const jwt = require('jsonwebtoken');

export default (req, res, next) => {
    // code for session
    // if (req.session?.user) return next();
    // return res.status(403).end();
    const JWT_SECRET = process.env.JWT_SECRET;
    let token, verified;

    // token = req.header('jwt_token');
    token = req.headers.authorization;

    if (!token) return res.status(403).send('Access Denied');

    verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;

    return next();
};
