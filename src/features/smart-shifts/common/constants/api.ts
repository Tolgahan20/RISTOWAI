const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  baseUrl: BASE_URL,
  auth: {
    base: `${BASE_URL}/auth`,
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    password: {
      forgot: `${BASE_URL}/auth/password/forgot`,
      reset: `${BASE_URL}/auth/password/reset`,
      verify: `${BASE_URL}/auth/password/verify-email`,
    },
    tokens: {
      refresh: `${BASE_URL}/auth/tokens/refresh`,
      revoke: `${BASE_URL}/auth/tokens/revoke`,
    },
  },
  // Add other feature endpoints here
} as const;
