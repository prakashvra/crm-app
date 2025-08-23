export type ContactStatus = 'active' | 'inactive' | 'prospect' | 'customer';
export type ContactSource = 'website' | 'referral' | 'social_media' | 'cold_call' | 'event' | 'other';
export type ContactPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  status: ContactStatus;
  source: ContactSource;
  priority: ContactPriority;
  tags?: string[];
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  customFields?: Record<string, any>;
  assignedUserId: number;
  organizationId?: number;
  organization?: {
    id: number;
    name: string;
  };
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  department?: string;
  status: ContactStatus;
  source: ContactSource;
  priority: ContactPriority;
  tags?: string[];
  notes?: string;
  address?: Contact['address'];
  socialMedia?: Contact['socialMedia'];
  organizationId?: number;
  nextFollowUpDate?: string;
}

export interface ContactFilters {
  search?: string;
  status?: ContactStatus;
  source?: ContactSource;
  priority?: ContactPriority;
  assignedUserId?: number;
  organizationId?: number;
  tags?: string[];
}

export interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
