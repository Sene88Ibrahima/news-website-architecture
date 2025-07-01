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
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {(() => {
                  const wordCount = article.content.trim().split(/\s+/).length;
                  const readingTime = Math.ceil(wordCount / 200);
                  return readingTime < 1 ? '< 1 min de lecture' : `${readingTime} min de lecture`;
                })()}
              </span>
            </div>
            
            {article.summary && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">RÉSUMÉ</h2>
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  {article.summary}
                </p>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">CONTENU DE L'ARTICLE</h2>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-lg">
                {article.content}
              </div>
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