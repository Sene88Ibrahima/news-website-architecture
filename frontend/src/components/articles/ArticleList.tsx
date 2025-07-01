import React from 'react';
import { Article } from '../../types';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryColors';

interface ArticleListProps {
  articles: Article[];
  onSelect: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {articles.map((article, index) => (
      <div
        key={article.id}
        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
        onClick={() => onSelect(article)}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Image placeholder */}
        <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(article.category.name)} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category.name).bg} ${getCategoryColor(article.category.name).text} ${getCategoryColor(article.category.name).border} border backdrop-blur-sm`}>
              {article.category.name}
            </span>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
            {article.title}
          </h2>
          
          <div className="mb-4">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Résumé</p>
            <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
              {article.summary}
            </p>
          </div>
          
          {/* Métadonnées */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {article.author.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{article.author.username}</p>
                <p className="text-xs text-gray-500 font-medium">
                  {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">
                {(() => {
                  const now = new Date();
                  const createdAt = new Date(article.createdAt);
                  const diffInMs = now.getTime() - createdAt.getTime();
                  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                  
                  if (diffInDays > 0) {
                    return `il y a ${diffInDays}j`;
                  } else if (diffInHours > 0) {
                    return `il y a ${diffInHours}h`;
                  } else if (diffInMinutes > 0) {
                    return `il y a ${diffInMinutes} min`;
                  } else {
                    return 'à l\'instant';
                  }
                })()}
              </span>
            </div>
          </div>
          
          {/* Temps de lecture estimé */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-600 py-2 rounded-lg mx-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-semibold">
                {(() => {
                  const content = article.content || article.summary;
                  const wordCount = content.trim().split(/\s+/).length;
                  const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute
                  return readingTime < 1 ? '< 1 min de lecture' : `${readingTime} min de lecture`;
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Effet de survol */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
      </div>
    ))}
  </div>
);

export default ArticleList;