// usersController.js
// Controller for handling user-related logic

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

module.exports = {
  // GET /api/users
  getUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      if (role) where.role = role;
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit),
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { articles: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);
      
      res.json({
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/users
  createUser: async (req, res) => {
    try {
      const { username, email, password, role = 'VISITOR' } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'Username, email, and password are required' 
        });
      }
      
      // Validate role
      const validRoles = ['VISITOR', 'EDITOR', 'ADMIN'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      res.status(201).json(user);
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.includes('username') ? 'username' : 'email';
        return res.status(400).json({ error: `${field} already exists` });
      }
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /api/users/:id
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, role } = req.body;
      
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent admin from changing their own role
      if (existingUser.id === req.user.id && role && role !== existingUser.role) {
        return res.status(400).json({ 
          error: 'Cannot change your own role' 
        });
      }
      
      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) {
        const validRoles = ['VISITOR', 'EDITOR', 'ADMIN'];
        if (!validRoles.includes(role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        updateData.role = role;
      }
      
      // Hash new password if provided
      if (password) {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }
      
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      res.json(user);
    } catch (error) {
      if (error.code === 'P2002') {
        const field = error.meta?.target?.includes('username') ? 'username' : 'email';
        return res.status(400).json({ error: `${field} already exists` });
      }
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // DELETE /api/users/:id
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });
      
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent admin from deleting themselves
      if (existingUser.id === req.user.id) {
        return res.status(400).json({ 
          error: 'Cannot delete your own account' 
        });
      }
      
      // Check if user has articles
      if (existingUser._count.articles > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete user with existing articles' 
        });
      }
      
      await prisma.user.delete({
        where: { id }
      });
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};