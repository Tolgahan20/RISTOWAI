import { useState } from 'react';
import { useUnresolvedAnomalies } from './usePunchClock';
import { usePunchClockActions } from './usePunchClockActions';

export const useAnomaliesPanel = (venueId: string) => {
  const { data: anomalies, isLoading, error } = useUnresolvedAnomalies(venueId);
  const { resolveAnomaly } = usePunchClockActions();
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({});
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (eventId: string, approved: boolean) => {
    const notes = managerNotes[eventId] || '';
    
    if (!notes.trim()) {
      alert('Per favore, inserisci una nota prima di risolvere l\'anomalia.');
      return;
    }

    try {
      setResolvingId(eventId);
      await resolveAnomaly.mutateAsync({
        eventId,
        data: {
          managerNotes: notes,
          approved,
        },
      });
      
      // Clear the notes for this event
      setManagerNotes((prev) => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
    } catch (err) {
      console.error('Failed to resolve anomaly:', err);
      alert('Errore nella risoluzione dell\'anomalia');
    } finally {
      setResolvingId(null);
    }
  };

  const updateNotes = (eventId: string, notes: string) => {
    setManagerNotes((prev) => ({
      ...prev,
      [eventId]: notes,
    }));
  };

  return {
    anomalies,
    isLoading,
    error,
    managerNotes,
    updateNotes,
    resolvingId,
    handleResolve,
  };
};

