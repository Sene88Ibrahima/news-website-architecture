"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/common/LoadingSpinner"
import type { Article } from "../types"
import { articlesApi } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { ArrowLeft, Calendar, User, Clock, Edit3, Trash2, BookOpen, Tag, CheckCircle, AlertCircle } from "lucide-react"

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("ID d'article manquant")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await articlesApi.getById(id)
        setArticle(response.data)
      } catch (err: any) {
        setError("Erreur lors du chargement de l'article")
        console.error("Error fetching article:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const handleDelete = async () => {
    if (!article || !id) return

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await articlesApi.delete(id)
        navigate("/articles")
      } catch (err) {
        setError("Erreur lors de la suppression de l'article")
      }
    }
  }

  const canEdit = user && article && (hasRole("ADMIN") || (hasRole("EDITOR") && article.authorId === user.id))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-slate-600 font-medium">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{error || "Article non trouvé"}</h1>
          <p className="text-slate-600 mb-6">
            Nous n'avons pas pu charger cet article. Il se peut qu'il ait été supprimé ou que vous n'ayez pas les
            permissions nécessaires.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const wordCount = article.content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Retour aux articles
            </Link>
          </div>

          {/* Article Card */}
          <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <header className="p-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <Tag className="w-4 h-4" />
                  {article.category?.name}
                </span>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    article.published ? "bg-green-500/20 text-green-100" : "bg-yellow-500/20 text-yellow-100"
                  }`}
                >
                  {article.published ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Publié
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Brouillon
                    </>
                  )}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.author?.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {article.updatedAt !== article.createdAt && (
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Modifié le {new Date(article.updatedAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime < 1 ? "< 1 min de lecture" : `${readingTime} min de lecture`}</span>
                </div>
              </div>
            </header>

            <div className="p-8">
              {/* Summary */}
              {article.summary && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Résumé</h2>
                  </div>
                  <p className="text-xl text-slate-700 leading-relaxed font-medium">{article.summary}</p>
                </div>
              )}

              {/* Content */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Contenu de l'article</h2>
                </div>
                <div className="prose prose-lg prose-slate max-w-none">
                  <div className="text-slate-800 leading-relaxed text-lg whitespace-pre-wrap">{article.content}</div>
                </div>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="border-t border-slate-200 pt-8">
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/articles/${article.id}/edit`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      Modifier
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetailPage
