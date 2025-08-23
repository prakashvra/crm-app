export type OrganizationSize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type OrganizationStatus = 'prospect' | 'customer' | 'partner' | 'inactive';

export interface Organization {
  id: number;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  size: OrganizationSize;
  status: OrganizationStatus;
  revenue?: number;
  employees?: number;
  description?: string;
  tags?: string[];
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  assignedUserId: number;
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  contacts?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationFormData {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: Organization['address'];
  size: OrganizationSize;
  status: OrganizationStatus;
  revenue?: number;
  employees?: number;
  description?: string;
  tags?: string[];
  socialProfiles?: Organization['socialProfiles'];
}

export interface OrganizationFilters {
  search?: string;
  status?: OrganizationStatus;
  industry?: string;
  size?: OrganizationSize;
  assignedUserId?: number;
}

export interface OrganizationListResponse {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
