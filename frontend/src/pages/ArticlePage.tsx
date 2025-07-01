import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ArticleDetail from '../components/articles/ArticleDetail';

const ArticlePage: React.FC = () => {
  // TODO: Fetch article by ID from route params
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8">
        <ArticleDetail
          title=""
          content=""
          author=""
          category=""
          createdAt={new Date().toISOString()}
          published={false}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;