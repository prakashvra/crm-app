import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OrganizationList } from '@/components/organizations/OrganizationList';
import { OrganizationForm } from '@/components/organizations/OrganizationForm';
import { OrganizationDetail } from '@/components/organizations/OrganizationDetail';

export const Organizations: React.FC = () => {
  return (
    <Routes>
      <Route index element={<OrganizationList />} />
      <Route path="new" element={<OrganizationForm mode="create" />} />
      <Route path=":id" element={<OrganizationDetail />} />
      <Route path=":id/edit" element={<OrganizationForm mode="edit" />} />
    </Routes>
  );
};
