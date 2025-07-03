import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  } | null;
  roles: string[];
  setAuth: (token: string, refreshToken: string, id: string, username: string, email: string, roles: string[]) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      user: null,
      roles: [],
      setAuth: (token, refreshToken, id, username, email, roles) =>
        set({
          token,
          refreshToken,
          isLoggedIn: true,
          user: { id, username, email, roles },
          roles,
        }),
      setToken: (token) => set((state) => ({
        token,
        isLoggedIn: true,
        user: state.user ? { ...state.user, token } : null, // Update token in user object if it exists
      })),
      clearAuth: () => set({ token: null, refreshToken: null, isLoggedIn: false, user: null, roles: [] }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
