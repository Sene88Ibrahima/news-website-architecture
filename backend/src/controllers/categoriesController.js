// categoriesController.js
// Controller for handling category-related logic

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // GET /api/categories
  getCategories: async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { articles: true }
          }
        },
        orderBy: { name: 'asc' }
      });
      
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/categories
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }
      
      const category = await prisma.category.create({
        data: {
          name,
          description
        },
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });
      
      res.status(201).json(category);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/categories/:id
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const existingCategory = await prisma.category.findUnique({
        where: { id }
      });
      
      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      
      const category = await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });
      
      res.json(category);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/categories/:id
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });
      
      if (!existingCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Check if category has articles
      if (existingCategory._count.articles > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with existing articles' 
        });
      }
      
      await prisma.category.delete({
        where: { id }
      });
      
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};