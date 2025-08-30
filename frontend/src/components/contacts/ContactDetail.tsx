import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useContacts } from '@/hooks/useContacts';
import { Contact } from '@/types/contact';

export const ContactDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContact, deleteContact, loading } = useContacts();
  const [contact, setContact] = useState<Contact | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    if (!id) {
      console.log('No ID provided');
      return;
    }
    
    console.log('Loading contact with ID:', id);
    try {
      const contactData = await getContact(Number(id));
      console.log('Contact data received:', contactData);
      console.log('Contact data type:', typeof contactData);
      console.log('Contact data keys:', contactData ? Object.keys(contactData) : 'null');
      
      if (contactData) {
        console.log('Setting contact data:', contactData);
        setContact(contactData);
      } else {
        console.log('No contact data returned');
        toast.error('Contact not found');
        navigate('/contacts');
      }
    } catch (error: unknown) {
      console.error('Error loading contact:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load contact';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    
    try {
      const success = await deleteContact(contact.id);
      if (success) {
        toast.success('Contact deleted successfully');
        navigate('/contacts');
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
      toast.error(errorMessage);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !contact) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/contacts')}
            className="text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {contact.firstName} {contact.lastName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Contact Details
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/contacts/${contact.id}/edit`)}
            className="btn-secondary flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
              </div>

              {contact.email && (
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {contact.email}
                    </a>
                    <p className="text-sm text-gray-500">Email</p>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      {contact.phone}
                    </a>
                    <p className="text-sm text-gray-500">Phone</p>
                  </div>
                </div>
              )}

              {contact.title && (
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.title}</p>
                    <p className="text-sm text-gray-500">Job Title</p>
                  </div>
                </div>
              )}

              {contact.department && (
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.department}</p>
                    <p className="text-sm text-gray-500">Department</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status & Classification */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : 'Unknown'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Priority</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(contact.priority)}`}>
                  {contact.priority ? contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1) : 'Unknown'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Source</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {contact.source ? contact.source.replace('_', ' ') : 'Unknown'}
                </p>
              </div>

              {contact.nextFollowUpDate && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(contact.nextFollowUpDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Next Follow-up</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-500">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {contact.address && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-500">Address</p>
              </div>
              <div className="text-sm text-gray-900">
                {contact.address.street && <p>{contact.address.street}</p>}
                {(contact.address.city || contact.address.state || contact.address.zipCode) && (
                  <p>
                    {contact.address.city}
                    {contact.address.city && contact.address.state && ', '}
                    {contact.address.state} {contact.address.zipCode}
                  </p>
                )}
                {contact.address.country && <p>{contact.address.country}</p>}
              </div>
            </div>
          )}

          {/* Social Media */}
          {contact.socialMedia && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Social Media</p>
              <div className="space-y-2">
                {contact.socialMedia.linkedin && (
                  <a
                    href={contact.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500 block"
                  >
                    LinkedIn: {contact.socialMedia.linkedin}
                  </a>
                )}
                {contact.socialMedia.twitter && (
                  <a
                    href={contact.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500 block"
                  >
                    Twitter: {contact.socialMedia.twitter}
                  </a>
                )}
                {contact.socialMedia.facebook && (
                  <a
                    href={contact.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-500 block"
                  >
                    Facebook: {contact.socialMedia.facebook}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Contact</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {contact.firstName} {contact.lastName}? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
