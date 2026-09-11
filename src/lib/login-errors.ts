import { ApiError } from './api';

const DEFAULT_LOGIN_ERROR = 'Não foi possível entrar. Tente novamente.';

/**
 * Converts every failure that can reach the login form into safe, user-facing
 * Portuguese. Backend messages are intentionally never returned here because
 * they may contain technical or untranslated details.
 */
export function getLoginErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return DEFAULT_LOGIN_ERROR;
  }

  switch (error.status) {
    case 0:
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    case 400:
      return 'Confira o e-mail informado e tente novamente.';
    case 401:
      return 'E-mail ou senha incorretos.';
    case 403:
      return 'Você não tem permissão para acessar esta área.';
    case 404:
      return 'O serviço de login não está disponível no momento.';
    case 408:
      return 'O login demorou para responder. Tente novamente.';
    case 429:
      return 'Muitas tentativas de acesso. Aguarde um pouco e tente novamente.';
    default:
      if (error.status >= 500) {
        return 'O servidor está indisponível no momento. Tente novamente mais tarde.';
      }

      return DEFAULT_LOGIN_ERROR;
  }
}
