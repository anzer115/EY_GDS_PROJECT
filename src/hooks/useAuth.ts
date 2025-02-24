import { useCallback } from 'react';
import { useStore } from '../lib/store';

export function useAuth() {
  const { user, setUser } = useStore();

  const signIn = useCallback(async (email: string, password: string) => {
    // Simple mock authentication
    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters' } };
    }
    
    setUser({
      id: crypto.randomUUID(),
      email,
    });
    
    return { error: null };
  }, [setUser]);

  const signUp = useCallback(async (email: string, password: string) => {
    // Simple mock authentication
    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters' } };
    }
    
    setUser({
      id: crypto.randomUUID(),
      email,
    });
    
    return { error: null };
  }, [setUser]);

  const signOut = useCallback(async () => {
    setUser(null);
  }, [setUser]);

  return {
    session: user ? { user } : null,
    loading: false,
    signIn,
    signUp,
    signOut,
  };
}