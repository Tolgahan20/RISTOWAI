import { useCallback } from 'react';
import { parseError, getErrorMessage, isNetworkError } from '../utils/error';
import { useNotification } from './useNotification';
import { COMMON_MESSAGES } from '../constants/messages';
import type { AppError } from '../types/error';

interface ErrorHandlerOptions {
  onError?: (error: AppError) => void;
  showNotification?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const notification = useNotification();

  const handleError = useCallback(
    (error: unknown): AppError => {
      const parsedError = parseError(error);
      const message = getErrorMessage(parsedError);

      // Call custom error handler if provided
      if (options.onError) {
        options.onError(parsedError);
      }

      // Show notification if enabled
      if (options.showNotification) {
        switch ('statusCode' in parsedError ? parsedError.statusCode : undefined) {
          case 401:
            notification.warning(COMMON_MESSAGES.SESSION_EXPIRED);
            break;
          case 403:
            notification.error(COMMON_MESSAGES.FORBIDDEN);
            break;
          case 404:
            notification.error(message || COMMON_MESSAGES.NOT_FOUND);
            break;
          default:
            if (isNetworkError(parsedError)) {
              notification.error(COMMON_MESSAGES.NETWORK_ERROR);
            } else {
              notification.error(message || COMMON_MESSAGES.UNKNOWN_ERROR);
            }
        }
      }

      return parsedError;
    },
    [options, notification]
  );

  return {
    handleError,
  };
};