// tokensController.js
// Controller for handling API token management

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

module.exports = {
  // GET /api/tokens
  getTokens: async (req, res) => {
    try {
      const tokens = await prisma.authToken.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      console.error('Error fetching tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des tokens'
      });
    }
  },

  // POST /api/tokens
  createToken: async (req, res) => {
    try {
      const { name, expiresAt, userId } = req.body;
      
      // Générer un token unique
      const token = crypto.randomBytes(32).toString('hex');
      
      // Vérifier si l'utilisateur existe (si spécifié)
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'Utilisateur non trouvé'
          });
        }
      }
      
      const newToken = await prisma.authToken.create({
        data: {
          token,
          type: name || 'API',
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          userId: userId || null
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: newToken,
        message: 'Token créé avec succès'
      });
    } catch (error) {
      console.error('Error creating token:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du token'
      });
    }
  },

  // DELETE /api/tokens/:id
  deleteToken: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Vérifier si le token existe
      const existingToken = await prisma.authToken.findUnique({
        where: { id }
      });
      
      if (!existingToken) {
        return res.status(404).json({
          success: false,
          error: 'Token non trouvé'
        });
      }
      
      await prisma.authToken.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Token supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting token:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du token'
      });
    }
  },

  // PUT /api/tokens/:id/toggle
  toggleToken: async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingToken = await prisma.authToken.findUnique({
        where: { id }
      });
      
      if (!existingToken) {
        return res.status(404).json({
          success: false,
          error: 'Token non trouvé'
        });
      }
      
      const updatedToken = await prisma.authToken.update({
        where: { id },
        data: {
          isActive: !existingToken.isActive
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: updatedToken,
        message: `Token ${updatedToken.isActive ? 'activé' : 'désactivé'} avec succès`
      });
    } catch (error) {
      console.error('Error toggling token:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la modification du token'
      });
    }
  }
};