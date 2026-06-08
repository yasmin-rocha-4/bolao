"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aposta_service_1 = require("./aposta.service");
const aposta_repo_1 = require("./aposta.repo");
jest.mock("./aposta.repo", () => ({
    apostaRepository: {
        getAll: jest.fn(),
        getById: jest.fn(),
        getCampanhaOpcaoById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
describe("apostaService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve criar aposta quando campanha e opção são válidas", async () => {
        const data = {
            usuario_id: 1,
            campanha_opcao_id: 1,
            meio_pagamento: "PIX",
            status: "PENDENTE",
            comprovante: "pix.png",
        };
        const opcao = {
            id: 1,
            status: "ATIVA",
            campanha: {
                is_publica: true,
                data_inicio: new Date("2026-01-01"),
                data_fim: new Date("2026-12-31"),
            },
        };
        const apostaCriada = {
            id: 1,
            ...data,
        };
        aposta_repo_1.apostaRepository.getCampanhaOpcaoById.mockResolvedValue(opcao);
        aposta_repo_1.apostaRepository.create.mockResolvedValue(apostaCriada);
        const resultado = await aposta_service_1.apostaService.create(data);
        expect(resultado).toEqual(apostaCriada);
        expect(aposta_repo_1.apostaRepository.create).toHaveBeenCalledWith(data);
    });
    it("não deve criar aposta se opção estiver inativa", async () => {
        const data = {
            usuario_id: 1,
            campanha_opcao_id: 1,
            meio_pagamento: "PIX",
            status: "PENDENTE",
        };
        const opcao = {
            id: 1,
            status: "INATIVA",
            campanha: {
                is_publica: true,
                data_inicio: new Date("2026-01-01"),
                data_fim: new Date("2026-12-31"),
            },
        };
        aposta_repo_1.apostaRepository.getCampanhaOpcaoById.mockResolvedValue(opcao);
        await expect(aposta_service_1.apostaService.create(data)).rejects.toThrow("Essa opção está inativa");
        expect(aposta_repo_1.apostaRepository.create).not.toHaveBeenCalled();
    });
    it("não deve criar aposta se campanha for privada", async () => {
        const data = {
            usuario_id: 1,
            campanha_opcao_id: 1,
            meio_pagamento: "PIX",
            status: "PENDENTE",
        };
        const opcao = {
            id: 1,
            status: "ATIVA",
            campanha: {
                is_publica: false,
                data_inicio: new Date("2026-01-01"),
                data_fim: new Date("2026-12-31"),
            },
        };
        aposta_repo_1.apostaRepository.getCampanhaOpcaoById.mockResolvedValue(opcao);
        await expect(aposta_service_1.apostaService.create(data)).rejects.toThrow("Esta campanha é privada");
        expect(aposta_repo_1.apostaRepository.create).not.toHaveBeenCalled();
    });
    it("deve listar apostas", async () => {
        const apostas = [{ id: 1, status: "PENDENTE", meio_pagamento: "PIX" }];
        aposta_repo_1.apostaRepository.getAll.mockResolvedValue(apostas);
        const resultado = await aposta_service_1.apostaService.getAll();
        expect(resultado).toEqual(apostas);
        expect(aposta_repo_1.apostaRepository.getAll).toHaveBeenCalledTimes(1);
    });
    it("deve buscar aposta por ID existente", async () => {
        const aposta = {
            id: 1,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    data_fim: new Date("2026-12-31"),
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        const resultado = await aposta_service_1.apostaService.getById(1);
        expect(resultado).toEqual(aposta);
        expect(aposta_repo_1.apostaRepository.getById).toHaveBeenCalledWith(1);
    });
    it("deve retornar erro ao buscar aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.getById(99)).rejects.toThrow("Aposta não encontrada");
    });
    it("deve atualizar aposta existente", async () => {
        const apostaExistente = {
            id: 1,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    data_fim: new Date("2026-12-31"),
                },
            },
        };
        const dados = { status: "CONFIRMADA" };
        const apostaAtualizada = { ...apostaExistente, ...dados };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(apostaExistente);
        aposta_repo_1.apostaRepository.update.mockResolvedValue(apostaAtualizada);
        const resultado = await aposta_service_1.apostaService.update(1, dados);
        expect(resultado).toEqual(apostaAtualizada);
        expect(aposta_repo_1.apostaRepository.update).toHaveBeenCalledWith(1, dados);
    });
    it("não deve atualizar aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.update(99, { status: "CONFIRMADA" })).rejects.toThrow("Aposta não encontrada");
        expect(aposta_repo_1.apostaRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover aposta existente", async () => {
        const aposta = {
            id: 1,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    data_fim: new Date("2026-12-31"),
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        aposta_repo_1.apostaRepository.delete.mockResolvedValue(aposta);
        const resultado = await aposta_service_1.apostaService.delete(1);
        expect(resultado).toEqual(aposta);
        expect(aposta_repo_1.apostaRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.delete(99)).rejects.toThrow("Aposta não encontrada");
        expect(aposta_repo_1.apostaRepository.delete).not.toHaveBeenCalled();
    });
});
