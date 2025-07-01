import React from 'react';
// First install react-router-dom: npm install react-router-dom @types/react-router-dom
// First install the required package:
// npm install react-router-dom
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200">
          📰 Site d'Actualités
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Accueil
          </Link>
          
          {isAuthenticated ? (
            <>
              <span className="text-blue-200">
                Bonjour, {user?.username}
              </span>
              
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="hover:text-blue-200">
                  Administration
                </Link>
              )}
              
              {(user?.role === 'EDITOR' || user?.role === 'ADMIN') && (
                <Link to="/gestion" className="hover:text-blue-200">
                  Gestion
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="bg-blue-600 hover:bg-blue-800 px-3 py-1 rounded"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link 
              to="/connexion" 
              className="bg-blue-600 hover:bg-blue-800 px-3 py-1 rounded"
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;