interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export interface UtilsState {
  cepIsLoading: boolean;
  cepError: string | null;

  fetchCep: (cep: string) => Promise<ViaCepResponse>;
  checkPermission: (permissionName: string) => boolean;
  handleNavigation: (path: string, permission: string) => void;
}
