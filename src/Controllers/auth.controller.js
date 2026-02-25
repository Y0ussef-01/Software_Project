const authService = require('../services/auth.services.js');

const login = async (req, res) => {
    try {
        const { id, password } = req.body;
        const data = await authService.userLogin(id, password);
        res.json(data);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { id, password } = req.body;
        const data = await authService.adminLogin(id, password);
        res.json(data);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

module.exports = { login, adminLogin };
