import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminPage from './pages/AdminPage';
import ManagementPage from './pages/ManagementPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/articles" element={
                <ProtectedRoute requiredRole="EDITOR">
                  <ArticlesPage />
                </ProtectedRoute>
              } />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/articles/:id/edit" element={
                <ProtectedRoute requiredRole="EDITOR">
                  <div>Edit Article Page - À implémenter</div>
                </ProtectedRoute>
              } />
              <Route path="/articles/new" element={
                <ProtectedRoute requiredRole="EDITOR">
                  <div>New Article Page - À implémenter</div>
                </ProtectedRoute>
              } />
              <Route 
                path="/gestion" 
                element={
                  <ProtectedRoute requiredRole="EDITOR">
                    <ManagementPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
