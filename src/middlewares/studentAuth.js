const jwt = require('jsonwebtoken');

const studentAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'student')
            return res.status(403).json({ message: 'Students only' });

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = studentAuth;
