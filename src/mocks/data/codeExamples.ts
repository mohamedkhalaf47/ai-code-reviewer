export const authMiddlewareCode = `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    
    // SECURITY ISSUE: SQL Injection vulnerability (Line 18)
    const user = await db.query(
      "SELECT * FROM users WHERE id = " + decoded.userId
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // PERFORMANCE ISSUE: Nested loop O(n²) (Line 42)
    for (let i = 0; i < allowedRoles.length; i++) {
      for (let j = 0; j < req.user.roles.length; j++) {
        if (allowedRoles[i] === req.user.roles[j]) {
          return next();
        }
      }
    }

    return res.status(403).json({ error: 'Forbidden' });
  };
};`;

export const apiRoutesCode = `import express from 'express';
import { authenticateUser, authorizeRole } from '../middleware/auth';
import { userController } from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/auth/login', userController.login);
router.post('/auth/register', userController.register);

// Protected routes
router.get('/users', authenticateUser, userController.getAllUsers);
router.get('/users/:id', authenticateUser, userController.getUserById);
router.put('/users/:id', authenticateUser, userController.updateUser);
router.delete(
  '/users/:id',
  authenticateUser,
  authorizeRole(['admin']),
  userController.deleteUser
);

// Admin only routes
router.get(
  '/admin/stats',
  authenticateUser,
  authorizeRole(['admin']),
  userController.getStats
);

export default router;`;

export const jwtUtilsCode = `import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// SECURITY ISSUE: Weak JWT secret (Line 5)
const JWT_SECRET = 'myS3cr3t123';
const JWT_EXPIRY = '24h';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};`;

export const authTestCode = `import request from 'supertest';
import { app } from '../app';
import { db } from '../config/database';

describe('Authentication Middleware', () => {
  beforeEach(async () => {
    await db.query('TRUNCATE TABLE users CASCADE');
  });

  describe('POST /auth/login', () => {
    it('should return token for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('should allow access with valid token', async () => {
      const token = generateTestToken();
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', \`Bearer \${token}\`);

      expect(response.status).toBe(200);
    });

    it('should deny access without token', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
    });
  });
});`;

export const diffExample = `@@ -1,10 +1,15 @@
 import { Request, Response, NextFunction } from 'express';
 import jwt from 'jsonwebtoken';
+import { db } from '../config/database';
 
-export const authenticate = (req, res, next) => {
+export const authenticateUser = async (
+  req: Request,
+  res: Response,
+  next: NextFunction
+) => {
   try {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }`;
