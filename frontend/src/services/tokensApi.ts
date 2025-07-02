import api from './api';

export interface ApiToken {
  id: string;
  token: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  userId?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateTokenRequest {
  name?: string;
  expiresAt?: string;
  userId?: string;
}

export interface TokensResponse {
  success: boolean;
  data: ApiToken[];
}

export interface TokenResponse {
  success: boolean;
  data: ApiToken;
  message?: string;
}

export const tokensApi = {
  // Récupérer tous les tokens
  getTokens: async (): Promise<TokensResponse> => {
    const response = await api.get('/tokens');
    return response.data;
  },

  // Créer un nouveau token
  createToken: async (data: CreateTokenRequest): Promise<TokenResponse> => {
    const response = await api.post('/tokens', data);
    return response.data;
  },

  // Activer/désactiver un token
  toggleToken: async (id: string): Promise<TokenResponse> => {
    const response = await api.put(`/tokens/${id}/toggle`);
    return response.data;
  },

  // Supprimer un token
  deleteToken: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete(`/tokens/${id}`);
    return response.data;
  }
};