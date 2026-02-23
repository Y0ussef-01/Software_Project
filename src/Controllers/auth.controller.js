const authService = require('../services/auth.services.js');

const login = async (req, res) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({ message: 'Please Enter ID and Password' });
        }

        const data = await authService.unifiedLogin(id, password);

        res.json(data);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

module.exports = { login };