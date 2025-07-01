require('dotenv').config();
const express = require('express');
const soap = require('soap');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.SOAP_PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'soap-service-secret';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Load WSDL
const wsdlPath = path.join(__dirname, 'wsdl', 'userService.wsdl');
const wsdlXml = fs.readFileSync(wsdlPath, 'utf8');

// Helper function to validate JWT token
const validateToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return '';
  }
};

// Helper function to format user response
const formatUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

// SOAP Service implementation
const service = {
  UserService: {
    UserServiceSoapPort: {
      // Authenticate user and return JWT token
      authenticateUser: async (args) => {
        try {
          const { username, password } = args;
          
          if (!username || !password) {
            return {
              success: false,
              error: 'Username and password are required',
              token: null,
              user: null
            };
          }
          
          // Find user by username or email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: username },
                { email: username }
              ]
            }
          });
          
          if (!user) {
            return {
            success: false,
            error: 'Invalid credentials',
            token: '',
            user: {}
          };
          }
          
          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return {
            success: false,
            error: 'Invalid credentials',
            token: '',
            user: {}
          };
          }
          
          // Generate JWT token
          const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          return {
            success: true,
            error: '',
            token: token,
            user: formatUser(user)
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return {
            success: false,
            error: 'Internal server error',
            token: '',
            user: {}
          };
        }
      },
      
      // Get list of users (requires authentication)
      getUsers: async (args) => {
        try {
          const { token, page = 1, limit = 10, role } = args;
          
          // Validate token
          const decoded = validateToken(token);
          if (!decoded) {
            return {
              success: false,
              error: 'Invalid or expired token',
              users: [],
              total: 0
            };
          }
          
          // Check if user has admin privileges
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              error: 'Insufficient privileges',
              users: [],
              total: 0
            };
          }
          
          const skip = (parseInt(page) - 1) * parseInt(limit);
          const where = {};
          if (role) where.role = role;
          
          const [users, total] = await Promise.all([
            prisma.user.findMany({
              where,
              skip,
              take: parseInt(limit),
              orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
          ]);
          
          return {
            success: true,
            error: '',
            users: users.map(formatUser),
            total: total,
            page: parseInt(page),
            limit: parseInt(limit)
          };
        } catch (error) {
          console.error('Get users error:', error);
          return {
            success: false,
            error: 'Internal server error',
            users: [],
            total: 0
          };
        }
      },
      
      // Add new user (requires admin authentication)
      addUser: async (args) => {
        try {
          const { token, username, email, password, role = 'VISITOR' } = args;
          
          // Validate token
          const decoded = validateToken(token);
          if (!decoded) {
            return {
              success: false,
              error: 'Invalid or expired token',
              user: {}
            };
          }
          
          // Check if user has admin privileges
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              error: 'Insufficient privileges',
              user: {}
            };
          }
          
          if (!username || !email || !password) {
            return {
              success: false,
              error: 'Username, email, and password are required',
              user: {}
            };
          }
          
          // Validate role
          const validRoles = ['VISITOR', 'EDITOR', 'ADMIN'];
          if (!validRoles.includes(role)) {
            return {
              success: false,
              error: 'Invalid role',
              user: {}
            };
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
            }
          });
          
          return {
            success: true,
            error: '',
            user: formatUser(user)
          };
        } catch (error) {
          console.error('Add user error:', error);
          if (error.code === 'P2002') {
            const field = error.meta?.target?.includes('username') ? 'username' : 'email';
            return {
              success: false,
              error: `${field} already exists`,
              user: {}
            };
          }
          return {
            success: false,
            error: 'Internal server error',
            user: {}
          };
        }
      },
      
      // Update user (requires admin authentication)
      updateUser: async (args) => {
        try {
          const { token, userId, username, email, password, role } = args;
          
          // Validate token
          const decoded = validateToken(token);
          if (!decoded) {
            return {
              success: false,
              error: 'Invalid or expired token',
              user: null
            };
          }
          
          // Check if user has admin privileges
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              error: 'Insufficient privileges',
              user: null
            };
          }
          
          if (!userId) {
            return {
              success: false,
              error: 'User ID is required',
              user: null
            };
          }
          
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          });
          
          if (!existingUser) {
            return {
              success: false,
              error: 'User not found',
              user: null
            };
          }
          
          const updateData = {};
          if (username !== undefined) updateData.username = username;
          if (email !== undefined) updateData.email = email;
          if (role !== undefined) {
            const validRoles = ['VISITOR', 'EDITOR', 'ADMIN'];
            if (!validRoles.includes(role)) {
              return {
                success: false,
                error: 'Invalid role',
                user: null
              };
            }
            updateData.role = role;
          }
          
          // Hash new password if provided
          if (password) {
            const saltRounds = 12;
            updateData.password = await bcrypt.hash(password, saltRounds);
          }
          
          const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
          });
          
          return {
            success: true,
            error: '',
            user: formatUser(user)
          };
        } catch (error) {
          console.error('Update user error:', error);
          if (error.code === 'P2002') {
            const field = error.meta?.target?.includes('username') ? 'username' : 'email';
            return {
              success: false,
              error: `${field} already exists`,
              user: null
            };
          }
          return {
            success: false,
            error: 'Internal server error',
            user: null
          };
        }
      },
      
      // Delete user (requires admin authentication)
      deleteUser: async (args) => {
        try {
          const { token, userId } = args;
          
          // Validate token
          const decoded = validateToken(token);
          if (!decoded) {
            return {
              success: false,
              error: 'Invalid or expired token'
            };
          }
          
          // Check if user has admin privileges
          if (decoded.role !== 'ADMIN') {
            return {
              success: false,
              error: 'Insufficient privileges'
            };
          }
          
          if (!userId) {
            return {
              success: false,
              error: 'User ID is required'
            };
          }
          
          const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              _count: {
                select: { articles: true }
              }
            }
          });
          
          if (!existingUser) {
            return {
              success: false,
              error: 'User not found'
            };
          }
          
          // Prevent admin from deleting themselves
          if (existingUser.id === decoded.userId) {
            return {
              success: false,
              error: 'Cannot delete your own account'
            };
          }
          
          // Check if user has articles
          if (existingUser._count.articles > 0) {
            return {
              success: false,
              error: 'Cannot delete user with existing articles'
            };
          }
          
          await prisma.user.delete({
            where: { id: userId }
          });
          
          return {
            success: true,
            error: ''
          };
        } catch (error) {
          console.error('Delete user error:', error);
          return {
            success: false,
            error: 'Internal server error'
          };
        }
      },
      
      // Get user by ID (requires authentication)
      getUserById: async (args) => {
        try {
          const { token, userId } = args;
          
          // Validate token
          const decoded = validateToken(token);
          if (!decoded) {
            return {
              success: false,
              error: 'Invalid or expired token',
              user: null
            };
          }
          
          if (!userId) {
            return {
              success: false,
              error: 'User ID is required',
              user: null
            };
          }
          
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });
          
          if (!user) {
            return {
              success: false,
              error: 'User not found',
              user: null
            };
          }
          
          return {
            success: true,
            error: '',
            user: formatUser(user)
          };
        } catch (error) {
          console.error('Get user by ID error:', error);
          return {
            success: false,
            error: 'Internal server error',
            user: null
          };
        }
      }
    }
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', service: 'SOAP', database: 'Connected' });
  } catch (error) {
    res.status(503).json({ status: 'Error', service: 'SOAP', database: 'Disconnected' });
  }
});

// WSDL endpoint
app.get('/soap?wsdl', (req, res) => {
  res.type('application/xml');
  res.send(wsdlXml);
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

app.listen(PORT, function () {
  soap.listen(app, '/soap', service, wsdlXml);
  console.log(`🧼 SOAP Service running on http://localhost:${PORT}`);
  console.log(`📋 WSDL available at http://localhost:${PORT}/soap?wsdl`);
  console.log(`🔐 User management operations available`);
});

module.exports = app;