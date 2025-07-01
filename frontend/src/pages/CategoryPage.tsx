import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ArticleList from '../components/articles/ArticleList';
import Pagination from '../components/common/Pagination';

const CategoryPage: React.FC = () => {
  // TODO: Fetch articles by category from route params
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8">
        <h2 className="text-xl font-bold mb-4">Catégorie: ...</h2>
        <ArticleList articles={[]} onSelect={() => {}} />
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;