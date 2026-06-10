"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aposta_service_1 = require("./aposta.service");
const aposta_repo_1 = require("./aposta.repo");
jest.mock("./aposta.repo", () => ({
    apostaRepository: {
        getAllByUsuario: jest.fn(),
        getAllByAdmin: jest.fn(),
        getById: jest.fn(),
        getCampanhaOpcaoById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
const cliente = {
    id: 1,
    email: "cliente@email.com",
    tipo_usuario: "cliente",
};
const admin = {
    id: 2,
    email: "admin@email.com",
    tipo_usuario: "administrador",
};
describe("apostaService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve criar aposta usando o usuário logado", async () => {
        const data = {
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
            usuario_id: cliente.id,
        };
        aposta_repo_1.apostaRepository.getCampanhaOpcaoById.mockResolvedValue(opcao);
        aposta_repo_1.apostaRepository.create.mockResolvedValue(apostaCriada);
        const resultado = await aposta_service_1.apostaService.create(data, cliente);
        expect(resultado).toEqual(apostaCriada);
        expect(aposta_repo_1.apostaRepository.create).toHaveBeenCalledWith({
            ...data,
            usuario_id: cliente.id,
        });
    });
    it("não deve criar aposta se opção estiver inativa", async () => {
        const data = {
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
        await expect(aposta_service_1.apostaService.create(data, cliente)).rejects.toThrow("Essa opção está inativa");
        expect(aposta_repo_1.apostaRepository.create).not.toHaveBeenCalled();
    });
    it("não deve criar aposta se campanha for privada", async () => {
        const data = {
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
        await expect(aposta_service_1.apostaService.create(data, cliente)).rejects.toThrow("Esta campanha é privada");
        expect(aposta_repo_1.apostaRepository.create).not.toHaveBeenCalled();
    });
    it("deve listar apostas do cliente logado", async () => {
        const apostas = [{ id: 1, usuario_id: cliente.id, status: "PENDENTE" }];
        aposta_repo_1.apostaRepository.getAllByUsuario.mockResolvedValue(apostas);
        const resultado = await aposta_service_1.apostaService.getAll(cliente);
        expect(resultado).toEqual(apostas);
        expect(aposta_repo_1.apostaRepository.getAllByUsuario).toHaveBeenCalledWith(cliente.id);
        expect(aposta_repo_1.apostaRepository.getAllByAdmin).not.toHaveBeenCalled();
    });
    it("deve listar apostas das campanhas do administrador", async () => {
        const apostas = [{ id: 1, status: "PENDENTE" }];
        aposta_repo_1.apostaRepository.getAllByAdmin.mockResolvedValue(apostas);
        const resultado = await aposta_service_1.apostaService.getAll(admin);
        expect(resultado).toEqual(apostas);
        expect(aposta_repo_1.apostaRepository.getAllByAdmin).toHaveBeenCalledWith(admin.id);
        expect(aposta_repo_1.apostaRepository.getAllByUsuario).not.toHaveBeenCalled();
    });
    it("deve buscar aposta própria do cliente", async () => {
        const aposta = {
            id: 1,
            usuario_id: cliente.id,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: admin.id,
                    data_fim: new Date("2026-12-31"),
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        const resultado = await aposta_service_1.apostaService.getById(1, cliente);
        expect(resultado).toEqual(aposta);
        expect(aposta_repo_1.apostaRepository.getById).toHaveBeenCalledWith(1);
    });
    it("não deve permitir cliente acessar aposta de outro usuário", async () => {
        const aposta = {
            id: 1,
            usuario_id: 999,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: admin.id,
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        await expect(aposta_service_1.apostaService.getById(1, cliente)).rejects.toThrow("Você não tem permissão para acessar esta aposta");
    });
    it("deve permitir administrador acessar aposta da própria campanha", async () => {
        const aposta = {
            id: 1,
            usuario_id: cliente.id,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: admin.id,
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        const resultado = await aposta_service_1.apostaService.getById(1, admin);
        expect(resultado).toEqual(aposta);
    });
    it("não deve permitir administrador acessar aposta de outra campanha", async () => {
        const aposta = {
            id: 1,
            usuario_id: cliente.id,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: 999,
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        await expect(aposta_service_1.apostaService.getById(1, admin)).rejects.toThrow("Você não tem permissão para acessar esta aposta");
    });
    it("deve retornar erro ao buscar aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.getById(99, cliente)).rejects.toThrow("Aposta não encontrada");
    });
    it("deve atualizar aposta própria do cliente", async () => {
        const apostaExistente = {
            id: 1,
            usuario_id: cliente.id,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: admin.id,
                },
            },
        };
        const dados = { status: "CONFIRMADA" };
        const apostaAtualizada = { ...apostaExistente, ...dados };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(apostaExistente);
        aposta_repo_1.apostaRepository.update.mockResolvedValue(apostaAtualizada);
        const resultado = await aposta_service_1.apostaService.update(1, dados, cliente);
        expect(resultado).toEqual(apostaAtualizada);
        expect(aposta_repo_1.apostaRepository.update).toHaveBeenCalledWith(1, dados);
    });
    it("não deve atualizar aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.update(99, { status: "CONFIRMADA" }, cliente)).rejects.toThrow("Aposta não encontrada");
        expect(aposta_repo_1.apostaRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover aposta própria do cliente", async () => {
        const aposta = {
            id: 1,
            usuario_id: cliente.id,
            status: "PENDENTE",
            campanhaOpcao: {
                campanha: {
                    criador_id: admin.id,
                },
            },
        };
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(aposta);
        aposta_repo_1.apostaRepository.delete.mockResolvedValue(aposta);
        const resultado = await aposta_service_1.apostaService.delete(1, cliente);
        expect(resultado).toEqual(aposta);
        expect(aposta_repo_1.apostaRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover aposta inexistente", async () => {
        aposta_repo_1.apostaRepository.getById.mockResolvedValue(null);
        await expect(aposta_service_1.apostaService.delete(99, cliente)).rejects.toThrow("Aposta não encontrada");
        expect(aposta_repo_1.apostaRepository.delete).not.toHaveBeenCalled();
    });
});
