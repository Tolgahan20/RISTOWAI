'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { RolesList } from '@/features/smart-shifts/roles/components';
import pageLayout from '@/styles/page-layout.module.css';

export default function RolesPage() {
  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Gestione Ruoli"
        subtitle="Gestisci i ruoli di sistema e personalizzati per il tuo ristorante"
      />
      <RolesList />
    </div>
  );
}

