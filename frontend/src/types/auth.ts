export interface Employee {
  id?: number;
  name: string;
  userId: string; // The employee login ID / Username
  department: string;
}

export interface AuthResponse {
  token: string;
  user: Employee;
} 