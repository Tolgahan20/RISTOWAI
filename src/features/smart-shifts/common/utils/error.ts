import { AxiosError } from 'axios';
import { AppError, ValidationError, ApiError, NetworkError } from '../types/error';

export const parseError = (error: unknown): AppError => {
  if (error instanceof AxiosError) {
    // Network error (no response)
    if (!error.response) {
      return {
        message: 'Network error. Please check your connection.',
        isNetworkError: true,
      };
    }

    const data = error.response.data;

    // Validation error
    if (error.response.status === 400 && 'errors' in data) {
      return {
        message: data.message || 'Validation error',
        error: data.error || 'BAD_REQUEST',
        statusCode: 400,
        errors: data.errors,
      } as ValidationError;
    }

    // Standard API error
    return {
      message: data.message || error.message,
      error: data.error || error.name,
      statusCode: error.response.status,
    };
  }

  // Unknown error
  if (error instanceof Error) {
    return {
      message: error.message,
      error: error.name,
      statusCode: 500,
    };
  }

  return {
    message: 'An unknown error occurred',
    error: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
};

export const getErrorMessage = (error: AppError): string => {
  if (isValidationError(error)) {
    // Get first validation error message
    const firstField = Object.keys(error.errors)[0];
    return error.errors[firstField][0] || error.message;
  }

  return error.message;
};

// Type guards
export const isValidationError = (error: AppError): error is ValidationError => {
  return 'errors' in error;
};

export const isNetworkError = (error: AppError): error is NetworkError => {
  return 'isNetworkError' in error;
};

export const isApiError = (error: AppError): error is ApiError => {
  return 'statusCode' in error && !isValidationError(error);
};

export const getFieldError = (error: AppError, field: string): string | undefined => {
  if (isValidationError(error) && error.errors[field]) {
    return error.errors[field][0];
  }
  return undefined;
};

export const hasFieldError = (error: AppError, field: string): boolean => {
  return isValidationError(error) && !!error.errors[field];
};

export const getHttpStatusText = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 422:
      return 'Validation Error';
    case 500:
      return 'Internal Server Error';
    default:
      return 'Unknown Error';
  }
};