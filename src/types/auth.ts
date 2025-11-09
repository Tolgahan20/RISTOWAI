export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailData {
  email: string;
  currentPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserProfile;
}

