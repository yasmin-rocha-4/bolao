"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const campanha_opcoes_service_1 = require("./campanha.opcoes.service");
const campanha_opcoes_repo_1 = require("./campanha.opcoes.repo");
const campanha_repo_1 = require("../campanha/campanha.repo");
jest.mock("./campanha.opcoes.repo", () => ({
    campanhaOpcoesRepository: {
        getAllByAdmin: jest.fn(),
        getAllPublicas: jest.fn(),
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
const admin = {
    id: 1,
    email: "admin@email.com",
    tipo_usuario: "administrador",
};
const outroAdmin = {
    id: 2,
    email: "outroadmin@email.com",
    tipo_usuario: "administrador",
};
const cliente = {
    id: 3,
    email: "cliente@email.com",
    tipo_usuario: "cliente",
};
describe("campanhaOpcoesService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve listar opções das campanhas do administrador", async () => {
        const opcoes = [
            {
                id: 1,
                descricao: "Brasil campeão",
                status: "ATIVA",
                campanha: {
                    id: 1,
                    criador_id: admin.id,
                },
            },
        ];
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllByAdmin.mockResolvedValue(opcoes);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getAll(admin);
        expect(resultado).toEqual(opcoes);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllByAdmin).toHaveBeenCalledWith(admin.id);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllPublicas).not.toHaveBeenCalled();
    });
    it("deve listar opções públicas para cliente", async () => {
        const opcoes = [
            {
                id: 1,
                descricao: "Brasil campeão",
                status: "ATIVA",
            },
        ];
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllPublicas.mockResolvedValue(opcoes);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getAll(cliente);
        expect(resultado).toEqual(opcoes);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllPublicas).toHaveBeenCalledTimes(1);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getAllByAdmin).not.toHaveBeenCalled();
    });
    it("deve buscar opção por ID existente do próprio administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            campanha: {
                id: 1,
                criador_id: admin.id,
                is_publica: true,
                status: "ATIVA",
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getById(1, admin);
        expect(resultado).toEqual(opcao);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.getById).toHaveBeenCalledWith(1);
    });
    it("não deve permitir administrador acessar opção de outro administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Argentina campeã",
            status: "ATIVA",
            campanha: {
                id: 1,
                criador_id: outroAdmin.id,
                is_publica: true,
                status: "ATIVA",
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.getById(1, admin)).rejects.toThrow("Você não tem permissão para acessar esta opção");
    });
    it("deve permitir cliente acessar opção ativa de campanha pública ativa", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            campanha: {
                id: 1,
                criador_id: admin.id,
                is_publica: true,
                status: "ATIVA",
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.getById(1, cliente);
        expect(resultado).toEqual(opcao);
    });
    it("não deve permitir cliente acessar opção indisponível", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            status: "INATIVA",
            campanha: {
                id: 1,
                criador_id: admin.id,
                is_publica: true,
                status: "ATIVA",
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.getById(1, cliente)).rejects.toThrow("Opção não disponível");
    });
    it("deve retornar erro ao buscar opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.getById(99, admin)).rejects.toThrow("Opção da campanha não encontrada");
    });
    it("deve criar opção em campanha do próprio administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: admin.id,
        };
        const data = {
            campanha_id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        const opcaoCriada = { id: 1, ...data };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.create.mockResolvedValue(opcaoCriada);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.create(data, admin);
        expect(resultado).toEqual(opcaoCriada);
        expect(campanha_repo_1.campanhaRepository.getById).toHaveBeenCalledWith(1);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).toHaveBeenCalledWith(data);
    });
    it("não deve permitir cliente criar opção", async () => {
        const data = {
            campanha_id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.create(data, cliente)).rejects.toThrow("Apenas administradores podem criar opções");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).not.toHaveBeenCalled();
    });
    it("não deve criar opção quando campanha não existe", async () => {
        const data = {
            campanha_id: 999,
            descricao: "Argentina campeã",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.create(data, admin)).rejects.toThrow("Campanha não encontrada");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).not.toHaveBeenCalled();
    });
    it("não deve criar opção em campanha de outro administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: outroAdmin.id,
        };
        const data = {
            campanha_id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            eh_resultado_final: false,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.create(data, admin)).rejects.toThrow("Você não tem permissão para criar opção nesta campanha");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.create).not.toHaveBeenCalled();
    });
    it("deve atualizar opção existente do próprio administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            campanha: {
                id: 1,
                criador_id: admin.id,
            },
        };
        const dados = { descricao: "Brasil Hexacampeão" };
        const opcaoAtualizada = { ...opcao, ...dados };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.update.mockResolvedValue(opcaoAtualizada);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.update(1, dados, admin);
        expect(resultado).toEqual(opcaoAtualizada);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.update).toHaveBeenCalledWith(1, dados);
    });
    it("não deve atualizar opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.update(99, { status: "INATIVA" }, admin)).rejects.toThrow("Opção da campanha não encontrada");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.update).not.toHaveBeenCalled();
    });
    it("não deve atualizar opção de outro administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            status: "ATIVA",
            campanha: {
                id: 1,
                criador_id: outroAdmin.id,
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.update(1, { status: "INATIVA" }, admin)).rejects.toThrow("Você não tem permissão para alterar esta opção");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover opção existente do próprio administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            campanha: {
                id: 1,
                criador_id: admin.id,
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        campanha_opcoes_repo_1.campanhaOpcoesRepository.delete.mockResolvedValue(opcao);
        const resultado = await campanha_opcoes_service_1.campanhaOpcoesService.delete(1, admin);
        expect(resultado).toEqual(opcao);
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover opção inexistente", async () => {
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(null);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.delete(99, admin)).rejects.toThrow("Opção da campanha não encontrada");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
    });
    it("não deve remover opção de outro administrador", async () => {
        const opcao = {
            id: 1,
            descricao: "Brasil campeão",
            campanha: {
                id: 1,
                criador_id: outroAdmin.id,
            },
        };
        campanha_opcoes_repo_1.campanhaOpcoesRepository.getById.mockResolvedValue(opcao);
        await expect(campanha_opcoes_service_1.campanhaOpcoesService.delete(1, admin)).rejects.toThrow("Você não tem permissão para excluir esta opção");
        expect(campanha_opcoes_repo_1.campanhaOpcoesRepository.delete).not.toHaveBeenCalled();
    });
});
