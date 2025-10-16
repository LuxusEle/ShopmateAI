import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';

declare global {
  namespace Express {
    interface Request {
      user?: {
        staffId: string;
        organizationId: string;
        email: string;
        role: string;
      };
      token?: string;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authService.extractToken(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: No token provided',
        timestamp: new Date(),
      });
      return;
    }

    const payload = authService.verifyToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid token',
        timestamp: new Date(),
      });
      return;
    }

    req.user = payload;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Token verification failed',
      timestamp: new Date(),
    });
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authService.extractToken(authHeader);

    if (token) {
      const payload = authService.verifyToken(token);
      if (payload) {
        req.user = payload;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: No user',
        timestamp: new Date(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient permissions',
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
};

export const requireOrganization = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: No user',
      timestamp: new Date(),
    });
    return;
  }

  // Check if the requested organization matches user's organization
  const requestedOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;

  if (requestedOrgId && requestedOrgId !== req.user.organizationId) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Cannot access other organization data',
      timestamp: new Date(),
    });
    return;
  }

  next();
};
