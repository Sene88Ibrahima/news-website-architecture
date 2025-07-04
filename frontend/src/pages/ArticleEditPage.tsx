import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { articlesApi, categoriesApi } from '../services/api';
import ArticleForm from '../components/articles/ArticleForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Article, Category } from '../types';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const ArticleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("ID d'article manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch article and categories in parallel
        const [articleResponse, categoriesResponse] = await Promise.all([
          articlesApi.getById(id),
          categoriesApi.getAll()
        ]);
        
        const fetchedArticle = articleResponse.data;
        
        // Check if user can edit this article
        if (!user || (!hasRole('ADMIN') && !(hasRole('EDITOR') && fetchedArticle.authorId === user.id))) {
          setError("Vous n'avez pas les permissions pour modifier cet article");
          setLoading(false);
          return;
        }
        
        setArticle(fetchedArticle);
        setCategories(categoriesResponse.data || []);
      } catch (err: any) {
        setError("Erreur lors du chargement de l'article");
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleSubmit = async (formData: any) => {
    if (!id || !article) return;

    try {
      setSubmitting(true);
      setError(null);
      
      // Find category ID by name
      const selectedCategory = categories.find((cat: Category) => cat.name === formData.category);
      if (!selectedCategory) {
        setError("Catégorie sélectionnée invalide");
        setSubmitting(false);
        return;
      }
      
      const updateData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        categoryId: selectedCategory.id,
        published: formData.published
      };
      
      await articlesApi.update(id, updateData);
      navigate(`/articles/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour de l'article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-slate-600 font-medium">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{error || "Article non trouvé"}</h1>
          <p className="text-slate-600 mb-6">
            Nous n'avons pas pu charger cet article pour modification.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  const categoryOptions = categories.map(cat => cat.name);
  
  const initialValues = {
    title: article.title,
    content: article.content,
    summary: article.summary || '',
    category: article.category?.name || '',
    published: article.published
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/articles/${id}`)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Retour à l'article
            </button>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Modifier l'article</h1>
              <p className="text-blue-100">Modifiez les informations de votre article</p>
            </div>
            
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}
              
              <ArticleForm
                initialValues={initialValues}
                categories={categoryOptions}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditPage;