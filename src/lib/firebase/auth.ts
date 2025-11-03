import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const signInWithFacebook = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result;
  } catch (error: any) {
    console.error('Facebook sign in error:', error);
    throw error;
  }
};

export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting Firebase ID token:', error);
    return null;
  }
};

