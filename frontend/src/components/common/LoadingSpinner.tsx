import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col justify-center items-center py-12">
    <div className="relative">
      {/* Spinner principal */}
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-500 border-r-purple-500 absolute top-0 left-0"></div>
      
      {/* Points animés */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    {/* Texte de chargement */}
    <div className="mt-4 text-center">
      <p className="text-gray-600 text-sm font-medium animate-pulse">
        Chargement en cours...
      </p>
      <div className="flex justify-center mt-2 space-x-1">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;