import { employeeAPI } from '../lib/api';

export interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  position: string;
  division_id: string;
  join_date: string;
  employment_status: 'active' | 'inactive' | 'terminated';
  salary_base?: number;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  division_name?: string;
}

export interface Division {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  manager_name?: string;
}

export class EmployeeService {
  static async getEmployees(): Promise<Employee[]> {
    try {
      const response = await employeeAPI.getEmployees();
      return response.data.employees;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch employees');
    }
  }

  static async getEmployeeByUserId(userId: string): Promise<Employee | null> {
    try {
      const response = await employeeAPI.getEmployeeByUserId(userId);
      return response.data.employee;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch employee');
    }
  }

  static async createEmployee(employeeData: any): Promise<Employee> {
    try {
      const response = await employeeAPI.createEmployee(employeeData);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create employee');
    }
  }

  static async updateEmployee(id: string, updates: any): Promise<Employee> {
    try {
      const response = await employeeAPI.updateEmployee(id, updates);
      return response.data.employee;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update employee');
    }
  }

  static async getDivisions(): Promise<Division[]> {
    try {
      const response = await employeeAPI.getDivisions();
      return response.data.divisions;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch divisions');
    }
  }
}