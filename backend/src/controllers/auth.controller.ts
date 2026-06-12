import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Employee } from "../entities/Employee";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const employeeRepository = AppDataSource.getRepository(Employee);


// Register new employee

export const register = async (req: Request, res: Response) => {
  try {

    const { name, username, department, password } = req.body;

    const existingUser = await employeeRepository.findOneBy({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = employeeRepository.create({
      name,
      username,
      department,
      password: hashedPassword
    });

    await employeeRepository.save(employee);

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// login for registered employee

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const employee = await employeeRepository.findOneBy({ username });

    if (!employee) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);    // compare() Function .
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: employee.id,
       username: employee.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      employee: {
         name: employee.name,
          username: employee.username,
           department: employee.department }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


// getProfile 
export const getProfile = async (req: any, res: Response) => {
  try {
    const employee = await employeeRepository.findOneBy({ id: req.user.id });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ name: employee.name, username: employee.username, department: employee.department });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


 
// logout for employee

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ 
      success: true, 
      message: "Employee logged out successfully." 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error during logout." 
    });
  }
};