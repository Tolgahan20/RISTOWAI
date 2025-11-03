export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: 'Accesso effettuato con successo',
    ERROR: 'Email o password non validi',
    NETWORK_ERROR: 'Impossibile connettersi al server',
  },
  REGISTER: {
    SUCCESS: 'Registrazione completata. Controlla la tua email',
    ERROR: 'Impossibile creare l\'account',
    EMAIL_EXISTS: 'Esiste già un account con questa email',
  },
  PASSWORD: {
    FORGOT: {
      SUCCESS: 'Istruzioni per il reset inviate alla tua email',
      ERROR: 'Impossibile processare la richiesta di reset',
    },
    RESET: {
      SUCCESS: 'Password reimpostata con successo',
      ERROR: 'Impossibile reimpostare la password',
      INVALID_TOKEN: 'Token non valido o scaduto',
    },
  },
  EMAIL: {
    VERIFY: {
      SUCCESS: 'Email verificata con successo',
      ERROR: 'Impossibile verificare l\'email',
      INVALID_TOKEN: 'Token di verifica non valido o scaduto',
    },
  },
  TOKEN: {
    REFRESH_ERROR: 'Sessione scaduta. Effettua nuovamente l\'accesso',
    REVOKE_SUCCESS: 'Logout effettuato con successo',
    REVOKE_ERROR: 'Errore durante il logout',
  },
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Questo campo è obbligatorio',
  EMAIL: {
    INVALID: 'Inserisci un indirizzo email valido',
  },
  PASSWORD: {
    MIN_LENGTH: 'La password deve contenere almeno 8 caratteri',
    MATCH: 'Le password non coincidono',
  },
} as const;

export const COMMON_MESSAGES = {
  NETWORK_ERROR: 'Errore di rete. Controlla la tua connessione',
  UNKNOWN_ERROR: 'Si è verificato un errore imprevisto',
  SESSION_EXPIRED: 'La tua sessione è scaduta. Effettua nuovamente l\'accesso',
  UNAUTHORIZED: 'Non sei autorizzato a eseguire questa azione',
  FORBIDDEN: 'Non hai i permessi per eseguire questa azione',
  NOT_FOUND: 'La risorsa richiesta non è stata trovata',
} as const;

export const ONBOARDING_MESSAGES = {
  START: {
    SUCCESS: 'Onboarding iniziato',
    ERROR: 'Impossibile avviare l\'onboarding',
  },
  SAVE: {
    SUCCESS: 'Informazioni salvate con successo',
    ERROR: 'Impossibile salvare le informazioni',
  },
  COMPLETE: {
    SUCCESS: 'Configurazione completata! Benvenuto su Ristowai',
    ERROR: 'Impossibile completare la configurazione',
  },
  VENUE_INFO: {
    REQUIRED: 'Compila tutti i campi obbligatori',
    SUCCESS: 'Informazioni locale salvate',
  },
  WORK_PHASES: {
    MIN_ONE: 'Aggiungi almeno una fase di lavoro',
    SUCCESS: 'Fasi di lavoro salvate',
  },
  STAFF_IMPORT: {
    MIN_ONE: 'Aggiungi almeno un membro dello staff',
    SUCCESS: 'Staff importato con successo',
  },
  HOLIDAY_CALENDAR: {
    SUCCESS: 'Calendario festività salvato',
  },
  TIME_CAPTURE: {
    SUCCESS: 'Impostazioni rilevazione presenze salvate',
  },
} as const;

export const AI_SCHEDULER_MESSAGES = {
  generateSuccess: 'Turni generati con successo!',
  generateError: 'Errore nella generazione dei turni',
  publishSuccess: 'Turni pubblicati con successo!',
  publishError: 'Errore nella pubblicazione dei turni',
};


export const SCHEDULES_MESSAGES = {
  title: 'Turni Settimanali',
  loading: 'Caricamento turni...',
  error: {
    loadFailed: 'Errore nel caricamento dei turni',
    retry: 'Riprova',
  },
  empty: {
    title: 'Nessun turno programmato',
    description: 'Non ci sono turni per questa settimana.',
    action: 'Genera Turni con AI',
  },
  navigation: {
    previous: 'Precedente',
    today: 'Oggi',
    next: 'Prossima',
  },
  venue: {
    label: 'Locale:',
  },
  week: {
    format: (weekNumber: number, year: number) => `Settimana ${weekNumber}, ${year}`,
  },
};
