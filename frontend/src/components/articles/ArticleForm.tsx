import React, { useState } from 'react';

interface ArticleFormProps {
  initialValues?: {
    title: string;
    content: string;
    summary: string;
    category: string;
    published: boolean;
  };
  categories: string[];
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialValues, categories, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    content: initialValues?.content || '',
    summary: initialValues?.summary || '',
    category: initialValues?.category || '',
    published: initialValues?.published || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold">Titre</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Résumé</label>
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          rows={2}
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Contenu</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          rows={8}
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Catégorie</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          checked={form.published}
          onChange={handleChange}
          id="published"
        />
        <label htmlFor="published">Publié</label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
};

export default ArticleForm;