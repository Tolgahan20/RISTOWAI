import { axiosInstance } from '@/features/smart-shifts/common/api/axios';
import { api } from '@/features/smart-shifts/common/constants/api';
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ChangeEmailData,
} from '@/types/auth';

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>(api.user.profile);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await axiosInstance.patch<UserProfile>(api.user.profile, data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.patch<{ message: string }>(
      api.user.changePassword,
      data,
    );
    return response.data;
  },

  changeEmail: async (data: ChangeEmailData): Promise<{ message: string }> => {
    const response = await axiosInstance.patch<{ message: string }>(
      api.user.changeEmail,
      data,
    );
    return response.data;
  },
};

