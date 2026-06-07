"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_service_1 = require("./usuario.service");
const usuario_repo_1 = require("./usuario.repo");
jest.mock("./usuario.repo", () => ({
    usuarioRepository: {
        getAll: jest.fn(),
        getById: jest.fn(),
        getByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
describe("usuarioService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve listar usuários", async () => {
        const usuariosMock = [
            {
                id: 1,
                nome: "Maria Silva",
                email: "maria@email.com",
                cpf: "12345678901",
                senha: "senha1234",
                telefone: "34999999999",
                tipo_usuario: "cliente",
                status: "ativo",
            },
        ];
        usuario_repo_1.usuarioRepository.getAll.mockResolvedValue(usuariosMock);
        const resultado = await usuario_service_1.usuarioService.getAll();
        expect(resultado).toEqual(usuariosMock);
        expect(usuario_repo_1.usuarioRepository.getAll).toHaveBeenCalledTimes(1);
    });
    it("deve buscar usuário por ID existente", async () => {
        const usuario = {
            id: 1,
            nome: "Maria Silva",
            email: "maria@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.getById(1);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.getById).toHaveBeenCalledWith(1);
    });
    it("deve retornar erro ao buscar usuário inexistente", async () => {
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(null);
        await expect(usuario_service_1.usuarioService.getById(99)).rejects.toThrow("Usuário não encontrado");
    });
    it("deve criar usuário quando e-mail não existe", async () => {
        const novoUsuario = {
            nome: "Carlos Silva",
            email: "carlos@email.com",
            senha: "12345678",
            cpf: "11122233344",
            telefone: "34999999999",
            tipo_usuario: "cliente",
            status: "ativo",
        };
        const usuarioCriado = {
            id: 1,
            ...novoUsuario,
        };
        usuario_repo_1.usuarioRepository.getByEmail.mockResolvedValue(null);
        usuario_repo_1.usuarioRepository.create.mockResolvedValue(usuarioCriado);
        const resultado = await usuario_service_1.usuarioService.create(novoUsuario);
        expect(resultado).toEqual(usuarioCriado);
        expect(usuario_repo_1.usuarioRepository.getByEmail).toHaveBeenCalledWith(novoUsuario.email);
        expect(usuario_repo_1.usuarioRepository.create).toHaveBeenCalledWith(novoUsuario);
    });
    it("não deve criar usuário com e-mail já cadastrado", async () => {
        const usuario = {
            nome: "Carlos Silva",
            email: "carlos@email.com",
            senha: "12345678",
            cpf: "11122233344",
            tipo_usuario: "cliente",
            status: "ativo",
        };
        const usuarioExistente = {
            id: 1,
            ...usuario,
        };
        usuario_repo_1.usuarioRepository.getByEmail.mockResolvedValue(usuarioExistente);
        await expect(usuario_service_1.usuarioService.create(usuario)).rejects.toThrow("E-mail já cadastrado");
        expect(usuario_repo_1.usuarioRepository.create).not.toHaveBeenCalled();
    });
    it("não deve atualizar usuário com e-mail de outro usuário", async () => {
        const usuarioAtual = {
            id: 1,
            nome: "Usuário Atual",
            email: "atual@email.com",
        };
        const outroUsuario = {
            id: 2,
            nome: "Outro Usuário",
            email: "outro@email.com",
        };
        const dadosAtualizacao = {
            email: "outro@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuarioAtual);
        usuario_repo_1.usuarioRepository.getByEmail.mockResolvedValue(outroUsuario);
        await expect(usuario_service_1.usuarioService.update(1, dadosAtualizacao)).rejects.toThrow("E-mail já utilizado por outro usuário");
        expect(usuario_repo_1.usuarioRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover usuário existente", async () => {
        const usuario = {
            id: 1,
            nome: "Maria Silva",
            email: "maria@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        usuario_repo_1.usuarioRepository.delete.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.delete(1);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.delete).toHaveBeenCalledWith(1);
    });
    it("não deve remover usuário inexistente", async () => {
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(null);
        await expect(usuario_service_1.usuarioService.delete(99)).rejects.toThrow("Usuário não encontrado");
        expect(usuario_repo_1.usuarioRepository.delete).not.toHaveBeenCalled();
    });
});
