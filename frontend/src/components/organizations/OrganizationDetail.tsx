import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Organization } from '@/types/organization';
import {
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export const OrganizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrganization, deleteOrganization, loading, error } = useOrganizations();
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrganization();
    }
  }, [id]);

  const loadOrganization = async () => {
    if (!id) return;
    
    const organizationData = await getOrganization(Number(id));
    if (organizationData) {
      setOrganization(organizationData);
    } else {
      toast.error('Organization not found');
      navigate('/organizations');
    }
  };

  const handleDelete = async () => {
    if (!organization) return;
    
    const success = await deleteOrganization(organization.id);
    if (success) {
      toast.success('Organization deleted successfully');
      navigate('/organizations');
    }
    setShowDeleteModal(false);
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeColor = (size: string) => {
    if (!size) return 'bg-gray-100 text-gray-800';
    switch (size) {
      case 'enterprise': return 'bg-red-100 text-red-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'small': return 'bg-green-100 text-green-800';
      case 'startup': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Organization not found</h3>
        <p className="mt-1 text-sm text-gray-500">The organization you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/organizations')}
            className="text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-sm text-gray-500">{organization.industry || 'No industry specified'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/organizations/${organization.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organization.email && (
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${organization.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {organization.email}
                    </a>
                  </div>
                </div>
              )}

              {organization.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${organization.phone}`} className="text-sm font-medium text-gray-900">
                      {organization.phone}
                    </a>
                  </div>
                </div>
              )}

              {organization.website && (
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {organization.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {organization.address && (organization.address.street || organization.address.city) && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {organization.address.street && (
                      <>
                        {organization.address.street}
                        <br />
                      </>
                    )}
                    {organization.address.city && organization.address.state
                      ? `${organization.address.city}, ${organization.address.state}`
                      : organization.address.city || organization.address.state
                    }
                    {organization.address.zipCode && ` ${organization.address.zipCode}`}
                    {organization.address.country && (
                      <>
                        <br />
                        {organization.address.country}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {organization.description && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{organization.description}</p>
            </div>
          )}

          {/* Social Media */}
          {organization.socialProfiles && (organization.socialProfiles.linkedin || organization.socialProfiles.twitter || organization.socialProfiles.facebook) && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
              <div className="space-y-3">
                {organization.socialProfiles.linkedin && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
                    <a href={organization.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {organization.socialProfiles.linkedin}
                    </a>
                  </div>
                )}
                {organization.socialProfiles.twitter && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Twitter</p>
                    <a href={organization.socialProfiles.twitter} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {organization.socialProfiles.twitter}
                    </a>
                  </div>
                )}
                {organization.socialProfiles.facebook && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Facebook</p>
                    <a href={organization.socialProfiles.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      {organization.socialProfiles.facebook}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacts */}
          {organization.contacts && organization.contacts.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contacts ({organization.contacts.length})</h3>
              <div className="space-y-3">
                {organization.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.email && (
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Classification */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Classification</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(organization.status)}`}>
                  {organization.status ? organization.status.charAt(0).toUpperCase() + organization.status.slice(1) : 'Unknown'}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Size</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSizeColor(organization.size)}`}>
                  {organization.size ? organization.size.charAt(0).toUpperCase() + organization.size.slice(1) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Organization Metrics */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Metrics</h3>
            <div className="space-y-4">
              {organization.employees !== undefined && organization.employees !== null && (
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="text-sm font-medium text-gray-900">
                      {organization.employees.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {organization.revenue !== undefined && organization.revenue !== null && (
                <div className="flex items-center space-x-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Annual Revenue</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${organization.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {organization.tags && organization.tags.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {organization.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assigned User */}
          {organization.assignedUser && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned User</h3>
              <p className="text-sm font-medium text-gray-900">
                {organization.assignedUser.firstName} {organization.assignedUser.lastName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <TrashIcon className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Organization</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{organization.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
