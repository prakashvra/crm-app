import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ContactDetail } from '@/components/contacts/ContactDetail';

export const Contacts: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ContactList />} />
      <Route path="new" element={<ContactForm mode="create" />} />
      <Route path=":id" element={<ContactDetail />} />
      <Route path=":id/edit" element={<ContactForm mode="edit" />} />
    </Routes>
  );
};
