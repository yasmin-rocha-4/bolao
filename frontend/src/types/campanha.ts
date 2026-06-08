export interface Campanha {
  id: number;
  nome: string;
  data_inicio: string;
  data_fim: string;
  tx_operacional: string;
  valor_bolao: string;
  is_publica: boolean;
  codigo_campanha: string;
  status: string;
}

export interface CampanhaForm {
  nome: string;
  data_inicio: string;
  data_fim: string;
  tx_operacional: number;
  valor_bolao: number;
  is_publica: boolean;
  codigo_campanha: string;
  status: string;
}
