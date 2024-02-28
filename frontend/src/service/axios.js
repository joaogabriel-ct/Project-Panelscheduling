import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { tokenService } from "./auth/tokenService";
import { withSessionHOC } from "./auth/session";



const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';

function getAccessToken(ctx) {
  return tokenService.get(ctx);
}

export function getAPIClient(ctx = null) {
  let token = getAccessToken(ctx);

  const api = axios.create({
    baseURL: 'https://wpp-client.online/api/v1/' 
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
  api.interceptors.request.use(config => {
    return config;
  });
  api.interceptors.response.use(response => {
    return response;
  }, async (error) => {
    if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
      error.config.__isRetryRequest = true;
      try {
        const refreshToken = ctx ? parseCookies(ctx)['refreshToken'] : localStorage.getItem('refreshToken');
        const response = await axios.post(`https://wpp-client.online/api/v1/token/refresh/`, { token: refreshToken });
        const { token: newToken } = response.data;
        if (ctx) {
          setCookie(ctx, 'token', newToken, { path: '/' });
        } else {
          localStorage.setItem('token', newToken);
        }
        api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
        return api(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  });
  return api;
}