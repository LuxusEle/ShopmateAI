import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import type { AuthToken, LoginRequest, RegisterRequest } from '../../../shared/types';

export interface TokenPayload {
  staffId: string;
  organizationId: string;
  email: string;
  role: string;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiration: string;
  private readonly saltRounds: number = 10;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
  }

  /**
   * Hash a password using bcryptjs
   */
  async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, this.saltRounds);
  }

  /**
   * Compare a plain password with a hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  /**
   * Generate JWT tokens (access and refresh)
   */
  generateTokens(payload: TokenPayload): {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  } {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });

    // Refresh token lasts longer (7 days)
    const refreshToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtExpiration,
    };
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded as TokenPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh an access token using a refresh token
   */
  refreshAccessToken(refreshToken: string): string | null {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      const payload = decoded as TokenPayload;

      // Generate new access token
      const newAccessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiration,
      });

      return newAccessToken;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }

    return null;
  }

  /**
   * Validate login credentials
   */
  async validateLoginRequest(request: LoginRequest): Promise<{ valid: boolean; error?: string }> {
    if (!request.email || !request.password) {
      return { valid: false, error: 'Email and password are required' };
    }

    if (!this.isValidEmail(request.email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    if (request.password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }

    return { valid: true };
  }

  /**
   * Validate registration request
   */
  async validateRegisterRequest(request: RegisterRequest): Promise<{ valid: boolean; error?: string }> {
    if (!request.email || !request.password || !request.name) {
      return { valid: false, error: 'Email, password, and name are required' };
    }

    if (!this.isValidEmail(request.email)) {
      return { valid: false, error: 'Invalid email format' };
    }

    if (request.password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }

    if (request.name.length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }

    if (request.password !== request.passwordConfirm) {
      return { valid: false, error: 'Passwords do not match' };
    }

    return { valid: true };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate a secure API key
   */
  generateApiKey(): string {
    return `shopmate_${uuidv4().replace(/-/g, '')}`;
  }

  /**
   * Hash an API key for storage
   */
  async hashApiKey(apiKey: string): Promise<string> {
    return bcryptjs.hash(apiKey, this.saltRounds);
  }

  /**
   * Verify an API key
   */
  async verifyApiKey(plainKey: string, hashedKey: string): Promise<boolean> {
    return bcryptjs.compare(plainKey, hashedKey);
  }
}

// Export singleton instance
export const authService = new AuthService();
