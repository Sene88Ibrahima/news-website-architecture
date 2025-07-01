import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form className="space-y-4 max-w-sm mx-auto mt-8" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        disabled={loading}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};

export default LoginForm;