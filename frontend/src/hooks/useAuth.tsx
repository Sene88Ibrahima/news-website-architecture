import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // TODO: Call API and set user
    setLoading(false);
  };

  const logout = () => {
    // TODO: Clear user session
    setUser(null);
  };

  return { user, loading, error, login, logout };
}