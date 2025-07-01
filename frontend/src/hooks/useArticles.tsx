import { useState } from 'react';

export function useArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    // TODO: Fetch articles from API
    setLoading(false);
  };

  return { articles, loading, error, fetchArticles };
}