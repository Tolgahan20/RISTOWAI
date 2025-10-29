export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: 'Successfully logged in',
    ERROR: 'Invalid email or password',
    NETWORK_ERROR: 'Unable to connect to the server',
  },
  REGISTER: {
    SUCCESS: 'Registration successful. Please check your email',
    ERROR: 'Unable to create account',
    EMAIL_EXISTS: 'An account with this email already exists',
  },
  PASSWORD: {
    FORGOT: {
      SUCCESS: 'Password reset instructions sent to your email',
      ERROR: 'Unable to process password reset request',
    },
    RESET: {
      SUCCESS: 'Password successfully reset',
      ERROR: 'Unable to reset password',
      INVALID_TOKEN: 'Invalid or expired reset token',
    },
  },
  EMAIL: {
    VERIFY: {
      SUCCESS: 'Email successfully verified',
      ERROR: 'Unable to verify email',
      INVALID_TOKEN: 'Invalid or expired verification token',
    },
  },
  TOKEN: {
    REFRESH_ERROR: 'Session expired. Please login again',
    REVOKE_SUCCESS: 'Successfully logged out',
    REVOKE_ERROR: 'Error during logout',
  },
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: {
    INVALID: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 'Password must be at least 8 characters',
    MATCH: 'Passwords do not match',
  },
} as const;

export const COMMON_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
} as const;
