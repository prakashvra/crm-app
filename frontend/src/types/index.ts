export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'support';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer';
  source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'event' | 'other';
  notes?: string;
  tags: string[];
  socialProfiles: Record<string, string>;
  lastContactDate?: string;
  assignedUserId: number;
  organizationId?: number;
  assignedUser?: User;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address: Record<string, any>;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  status: 'prospect' | 'customer' | 'partner' | 'inactive';
  revenue?: number;
  employees?: number;
  description?: string;
  tags: string[];
  socialProfiles: Record<string, string>;
  assignedUserId: number;
  assignedUser?: User;
  contacts?: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: number;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'event' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  customFields: Record<string, any>;
  assignedUserId: number;
  contactId?: number;
  organizationId?: number;
  assignedUser?: User;
  contact?: Contact;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'demo' | 'other';
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  assignedUserId: number;
  createdByUserId: number;
  contactId?: number;
  organizationId?: number;
  dealId?: number;
  assignedUser?: User;
  createdByUser?: User;
  contact?: Contact;
  organization?: Organization;
  deal?: Deal;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}
