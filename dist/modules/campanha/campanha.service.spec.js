"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const campanha_service_1 = require("./campanha.service");
const campanha_repo_1 = require("./campanha.repo");
jest.mock("./campanha.repo", () => ({
    campanhaRepository: {
        getAllByCriador: jest.fn(),
        getAllPublicas: jest.fn(),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
const admin = {
    id: 1,
    email: "admin@email.com",
    tipo_usuario: "administrador",
};
const cliente = {
    id: 2,
    email: "cliente@email.com",
    tipo_usuario: "cliente",
};
describe("campanhaService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve listar campanhas criadas pelo administrador", async () => {
        const campanhas = [
            {
                id: 1,
                nome: "Bolão Copa",
                criador_id: admin.id,
                status: "ATIVA",
                is_publica: true,
            },
        ];
        campanha_repo_1.campanhaRepository.getAllByCriador.mockResolvedValue(campanhas);
        const resultado = await campanha_service_1.campanhaService.getAll(admin);
        expect(resultado).toEqual(campanhas);
        expect(campanha_repo_1.campanhaRepository.getAllByCriador).toHaveBeenCalledWith(admin.id);
        expect(campanha_repo_1.campanhaRepository.getAllPublicas).not.toHaveBeenCalled();
    });
    it("deve listar campanhas públicas para cliente", async () => {
        const campanhas = [
            {
                id: 1,
                nome: "Bolão Copa",
                status: "ATIVA",
                is_publica: true,
            },
        ];
        campanha_repo_1.campanhaRepository.getAllPublicas.mockResolvedValue(campanhas);
        const resultado = await campanha_service_1.campanhaService.getAll(cliente);
        expect(resultado).toEqual(campanhas);
        expect(campanha_repo_1.campanhaRepository.getAllPublicas).toHaveBeenCalledTimes(1);
        expect(campanha_repo_1.campanhaRepository.getAllByCriador).not.toHaveBeenCalled();
    });
    it("deve buscar campanha por ID existente para administrador criador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: admin.id,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        const resultado = await campanha_service_1.campanhaService.getById(1, admin);
        expect(resultado).toEqual(campanha);
        expect(campanha_repo_1.campanhaRepository.getById).toHaveBeenCalledWith(1);
    });
    it("deve retornar erro ao buscar campanha inexistente", async () => {
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(null);
        await expect(campanha_service_1.campanhaService.getById(99, admin)).rejects.toThrow("Campanha não encontrada");
    });
    it("não deve permitir administrador acessar campanha de outro administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: 999,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        await expect(campanha_service_1.campanhaService.getById(1, admin)).rejects.toThrow("Você não tem permissão para acessar esta campanha");
    });
    it("deve permitir cliente acessar campanha pública e ativa", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: admin.id,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        const resultado = await campanha_service_1.campanhaService.getById(1, cliente);
        expect(resultado).toEqual(campanha);
    });
    it("não deve permitir cliente acessar campanha privada", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Privado",
            criador_id: admin.id,
            status: "ATIVA",
            is_publica: false,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        await expect(campanha_service_1.campanhaService.getById(1, cliente)).rejects.toThrow("Campanha não disponível");
    });
    it("deve criar campanha válida para administrador", async () => {
        const data = {
            nome: "Bolão Copa 2026",
            data_inicio: new Date("2026-06-01"),
            data_fim: new Date("2026-07-31"),
            tx_operacional: 10,
            valor_bolao: 50,
            is_publica: true,
            codigo_campanha: "COPA2026",
            status: "ATIVA",
        };
        const campanhaCriada = {
            id: 1,
            ...data,
            criador_id: admin.id,
        };
        campanha_repo_1.campanhaRepository.create.mockResolvedValue(campanhaCriada);
        const resultado = await campanha_service_1.campanhaService.create(data, admin);
        expect(resultado).toEqual(campanhaCriada);
        expect(campanha_repo_1.campanhaRepository.create).toHaveBeenCalledWith({
            ...data,
            criador_id: admin.id,
        });
    });
    it("não deve permitir cliente criar campanha", async () => {
        const data = {
            nome: "Bolão Copa 2026",
            data_inicio: new Date("2026-06-01"),
            data_fim: new Date("2026-07-31"),
            tx_operacional: 10,
            valor_bolao: 50,
            is_publica: true,
            codigo_campanha: "COPA2026",
            status: "ATIVA",
        };
        await expect(campanha_service_1.campanhaService.create(data, cliente)).rejects.toThrow("Apenas administradores podem criar campanhas");
        expect(campanha_repo_1.campanhaRepository.create).not.toHaveBeenCalled();
    });
    it("não deve criar campanha com data inicial maior que data final", async () => {
        const data = {
            nome: "Campanha inválida",
            data_inicio: new Date("2026-08-01"),
            data_fim: new Date("2026-07-01"),
            tx_operacional: 10,
            valor_bolao: 50,
            is_publica: true,
            codigo_campanha: "ERRADA",
            status: "ATIVA",
        };
        await expect(campanha_service_1.campanhaService.create(data, admin)).rejects.toThrow("A data de início deve ser anterior à data de fim");
        expect(campanha_repo_1.campanhaRepository.create).not.toHaveBeenCalled();
    });
    it("deve atualizar campanha do próprio administrador", async () => {
        const campanhaExistente = {
            id: 1,
            nome: "Bolão",
            criador_id: admin.id,
            status: "ATIVA",
            is_publica: true,
        };
        const dadosAtualizacao = {
            nome: "Bolão Atualizado",
        };
        const campanhaAtualizada = {
            ...campanhaExistente,
            ...dadosAtualizacao,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanhaExistente);
        campanha_repo_1.campanhaRepository.update.mockResolvedValue(campanhaAtualizada);
        const resultado = await campanha_service_1.campanhaService.update(1, dadosAtualizacao, admin);
        expect(resultado).toEqual(campanhaAtualizada);
        expect(campanha_repo_1.campanhaRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao);
    });
    it("não deve atualizar campanha inexistente", async () => {
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(null);
        await expect(campanha_service_1.campanhaService.update(99, { nome: "Teste" }, admin)).rejects.toThrow("Campanha não encontrada");
        expect(campanha_repo_1.campanhaRepository.update).not.toHaveBeenCalled();
    });
    it("não deve atualizar campanha de outro administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão",
            criador_id: 999,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        await expect(campanha_service_1.campanhaService.update(1, { nome: "Teste" }, admin)).rejects.toThrow("Você não tem permissão para editar esta campanha");
        expect(campanha_repo_1.campanhaRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover campanha do próprio administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: admin.id,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        campanha_repo_1.campanhaRepository.delete.mockResolvedValue(campanha);
        const resultado = await campanha_service_1.campanhaService.delete(1, admin);
        expect(resultado).toEqual(campanha);
        expect(campanha_repo_1.campanhaRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover campanha inexistente", async () => {
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(null);
        await expect(campanha_service_1.campanhaService.delete(99, admin)).rejects.toThrow("Campanha não encontrada");
        expect(campanha_repo_1.campanhaRepository.delete).not.toHaveBeenCalled();
    });
    it("não deve remover campanha de outro administrador", async () => {
        const campanha = {
            id: 1,
            nome: "Bolão Copa",
            criador_id: 999,
            status: "ATIVA",
            is_publica: true,
        };
        campanha_repo_1.campanhaRepository.getById.mockResolvedValue(campanha);
        await expect(campanha_service_1.campanhaService.delete(1, admin)).rejects.toThrow("Você não tem permissão para excluir esta campanha");
        expect(campanha_repo_1.campanhaRepository.delete).not.toHaveBeenCalled();
    });
});
