"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
zod_1.z.setErrorMap((issue) => {
    switch (issue.code) {
        case "invalid_type":
            return {
                message: "Campo obrigatório.",
            };
        case "invalid_format":
            return {
                message: "Formato inválido.",
            };
        case "too_small":
            return {
                message: issue.message || "Valor menor que o permitido.",
            };
        case "too_big":
            return {
                message: issue.message || "Valor maior que o permitido.",
            };
        case "invalid_value":
            return {
                message: "Valor inválido.",
            };
        default:
            return {
                message: issue.message || "Erro de validação.",
            };
    }
});
