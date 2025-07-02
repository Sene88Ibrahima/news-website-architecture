import React, { useState, useEffect } from 'react';
import { tokensApi, ApiToken, CreateTokenRequest } from '../../services/tokensApi';
import { useAuth } from '../../contexts/AuthContext';

const TokenManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTokenRequest>({
    name: '',
    expiresAt: '',
    userId: ''
  });

  // Vérifier les permissions
  if (!hasRole('ADMIN')) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Accès non autorisé. Seuls les administrateurs peuvent gérer les tokens API.</p>
      </div>
    );
  }

  // Charger les tokens
  const loadTokens = async () => {
    try {
      setLoading(true);
      const response = await tokensApi.getTokens();
      setTokens(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des tokens');
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau token
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const tokenData: CreateTokenRequest = {
        name: formData.name || undefined,
        expiresAt: formData.expiresAt || undefined,
        userId: formData.userId || undefined
      };
      
      await tokensApi.createToken(tokenData);
      setShowCreateForm(false);
      setFormData({ name: '', expiresAt: '', userId: '' });
      await loadTokens();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du token');
    } finally {
      setCreateLoading(false);
    }
  };

  // Activer/désactiver un token
  const handleToggleToken = async (id: string) => {
    try {
      await tokensApi.toggleToken(id);
      await loadTokens();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la modification du token');
    }
  };

  // Supprimer un token
  const handleDeleteToken = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce token ?')) {
      return;
    }
    
    try {
      await tokensApi.deleteToken(id);
      await loadTokens();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression du token');
    }
  };

  // Copier le token dans le presse-papiers
  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      alert('Token copié dans le presse-papiers');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si le token est expiré
  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des jetons API</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Créer un token
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Créer un nouveau token API</h3>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du token (optionnel)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Token pour API externe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'expiration (optionnel)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID utilisateur associé (optionnel)
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID de l'utilisateur"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={createLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {createLoading ? 'Création...' : 'Créer le token'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: '', expiresAt: '', userId: '' });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des tokens */}
      {loading ? (
        <div className="text-center py-8">
          <p>Chargement des tokens...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun token API créé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expire le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tokens.map((token) => (
                    <tr key={token.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                            {token.token.substring(0, 16)}...
                          </code>
                          <button
                            onClick={() => copyToClipboard(token.token)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Copier le token complet"
                          >
                            📋
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {token.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {token.user ? (
                          <div>
                            <div className="font-medium">{token.user.username}</div>
                            <div className="text-gray-500">{token.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          !token.isActive
                            ? 'bg-red-100 text-red-800'
                            : isExpired(token.expiresAt)
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {!token.isActive
                            ? 'Inactif'
                            : isExpired(token.expiresAt)
                            ? 'Expiré'
                            : 'Actif'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(token.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {token.expiresAt ? formatDate(token.expiresAt) : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleToggleToken(token.id)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            token.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          } transition-colors`}
                        >
                          {token.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleDeleteToken(token.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TokenManagement;