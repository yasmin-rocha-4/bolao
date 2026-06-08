"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const campanha_opcoes_service_1 = require("./campanha.opcoes.service");
const campanha_opcoes_repo_1 = require("./campanha.opcoes.repo");
const campanha_repo_1 = require("../campanha/campanha.repo");
jest.mock("./campanha.opcoes.repo", () => ({
    campanhaOpcoesRepository: {
        getAll: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
jest.mock("../campanha/campanha.repo", () => ({
    campanhaRepository: {
        getById: jest.fn(),
    },
}));
describe("campanhaOpcoesService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve listar opções de campanha", async () => {
        const opcoes = [{ id: 1, descricao: "Brasil campeão", status: "ATIVA" }];
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getAll.mockResolvedValue(opcoes);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getAll();
        expect(resultado).toEqual(opcoes);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getAll).toHaveBeenCalledTimes(1);
    });
    it("deve buscar opção por ID existente", async () => {
        const opcao = { id: 1, descricao: "Brasil campeão", status: "ATIVA" };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getById(1);
        expect(resultado).toEqual(opcao);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getById).toHaveBeenCalledWith(1);
    });
    it("deve retornar erro ao buscar opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.getById(99)).rejects.toThrow("Opção da campanha não encontrada");
    });
    it("deve criar opção quando campanha existe", async () => {
        const campanha = { id: 1, nome: "Bolão Copa" };
        const data = {
            campanha_id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        const opcaoCriada = { id: 1, ...data };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.create.mockResolvedValue(opcaoCriada);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.create(data);
        expect(resultado).toEqual(opcaoCriada);
        expect(campanha_repo_1.campanhaRepository.getById).toHaveBeenCalledWith(1);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).toHaveBeenCalledWith(data);
    });
    it("não deve criar opção quando campanha não existe", async () => {
        const data = {
            campanha_id: 999,
            descricao: "Argentina campeã",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.create(data)).rejects.toThrow("Campanha inválida");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).not.toHaveBeenCalled();
    });
    it("deve atualizar opção existente", async () => {
        const opcao = { id: 1, descricao: "Brasil campeão", status: "ATIVA" };
        const dados = { descricao: "Brasil Hexacampeão" };
        const opcaoAtualizada = { ...opcao, ...dados };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.update.mockResolvedValue(opcaoAtualizada);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.update(1, dados);
        expect(resultado).toEqual(opcaoAtualizada);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.update).toHaveBeenCalledWith(1, dados);
    });
    it("não deve atualizar opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.update(99, { status: "INATIVA" })).rejects.toThrow("Opção da campanha não encontrada");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover opção existente", async () => {
        const opcao = { id: 1, descricao: "Brasil campeão" };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.delete.mockResolvedValue(opcao);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.delete(1);
        expect(resultado).toEqual(opcao);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.delete(99)).rejects.toThrow("Opção da campanha não encontrada");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
    });
});
