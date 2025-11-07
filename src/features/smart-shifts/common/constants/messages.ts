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

export const VENUE_MESSAGES = {
  create: {
    success: 'Locale creato con successo!',
    error: 'Errore nella creazione del locale',
  },
  update: {
    success: 'Locale aggiornato con successo!',
    error: 'Errore nell\'aggiornamento del locale',
  },
  delete: {
    success: 'Locale eliminato con successo!',
    error: 'Errore nell\'eliminazione del locale',
    confirm: 'Sei sicuro di voler eliminare questo locale? Questa azione non può essere annullata.',
    hasStaff: 'Impossibile eliminare il locale: ha staff associato',
  },
  load: {
    error: 'Errore nel caricamento dei locali',
  },
  validation: {
    nameRequired: 'Il nome è obbligatorio',
    typeRequired: 'Seleziona un tipo di locale',
    timezoneRequired: 'Il fuso orario è obbligatorio',
    invalidTime: 'Orario non valido',
  },
};

export const STAFF_MESSAGES = {
  create: {
    success: 'Dipendente aggiunto con successo!',
    error: 'Errore nell\'aggiunta del dipendente',
  },
  update: {
    success: 'Dipendente aggiornato con successo!',
    error: 'Errore nell\'aggiornamento del dipendente',
  },
  delete: {
    success: 'Dipendente eliminato con successo!',
    error: 'Errore nell\'eliminazione del dipendente',
    confirm: 'Sei sicuro di voler eliminare questo dipendente? Questa azione non può essere annullata.',
  },
  load: {
    error: 'Errore nel caricamento dello staff',
  },
  validation: {
    roleRequired: 'Il ruolo è obbligatorio',
    contractTypeRequired: 'Seleziona un tipo di contratto',
    weeklyHoursRequired: 'Le ore settimanali sono obbligatorie',
    hourlyRateRequired: 'La tariffa oraria è obbligatoria',
    hireDateRequired: 'La data di assunzione è obbligatoria',
    invalidDate: 'Data non valida',
    invalidEmail: 'Email non valida',
    invalidPhone: 'Numero di telefono non valido',
    invalidIban: 'IBAN non valido',
    invalidCodiceFiscale: 'Codice fiscale non valido',
  },
};

export const REQUEST_MESSAGES = {
  create: {
    success: 'Richiesta creata con successo',
    error: 'Errore nella creazione della richiesta',
  },
  update: {
    success: 'Richiesta aggiornata con successo',
    error: 'Errore nell\'aggiornamento della richiesta',
  },
  delete: {
    success: 'Richiesta eliminata con successo',
    error: 'Errore nell\'eliminazione della richiesta',
    confirm: 'Sei sicuro di voler eliminare questa richiesta?',
  },
  approve: {
    success: 'Richiesta approvata con successo',
    error: 'Errore nell\'approvazione della richiesta',
    confirm: 'Sei sicuro di voler approvare questa richiesta?',
  },
  reject: {
    success: 'Richiesta rifiutata',
    error: 'Errore nel rifiuto della richiesta',
    confirm: 'Sei sicuro di voler rifiutare questa richiesta?',
  },
  cancel: {
    success: 'Richiesta annullata',
    error: 'Errore nell\'annullamento della richiesta',
    confirm: 'Sei sicuro di voler annullare questa richiesta?',
  },
  load: {
    error: 'Errore nel caricamento delle richieste',
  },
  empty: {
    title: 'Nessuna richiesta',
    description: 'Non ci sono richieste da visualizzare.',
  },
  validation: {
    endDateBeforeStart: 'La data di fine deve essere successiva alla data di inizio',
    missingShift: 'Seleziona un turno per lo scambio',
    missingStaff: 'Seleziona un dipendente per lo scambio',
  },
};
