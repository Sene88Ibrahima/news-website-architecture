import React from 'react';

interface ArticleCardProps {
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, content, author, category, createdAt }) => (
  <article className="p-6 border rounded shadow bg-white">
    <h1 className="text-2xl font-bold mb-2">{title}</h1>
    <div className="text-gray-500 text-xs mb-4 flex gap-4">
      <span>Catégorie: {category}</span>
      <span>Auteur: {author}</span>
      <span>{new Date(createdAt).toLocaleDateString()}</span>
    </div>
    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  </article>
);

export default ArticleCard;