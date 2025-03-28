// Mock employee database
export interface Employee {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'insurance' | 'bank';
  company: string;
}

export const employees: Employee[] = [
  {
    id: '1',
    username: 'insurance_admin1',
    password: 'ins123', // In production, this would be hashed
    name: 'John Smith',
    role: 'insurance',
    company: 'Guardian Insurance'
  },
  {
    id: '2',
    username: 'insurance_admin2',
    password: 'ins456',
    name: 'Sarah Johnson',
    role: 'insurance',
    company: 'SafeHaven Insurance'
  },
  {
    id: '3',
    username: 'bank_admin1',
    password: 'bank123',
    name: 'Michael Brown',
    role: 'bank',
    company: 'Global Bank'
  },
  {
    id: '4',
    username: 'bank_admin2',
    password: 'bank456',
    name: 'Emily Davis',
    role: 'bank',
    company: 'City Bank'
  }
];

export const authenticateEmployee = (username: string, password: string): Employee | null => {
  return employees.find(emp => emp.username === username && emp.password === password) || null;
};