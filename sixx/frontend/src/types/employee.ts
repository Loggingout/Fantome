// src/types/employee.ts
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  performance: number; // 0–100
  avatarColor?: string;
}

export interface ActivityItem {
  id: string;
  type: "hire" | "update" | "login" | "role-change";
  message: string;
  timestamp: string;
}
