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
const admin = {
    id: 10,
    email: "admin@email.com",
    tipo_usuario: "administrador",
};
const cliente = {
    id: 1,
    email: "cliente@email.com",
    tipo_usuario: "cliente",
};
describe("usuarioService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve listar usuários quando for administrador", async () => {
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
        const resultado = await usuario_service_1.usuarioService.getAll(admin);
        expect(resultado).toEqual(usuariosMock);
        expect(usuario_repo_1.usuarioRepository.getAll).toHaveBeenCalledTimes(1);
    });
    it("não deve permitir cliente listar todos os usuários", async () => {
        await expect(usuario_service_1.usuarioService.getAll(cliente)).rejects.toThrow("Apenas administradores podem listar usuários.");
        expect(usuario_repo_1.usuarioRepository.getAll).not.toHaveBeenCalled();
    });
    it("deve buscar próprio usuário por ID", async () => {
        const usuario = {
            id: 1,
            nome: "Maria Silva",
            email: "maria@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.getById(1, cliente);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.getById).toHaveBeenCalledWith(1);
    });
    it("deve permitir administrador buscar qualquer usuário por ID", async () => {
        const usuario = {
            id: 2,
            nome: "Carlos Silva",
            email: "carlos@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.getById(2, admin);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.getById).toHaveBeenCalledWith(2);
    });
    it("não deve permitir cliente acessar perfil de outro usuário", async () => {
        await expect(usuario_service_1.usuarioService.getById(99, cliente)).rejects.toThrow("Você só pode acessar o seu próprio perfil.");
        expect(usuario_repo_1.usuarioRepository.getById).not.toHaveBeenCalled();
    });
    it("deve retornar erro ao buscar usuário inexistente", async () => {
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(null);
        await expect(usuario_service_1.usuarioService.getById(99, admin)).rejects.toThrow("Usuário não encontrado.");
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
        expect(usuario_repo_1.usuarioRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            cpf: novoUsuario.cpf,
            telefone: novoUsuario.telefone,
            tipo_usuario: "cliente",
            status: "ativo",
        }));
        expect(usuario_repo_1.usuarioRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            senha: expect.stringMatching(/^\$2[aby]\$/),
        }));
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
        await expect(usuario_service_1.usuarioService.create(usuario)).rejects.toThrow("E-mail já cadastrado.");
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
        await expect(usuario_service_1.usuarioService.update(1, dadosAtualizacao, cliente)).rejects.toThrow("E-mail já utilizado por outro usuário.");
        expect(usuario_repo_1.usuarioRepository.update).not.toHaveBeenCalled();
    });
    it("deve atualizar próprio usuário", async () => {
        const usuarioAtual = {
            id: 1,
            nome: "Maria Silva",
            email: "maria@email.com",
        };
        const dadosAtualizacao = {
            nome: "Maria Atualizada",
        };
        const usuarioAtualizado = {
            ...usuarioAtual,
            ...dadosAtualizacao,
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuarioAtual);
        usuario_repo_1.usuarioRepository.update.mockResolvedValue(usuarioAtualizado);
        const resultado = await usuario_service_1.usuarioService.update(1, dadosAtualizacao, cliente);
        expect(resultado).toEqual(usuarioAtualizado);
        expect(usuario_repo_1.usuarioRepository.update).toHaveBeenCalledWith(1, dadosAtualizacao);
    });
    it("não deve permitir cliente atualizar outro usuário", async () => {
        await expect(usuario_service_1.usuarioService.update(99, { nome: "Teste" }, cliente)).rejects.toThrow("Você só pode editar o seu próprio perfil.");
        expect(usuario_repo_1.usuarioRepository.update).not.toHaveBeenCalled();
    });
    it("deve remover próprio usuário existente", async () => {
        const usuario = {
            id: 1,
            nome: "Maria Silva",
            email: "maria@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        usuario_repo_1.usuarioRepository.delete.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.delete(1, cliente);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.delete).toHaveBeenCalledWith(1);
    });
    it("deve permitir administrador remover qualquer usuário existente", async () => {
        const usuario = {
            id: 2,
            nome: "Carlos Silva",
            email: "carlos@email.com",
        };
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(usuario);
        usuario_repo_1.usuarioRepository.delete.mockResolvedValue(usuario);
        const resultado = await usuario_service_1.usuarioService.delete(2, admin);
        expect(resultado).toEqual(usuario);
        expect(usuario_repo_1.usuarioRepository.delete).toHaveBeenCalledWith(2);
    });
    it("não deve permitir cliente remover outro usuário", async () => {
        await expect(usuario_service_1.usuarioService.delete(99, cliente)).rejects.toThrow("Você só pode excluir o seu próprio perfil.");
        expect(usuario_repo_1.usuarioRepository.delete).not.toHaveBeenCalled();
    });
    it("não deve remover usuário inexistente", async () => {
        usuario_repo_1.usuarioRepository.getById.mockResolvedValue(null);
        await expect(usuario_service_1.usuarioService.delete(99, admin)).rejects.toThrow("Usuário não encontrado.");
        expect(usuario_repo_1.usuarioRepository.delete).not.toHaveBeenCalled();
    });
});
