const jwt = require('jsonwebtoken');

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token provided' });

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Not allowed for this role' });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = checkRole;