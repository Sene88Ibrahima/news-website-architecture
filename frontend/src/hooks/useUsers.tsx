import { useState } from 'react';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    // TODO: Fetch users from API
    setLoading(false);
  };

  return { users, loading, error, fetchUsers };
}