"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema, segment = "body") => (req, res, next) => {
    try {
        req[segment] = schema.parse(req[segment]);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Erro de validação",
                details: error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    mensagem: issue.message,
                })),
            });
        }
        return res.status(500).json({
            error: "Erro interno",
        });
    }
};
exports.validate = validate;
