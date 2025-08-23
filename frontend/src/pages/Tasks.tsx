import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetail } from '@/components/tasks/TaskDetail';

export const Tasks: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TaskList />} />
      <Route path="new" element={<TaskForm />} />
      <Route path=":id" element={<TaskDetail />} />
      <Route path=":id/edit" element={<TaskForm />} />
    </Routes>
  );
};
