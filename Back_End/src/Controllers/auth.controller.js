const authService = require('../services/auth.services.js');

const login = async (req, res) => {
    try {
        const { id, password } = req.body;
        const data = await authService.login(id, password);
        res.json(data);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
const signup = async (req, res) => {
    try {
        const { id, name, password } = req.body;
        if (!id || !name || !password) {
            return res.status(400).json({ message: 'id, name and password are required' });
        }
        const data = await authService.signup(id, name, password);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { login, signup };