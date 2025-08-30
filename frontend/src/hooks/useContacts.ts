import { useState } from 'react';
import { Contact, ContactFormData, ContactFilters, ContactListResponse } from '@/types/contact';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchContacts = async (filters?: ContactFilters, page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${API_BASE}/contacts?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data: ContactListResponse = await response.json();
      setContacts(data.contacts);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getContact = async (id: number): Promise<Contact | null> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching contact with ID:', id);
      const response = await fetch(`${API_BASE}/contacts/${id}`, {
        headers: getAuthHeaders(),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      console.log('Extracted contact:', data.contact);
      
      return data.contact;
    } catch (err) {
      console.error('Error in getContact:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contact');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: ContactFormData): Promise<Contact | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create contact');
      }

      const contact: Contact = await response.json();
      setContacts(prev => [contact, ...prev]);
      return contact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contact');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: number, contactData: Partial<ContactFormData>): Promise<Contact | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contact');
      }

      const contact: Contact = await response.json();
      setContacts(prev => prev.map(c => c.id === id ? contact : c));
      return contact;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      setContacts(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
  };
};
