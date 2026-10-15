import { isAxiosError } from 'axios';

/** Corpo de erro padrão das exceções HTTP do NestJS. */
interface NestErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/** Erro normalizado de qualquer chamada à care-senior-api. */
export class ApiError extends Error {
  readonly status: number | undefined;
  /** Mensagens individuais (o ValidationPipe do Nest devolve uma por campo). */
  readonly messages: string[];

  constructor(message: string, status?: number, messages: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages.length > 0 ? messages : [message];
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isTooManyRequests() {
    return this.status === 429;
  }

  get isClientError() {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }
}

function isNestErrorBody(body: unknown): body is NestErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'statusCode' in body &&
    'message' in body
  );
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const body: unknown = error.response?.data;

    if (isNestErrorBody(body)) {
      const messages = Array.isArray(body.message)
        ? body.message
        : [body.message];
      return new ApiError(messages.join('\n'), status, messages);
    }

    if (!error.response) {
      return new ApiError('Não foi possível conectar ao servidor.');
    }
    return new ApiError(error.message, status);
  }

  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError('Erro inesperado.');
}
