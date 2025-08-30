export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  notes?: string;
  assignedUserId: number;
  contactId?: number;
  dealId?: number;
  organizationId?: number;
  createdAt: string;
  updatedAt: string;
  assignedUser?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  contact?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
  };
  deal?: {
    id: number;
    title: string;
  };
  organization?: {
    id: number;
    name: string;
  };
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = Task;

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  notes?: string;
  contactId?: number;
  dealId?: number;
  organizationId?: number;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignedUserId?: number;
  contactId?: number;
  dealId?: number;
  organizationId?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
