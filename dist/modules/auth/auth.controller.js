"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const auth_schema_1 = require("./auth.schema");
const auth_service_1 = require("./auth.service");
const login = async (req, res) => {
    const validation = auth_schema_1.loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const { email, senha } = validation.data;
        const resultado = await auth_service_1.authService.login(email, senha);
        return res.status(200).json(resultado);
    }
    catch (error) {
        return res.status(401).json({
            mensagem: error.message,
        });
    }
};
exports.login = login;
