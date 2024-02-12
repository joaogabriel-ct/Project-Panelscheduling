import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { tokenService } from "./auth/tokenService";
import { withSessionHOC } from "./auth/session";



const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';


export function getAPIClient(ctx = null) {
  let token = tokenService.get(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/' 
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  // Interceptador de Requisição
  api.interceptors.request.use(config => {
    // Você pode adicionar o que precisar aqui antes de enviar a requisição
    return config;
  });

  // Interceptador de Resposta
  api.interceptors.response.use(response => {
    // Se a resposta for bem-sucedida, apenas a retorne
    return response;
  }, async (error) => {
    // Verifique se é um erro 401 e precisa de atualização de token
    if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
      // Marca como uma tentativa de reenvio para evitar loop infinito
      error.config.__isRetryRequest = true;
      
      try {
        // Tenta atualizar o token aqui
        const refreshToken = ctx ? parseCookies(ctx)['refreshToken'] : localStorage.getItem('refreshToken');
        const response = await axios.post(`http://localhost:8000/api/v1/token/refresh/`, { token: refreshToken });

        const { token: newToken } = response.data;

        // Atualiza o token no armazenamento e cabeçalhos
        if (ctx) {
          setCookie(ctx, 'token', newToken, { path: '/' });
        } else {
          localStorage.setItem('token', newToken);
        }
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;

        // Reenvia a requisição original com o novo token
        return api(error.config);
      } catch (refreshError) {
        // Caso a atualização falhe, retorne o erro original
        return Promise.reject(refreshError);
      }
    }
    
    // Para outros tipos de erros, simplesmente os retorne
    return Promise.reject(error);
  });

  return api;
}