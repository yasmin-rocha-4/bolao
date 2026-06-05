"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const campanha_repo_js_1 = require("./campanha.repo.js");
const campanha_schema_js_1 = require("./campanha.schema.js");
// CRIAR CAMPANHA
const create = async (req, res) => {
    const validation = campanha_schema_js_1.createCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanha = await campanha_repo_js_1.campanhaRepository.create(validation.data);
        return res.status(201).json(campanha);
    }
    catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno",
        });
    }
};
exports.create = create;
// ATUALIZAR CAMPANHA
const update = async (req, res) => {
    const id = Number(req.params.id);
    const validation = campanha_schema_js_1.updateCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanhaExistente = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanhaExistente) {
            return res.status(404).json({
                mensagem: "Campanha não encontrada",
            });
        }
        const campanha = await campanha_repo_js_1.campanhaRepository.update(id, validation.data);
        return res.status(200).json(campanha);
    }
    catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno",
        });
    }
};
exports.update = update;
