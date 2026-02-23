const jwt = require('jsonwebtoken');

const teacherAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'teacher')
            return res.status(403).json({ message: 'Teachers only' });

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = teacherAuth;