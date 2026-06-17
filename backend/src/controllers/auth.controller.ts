import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Employee } from "../entities/Employee";
import { redisClient } from "../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const employeeRepository = AppDataSource.getRepository(Employee);

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

// 1. Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, department, password } = req.body;
    const existingUser = await employeeRepository.findOneBy({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = employeeRepository.create({ name, username, department, password: hashedPassword });
    await employeeRepository.save(employee);

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Login (Generates Access JSON + HttpOnly Refresh Cookie)
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const employee = await employeeRepository.findOneBy({ username });

    if (!employee) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);    
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // A. Generate Short-Lived Access Token
    const accessToken = jwt.sign(
      { id: employee.id, username: employee.username },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );

    // B. Generate Long-Lived Refresh Token 
    const refreshToken = jwt.sign(
      { id: employee.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    // C. Save Refresh Token to Redis
    await redisClient.setEx(`refresh:${employee.id}`, 604800, refreshToken);

    // D. Send Refresh Token as an HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,                         
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",                    
      maxAge: 7 * 24 * 60 * 60 * 1000,    
    });

    // E. Return Access Token and Profile Info in body 
    res.json({
      accessToken,
      employee: { name: employee.name, username: employee.username, department: employee.department }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Silent Token Refresh (Generates new Access Token using Cookie)
export const refreshTokens = async (req: Request, res: Response) => {
  try {
    // Read token straight from cookies
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token Missing" });

    // Verify Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };

    // Check if it exists in Redis 
    const activeToken = await redisClient.get(`refresh:${decoded.id}`);
    if (!activeToken || activeToken !== refreshToken) {
      return res.status(403).json({ message: "Session expired or invalid" });
    }

    // Fetch employee data to keep payload fresh
    const employee = await employeeRepository.findOneBy({ id: decoded.id });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Issue a brand new short-lived Access Token
    const newAccessToken = jwt.sign(
      { id: employee.id, username: employee.username },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );
 
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or Expired Refresh Token" });
  }
};

// 4. Logout (Clears Redis Session + Destroys Cookie)
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
        
        await redisClient.del(`refresh:${decoded.id}`);  // Delete session data from RAM
      } catch (err) {
        // Token might be  expired already, carry on to clear cookie
      }
    }
    // wipe the client's cookie out of the browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ success: true, message: "Logged out successfully. Session revoked." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error during logout." });
  }
};


// 5. Get Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const employee = await employeeRepository.findOneBy({ id: req.user.id });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ name: employee.name, username: employee.username, department: employee.department });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};