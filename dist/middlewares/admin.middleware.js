"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
function adminMiddleware(req, res, next) {
    if (!req.usuario) {
        return res.status(401).json({
            mensagem: "Usuário não autenticado.",
        });
    }
    if (req.usuario.tipo_usuario !== "administrador") {
        return res.status(403).json({
            mensagem: "Apenas administradores podem realizar esta operação.",
        });
    }
    next();
}
