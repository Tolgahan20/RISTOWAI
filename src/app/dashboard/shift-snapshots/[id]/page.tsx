'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/layout';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { useShiftSnapshot, useSnapshotHistory } from '@/features/smart-shifts/shift-snapshots/hooks';
import { SnapshotDetail } from '@/features/smart-shifts/shift-snapshots/components';
import pageLayout from '@/styles/page-layout.module.css';

export default function SnapshotDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: snapshot, isLoading, error } = useShiftSnapshot(id);
  const { data: history } = useSnapshotHistory(id);

  if (isLoading) return <LoadingState />;
  if (error || !snapshot) return <ErrorState message="Snapshot non trovato" />;

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title={`Snapshot v${snapshot.version}`}
        subtitle={`${new Date(snapshot.startDate).toLocaleDateString('it-IT')} - ${new Date(snapshot.endDate).toLocaleDateString('it-IT')}`}
        showBackButton
        backButtonUrl="/dashboard/shift-snapshots"
      />
      <SnapshotDetail snapshot={snapshot} history={history || []} />
    </div>
  );
}

