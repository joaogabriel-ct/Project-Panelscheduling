import { api } from '../api';
import { tokenService } from './tokenService';

export const authService = {
  async login({ username, password }) {
    try {
      const response = await api.post(`login/`, { username, password });
      const body = response.data;
      tokenService.save(body.access);
      return { success: true, data: body };
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data.detail || 'Erro no servidor' };
      } else {
        return { success: false, message: 'Erro de conexão ou erro desconhecido' };
      }
    }
  },

  async getSession(ctx = null) {
    const token = tokenService.get(ctx);

    return api.get(`token/validated/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      ctx,
      refresh: true,
    })
    .then((response) => {
        if (!(response.status >= 200 && response.status < 300)) {
          throw new Error('Não autorizado');
        }
        return response.data;
      });
  }
};