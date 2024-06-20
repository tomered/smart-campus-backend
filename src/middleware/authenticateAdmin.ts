import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (decoded && typeof decoded === 'object' && 'role' in decoded && decoded.role === 'admin') {
      next();
    } else {
      res.status(403).send('Forbidden: Admin access required');
    }
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

export { isAdmin };
