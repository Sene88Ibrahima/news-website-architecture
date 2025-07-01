import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Article } from '../types';
import { articlesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError('ID d\'article manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await articlesApi.getById(id);
        setArticle(response.data);
      } catch (err: any) {
        setError('Erreur lors du chargement de l\'article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!article || !id) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await articlesApi.delete(id);
        navigate('/articles');
      } catch (err) {
        setError('Erreur lors de la suppression de l\'article');
      }
    }
  };

  const canEdit = user && article && (
    hasRole('ADMIN') || 
    (hasRole('EDITOR') && article.authorId === user.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Article non trouvé'}
          </h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Retour aux articles
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {article.category?.name}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                article.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {article.published ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <span>Par {article.author?.username}</span>
              <span className="mx-2">•</span>
              <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              {article.updatedAt !== article.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>Modifié le {new Date(article.updatedAt).toLocaleDateString('fr-FR')}</span>
                </>
              )}
            </div>
            
            {article.summary && (
              <p className="text-xl text-gray-700 leading-relaxed">
                {article.summary}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="border-t pt-6">
              <div className="flex gap-4">
                <Link
                  to={`/articles/${article.id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default ArticleDetailPage;