import { useState } from 'react';

export type SchedulerTab = 'generator' | 'history';

export const useAISchedulerPage = () => {
  const [activeTab, setActiveTab] = useState<SchedulerTab>('generator');

  const getSubtitle = () => {
    return activeTab === 'generator'
      ? 'Genera automaticamente i turni con l\'intelligenza artificiale'
      : 'Visualizza lo storico delle generazioni di turni';
  };

  return {
    activeTab,
    setActiveTab,
    subtitle: getSubtitle(),
  };
};

