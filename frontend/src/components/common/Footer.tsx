import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo et description */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              NewsHub
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Votre source d'information de confiance. Restez informé avec les dernières actualités, 
            analyses et reportages de qualité.
          </p>

        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Liens rapides</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                Accueil
              </a>
            </li>
            <li>
              <a href="/articles" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                Articles
              </a>
            </li>

          </ul>
        </div>


      </div>

      {/* Ligne de séparation et copyright */}
      <div className="border-t border-gray-700 mt-8 pt-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} NewsHub. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;