export interface Deal {
  id: number;
  title: string;
  description?: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  probability: number; // 0-100
  expectedCloseDate?: string;
  actualCloseDate?: string;
  source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'event' | 'other';
  tags?: string[];
  notes?: string;
  
  // Relationships
  contactId?: number;
  organizationId?: number;
  assignedUserId?: number;
  
  // Related data (populated by backend)
  contact?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  organization?: {
    id: number;
    name: string;
  };
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface DealFormData {
  title: string;
  description?: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  source: 'website' | 'referral' | 'social_media' | 'cold_call' | 'event' | 'other';
  tags?: string[];
  notes?: string;
  contactId?: number;
  organizationId?: number;
}

export interface DealFilters {
  search?: string;
  stage?: string;
  priority?: string;
  source?: string;
  assignedUserId?: number;
  contactId?: number;
  organizationId?: number;
  minValue?: number;
  maxValue?: number;
}

export interface DealListResponse {
  deals: Deal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
