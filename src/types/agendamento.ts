import { ReactNode } from "react";

export type Empresa = {
  id: string;
  nome_fantasia: string;
};

export type Profissional = {
  id: string;
  nome: string;
  especialidade?: string;
};

export type Agendamento = {
  paciente: ReactNode;
  id: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
  data_sugerida: string;
  tipo_servico: string;
  empresas?: {
    nome_fantasia: string;
  };
  profissionais?: {
    nome: string;
  };
};


export type EscalaMedica = {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  profissional_id: string;
  profissionais?: Profissional;
};
