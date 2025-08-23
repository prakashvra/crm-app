import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DealList } from '@/components/deals/DealList';
import { DealForm } from '@/components/deals/DealForm';
import { DealDetail } from '@/components/deals/DealDetail';

const Deals: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <Routes>
          <Route index element={<DealList />} />
          <Route path="new" element={<DealForm />} />
          <Route path=":id" element={<DealDetail />} />
          <Route path=":id/edit" element={<DealForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default Deals;
