import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ArticleManagement from '../components/articles/ArticleManagement';
import CategoryManagement from '../components/admin/CategoryManagement';

type TabType = 'articles' | 'categories';

const ManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('articles');

  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Accès refusé</h1>
          <p className="mt-2 text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'articles' as TabType, label: 'Mes Articles', icon: '📝' },
    ...(user.role === 'ADMIN' ? [{ id: 'categories' as TabType, label: 'Catégories', icon: '📁' }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'articles':
        return <ArticleManagement />;
      case 'categories':
        return user.role === 'ADMIN' ? <CategoryManagement /> : <ArticleManagement />;
      default:
        return <ArticleManagement />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {user.role === 'ADMIN' ? 'Gestion' : 'Gestion de mes contenus'}
      </h1>
      
      {/* Navigation par onglets */}
      {tabs.length > 1 && (
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Contenu de l'onglet actif */}
      <div className="bg-gray-50 rounded-lg p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManagementPage;