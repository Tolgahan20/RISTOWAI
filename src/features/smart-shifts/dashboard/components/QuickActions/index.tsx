import { Calendar, Users, Clock, Briefcase } from 'react-feather';
import styles from './quick-actions.module.css';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: <Calendar size={20} />,
      label: 'Genera Turni AI',
      path: '/dashboard/smart-shifts/ai-scheduler',
    },
    {
      icon: <Users size={20} />,
      label: 'Gestisci Staff',
      path: '/dashboard/smart-shifts/staff',
    },
    {
      icon: <Clock size={20} />,
      label: 'Configura Fasi',
      path: '/dashboard/smart-shifts/phases',
    },
    {
      icon: <Briefcase size={20} />,
      label: 'Vedi Tutti i Turni',
      path: '/dashboard/smart-shifts/schedules',
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Azioni Rapide</h2>
      <div className={styles.grid}>
        {actions.map((action) => (
          <button
            key={action.path}
            className={styles.button}
            onClick={() => {
              window.location.href = action.path;
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
