// articlesController.js
// Controller for handling article-related logic

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // GET /api/articles
  getArticles: async (req, res) => {
    try {
      const { page = 1, limit = 10, category, published } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      if (category) where.categoryId = category;
      if (published !== undefined) where.published = published === 'true';
      
      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          skip,
          take: parseInt(limit),
          include: {
            author: { select: { id: true, username: true } },
            category: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.article.count({ where })
      ]);
      
      res.json({
        articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/articles/:id
  getArticleById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true } }
        }
      });
      
      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/articles
  createArticle: async (req, res) => {
    try {
      const { title, content, summary, categoryId, published = false } = req.body;
      const authorId = req.user.id; // From auth middleware
      
      if (!title || !content || !summary || !categoryId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const article = await prisma.article.create({
        data: {
          title,
          content,
          summary,
          categoryId,
          authorId,
          published
        },
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true } }
        }
      });
      
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/articles/:id
  updateArticle: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, summary, categoryId, published } = req.body;
      
      const existingArticle = await prisma.article.findUnique({
        where: { id }
      });
      
      if (!existingArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Check if user is author or admin
      if (existingArticle.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (summary !== undefined) updateData.summary = summary;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (published !== undefined) updateData.published = published;
      
      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true } }
        }
      });
      
      res.json(article);
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/articles/:id
  deleteArticle: async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingArticle = await prisma.article.findUnique({
        where: { id }
      });
      
      if (!existingArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Check if user is author or admin
      if (existingArticle.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      await prisma.article.delete({
        where: { id }
      });
      
      res.json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};