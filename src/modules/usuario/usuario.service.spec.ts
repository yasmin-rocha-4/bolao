import { usuarioService } from "./usuario.service";
import { usuarioRepository } from "./usuario.repo";

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

    (usuarioRepository.getAll as jest.Mock).mockResolvedValue(usuariosMock);

    const resultado = await usuarioService.getAll();

    expect(resultado).toEqual(usuariosMock);
    expect(usuarioRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it("deve buscar usuário por ID existente", async () => {
    const usuario = {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
    };

    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuario);

    const resultado = await usuarioService.getById(1);

    expect(resultado).toEqual(usuario);
    expect(usuarioRepository.getById).toHaveBeenCalledWith(1);
  });

  it("deve retornar erro ao buscar usuário inexistente", async () => {
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(usuarioService.getById(99)).rejects.toThrow(
      "Usuário não encontrado",
    );
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

    (usuarioRepository.getByEmail as jest.Mock).mockResolvedValue(null);
    (usuarioRepository.create as jest.Mock).mockResolvedValue(usuarioCriado);

    const resultado = await usuarioService.create(novoUsuario);

    expect(resultado).toEqual(usuarioCriado);
    expect(usuarioRepository.getByEmail).toHaveBeenCalledWith(
      novoUsuario.email,
    );
    expect(usuarioRepository.create).toHaveBeenCalledWith(
  expect.objectContaining({
    nome: novoUsuario.nome,
    email: novoUsuario.email,
    cpf: novoUsuario.cpf,
    telefone: novoUsuario.telefone,
    tipo_usuario: "cliente",
    status: "ativo",
  }),
);

expect(usuarioRepository.create).toHaveBeenCalledWith(
  expect.objectContaining({
    senha: expect.stringMatching(/^\$2[aby]\$/),
  }),
);
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

    (usuarioRepository.getByEmail as jest.Mock).mockResolvedValue(
      usuarioExistente,
    );

    await expect(usuarioService.create(usuario)).rejects.toThrow(
      "E-mail já cadastrado",
    );

    expect(usuarioRepository.create).not.toHaveBeenCalled();
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

    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuarioAtual);
    (usuarioRepository.getByEmail as jest.Mock).mockResolvedValue(outroUsuario);

    await expect(usuarioService.update(1, dadosAtualizacao)).rejects.toThrow(
      "E-mail já utilizado por outro usuário",
    );

    expect(usuarioRepository.update).not.toHaveBeenCalled();
  });

  it("deve remover usuário existente", async () => {
    const usuario = {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
    };

    (usuarioRepository.getById as jest.Mock).mockResolvedValue(usuario);
    (usuarioRepository.delete as jest.Mock).mockResolvedValue(usuario);

    const resultado = await usuarioService.delete(1);

    expect(resultado).toEqual(usuario);
    expect(usuarioRepository.delete).toHaveBeenCalledWith(1);
  });

  it("não deve remover usuário inexistente", async () => {
    (usuarioRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(usuarioService.delete(99)).rejects.toThrow(
      "Usuário não encontrado",
    );

    expect(usuarioRepository.delete).not.toHaveBeenCalled();
  });
});
