export interface Aposta {
  id: number;
  usuario_id: number;
  campanha_opcao_id: number;
  status: string;
  meio_pagamento: string;
  comprovante?: string;
  dt_criacao: string;

  usuario?: {
    id: number;
    nome: string;
    email: string;
  };

  campanhaOpcao?: {
    id: number;
    descricao: string;
    campanha?: {
      id: number;
      nome: string;
    };
  };
}

export interface ApostaForm {
  usuario_id: number;
  campanha_opcao_id: number;
  meio_pagamento: string;
  status: string;
  comprovante?: string;
}
