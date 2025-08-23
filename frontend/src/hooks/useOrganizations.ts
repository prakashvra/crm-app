import { useState } from 'react';
import { Organization, OrganizationFormData, OrganizationFilters, OrganizationListResponse } from '@/types/organization';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const useOrganizations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrganizations = async (filters?: OrganizationFilters, page = 1, limit = 20): Promise<OrganizationListResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.industry) params.append('industry', filters.industry);

      const response = await fetch(`${API_BASE}/organizations?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOrganization = async (id: number): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/organizations/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organization');
      }

      const data = await response.json();
      return data.organization;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (organizationData: OrganizationFormData): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/organizations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to create organization');
      }

      const data = await response.json();
      return data.organization;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (id: number, organizationData: Partial<OrganizationFormData>): Promise<Organization | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/organizations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to update organization');
      }

      const data = await response.json();
      return data.organization;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/organizations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete organization');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
