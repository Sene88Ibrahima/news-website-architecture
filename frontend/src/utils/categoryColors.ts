// Utilitaire pour assigner des couleurs aux catégories
export const getCategoryColor = (categoryName: string): { bg: string; text: string; border: string } => {
  const colors = {
    'Politique': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200'
    },
    'Économie': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    'Sport': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    'Technologie': {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200'
    },
    'Culture': {
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      border: 'border-pink-200'
    },
    'Santé': {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    },
    'Environnement': {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-200'
    },
    'International': {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      border: 'border-indigo-200'
    },
    'Société': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200'
    },
    'Sciences': {
      bg: 'bg-cyan-100',
      text: 'text-cyan-800',
      border: 'border-cyan-200'
    }
  };

  // Couleur par défaut si la catégorie n'est pas trouvée
  const defaultColor = {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  };

  return colors[categoryName as keyof typeof colors] || defaultColor;
};

// Fonction pour obtenir une couleur de gradient pour l'image de fond
export const getCategoryGradient = (categoryName: string): string => {
  const gradients = {
    'Politique': 'from-red-500 via-red-600 to-red-700',
    'Économie': 'from-green-500 via-green-600 to-green-700',
    'Sport': 'from-blue-500 via-blue-600 to-blue-700',
    'Technologie': 'from-purple-500 via-purple-600 to-purple-700',
    'Culture': 'from-pink-500 via-pink-600 to-pink-700',
    'Santé': 'from-emerald-500 via-emerald-600 to-emerald-700',
    'Environnement': 'from-teal-500 via-teal-600 to-teal-700',
    'International': 'from-indigo-500 via-indigo-600 to-indigo-700',
    'Société': 'from-orange-500 via-orange-600 to-orange-700',
    'Sciences': 'from-cyan-500 via-cyan-600 to-cyan-700'
  };

  return gradients[categoryName as keyof typeof gradients] || 'from-gray-500 via-gray-600 to-gray-700';
};