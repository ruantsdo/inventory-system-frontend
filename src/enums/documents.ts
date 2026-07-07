export const professionalDocumentTypes = [
  { value: "CRM", label: "CRM — Conselho Reg. de Medicina" },
  { value: "CRMV", label: "CRMV — Conselho Reg. de Medicina Veterinária" },
  { value: "CRO", label: "CRO — Conselho Reg. de Odontologia" },
  { value: "COREN", label: "COREN — Conselho Reg. de Enfermagem" },
  { value: "CREFITO", label: "CREFITO — Conselho Reg. de Fisioterapia" },
  { value: "CREF", label: "CREF — Conselho Reg. de Educação Física" },
  { value: "CRP", label: "CRP — Conselho Reg. de Psicologia" },
  { value: "CRA", label: "CRA — Conselho Reg. de Administração" },
  { value: "CREA", label: "CREA — Conselho Reg. de Engenharia" },
  { value: "CAU", label: "CAU — Conselho de Arquitetura e Urbanismo" },
  { value: "OAB", label: "OAB — Ordem dos Advogados" },
  { value: "RQE", label: "RQE — Registro de Qualificação de Especialidade" },
  { value: "OTHER", label: "Outro" },
] as const;

export type ProfessionalDocumentType = (typeof professionalDocumentTypes)[number];
