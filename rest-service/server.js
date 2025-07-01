const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const { PrismaClient } = require('@prisma/client');
const js2xmlparser = require('js2xmlparser');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.REST_PORT || 8081;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser());

// Middleware to determine response format
app.use((req, res, next) => {
  const acceptHeader = req.headers.accept;
  req.responseFormat = acceptHeader && acceptHeader.includes('application/xml') ? 'xml' : 'json';
  
  // Helper function to send response in appropriate format
  res.sendFormatted = (data, rootElement = 'response') => {
    if (req.responseFormat === 'xml') {
      res.type('application/xml');
      const xmlData = js2xmlparser.parse(rootElement, data, {
        declaration: { encoding: 'UTF-8' },
        format: { pretty: true }
      });
      res.send(xmlData);
    } else {
      res.json(data);
    }
  };
  
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.sendFormatted({ status: 'OK', service: 'REST', database: 'Connected' });
  } catch (error) {
    res.status(503).sendFormatted({ status: 'Error', service: 'REST', database: 'Disconnected' });
  }
});

// GET /api/rest/articles - Get all articles with pagination
app.get('/api/rest/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, published, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (published !== undefined) where.published = published === 'true';
    if (category) {
      where.category = {
        name: { contains: category, mode: 'insensitive' }
      };
    }
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          author: {
            select: { id: true, username: true, email: true }
          },
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);
    
    const response = {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
    
    res.sendFormatted(response, 'articlesResponse');
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// GET /api/rest/articles/:id - Get article by ID
app.get('/api/rest/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, email: true }
        },
        category: true
      }
    });
    
    if (!article) {
      return res.status(404).sendFormatted({ error: 'Article not found' }, 'error');
    }
    
    res.sendFormatted({ article }, 'articleResponse');
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// GET /api/rest/articles/by-category - Get articles grouped by category
app.get('/api/rest/articles/by-category', async (req, res) => {
  try {
    const { published = 'true' } = req.query;
    
    const categories = await prisma.category.findMany({
      include: {
        articles: {
          where: { published: published === 'true' },
          include: {
            author: {
              select: { id: true, username: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5 // Limit articles per category
        }
      },
      orderBy: { name: 'asc' }
    });
    
    const response = {
      categoriesWithArticles: categories.map(category => ({
        category: {
          id: category.id,
          name: category.name,
          description: category.description
        },
        articles: category.articles,
        articleCount: category.articles.length
      }))
    };
    
    res.sendFormatted(response, 'categoriesResponse');
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// GET /api/rest/articles/category/:categoryName - Get articles for specific category
app.get('/api/rest/articles/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { page = 1, limit = 10, published = 'true' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const category = await prisma.category.findFirst({
      where: {
        name: { equals: categoryName, mode: 'insensitive' }
      }
    });
    
    if (!category) {
      return res.status(404).sendFormatted({ error: 'Category not found' }, 'error');
    }
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          categoryId: category.id,
          published: published === 'true'
        },
        skip,
        take: parseInt(limit),
        include: {
          author: {
            select: { id: true, username: true, email: true }
          },
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({
        where: {
          categoryId: category.id,
          published: published === 'true'
        }
      })
    ]);
    
    const response = {
      category,
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
    
    res.sendFormatted(response, 'categoryArticlesResponse');
  } catch (error) {
    console.error('Error fetching articles for category:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// GET /api/rest/categories - Get all categories
app.get('/api/rest/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.sendFormatted({ categories }, 'categoriesResponse');
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// GET /api/rest/users/:id/articles - Get articles by user
app.get('/api/rest/users/:id/articles', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, published } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true }
    });
    
    if (!user) {
      return res.status(404).sendFormatted({ error: 'User not found' }, 'error');
    }
    
    const where = { authorId: id };
    if (published !== undefined) where.published = published === 'true';
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);
    
    const response = {
      user,
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };
    
    res.sendFormatted(response, 'userArticlesResponse');
  } catch (error) {
    console.error('Error fetching user articles:', error);
    res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
  }
});

// POST /api/rest/articles - Create new article (JSON/XML)
app.post('/api/rest/articles', async (req, res) => {
  try {
    let articleData;
    
    // Handle XML input
    if (req.headers['content-type']?.includes('application/xml')) {
      const xmlData = req.body;
      articleData = {
        title: xmlData.article?.title?.[0] || xmlData.title?.[0],
        content: xmlData.article?.content?.[0] || xmlData.content?.[0],
        summary: xmlData.article?.summary?.[0] || xmlData.summary?.[0],
        categoryId: xmlData.article?.categoryId?.[0] || xmlData.categoryId?.[0],
        authorId: xmlData.article?.authorId?.[0] || xmlData.authorId?.[0],
        published: (xmlData.article?.published?.[0] || xmlData.published?.[0]) === 'true'
      };
    } else {
      articleData = req.body;
    }
    
    const { title, content, summary, categoryId, authorId, published = false } = articleData;
    
    if (!title || !content || !summary || !categoryId || !authorId) {
      return res.status(400).sendFormatted({
        error: 'Missing required fields: title, content, summary, categoryId, authorId'
      }, 'error');
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
        author: {
          select: { id: true, username: true, email: true }
        },
        category: true
      }
    });
    
    res.status(201).sendFormatted({ article }, 'articleResponse');
  } catch (error) {
    console.error('Error creating article:', error);
    if (error.code === 'P2002') {
      res.status(400).sendFormatted({ error: 'Article with this title already exists' }, 'error');
    } else if (error.code === 'P2003') {
      res.status(400).sendFormatted({ error: 'Invalid category or author ID' }, 'error');
    } else {
      res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
    }
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).sendFormatted({ error: 'Endpoint not found' }, 'error');
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).sendFormatted({ error: 'Internal server error' }, 'error');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 REST Service running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/rest`);
  console.log(`🔄 Supports both JSON and XML (use Accept: application/xml header)`);
});

module.exports = app;