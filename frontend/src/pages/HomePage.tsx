import React, { useState, useEffect } from 'react';
import ArticleList from '../components/articles/ArticleList';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Article, Category } from '../types';
import { articlesApi, categoriesApi } from '../services/api';
import { getCategoryColor } from '../utils/categoryColors';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: 10,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus && { published: selectedStatus }),
        sort: sortOrder === 'newest' ? 'desc' : 'asc'
      };
      
      const response = await articlesApi.getAll(params);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError('Erreur lors du chargement des articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, selectedStatus, searchTerm, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleArticleSelect = (article: Article) => {
    // Navigation vers la page de détail de l'article
    window.location.href = `/articles/${article.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Section Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Dernières Actualités
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Restez informé avec les dernières nouvelles, analyses et reportages de qualité
            </p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{articles.length}</div>
                <div className="text-blue-200 text-sm">Articles disponibles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{categories.length}</div>
                <div className="text-blue-200 text-sm">Catégories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200 text-sm">Actualités en continu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 -mt-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher des articles
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tapez votre recherche..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="lg:w-80">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par catégorie
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {(hasRole('EDITOR') || hasRole('ADMIN')) && (
              <div className="lg:w-80">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par statut
                </label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="true">Publié</option>
                    <option value="false">Brouillon</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Filtres rapides et navigation par ancienneté */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Filtres rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => {
                    const categoryColors = getCategoryColor(category.name);
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(selectedCategory === category.id ? '' : category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          selectedCategory === category.id
                            ? `${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} shadow-md scale-105`
                            : `bg-white ${categoryColors.text} ${categoryColors.border} hover:${categoryColors.bg} hover:scale-105`
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Boutons de navigation par ancienneté */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Navigation par ancienneté :</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder('newest')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortOrder === 'newest'
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Plus récents
                  </button>
                  <button
                    onClick={() => setSortOrder('oldest')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      sortOrder === 'oldest'
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                    Plus anciens
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory 
                  ? "Essayez de modifier vos critères de recherche ou de filtrage."
                  : "Il n'y a pas d'articles disponibles pour le moment."}
              </p>
              {(searchTerm || selectedCategory || selectedStatus) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedStatus('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* En-tête des résultats */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm || selectedCategory || selectedStatus ? 'Résultats de recherche' : 'Tous les articles'}
              </h2>
              <p className="text-gray-600 mt-1">
                {articles.length} article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
                {selectedCategory && ` dans ${categories.find(c => c.id === selectedCategory)?.name}`}
                {selectedStatus && ` avec le statut ${selectedStatus === 'true' ? 'Publié' : 'Brouillon'}`}
                {sortOrder === 'newest' ? ' (du plus récent au plus ancien)' : ' (du plus ancien au plus récent)'}
              </p>
            </div>
            
            <ArticleList articles={articles} onSelect={handleArticleSelect} />
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;