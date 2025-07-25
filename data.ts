export const Dados = [
  {
    id: 1,
    tipo: 1,
    nome: "João Pedro",
    status: "Concluído",
    aprovacao: "Reprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/03/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Carlos Silva",
        funcao: "Supervisor",
        cpf: "111.111.111-11",
        descricao: "Descrição gerada automaticamente"
      },
      {
        id: 2,
        nome: "Ana Oliveira",
        funcao: "Técnico de Qualidade",
        cpf: "222.222.222-22",
        descricao: null
      },
      {
        id: 3,
        nome: "Pedro Santos",
        funcao: "Operador",
        cpf: "333.333.333-33",
        descricao: null
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.315000,
      longitude: -40.305000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 2,
    tipo: 1,
    nome: "Maria Souza",
    status: "Concluído",
    aprovacao: "Reprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/03/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: {
      pessoas: [
        {
          id: 1,
          nome: "Fernando Costa",
          funcao: "Gerente",
          cpf: "444.444.444-44",
          descricao: null
        },
        {
          id: 2,
          nome: "Juliana Pereira",
          funcao: "Analista",
          cpf: "555.555.555-55",
          descricao: "Descrição gerada automaticamente"
        },
        {
          id: 3,
          nome: "Ricardo Almeida",
          funcao: "Assistente",
          cpf: "666.666.666-66",
          descricao: "Descrição gerada automaticamente"
        },
      ],
      imagem: require("./assets/images/atestado.png"),
      descricao: "Descrição não disponível",
      motivo: "Atestado",
    },
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.325000,
      longitude: -40.295000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 3,
    tipo: 1,
    nome: "José Lima",
    status: "Concluído",
    aprovacao: "Aprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/04/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Patrícia Gomes",
        funcao: "Coordenadora",
        cpf: "777.777.777-77",
        descricao: null
      },
      {
        id: 2,
        nome: "Marcos Ribeiro",
        funcao: "Inspetor",
        cpf: "888.888.888-88",
        descricao: null
      },
      {
        id: 3,
        nome: "Camila Ferreira",
        funcao: "Auxiliar",
        cpf: "999.999.999-99",
        descricao: "Descrição gerada automaticamente"
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.305000,
      longitude: -40.315000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 4,
    tipo: 1,
    nome: "Ana Carolina",
    status: "Concluído",
    aprovacao: "Aprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/04/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: {
      pessoas: [
        {
          id: 1,
          nome: "Roberto Nunes",
          funcao: "Diretor",
          cpf: "101.101.101-10",
          descricao: null
        },
        {
          id: 2,
          nome: "Tatiana Martins",
          funcao: "Supervisora",
          cpf: "202.202.202-20",
          descricao: "Descrição gerada automaticamente"
        },
        {
          id: 3,
          nome: "Lucas Barbosa",
          funcao: "Técnico",
          cpf: "303.303.303-30",
          descricao: null
        },
      ],
      imagem: require("./assets/images/atestado.png"),
      descricao: "Descrição não disponível",
      motivo: "Atestado",
    },
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.335000,
      longitude: -40.285000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 5,
    tipo: 1,
    nome: "Paulo Henrique",
    status: "Pendente",
    aprovacao: null,
    dataAprovacao: null,
    data: "05/05/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: null,
    horaConclusao: null,
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Daniela Cunha",
        funcao: "Engenheira",
        cpf: "404.404.404-40",
        descricao: "Descrição gerada automaticamente"
      },
      {
        id: 2,
        nome: "Felipe Ramos",
        funcao: "Consultor",
        cpf: "505.505.505-50",
        descricao: "Descrição gerada automaticamente"
      },
      {
        id: 3,
        nome: "Vanessa Soares",
        funcao: "Assessora",
        cpf: "606.606.606-60",
        descricao: "Descrição gerada automaticamente"
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.300000,
      longitude: -40.320000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 6,
    tipo: 1,
    nome: "Fernanda Oliveira",
    status: "Aberto",
    aprovacao: null,
    dataAprovacao: null,
    data: "05/05/2025",
    hora: "13:40",
    peso: "320 g",
    Material: "Poeira de Sílica",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: null,
    horaConclusao: null,
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Gustavo Henrique",
        funcao: "Auditor",
        cpf: "707.707.707-70",
        descricao: null
      },
      {
        id: 2,
        nome: "Isabela Santos",
        funcao: "Coordenadora",
        cpf: "808.808.808-80",
        descricao: null
      },
      {
        id: 3,
        nome: "Rodrigo Pereira",
        funcao: "Especialista",
        cpf: "909.909.909-90",
        descricao: "Descrição gerada automaticamente"
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.340000,
      longitude: -40.280000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 7,
    tipo: 2,
    nome: "Rafaela Costa",
    status: "Grave",
    aprovacao: "Reprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/06/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Leonardo Dias",
        funcao: "Gestor",
        cpf: "010.010.010-01",
        descricao: "Descrição gerada automaticamente"
      },
      {
        id: 2,
        nome: "Mariana Lopes",
        funcao: "Analista Sênior",
        cpf: "020.020.020-02",
        descricao: null
      },
      {
        id: 3,
        nome: "Thiago Miranda",
        funcao: "Supervisor",
        cpf: "030.030.030-03",
        descricao: null
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.350000,
      longitude: -40.330000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 8,
    tipo: 2,
    nome: "Bruno Carvalho",
    status: "Leve",
    aprovacao: "Reprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/06/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: {
      pessoas: [
        {
          id: 1,
          nome: "Carla Mendes",
          funcao: "Diretora",
          cpf: "040.040.040-04",
          descricao: null
        },
        {
          id: 2,
          nome: "Eduardo Silva",
          funcao: "Gerente",
          cpf: "050.050.050-05",
          descricao: "Descrição gerada automaticamente"
        },
        {
          id: 3,
          nome: "Patrícia Lima",
          funcao: "Coordenadora",
          cpf: "060.060.060-06",
          descricao: null
        },
      ],
      imagem: require("./assets/images/atestado.png"),
      descricao: "Descrição não disponível",
      motivo: "Atestado",
    },
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.290000,
      longitude: -40.270000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 9,
    tipo: 2,
    nome: "Amanda Santos",
    status: "Nenhum",
    aprovacao: "Aprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/07/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Marcelo Costa",
        funcao: "Superintendente",
        cpf: "070.070.070-07",
        descricao: null
      },
      {
        id: 2,
        nome: "Laura Fernandes",
        funcao: "Gerente",
        cpf: "080.080.080-08",
        descricao: null
      },
      {
        id: 3,
        nome: "Ricardo Alves",
        funcao: "Analista",
        cpf: "090.090.090-09",
        descricao: "Descrição gerada automaticamente"
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.310000,
      longitude: -40.310000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 10,
    tipo: 2,
    nome: "Luciana Pereira",
    status: "Grave",
    aprovacao: "Aprovado",
    dataAprovacao: "06/03/2025 - 12:30h",
    data: "05/07/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: "05/03/2025",
    horaConclusao: "22:40",
    justificativa: {
      pessoas: [
        {
          id: 1,
          nome: "Hugo Ribeiro",
          funcao: "Diretor",
          cpf: "101.010.101-01",
          descricao: null
        },
        {
          id: 2,
          nome: "Beatriz Almeida",
          funcao: "Supervisora",
          cpf: "202.020.202-02",
          descricao: null
        },
        {
          id: 3,
          nome: "Diego Martins",
          funcao: "Técnico",
          cpf: "303.030.303-03",
          descricao: "Descrição gerada automaticamente"
        },
      ],
      imagem: require("./assets/images/atestado.png"),
      descricao: "Descrição não disponível",
      motivo: "Atestado",
    },
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.320000,
      longitude: -40.290000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 11,
    tipo: 2,
    nome: "Roberto Nascimento",
    status: "Leve",
    aprovacao: null,
    dataAprovacao: null,
    data: "05/08/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: null,
    horaConclusao: null,
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "Sandra Vieira",
        funcao: "Coordenadora",
        cpf: "404.040.404-04",
        descricao: null
      },
      {
        id: 2,
        nome: "Fábio Souza",
        funcao: "Especialista",
        cpf: "505.050.505-05",
        descricao: "Descrição gerada automaticamente"
      },
      {
        id: 3,
        nome: "Gabriela Lima",
        funcao: "Assistente",
        cpf: "606.060.606-06",
        descricao: null
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.300500,
      longitude: -40.315000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  },
  {
    id: 12,
    tipo: 2,
    nome: "Nenhum",
    status: "Aberto",
    aprovacao: null,
    dataAprovacao: null,
    data: "05/08/2025",
    hora: "13:40",
    peso: "320 g",
    causa_queda: "Vibração Excessiva",
    equipamento: "Tremonha Vibratória",
    descricao_audio: "Intermitente",
    dataConclusao: null,
    horaConclusao: null,
    justificativa: null,
    pessoas: [
      {
        id: 1,
        nome: "André Luiz",
        funcao: "Gerente",
        cpf: "707.070.707-07",
        descricao: null
      },
      {
        id: 2,
        nome: "Tânia Oliveira",
        funcao: "Supervisora",
        cpf: "808.080.808-08",
        descricao: null
      },
      {
        id: 3,
        nome: "Vinícius Costa",
        funcao: "Analista",
        cpf: "909.090.909-09",
        descricao: "Descrição gerada automaticamente"
      },
    ],
    encarregado: "Roberto Nunes",
    localizacao: {
      latitude: -20.330000,
      longitude: -40.295000,
      local: "Zona de Carga",
      origem: "Funil Principal",
      origem_detalhado: "Silo 9",
      destino_final: "Separador de Ar",
    },
    foto: [require("./assets/images/ocorrencias.png")],
    data_fotos_registradas: "06/03/2025",
    hora_fotos_registradas: "07:30",
  }
];