export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string[]>;
}

export interface NetworkError {
  message: string;
  isNetworkError: true;
}

export type AppError = ApiError | ValidationError | NetworkError;

// Adding NOT_FOUND to common messages
export const COMMON_MESSAGES = {
  NOT_FOUND: 'The requested resource was not found',
} as const;