"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const auth_service_js_1 = require("./auth.service.js");
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const resultado = await auth_service_js_1.authService.login(email, senha);
        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso.",
            data: resultado,
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
exports.login = login;
