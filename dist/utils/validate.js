"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, segment = "body") => (req, res, next) => {
    const result = schema.safeParse(req[segment]);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Erro de validação.",
            errors: result.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensagem: issue.message,
            })),
        });
    }
    req[segment] = result.data;
    next();
};
exports.validate = validate;
