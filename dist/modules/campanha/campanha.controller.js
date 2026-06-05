"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const campanha_service_js_1 = require("./campanha.service.js");
const campanha_schema_js_1 = require("./campanha.schema.js");
const create = async (req, res) => {
    const validation = campanha_schema_js_1.createCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanha = await campanha_service_js_1.campanhaService.create(validation.data);
        return res.status(201).json(campanha);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = campanha_schema_js_1.updateCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanha = await campanha_service_js_1.campanhaService.update(Number(req.params.id), validation.data);
        return res.status(200).json(campanha);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
