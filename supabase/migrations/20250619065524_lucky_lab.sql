/*
  # Complete HRIS Database Schema

  1. New Tables
    - `profiles` - User profile information extending auth.users
    - `divisions` - Company divisions/departments
    - `employees` - Employee records linked to profiles
    - `attendance_records` - Daily attendance tracking
    - `leave_requests` - Leave request management
    - `announcements` - Company announcements
    - `documents` - Employee document storage
    - `payroll_components` - Salary components configuration
    - `salary_records` - Monthly salary records

  2. Security
    - Enable RLS on all tables
    - Role-based access policies (admin, manager, employee)
    - Data ownership policies for employee records

  3. Features
    - Custom enums for data consistency
    - Automatic timestamp updates
    - Performance indexes
    - Sample data for divisions and payroll components
*/

-- Create custom types/enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE employment_status AS ENUM ('active', 'inactive', 'terminated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_type AS ENUM ('annual', 'sick', 'emergency', 'maternity', 'paternity', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE announcement_type AS ENUM ('general', 'urgent', 'event');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'employee',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Divisions table
CREATE TABLE IF NOT EXISTS divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  manager_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  position text NOT NULL,
  division_id uuid REFERENCES divisions(id),
  join_date date NOT NULL,
  employment_status employment_status DEFAULT 'active',
  salary_base numeric(15,2),
  address text,
  emergency_contact text,
  emergency_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  clock_in timestamptz,
  clock_out timestamptz,
  clock_in_location text,
  clock_out_location text,
  clock_in_photo text,
  clock_out_photo text,
  status attendance_status DEFAULT 'present',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_requested integer NOT NULL,
  reason text NOT NULL,
  status leave_status DEFAULT 'pending',
  approver_id uuid REFERENCES employees(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  announcement_type announcement_type DEFAULT 'general',
  published_by uuid REFERENCES profiles(id),
  published_at timestamptz,
  expires_at timestamptz,
  target_roles user_role[],
  target_divisions uuid[],
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  name text NOT NULL,
  document_type text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES profiles(id),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payroll components table
CREATE TABLE IF NOT EXISTS payroll_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  component_type text NOT NULL, -- 'allowance', 'deduction', 'tax'
  is_percentage boolean DEFAULT false,
  amount numeric(15,2),
  percentage numeric(5,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Salary records table
CREATE TABLE IF NOT EXISTS salary_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  period_year integer NOT NULL,
  period_month integer NOT NULL,
  base_salary numeric(15,2) NOT NULL,
  allowances jsonb,
  deductions jsonb,
  tax_amount numeric(15,2),
  gross_salary numeric(15,2) NOT NULL,
  net_salary numeric(15,2) NOT NULL,
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, period_year, period_month)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_profile_id ON employees(profile_id);
CREATE INDEX IF NOT EXISTS idx_employees_division_id ON employees(division_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at);
CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_records_employee_period ON salary_records(employee_id, period_year, period_month);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Divisions policies
CREATE POLICY "Everyone can read divisions"
  ON divisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage divisions"
  ON divisions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Employees policies
CREATE POLICY "Users can read own employee record"
  ON employees FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Admins and managers can read all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage employees"
  ON employees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance records policies
CREATE POLICY "Users can read own attendance"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = attendance_records.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own attendance"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = attendance_records.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own attendance"
  ON attendance_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = attendance_records.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can read all attendance"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Leave requests policies
CREATE POLICY "Users can read own leave requests"
  ON leave_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = leave_requests.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own leave requests"
  ON leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = leave_requests.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can read all leave requests"
  ON leave_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update leave requests"
  ON leave_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Announcements policies
CREATE POLICY "Everyone can read published announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins and managers can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Documents policies
CREATE POLICY "Users can read own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = documents.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = documents.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payroll components policies
CREATE POLICY "Everyone can read payroll components"
  ON payroll_components FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage payroll components"
  ON payroll_components FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Salary records policies
CREATE POLICY "Users can read own salary records"
  ON salary_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = salary_records.employee_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage salary records"
  ON salary_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_divisions_updated_at 
    BEFORE UPDATE ON divisions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_attendance_records_updated_at 
    BEFORE UPDATE ON attendance_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_leave_requests_updated_at 
    BEFORE UPDATE ON leave_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_announcements_updated_at 
    BEFORE UPDATE ON announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_payroll_components_updated_at 
    BEFORE UPDATE ON payroll_components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Insert sample divisions
INSERT INTO divisions (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Human Resources', 'Manages employee relations and company policies'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Technology', 'Software development and IT infrastructure'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Marketing', 'Brand management and customer acquisition'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Finance', 'Financial planning and accounting'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Operations', 'Business operations and logistics')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payroll components
INSERT INTO payroll_components (name, component_type, is_percentage, amount, percentage) VALUES
  ('Transport Allowance', 'allowance', false, 500000, 0),
  ('Meal Allowance', 'allowance', false, 300000, 0),
  ('Health Insurance', 'deduction', true, 0, 5.0),
  ('Pension Fund', 'deduction', true, 0, 2.0),
  ('Income Tax', 'tax', true, 0, 15.0),
  ('Performance Bonus', 'allowance', true, 0, 10.0)
ON CONFLICT (name) DO NOTHING;

-- Note: Actual user profiles and employees will be created when users sign up
-- The application will handle user registration and profile creation