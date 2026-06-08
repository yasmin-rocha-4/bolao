export interface CampanhaOpcao {
  id: number;
  campanha_id: number;
  descricao: string;
  status: string;
  eh_resultado_final: boolean;
}

export interface CampanhaOpcaoForm {
  campanha_id: number;
  descricao: string;
  status: string;
  eh_resultado_final: boolean;
}
