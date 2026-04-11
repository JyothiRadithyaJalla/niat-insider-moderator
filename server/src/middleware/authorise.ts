import { Request, Response, NextFunction } from 'express';
import { UserRole, HttpStatus } from '../types/auth.types.js';
import Article from '../models/Article.model.js';

/**
 * Role-based authorisation middleware.
 * Restricts access to users whose role is in the allowed list.
 */
export const authorise = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'You do not have permission to access this resource.' });
      return;
    }

    next();
  };
};

/**
 * Campus scope guard middleware.
 * Ensures a moderator can only access resources from their own campus.
 * Specifically checks `article.campus === req.user.campus` for mutations.
 */
export const campusScopeGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication required.' });
    return;
  }

  // Admins can access all campuses
  if (req.user.role === UserRole.ADMIN) {
    next();
    return;
  }

  // For POST requests, ensure the moderator is submitting for their own campus
  if (req.method === 'POST') {
    if (req.body.campus && req.body.campus !== req.user.campus) {
      res.status(HttpStatus.FORBIDDEN).json({ message: 'You can only create articles for your own campus.' });
      return;
    }
  }

  // For GET (id), PUT, DELETE requests: enforce article.campus === req.user.campus
  const articleId = req.params['id'];
  if (articleId) {
    try {
      const article = await Article.findById(articleId);
      if (!article) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Article not found.' });
        return;
      }

      if (article.campus !== req.user.campus) {
        res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied: wrong campus.' });
        return;
      }
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Invalid Article ID' });
      return;
    }
  }

  next();
};
