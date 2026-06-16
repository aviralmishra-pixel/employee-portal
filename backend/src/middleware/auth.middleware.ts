import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string;
     username: string 
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Parses out "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access Token Required" });

  // Verifying against the short-lived ACCESS secret key
  jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (err, user) => {
    if (err) {
      // Frontend checks for 403 to trigger a automatic silent call to /api/refresh
      return res.status(403).json({ message: "Access Token Expired or Invalid" });
    }
    
    req.user = user as { id: string; username: string };
    next();
  });
};