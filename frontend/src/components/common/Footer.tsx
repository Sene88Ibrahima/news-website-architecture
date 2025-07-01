import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="container mx-auto text-center text-sm">
      &copy; {new Date().getFullYear()} Site d'actualités. Tous droits réservés.
    </div>
  </footer>
);

export default Footer;