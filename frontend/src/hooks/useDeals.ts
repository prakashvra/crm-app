import { useState, useCallback } from 'react';
import { Deal, DealFormData, DealFilters, DealListResponse } from '@/types/deal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useDeals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    if (error.response?.data?.error) {
      setError(error.response.data.error);
    } else if (error.message) {
      setError(error.message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  const getDeals = useCallback(async (
    filters: DealFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<DealListResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.stage && { stage: filters.stage }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.source && { source: filters.source }),
        ...(filters.assignedUserId && { assignedUserId: filters.assignedUserId.toString() }),
        ...(filters.contactId && { contactId: filters.contactId.toString() }),
        ...(filters.organizationId && { organizationId: filters.organizationId.toString() }),
        ...(filters.minValue && { minValue: filters.minValue.toString() }),
        ...(filters.maxValue && { maxValue: filters.maxValue.toString() })
      });

      const response = await fetch(`${API_BASE_URL}/deals?${queryParams}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeal = useCallback(async (id: number): Promise<Deal | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/deals/${id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deal not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.deal;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeal = useCallback(async (dealData: DealFormData): Promise<Deal | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/deals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          throw new Error(errorData.errors.map((e: any) => e.msg).join(', '));
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.deal;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (id: number, dealData: Partial<DealFormData>): Promise<Deal | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/deals/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          throw new Error(errorData.errors.map((e: any) => e.msg).join(', '));
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.deal;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeal = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/deals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/deals/pipeline`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.pipeline;
    } catch (error) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    getPipeline,
    setError
  };
};
