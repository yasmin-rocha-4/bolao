"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const aposta_service_js_1 = require("./aposta.service.js");
const aposta_schema_js_1 = require("./aposta.schema.js");
const create = async (req, res) => {
    const validation = aposta_schema_js_1.createApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const aposta = await aposta_service_js_1.apostaService.create(validation.data);
        return res.status(201).json(aposta);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = aposta_schema_js_1.updateApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const aposta = await aposta_service_js_1.apostaService.update(Number(req.params.id), validation.data);
        return res.status(200).json(aposta);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
