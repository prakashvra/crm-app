import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, deleteTask, loading, error } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    if (!id) return;
    
    const taskData = await getTask(parseInt(id));
    if (taskData) {
      setTask(taskData);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    const success = await deleteTask(parseInt(id));
    if (success) {
      toast.success('Task deleted successfully!');
      navigate('/tasks');
    } else if (error) {
      toast.error(error);
    }
    setShowDeleteConfirm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return priorityStyles[priority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate?: string, status?: string) => {
    if (!dueDate || status === 'completed' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task not found</h3>
        <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/tasks"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Tasks
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}>
                {task.priority} priority
              </span>
              {isOverdue(task.dueDate, task.status) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/tasks/${task.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
            
            {task.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              {task.completedDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Completed Date</h3>
                  <div className="flex items-center text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {formatDate(task.completedDate)}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h3>
                <div className="flex items-center text-sm text-gray-900">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
                <div className="flex items-center text-sm text-gray-900">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDateTime(task.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          {(task.estimatedHours || task.actualHours) && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.estimatedHours && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Estimated Hours</h3>
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {task.estimatedHours} hours
                    </div>
                  </div>
                )}
                {task.actualHours && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Actual Hours</h3>
                    <div className="flex items-center text-sm text-gray-900">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {task.actualHours} hours
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{task.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Relationships */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Items</h2>
            <div className="space-y-4">
              {task.contact && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Contact</h3>
                  <Link
                    to={`/contacts/${task.contact.id}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-900"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    {task.contact.firstName} {task.contact.lastName}
                  </Link>
                </div>
              )}

              {task.deal && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Deal</h3>
                  <Link
                    to={`/deals/${task.deal.id}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-900"
                  >
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    {task.deal.title}
                  </Link>
                </div>
              )}

              {task.organization && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Organization</h3>
                  <Link
                    to={`/organizations/${task.organization.id}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-900"
                  >
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {task.organization.name}
                  </Link>
                </div>
              )}

              {!task.contact && !task.deal && !task.organization && (
                <p className="text-sm text-gray-500">No related items</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-900">{task.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Priority:</span>
                <span className="font-medium text-gray-900">{task.priority}</span>
              </div>
              {task.estimatedHours && task.actualHours && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Variance:</span>
                  <span className={`font-medium ${
                    task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {task.actualHours > task.estimatedHours ? '+' : ''}
                    {(task.actualHours - task.estimatedHours).toFixed(1)}h
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">{formatDateTime(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <TrashIcon className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Task</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
