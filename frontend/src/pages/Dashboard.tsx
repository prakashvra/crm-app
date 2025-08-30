import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tasksApi, dealsApi, contactsApi } from '@/lib/api';
import {
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  onClick?: () => void;
}> = ({ title, value, icon: Icon, color, onClick }) => (
  <div 
    className={`bg-white overflow-hidden shadow rounded-lg ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    onClick={onClick}
  >
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: tasksDashboard } = useQuery({
    queryKey: ['tasks', 'dashboard'],
    queryFn: tasksApi.getDashboard,
  });

  const { data: pipeline } = useQuery({
    queryKey: ['deals', 'pipeline'],
    queryFn: dealsApi.getPipeline,
  });

  const { data: contacts } = useQuery({
    queryKey: ['contacts', 'summary'],
    queryFn: () => contactsApi.getAll({ limit: 1 }),
  });

  const stats = [
    {
      title: 'Total Contacts',
      value: contacts?.pagination?.total || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      onClick: () => navigate('/contacts'),
    },
    {
      title: 'Active Deals',
      value: pipeline?.pipeline?.reduce((acc: number, stage: any) => {
        if (!['closed_won', 'closed_lost'].includes(stage.stage)) {
          return acc + parseInt(stage.count);
        }
        return acc;
      }, 0) || 0,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      onClick: () => navigate('/deals'),
    },
    {
      title: 'Pending Tasks',
      value: tasksDashboard?.summary?.find((s: any) => s.status === 'pending')?.count || 0,
      icon: CheckCircleIcon,
      color: 'text-yellow-600',
      onClick: () => navigate('/tasks'),
    },
    {
      title: 'Overdue Tasks',
      value: tasksDashboard?.overdueTasks || 0,
      icon: CheckCircleIcon,
      color: 'text-red-600',
      onClick: () => navigate('/tasks'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your CRM today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pipeline Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sales Pipeline
            </h3>
            <div className="mt-5">
              {pipeline?.pipeline?.map((stage: any) => (
                <div key={stage.stage} className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {stage.stage.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{stage.count} deals</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${parseFloat(stage.totalValue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Task Summary
            </h3>
            <div className="mt-5">
              {tasksDashboard?.summary?.map((status: any) => (
                <div key={status.status} className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {status.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">{status.count} tasks</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-600">Overdue</span>
                  <span className="text-sm text-red-600">{tasksDashboard?.overdueTasks || 0} tasks</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">Due Today</span>
                  <span className="text-sm text-blue-600">{tasksDashboard?.todayTasks || 0} tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              className="btn-primary"
              onClick={() => navigate('/contacts/new')}
            >
              Add Contact
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/deals/new')}
            >
              Create Deal
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/tasks/new')}
            >
              New Task
            </button>
            <button 
              className="btn-primary"
              onClick={() => navigate('/organizations/new')}
            >
              Add Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
