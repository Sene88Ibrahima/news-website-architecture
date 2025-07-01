import React from 'react';
import { Article } from '../../types';

interface ArticleListProps {
  articles: Article[];
  onSelect: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onSelect }) => (
  <div className="grid gap-4">
    {articles.map(article => (
      <div
        key={article.id}
        className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
        onClick={() => onSelect(article)}
      >
        <h2 className="text-xl font-semibold">{article.title}</h2>
        <p className="text-gray-600 text-sm">{article.summary}</p>
        <div className="flex justify-between text-xs mt-2">
          <span>Catégorie: {article.category.name}</span>
          <span>Auteur: {article.author.username}</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    ))}
  </div>
);

export default ArticleList;