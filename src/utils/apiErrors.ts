import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 413) {
      return 'A imagem é demasiado grande para o servidor. Tente uma imagem menor.';
    }

    if (!error.response) {
      return 'Não foi possível contactar o servidor. Verifique a sua ligação.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
