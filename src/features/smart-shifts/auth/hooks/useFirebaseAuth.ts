import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebase/auth';
import * as authApi from '../api';
import { useNotification } from '@/features/smart-shifts/common/hooks/useNotification';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import { tokenService } from '../services/token.service';

export const useFirebaseAuth = () => {
  const router = useRouter();
  const { success, error } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const firebaseLogin = useMutation({
    mutationFn: async (data: { idToken: string; provider: 'google' | 'facebook' }) => {
      const response = await authApi.firebaseLogin(data);
      return response;
    },
    onSuccess: (data) => {
      console.log('Firebase login success!', data);
      success(AUTH_MESSAGES.LOGIN.SUCCESS);
      
      // Store tokens
      tokenService.setTokens(data.accessToken, data.refreshToken);
      
      // Redirect to onboarding (it will redirect to dashboard if already complete)
      setTimeout(() => {
        void router.push('/onboarding' as any);
      }, 1500);
    },
    onError: (err: unknown) => {
      console.error('Firebase login error:', err);
      const message = (err as AxiosError<{ message: string }>)?.response?.data?.message || AUTH_MESSAGES.LOGIN.ERROR;
      error(message);
      setIsLoading(false);
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      await firebaseLogin.mutateAsync({
        idToken,
        provider: 'google',
      });
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      
      // Handle specific Firebase errors
      const fbError = err as any;
      if (fbError?.code === 'auth/popup-closed-by-user') {
        error('Finestra di accesso chiusa. Riprova.');
      } else if (fbError?.code === 'auth/cancelled-popup-request') {
        // User closed popup, do nothing
      } else {
        error(AUTH_MESSAGES.LOGIN.ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithFacebook();
      const idToken = await result.user.getIdToken();
      
      await firebaseLogin.mutateAsync({
        idToken,
        provider: 'facebook',
      });
    } catch (err: unknown) {
      console.error('Facebook sign in error:', err);
      
      // Handle specific Firebase errors
      const fbError = err as any;
      if (fbError?.code === 'auth/popup-closed-by-user') {
        error('Finestra di accesso chiusa. Riprova.');
      } else if (fbError?.code === 'auth/cancelled-popup-request') {
        // User closed popup, do nothing
      } else {
        error(AUTH_MESSAGES.LOGIN.ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    handleFacebookSignIn,
    isLoading,
  };
};

