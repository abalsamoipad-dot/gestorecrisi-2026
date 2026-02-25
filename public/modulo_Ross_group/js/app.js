/* ============================================================
   ROSS GROUP S.R.L. — QUESTIONARIO STRUTTURA (Assetti OAC)
   Applicazione SPA — Logica form, validazione, Google Sheets
   v2 — Risposte multiple + Altro
   ============================================================ */

// ──────────────────────────────────────────────
// CONFIGURAZIONE
// ──────────────────────────────────────────────
const CONFIG = {
  // 🔗 INSERIRE QUI L'URL del Web App Google Apps Script dopo il deploy
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbztfonWor-uYcnLEvKI6sIqT77Mc26xfZIf7BMQ3wThm_jn169ALEKAkqZzV2fQkq-I/exec',
  // Se vuoto, il form mostrerà un avviso in console ma permetterà comunque il test dell'interfaccia
};

// ──────────────────────────────────────────────
// SVG ICONS
// ──────────────────────────────────────────────
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkWhite: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrowDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrowRight: '→',
  arrowLeft: '←',
  successCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
};

// ──────────────────────────────────────────────
// MODULI SELEZIONABILI (Dashboard)
// ──────────────────────────────────────────────
const MODULES = [
  { key: 'A', icon: '🏪', name: 'Vendite / POS / Cassa', desc: 'Procedure di vendita, resi, chiusura cassa, incassi' },
  { key: 'B', icon: '📦', name: 'Magazzino / Logistica', desc: 'Ricezione merce, trasferimenti, inventari, stagionalità' },
  { key: 'C', icon: '🛒', name: 'Acquisti / Fornitori', desc: 'Processo acquisto, controlli DDT/fatture, pagamenti' },
  { key: 'D', icon: '📊', name: 'Contabilità / Fiscale', desc: 'Chiusure contabili, IVA, riconciliazioni bancarie' },
  { key: 'E', icon: '👥', name: 'Presenze / Paghe', desc: 'Turni, presenze, flusso paghe, contributi' },
  { key: 'F', icon: '💻', name: 'IT / Sistemi / Dati', desc: 'Flussi dati, gestione accessi, continuità operativa' },
];

// Auto-suggestion: Area funzionale → Moduli consigliati
const AREA_MODULE_MAP = {
  'Vendite / Cassa / POS': ['A'],
  'Magazzino / Logistica / Inventari': ['B'],
  'Acquisti / Fornitori': ['C'],
  'Amministrazione / Contabilità': ['C', 'D'],
  'Fiscale / Adempimenti': ['D'],
  'HR / Presenze / Supporto paghe': ['E'],
  'IT / Supporto sistemi': ['F'],
  'Altro': [],
};

// ──────────────────────────────────────────────
// DATI COMPLETI DELLE DOMANDE (v2 — risposte multiple)
// ──────────────────────────────────────────────
const STEPS = [
  // ─── STEP 0: WELCOME ───
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Ross Group S.R.L.',
    subtitle: 'Questionario Struttura — Assetti OAC',
  },

  // ─── STEP 1: DATI INTERVISTATO ───
  {
    id: 'metadata',
    type: 'form',
    label: 'Sezione 0',
    title: 'Premessa e dati intervistato',
    subtitle: 'Compilare i dati identificativi e la dichiarazione di riservatezza.',
    fields: [
      {
        key: 'consenso',
        type: 'consent',
        label: 'Presa visione e dichiarazione di riservatezza',
        consentText: 'Dichiaro di aver compreso la finalità del questionario e di fornire risposte veritiere e complete, nei limiti delle mie conoscenze.',
        required: true,
      },
      { key: 'email', type: 'text', inputType: 'email', label: 'Indirizzo email', placeholder: 'nome@esempio.com', required: true },
      { key: 'data_intervista', type: 'date', label: 'Data intervista / compilazione', required: true },
      { key: 'nome', type: 'text', label: 'Cognome e Nome intervistato', placeholder: 'es. Rossi Mario', required: true },
      {
        key: 'ruolo',
        type: 'select',
        label: 'Ruolo / Mansione',
        options: [
          '', 'Responsabile punto vendita', 'Addetto vendita / commesso',
          'Cassiere', 'Magazziniere', 'Responsabile acquisti',
          'Addetto amministrazione', 'Responsabile contabilità',
          'Consulente esterno', 'Titolare / Direzione',
          'Altro',
        ],
        required: true,
        hasOther: true,
      },
      {
        key: 'sede',
        type: 'select',
        label: 'Sede / Punto vendita di riferimento',
        options: [
          '', 'Sede amministrativa / ufficio',
          'P.V. Agrigento - Viale L. Sciascia n. 70',
          'P.V. Agrigento - Viale L. Sciascia n. 19',
          'P.V. Canicattì - Via R. Livatino n. 2',
          'P.V. Raffadali - Via F16 n. 5',
          'Altro',
        ],
        required: true,
        hasOther: true,
      },
      {
        key: 'area',
        type: 'radio',
        label: 'Area / Funzione prevalente',
        options: [
          'Vendite / Cassa / POS',
          'Magazzino / Logistica / Inventari',
          'Acquisti / Fornitori',
          'Amministrazione / Contabilità',
          'Fiscale / Adempimenti',
          'HR / Presenze / Supporto paghe',
          'IT / Supporto sistemi',
          'Altro',
        ],
        required: true,
      },
      {
        key: 'anzianita',
        type: 'radio',
        label: 'Anzianità nel ruolo (fascia)',
        options: ['Meno di 6 mesi', 'Da 6 mesi a 2 anni', 'Da 2 a 5 anni', 'Oltre 5 anni'],
        required: true,
      },
      {
        key: 'intervistatore',
        type: 'radio',
        label: 'Intervistatore',
        options: ['Dott. Balsamo Antonio', 'Dott. Marotta Giuseppe', 'Questionario compilato in autonomia'],
        required: true,
      },
    ],
  },

  // ─── STEP 2: DASHBOARD ───
  {
    id: 'dashboard',
    type: 'dashboard',
    label: 'Selezione Moduli',
    title: 'Seleziona le aree di competenza',
    subtitle: 'Scegli i moduli pertinenti alle tue mansioni. Le sezioni Contesto, Controlli, Criticità e Follow-up sono sempre incluse.',
  },

  // ─── STEP 3: CONTESTO ORGANIZZATIVO (sempre) ───
  {
    id: 'contesto',
    type: 'form',
    label: 'Sezione I',
    title: 'Contesto Organizzativo',
    subtitle: 'Descrivere il proprio inquadramento e le interazioni operative.',
    alwaysShow: true,
    fields: [
      {
        key: 'D1',
        type: 'radio_other',
        label: '1. Qual è la sua principale responsabilità operativa?',
        options: [
          'Gestione vendite e rapporto con clienti',
          'Gestione magazzino e logistica',
          'Amministrazione e contabilità',
          'Coordinamento e supervisione di più aree',
        ],
        required: true,
      },
      {
        key: 'D2',
        type: 'checkbox_other',
        label: '2. Con quali interlocutori interagisce maggiormente?',
        options: [
          'Colleghi dello stesso punto vendita',
          'Responsabili / direzione aziendale',
          'Fornitori e corrieri',
          'Consulente paghe / commercialista',
          'Clienti finali',
        ],
        required: true,
      },
      {
        key: 'D3',
        type: 'checkbox_other',
        label: '3. Quali strumenti/sistemi utilizza quotidianamente?',
        options: [
          'POS / registratore di cassa',
          'Gestionale interno (magazzino/vendite)',
          'Fogli Excel / Google Sheets',
          'Email / WhatsApp per comunicazioni operative',
          'Software contabilità',
        ],
        required: true,
      },
      {
        key: 'D4',
        type: 'checkbox_other',
        label: '4. Quali criticità riscontra nella struttura organizzativa?',
        options: [
          'Ruoli e responsabilità poco chiari',
          'Comunicazione lenta tra sedi/funzioni',
          'Procedure non formalizzate o assenti',
          'Sistemi informatici inadeguati o scollegati',
          'Nessuna criticità rilevante',
        ],
        required: true,
      },
      {
        key: 'D4bis',
        type: 'scale',
        label: '4-bis. Quanto sono chiare (per Lei) le responsabilità e i confini operativi del suo ruolo?',
        helper: '1 = per nulla chiare · 5 = completamente chiare',
        min: 1, max: 5,
        labels: { 1: 'Per nulla', 5: 'Completamente' },
        required: true,
      },
    ],
  },

  // ─── STEP 4: A. VENDITE / POS / CASSA ───
  {
    id: 'vendite',
    type: 'form',
    label: 'Sezione II-A',
    title: 'Vendite / POS / Cassa',
    subtitle: 'Procedure di vendita, resi, chiusura cassa, gestione incassi.',
    moduleKey: 'A',
    fields: [
      {
        key: 'D5',
        type: 'radio_other',
        label: '5. Come si svolge la procedura di vendita standard?',
        options: [
          'Accoglienza → scelta articoli → cassa POS → emissione scontrino',
          'Cliente autonomo → cassa con barcode → scontrino automatico',
          'Vendita assistita → preventivo/ordine → pagamento → DDT/fattura',
          'Procedura mista (dipende dal tipo di cliente)',
        ],
        required: true,
      },
      {
        key: 'D5bis',
        type: 'radio_other',
        label: '5-bis. Come vengono gestite scontistiche e promozioni?',
        options: [
          'Sconti preimpostati nel sistema dalla direzione',
          'Sconti decisi dal responsabile punto vendita (entro un limite)',
          'Promozioni stagionali centralizzate (saldi, Black Friday, ecc.)',
          'Fidelity card con accumulo punti / sconti dedicati',
          'Non esistono politiche strutturate di sconto',
        ],
        required: true,
      },
      {
        key: 'D6',
        type: 'radio_other',
        label: '6. Come vengono gestiti resi e cambi merce?',
        options: [
          'Reso/cambio con scontrino entro 30 gg, autorizzato dal responsabile',
          'Cambio taglia/colore diretto senza autorizzazione',
          'Buono/voucher al posto del rimborso',
          'Procedura non formalizzata, decisa caso per caso',
        ],
        required: true,
      },
      {
        key: 'D7',
        type: 'radio_other',
        label: '7. Come avviene la chiusura cassa di fine giornata?',
        options: [
          'Z-report + quadratura contante + deposito in cassaforte',
          'Z-report + verifica POS + invio report alla direzione',
          'Chiusura automatica dal gestionale + verifica manuale',
          'Solo Z-report senza quadratura sistematica',
        ],
        required: true,
      },
      {
        key: 'D8',
        type: 'radio_other',
        label: '8. Chi effettua i controlli su incassi giornalieri?',
        options: [
          'Responsabile punto vendita, ogni giorno',
          'Direzione/amministrazione, con frequenza settimanale',
          'Cassiere stesso con verifica a fine turno',
          'Nessun controllo sistematico',
        ],
        required: true,
      },
      {
        key: 'D9',
        type: 'radio_other',
        label: '9. Come vengono gestiti gli accessi al POS/gestionale?',
        options: [
          'Credenziali personali per ogni operatore, gestite dalla direzione',
          'Credenziali condivise tra più operatori dello stesso PV',
          'Accesso unico senza password / sempre aperto',
          'Accesso con badge/impronta + password personale',
        ],
        required: true,
      },
      {
        key: 'D10',
        type: 'scale',
        label: '10. Quanto frequentemente riscontra criticità nella gestione cassa/incassi?',
        helper: '0 = Attività non eseguita · 1 = mai · 5 = molto frequentemente',
        min: 0, max: 5,
        labels: { 0: 'N/A', 1: 'Mai', 5: 'Molto freq.' },
        required: true,
      },
    ],
  },

  // ─── STEP 5: B. MAGAZZINO / LOGISTICA ───
  {
    id: 'magazzino',
    type: 'form',
    label: 'Sezione II-B',
    title: 'Magazzino / Logistica / Inventari',
    subtitle: 'Ricezione merce, trasferimenti, inventari, gestione stagionale.',
    moduleKey: 'B',
    fields: [
      {
        key: 'D11',
        type: 'radio_other',
        label: '11. Come avviene la ricezione merce dai fornitori?',
        options: [
          'Controllo DDT + verifica quantità/qualità + caricamento a gestionale',
          'Verifica sommaria quantità + firma DDT + caricamento successivo',
          'Scarico diretto senza controllo immediato, verifica posticipata',
          'Ricezione automatizzata con lettura barcode e verifica a sistema',
        ],
        required: true,
      },
      {
        key: 'D12',
        type: 'radio_other',
        label: '12. Come vengono gestiti i trasferimenti merce tra punti vendita?',
        options: [
          'Documento di trasferimento interno + aggiornamento su gestionale',
          'Comunicazione informale (WhatsApp/telefono) + aggiornamento manuale',
          'Trasferimenti automatici da gestionale centralizzato',
          'Non vengono effettuati trasferimenti tra PV',
        ],
        required: true,
      },
      {
        key: 'D13',
        type: 'radio_other',
        label: '13. Come e con quale frequenza si effettua l\'inventario fisico?',
        options: [
          'Inventario completo annuale + verifiche a campione trimestrali',
          'Inventario completo semestrale con riconciliazione a sistema',
          'Inventario annuale senza riconciliazione sistematica',
          'Inventario continuo/rotativo gestito dal sistema',
          'Inventario sporadico / non regolare',
        ],
        required: true,
      },
      {
        key: 'D14',
        type: 'radio_other',
        label: '14. Come vengono gestiti resi a fornitori e merce difettosa?',
        options: [
          'Nota di credito + reso documentato con DDT di reso',
          'Sostituzione diretta concordata con il fornitore',
          'Merce difettosa accantonata, gestione a fine stagione',
          'Nessuna procedura strutturata',
        ],
        required: true,
      },
      {
        key: 'D14bis',
        type: 'radio_other',
        label: '14-bis. Come viene gestita la stagionalità delle collezioni?',
        options: [
          'Passaggio collezione pianificato (SS/FW) con riordini centralizzati',
          'Saldi di fine stagione + smaltimento / outlet tra PV',
          'Gestione informale, riassortimenti su richiesta del PV',
          'Merce a stock continuativo, stagionalità poco rilevante',
        ],
        required: true,
      },
      {
        key: 'D14ter',
        type: 'radio_other',
        label: '14-ter. Quali misure di prevenzione ammanchi (shrinkage) esistono?',
        options: [
          'Sistemi antitaccheggio (placche/barriere) + conte periodiche',
          'Videosorveglianza + controlli inventariali periodici',
          'Solo conte inventariali, nessun sistema antitaccheggio',
          'Analisi differenze inventariali con azioni correttive documentate',
          'Nessuna misura strutturata',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 6: C. ACQUISTI / FORNITORI ───
  {
    id: 'acquisti',
    type: 'form',
    label: 'Sezione II-C',
    title: 'Acquisti / Fornitori / Pagamenti',
    subtitle: 'Processo di acquisto, controlli documentali, gestione pagamenti.',
    moduleKey: 'C',
    fields: [
      {
        key: 'D15',
        type: 'radio_other',
        label: '15. Come si svolge il processo di acquisto?',
        options: [
          'Fabbisogno dal PV → approvazione direzione → ordine → ricezione → fattura → pagamento',
          'Ordini diretti dal responsabile PV con limiti di spesa predefiniti',
          'Acquisti centralizzati dalla direzione senza input dai PV',
          'Processo misto: riordini automatici + acquisti su richiesta',
        ],
        required: true,
      },
      {
        key: 'D16',
        type: 'radio_other',
        label: '16. Quali controlli esistono su ordini/DDT/fatture?',
        options: [
          'Confronto sistematico ordine-DDT-fattura con gestionale',
          'Verifica manuale DDT-fattura, ordine non sempre formalizzato',
          'Solo verifica fattura al momento del pagamento',
          'Controllo automatico dal gestionale con segnalazione eccezioni',
          'Nessun controllo strutturato',
        ],
        required: true,
      },
      {
        key: 'D17',
        type: 'radio_other',
        label: '17. Come viene gestita l\'autorizzazione al pagamento?',
        options: [
          'Scadenziario gestito dall\'amministrazione, pagamento autorizzato dalla direzione',
          'Pagamenti automatici a scadenza (RiBa/SDD)',
          'Pagamenti manuali su richiesta del fornitore, approvati dalla direzione',
          'Gestione mista: automatici per fornitori ricorrenti, manuali per gli altri',
        ],
        required: true,
      },
      {
        key: 'D18',
        type: 'radio_other',
        label: '18. Come vengono gestiti ritardi o problemi di pagamento?',
        options: [
          'Comunicazione diretta con il fornitore + accordo scritto di rientro',
          'Gestione tramite amministrazione con piano di pagamento rateale',
          'Segnalazione alla direzione che decide caso per caso',
          'Nessuna procedura, si gestisce al momento',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 7: D. CONTABILITÀ / FISCALE ───
  {
    id: 'contabilita',
    type: 'form',
    label: 'Sezione II-D',
    title: 'Contabilità / Adempimenti Fiscali',
    subtitle: 'Chiusure contabili, adempimenti IVA, riconciliazioni.',
    moduleKey: 'D',
    fields: [
      {
        key: 'D19',
        type: 'radio_other',
        label: '19. Come si svolge la chiusura contabile mensile?',
        options: [
          'Riconciliazione cassa, banche, IVA e fornitori con check-list e validazione',
          'Chiusura parziale (solo banche e IVA) con verifica trimestrale completa',
          'Registrazioni contabili mensili senza riconciliazione sistematica',
          'Chiusura gestita interamente dal commercialista esterno',
        ],
        required: true,
      },
      {
        key: 'D20',
        type: 'radio_other',
        label: '20. Come vengono gestiti IVA/LIPE e adempimenti fiscali ricorrenti?',
        options: [
          'Gestione interna con calendario scadenze + verifica commercialista',
          'Delegati interamente al commercialista esterno',
          'Gestione interna con software dedicato, commercialista solo per dichiarazioni annuali',
          'Gestione mista con frequenti ritardi o dimenticanze',
        ],
        required: true,
      },
      {
        key: 'D21',
        type: 'radio_other',
        label: '21. Come si monitora lo scadenziario e la liquidità?',
        options: [
          'Scadenziario su gestionale + previsione di cassa settimanale',
          'Controllo manuale su Excel con aggiornamento periodico',
          'Monitoraggio informale basato sull\'esperienza',
          'Nessun monitoraggio strutturato della liquidità',
        ],
        required: true,
      },
      {
        key: 'D22',
        type: 'radio_other',
        label: '22. Come avvengono le riconciliazioni bancarie?',
        options: [
          'Riconciliazione mensile sistematica con gestionale/software',
          'Riconciliazione periodica su Excel / manuale',
          'Solo a chiusura annuale dal commercialista',
          'Riconciliazione automatica dal gestionale con verifica manuale eccezioni',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 8: E. PRESENZE / PAGHE ───
  {
    id: 'paghe',
    type: 'form',
    label: 'Sezione II-E',
    title: 'Presenze / Paghe / Contributi',
    subtitle: 'Rilevazione presenze, flusso verso consulente paghe, adempimenti lavoro.',
    moduleKey: 'E',
    fields: [
      {
        key: 'D23',
        type: 'radio_other',
        label: '23. Come vengono rilevate presenze, permessi e ferie?',
        options: [
          'Timbratura elettronica (badge/app) + approvazione responsabile',
          'Registro presenze cartaceo compilato dal responsabile PV',
          'Foglio Excel condiviso aggiornato manualmente',
          'Comunicazione informale al responsabile, nessun registro sistematico',
        ],
        required: true,
      },
      {
        key: 'D24',
        type: 'radio_other',
        label: '24. Come vengono trasmessi i dati al consulente paghe?',
        options: [
          'Invio mensile via email con prospetto presenze validato',
          'Accesso diretto del consulente al sistema di rilevazione presenze',
          'Comunicazione telefonica/WhatsApp con riepilogo informale',
          'Invio tramite portale del consulente paghe',
        ],
        required: true,
      },
      {
        key: 'D25',
        type: 'radio_other',
        label: '25. Quali controlli esistono su scadenze e versamenti contributivi?',
        options: [
          'Controllo interno con calendario scadenze + verifica consulente',
          'Interamente delegato al consulente paghe',
          'Controllo occasionale, nessun monitoraggio sistematico',
          'Software dedicato con alert automatici',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 9: F. IT / SISTEMI ───
  {
    id: 'it',
    type: 'form',
    label: 'Sezione II-F',
    title: 'IT / Sistemi / Flussi Dati',
    subtitle: 'Flussi dati tra POS, magazzino e contabilità. Gestione accessi e continuità operativa.',
    moduleKey: 'F',
    fields: [
      {
        key: 'D26',
        type: 'radio_other',
        label: '26. Come arrivano i dati vendita/magazzino alla contabilità?',
        options: [
          'Flusso automatico POS → gestionale → contabilità',
          'Esportazione manuale dal POS + importazione in contabilità',
          'Registrazione manuale dalla contabilità basata su report giornalieri',
          'Sistema integrato unico (ERP) che gestisce tutto automaticamente',
        ],
        required: true,
      },
      {
        key: 'D27',
        type: 'radio_other',
        label: '27. Come vengono gestiti utenti e autorizzazioni sui sistemi?',
        options: [
          'Profili utente individuali con permessi differenziati gestiti dall\'IT',
          'Credenziali condivise per ruolo (es. tutti i cassieri stesso login)',
          'Accesso unico amministratore, nessuna profilazione',
          'Gestione centralizzata con revisione periodica degli accessi',
        ],
        required: true,
      },
      {
        key: 'D28',
        type: 'radio_other',
        label: '28. Come vengono gestiti backup e incidenti informatici?',
        options: [
          'Backup automatico giornaliero su cloud + procedura di ripristino documentata',
          'Backup periodico su disco esterno / NAS locale',
          'Backup gestito dal fornitore del gestionale',
          'Nessun backup strutturato / non so come funziona',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 10: CONTROLLI E PRESIDI (sempre) ───
  {
    id: 'controlli',
    type: 'form',
    label: 'Sezione III',
    title: 'Controlli e Presidi',
    subtitle: 'Descrivere controlli formali/informali, evidenze e modalità di escalation.',
    alwaysShow: true,
    fields: [
      {
        key: 'D29',
        type: 'checkbox_other',
        label: '29. Quali controlli vengono effettuati sui processi di sua competenza?',
        options: [
          'Controllo da parte del responsabile diretto (periodico)',
          'Report automatici dal gestionale / sistema',
          'Verifica a campione da parte della direzione',
          'Audit / verifica da parte di consulente esterno',
          'Nessun controllo formale',
        ],
        required: true,
      },
      {
        key: 'D30',
        type: 'radio',
        label: '30. Esistono procedure scritte (SOP/istruzioni) per le attività che svolge?',
        options: ['Sì, aggiornate e reperibili', 'Sì, ma non aggiornate/non sempre reperibili', 'No'],
        required: true,
      },
      {
        key: 'D31',
        type: 'checkbox_other',
        label: '31. Quali strumenti/report utilizza per monitorare performance e anomalie?',
        options: [
          'Report vendite giornaliero/settimanale',
          'Report differenze cassa',
          'Report giacenze / movimenti magazzino',
          'Scadenziario pagamenti / incassi',
          'Nessun report strutturato',
        ],
        required: true,
      },
      {
        key: 'D32',
        type: 'radio_other',
        label: '32. Come vengono comunicate irregolarità/anomalie?',
        options: [
          'Segnalazione scritta (email/ticket) al responsabile diretto',
          'Comunicazione verbale / telefonica al responsabile',
          'Segnalazione tramite WhatsApp o chat informale',
          'Non esiste una procedura definita di escalation',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 11: CRITICITÀ E SUGGERIMENTI (sempre) ───
  {
    id: 'criticita',
    type: 'form',
    label: 'Sezione IV',
    title: 'Criticità e Suggerimenti',
    subtitle: 'Spazio dedicato a problemi ricorrenti e proposte migliorative.',
    alwaysShow: true,
    fields: [
      {
        key: 'D33',
        type: 'checkbox_other',
        label: '33. Quali sono le principali criticità da affrontare? (max 3)',
        maxSelections: 3,
        options: [
          'Mancanza di procedure scritte / formalizzate',
          'Sistemi informatici non integrati tra loro',
          'Comunicazione inefficace tra sedi/reparti',
          'Carenza di formazione del personale',
          'Assenza di controlli o verifiche periodiche',
          'Ritardi nei pagamenti / problemi di liquidità',
          'Gestione del magazzino poco accurata',
        ],
        required: true,
      },
      {
        key: 'D34',
        type: 'checkbox_other',
        label: '34. Quali miglioramenti suggerirebbe?',
        options: [
          'Introduzione di procedure scritte per ogni processo',
          'Integrazione/aggiornamento dei sistemi informatici',
          'Formazione periodica del personale',
          'Riunioni operative regolari tra sedi',
          'Introduzione di controlli e report periodici',
        ],
        required: true,
      },
      {
        key: 'D35',
        type: 'textarea',
        label: '35. Ulteriori osservazioni o proposte (facoltativo).',
        placeholder: 'Eventuali rischi, punti di attenzione, proposte non incluse sopra...',
        required: false,
      },
    ],
  },

  // ─── STEP 12: FOLLOW-UP / DOCUMENTAZIONE (sempre) ───
  {
    id: 'followup',
    type: 'form',
    label: 'Sezione V',
    title: 'Follow-up e Documentazione',
    subtitle: 'Indicare documenti/evidenze effettivamente disponibili nella propria struttura.',
    alwaysShow: true,
    fields: [
      {
        key: 'D36',
        type: 'checkbox',
        label: '36. Documenti/evidenze disponibili (selezionare quanto presente)',
        options: [
          'Organigramma / mansionario',
          'Procedure operative (SOP/POS)',
          'Esempi di report (vendite, cassa, inventari, scadenziari)',
          'Evidenze chiusura cassa (Z-report, quadrature)',
          'Evidenze inventario (liste, verbali, riconciliazioni)',
          'Evidenze controlli/approvazioni (email, firme, check-list)',
          'Nessun documento formalizzato / non disponibile',
        ],
        required: true,
      },
      {
        key: 'D37',
        type: 'radio_other',
        label: '37. Dove sono archiviati i documenti disponibili?',
        options: [
          'Cartella condivisa su PC / server locale',
          'Cloud (Google Drive, Dropbox, OneDrive)',
          'Archivio cartaceo in ufficio/magazzino',
          'Nel gestionale / software dedicato',
          'Non so dove siano archiviati',
        ],
        required: true,
      },
      {
        key: 'D38',
        type: 'text',
        label: '38. Conferma validazione',
        helper: 'Digitare esattamente "Confermo" per validare le risposte.',
        placeholder: 'Confermo',
        validation: 'confermo',
        required: true,
      },
    ],
  },

  // ─── STEP 13: REVIEW ───
  { id: 'review', type: 'review', title: 'Riepilogo risposte', subtitle: 'Verifica le risposte prima dell\'invio.' },

  // ─── STEP 14: SUCCESS ───
  { id: 'success', type: 'success' },
];

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
const state = {
  currentStep: 0,
  selectedModules: new Set(),
  answers: {},       // key → value (string or array)
  otherTexts: {},    // key → string (testo "Altro" per radio_other/checkbox_other)
  visibleSteps: [],
};

// ──────────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────────
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }
function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') element.className = v;
    else if (k === 'innerHTML') element.innerHTML = v;
    else if (k === 'textContent') element.textContent = v;
    else if (k.startsWith('on')) element.addEventListener(k.slice(2).toLowerCase(), v);
    else element.setAttribute(k, v);
  });
  children.forEach(c => {
    if (typeof c === 'string') element.appendChild(document.createTextNode(c));
    else if (c) element.appendChild(c);
  });
  return element;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ──────────────────────────────────────────────
// COMPUTE VISIBLE STEPS
// ──────────────────────────────────────────────
function computeVisibleSteps() {
  state.visibleSteps = STEPS.filter(step => {
    if (step.type === 'welcome' || step.type === 'dashboard' || step.type === 'review' || step.type === 'success') return true;
    if (step.alwaysShow) return true;
    if (step.moduleKey) return state.selectedModules.has(step.moduleKey);
    return true; // metadata step
  });
}

function getVisibleStepIndex(stepIndex) {
  const step = state.visibleSteps[stepIndex];
  return step ? STEPS.indexOf(step) : -1;
}

// ──────────────────────────────────────────────
// RENDER ENGINE
// ──────────────────────────────────────────────
function render() {
  const container = $('#formContainer');
  container.innerHTML = '';
  computeVisibleSteps();

  const step = state.visibleSteps[state.currentStep];
  if (!step) return;

  const stepEl = el('div', { className: 'step active' });

  switch (step.type) {
    case 'welcome': renderWelcome(stepEl); break;
    case 'form': renderForm(stepEl, step); break;
    case 'dashboard': renderDashboard(stepEl); break;
    case 'review': renderReview(stepEl); break;
    case 'success': renderSuccess(stepEl); break;
  }

  container.appendChild(stepEl);
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────
// PROGRESS BAR
// ──────────────────────────────────────────────
function updateProgress() {
  const total = state.visibleSteps.length - 1;
  const current = Math.min(state.currentStep, total);
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const bar = $('#progressBar');
  const text = $('#progressText');
  if (bar) bar.style.setProperty('--progress', pct + '%');
  if (text) text.textContent = `Step ${current + 1} di ${total + 1}`;
}

// ──────────────────────────────────────────────
// RENDER: WELCOME
// ──────────────────────────────────────────────
function renderWelcome(container) {
  const card = el('div', { className: 'glass-card' });

  card.innerHTML = `
    <div class="welcome-hero">
      <div class="welcome-badge">Progetto Assetti OAC</div>
      <h1 class="welcome-company">Ross Group S.R.L.</h1>
      <p class="welcome-project">Questionario Struttura — Adeguamento Assetti Organizzativi, Amministrativi e Contabili</p>
      <div class="welcome-divider"></div>
      <div class="welcome-info">
        <p><strong>Finalità:</strong> ricostruire i processi "as-is", individuare criticità, presidi e controlli, e definire priorità di intervento.</p>
        <p><strong>Durata indicativa:</strong> 15–25 minuti (solo sezioni pertinenti al ruolo).</p>
        <p><strong>Riservatezza:</strong> le informazioni sono raccolte per finalità organizzative interne e saranno trattate con criteri di riservatezza.</p>
        <p><strong>Istruzioni:</strong> selezionare le risposte più aderenti alla realtà operativa. Per ogni domanda è disponibile l'opzione "Altro" per risposte personalizzate.</p>
      </div>
    </div>
  `;

  const btnRow = el('div', { className: 'btn-row', style: 'justify-content: center;' });
  btnRow.appendChild(el('button', {
    className: 'btn btn-primary',
    innerHTML: 'Inizia il questionario ' + ICONS.arrowRight,
    onClick: () => goNext(),
  }));
  card.appendChild(btnRow);
  container.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER: FORM STEP
// ──────────────────────────────────────────────
function renderForm(container, step) {
  const card = el('div', { className: 'glass-card' });

  if (step.label) card.appendChild(el('div', { className: 'step-label', textContent: step.label }));
  card.appendChild(el('h2', { className: 'step-title', textContent: step.title }));
  if (step.subtitle) card.appendChild(el('p', { className: 'step-subtitle mb-24', textContent: step.subtitle }));

  step.fields.forEach(field => {
    card.appendChild(renderField(field));
  });

  // Buttons
  const btnRow = el('div', { className: 'btn-row' });
  btnRow.appendChild(el('button', {
    className: 'btn btn-secondary',
    innerHTML: ICONS.arrowLeft + ' Indietro',
    onClick: () => goPrev(),
  }));
  btnRow.appendChild(el('button', {
    className: 'btn btn-primary',
    innerHTML: 'Avanti ' + ICONS.arrowRight,
    onClick: () => goNext(),
  }));
  card.appendChild(btnRow);
  container.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER: FIELD
// ──────────────────────────────────────────────
function renderField(field) {
  const group = el('div', { className: 'field-group', 'data-field': field.key });

  // Label
  const labelEl = el('label', { className: 'field-label', innerHTML: escapeHtml(field.label) + (field.required ? '<span class="required">*</span>' : '') });
  group.appendChild(labelEl);

  // Helper
  if (field.helper) {
    group.appendChild(el('div', { className: 'field-helper', textContent: field.helper }));
  }

  const currentValue = state.answers[field.key];

  switch (field.type) {
    case 'text': {
      const input = el('input', {
        className: 'input',
        type: field.inputType || 'text',
        placeholder: field.placeholder || '',
        value: currentValue || '',
      });
      input.addEventListener('input', () => { state.answers[field.key] = input.value; clearFieldError(field.key); });
      group.appendChild(input);
      break;
    }

    case 'textarea': {
      const ta = el('textarea', {
        className: 'textarea',
        placeholder: field.placeholder || 'Scrivi la tua risposta...',
        textContent: currentValue || '',
      });
      ta.addEventListener('input', () => { state.answers[field.key] = ta.value; clearFieldError(field.key); });
      group.appendChild(ta);
      break;
    }

    case 'date': {
      const input = el('input', {
        className: 'input',
        type: 'date',
        value: currentValue || new Date().toISOString().split('T')[0],
      });
      if (!currentValue) state.answers[field.key] = input.value;
      input.addEventListener('change', () => { state.answers[field.key] = input.value; clearFieldError(field.key); });
      group.appendChild(input);
      break;
    }

    case 'select': {
      const select = el('select', { className: 'select' });
      field.options.forEach(opt => {
        const option = el('option', { value: opt, textContent: opt || '— Seleziona —' });
        if (opt === currentValue) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        state.answers[field.key] = select.value;
        clearFieldError(field.key);
        // Show/hide "Altro" text field
        if (field.hasOther) {
          const otherWrap = group.querySelector('.other-input-wrap');
          if (otherWrap) otherWrap.style.display = select.value === 'Altro' ? 'block' : 'none';
        }
      });
      group.appendChild(select);

      // "Altro" input for select
      if (field.hasOther) {
        const otherWrap = el('div', { className: 'other-input-wrap', style: currentValue === 'Altro' ? 'display:block' : 'display:none' });
        const otherInput = el('input', {
          className: 'input other-input',
          type: 'text',
          placeholder: 'Specificare...',
          value: state.otherTexts[field.key] || '',
        });
        otherInput.addEventListener('input', () => { state.otherTexts[field.key] = otherInput.value; });
        otherWrap.appendChild(otherInput);
        group.appendChild(otherWrap);
      }
      break;
    }

    case 'radio': {
      const radioGroup = el('div', { className: 'radio-group', 'data-field': field.key });
      field.options.forEach(opt => {
        const isSelected = currentValue === opt;
        const optEl = el('label', { className: 'radio-option' + (isSelected ? ' selected' : '') });
        const input = el('input', { type: 'radio', name: field.key, value: opt });
        if (isSelected) input.checked = true;
        optEl.appendChild(input);
        optEl.appendChild(el('span', { className: 'radio-circle' }));
        optEl.appendChild(el('span', { className: 'option-text', textContent: opt }));
        optEl.addEventListener('click', () => {
          state.answers[field.key] = opt;
          radioGroup.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
          optEl.classList.add('selected');
          clearFieldError(field.key);
          if (field.key === 'area') autoSuggestModules(opt);
        });
        radioGroup.appendChild(optEl);
      });
      group.appendChild(radioGroup);
      break;
    }

    case 'radio_other': {
      const radioGroup = el('div', { className: 'radio-group', 'data-field': field.key });

      field.options.forEach(opt => {
        const isSelected = currentValue === opt;
        const optEl = el('label', { className: 'radio-option' + (isSelected ? ' selected' : '') });
        const input = el('input', { type: 'radio', name: field.key, value: opt });
        if (isSelected) input.checked = true;
        optEl.appendChild(input);
        optEl.appendChild(el('span', { className: 'radio-circle' }));
        optEl.appendChild(el('span', { className: 'option-text', textContent: opt }));
        optEl.addEventListener('click', () => {
          state.answers[field.key] = opt;
          radioGroup.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
          optEl.classList.add('selected');
          clearFieldError(field.key);
          // Hide "Altro" input
          const otherWrap = group.querySelector('.other-input-wrap');
          if (otherWrap) otherWrap.style.display = 'none';
        });
        radioGroup.appendChild(optEl);
      });

      // "Altro (specificare)" option
      const isOther = currentValue === '__altro__';
      const otherOptEl = el('label', { className: 'radio-option' + (isOther ? ' selected' : '') });
      const otherRadio = el('input', { type: 'radio', name: field.key, value: '__altro__' });
      if (isOther) otherRadio.checked = true;
      otherOptEl.appendChild(otherRadio);
      otherOptEl.appendChild(el('span', { className: 'radio-circle' }));
      otherOptEl.appendChild(el('span', { className: 'option-text', textContent: 'Altro (specificare)' }));
      otherOptEl.addEventListener('click', () => {
        state.answers[field.key] = '__altro__';
        radioGroup.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        otherOptEl.classList.add('selected');
        clearFieldError(field.key);
        const otherWrap = group.querySelector('.other-input-wrap');
        if (otherWrap) {
          otherWrap.style.display = 'block';
          otherWrap.querySelector('input').focus();
        }
      });
      radioGroup.appendChild(otherOptEl);
      group.appendChild(radioGroup);

      // "Altro" text input
      const otherWrap = el('div', { className: 'other-input-wrap', style: isOther ? 'display:block' : 'display:none' });
      const otherInput = el('input', {
        className: 'input other-input',
        type: 'text',
        placeholder: 'Specificare la risposta...',
        value: state.otherTexts[field.key] || '',
      });
      otherInput.addEventListener('input', () => { state.otherTexts[field.key] = otherInput.value; clearFieldError(field.key); });
      otherWrap.appendChild(otherInput);
      group.appendChild(otherWrap);
      break;
    }

    case 'checkbox': {
      const cbGroup = el('div', { className: 'checkbox-group', 'data-field': field.key });
      const currentArr = currentValue || [];
      field.options.forEach(opt => {
        const isSelected = currentArr.includes(opt);
        const optEl = el('label', { className: 'checkbox-option' + (isSelected ? ' selected' : '') });
        const input = el('input', { type: 'checkbox', value: opt });
        if (isSelected) input.checked = true;
        optEl.appendChild(input);
        optEl.appendChild(el('span', { className: 'check-box', innerHTML: ICONS.checkWhite }));
        optEl.appendChild(el('span', { className: 'option-text', textContent: opt }));
        optEl.addEventListener('click', (e) => {
          e.preventDefault();
          let arr = state.answers[field.key] || [];
          if (arr.includes(opt)) {
            arr = arr.filter(v => v !== opt);
            optEl.classList.remove('selected');
          } else {
            // Max selections check
            if (field.maxSelections && arr.length >= field.maxSelections) return;
            arr.push(opt);
            optEl.classList.add('selected');
          }
          state.answers[field.key] = arr;
          clearFieldError(field.key);
        });
        cbGroup.appendChild(optEl);
      });
      group.appendChild(cbGroup);
      break;
    }

    case 'checkbox_other': {
      const cbGroup = el('div', { className: 'checkbox-group', 'data-field': field.key });
      const currentArr = currentValue || [];

      field.options.forEach(opt => {
        const isSelected = currentArr.includes(opt);
        const optEl = el('label', { className: 'checkbox-option' + (isSelected ? ' selected' : '') });
        const input = el('input', { type: 'checkbox', value: opt });
        if (isSelected) input.checked = true;
        optEl.appendChild(input);
        optEl.appendChild(el('span', { className: 'check-box', innerHTML: ICONS.checkWhite }));
        optEl.appendChild(el('span', { className: 'option-text', textContent: opt }));
        optEl.addEventListener('click', (e) => {
          e.preventDefault();
          let arr = state.answers[field.key] || [];
          if (arr.includes(opt)) {
            arr = arr.filter(v => v !== opt);
            optEl.classList.remove('selected');
          } else {
            if (field.maxSelections && arr.filter(v => v !== '__altro__').length >= field.maxSelections) return;
            arr.push(opt);
            optEl.classList.add('selected');
          }
          state.answers[field.key] = arr;
          clearFieldError(field.key);
        });
        cbGroup.appendChild(optEl);
      });

      // "Altro" checkbox option
      const hasOtherSelected = currentArr.includes('__altro__');
      const otherOptEl = el('label', { className: 'checkbox-option' + (hasOtherSelected ? ' selected' : '') });
      otherOptEl.appendChild(el('input', { type: 'checkbox', value: '__altro__' }));
      otherOptEl.appendChild(el('span', { className: 'check-box', innerHTML: ICONS.checkWhite }));
      otherOptEl.appendChild(el('span', { className: 'option-text', textContent: 'Altro (specificare)' }));
      otherOptEl.addEventListener('click', (e) => {
        e.preventDefault();
        let arr = state.answers[field.key] || [];
        if (arr.includes('__altro__')) {
          arr = arr.filter(v => v !== '__altro__');
          otherOptEl.classList.remove('selected');
          const otherWrap = group.querySelector('.other-input-wrap');
          if (otherWrap) otherWrap.style.display = 'none';
        } else {
          arr.push('__altro__');
          otherOptEl.classList.add('selected');
          const otherWrap = group.querySelector('.other-input-wrap');
          if (otherWrap) {
            otherWrap.style.display = 'block';
            otherWrap.querySelector('input').focus();
          }
        }
        state.answers[field.key] = arr;
        clearFieldError(field.key);
      });
      cbGroup.appendChild(otherOptEl);
      group.appendChild(cbGroup);

      // "Altro" text input
      const otherWrap = el('div', { className: 'other-input-wrap', style: hasOtherSelected ? 'display:block' : 'display:none' });
      const otherInput = el('input', {
        className: 'input other-input',
        type: 'text',
        placeholder: 'Specificare la risposta...',
        value: state.otherTexts[field.key] || '',
      });
      otherInput.addEventListener('input', () => { state.otherTexts[field.key] = otherInput.value; clearFieldError(field.key); });
      otherWrap.appendChild(otherInput);
      group.appendChild(otherWrap);
      break;
    }

    case 'scale': {
      const scaleGroup = el('div', { className: 'scale-group', 'data-field': field.key });
      for (let i = field.min; i <= field.max; i++) {
        const isSelected = currentValue === String(i);
        const scaleEl = el('div', { className: 'scale-option' + (isSelected ? ' selected' : '') });
        scaleEl.appendChild(el('span', { className: 'scale-number', textContent: String(i) }));
        if (field.labels && field.labels[i]) {
          scaleEl.appendChild(el('span', { className: 'scale-label', textContent: field.labels[i] }));
        }
        scaleEl.addEventListener('click', () => {
          state.answers[field.key] = String(i);
          scaleGroup.querySelectorAll('.scale-option').forEach(s => s.classList.remove('selected'));
          scaleEl.classList.add('selected');
          clearFieldError(field.key);
        });
        scaleGroup.appendChild(scaleEl);
      }
      group.appendChild(scaleGroup);
      break;
    }

    case 'consent': {
      const cbGroup = el('div', { className: 'checkbox-group', 'data-field': field.key });
      const isSelected = !!currentValue;
      const optEl = el('label', { className: 'checkbox-option' + (isSelected ? ' selected' : '') });
      optEl.appendChild(el('input', { type: 'checkbox' }));
      optEl.appendChild(el('span', { className: 'check-box', innerHTML: ICONS.checkWhite }));
      optEl.appendChild(el('span', { className: 'option-text', textContent: field.consentText }));
      optEl.addEventListener('click', (e) => {
        e.preventDefault();
        state.answers[field.key] = !state.answers[field.key];
        optEl.classList.toggle('selected', state.answers[field.key]);
        clearFieldError(field.key);
      });
      cbGroup.appendChild(optEl);
      group.appendChild(cbGroup);
      break;
    }
  }

  // Error container
  group.appendChild(el('div', { className: 'field-error', 'data-error': field.key }));

  return group;
}

// ──────────────────────────────────────────────
// RENDER: DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard(container) {
  const card = el('div', { className: 'glass-card' });
  const step = STEPS.find(s => s.id === 'dashboard');

  card.appendChild(el('div', { className: 'step-label', textContent: step.label }));
  card.appendChild(el('h2', { className: 'step-title', textContent: step.title }));
  card.appendChild(el('p', { className: 'step-subtitle', textContent: step.subtitle }));

  // Auto-suggest hint
  const area = state.answers.area;
  if (area && AREA_MODULE_MAP[area] && AREA_MODULE_MAP[area].length > 0) {
    const hintModules = AREA_MODULE_MAP[area].map(k => MODULES.find(m => m.key === k)?.name).filter(Boolean).join(', ');
    card.appendChild(el('div', {
      className: 'module-auto-hint',
      innerHTML: `💡 In base alla tua area (<strong>${escapeHtml(area)}</strong>), ti suggeriamo: <strong>${escapeHtml(hintModules)}</strong>`,
    }));
  }

  // Module grid
  const grid = el('div', { className: 'module-grid' });
  MODULES.forEach(mod => {
    const isSelected = state.selectedModules.has(mod.key);
    const cardEl = el('div', { className: 'module-card' + (isSelected ? ' selected' : '') });
    cardEl.innerHTML = `
      <div class="module-check">${ICONS.checkWhite}</div>
      <span class="module-icon">${mod.icon}</span>
      <div class="module-name">${escapeHtml(mod.name)}</div>
      <div class="module-desc">${escapeHtml(mod.desc)}</div>
    `;
    cardEl.addEventListener('click', () => {
      if (state.selectedModules.has(mod.key)) {
        state.selectedModules.delete(mod.key);
        cardEl.classList.remove('selected');
      } else {
        state.selectedModules.add(mod.key);
        cardEl.classList.add('selected');
      }
    });
    grid.appendChild(cardEl);
  });
  card.appendChild(grid);

  card.appendChild(el('p', {
    className: 'module-note',
    textContent: 'Le sezioni I (Contesto), III (Controlli), IV (Criticità) e V (Follow-up) sono sempre incluse e non richiedono selezione.',
  }));

  // Buttons
  const btnRow = el('div', { className: 'btn-row' });
  btnRow.appendChild(el('button', {
    className: 'btn btn-secondary',
    innerHTML: ICONS.arrowLeft + ' Indietro',
    onClick: () => goPrev(),
  }));
  btnRow.appendChild(el('button', {
    className: 'btn btn-primary',
    innerHTML: 'Avanti ' + ICONS.arrowRight,
    onClick: () => {
      if (state.selectedModules.size === 0) {
        if (!confirm('Non hai selezionato alcun modulo specifico. Verranno compilate solo le sezioni obbligatorie (Contesto, Controlli, Criticità, Follow-up). Continuare?')) return;
      }
      goNext();
    },
  }));
  card.appendChild(btnRow);
  container.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER: REVIEW
// ──────────────────────────────────────────────
function renderReview(container) {
  const card = el('div', { className: 'glass-card' });
  card.appendChild(el('div', { className: 'step-label', textContent: 'Riepilogo' }));
  card.appendChild(el('h2', { className: 'step-title', textContent: 'Verifica le risposte' }));
  card.appendChild(el('p', { className: 'step-subtitle mb-24', textContent: 'Controlla il riepilogo prima di inviare. Clicca su una sezione per espanderla.' }));

  const formSteps = state.visibleSteps.filter(s => s.type === 'form');
  formSteps.forEach(step => {
    const section = el('div', { className: 'review-section' });
    const header = el('div', { className: 'review-header' });
    header.appendChild(el('span', { className: 'review-header-title', textContent: (step.label ? step.label + ' — ' : '') + step.title }));
    header.appendChild(el('span', { className: 'review-header-arrow', innerHTML: ICONS.arrowDown }));

    const body = el('div', { className: 'review-body' });
    const bodyInner = el('div', { className: 'review-body-inner' });

    step.fields.forEach(field => {
      const val = state.answers[field.key];
      let displayVal = '';

      if (field.type === 'radio_other' && val === '__altro__') {
        displayVal = 'Altro: ' + (state.otherTexts[field.key] || '—');
      } else if (field.type === 'checkbox_other' || field.type === 'checkbox') {
        const arr = Array.isArray(val) ? val : [];
        const display = arr.map(v => {
          if (v === '__altro__') return 'Altro: ' + (state.otherTexts[field.key] || '—');
          return v;
        });
        displayVal = display.join(', ') || '—';
      } else if (Array.isArray(val)) {
        displayVal = val.join(', ');
      } else if (typeof val === 'boolean') {
        displayVal = val ? '✓ Confermato' : '✗ Non confermato';
      } else {
        displayVal = val || '—';
      }

      // Per i select con hasOther, mostrare il testo "Altro"
      if (field.hasOther && val === 'Altro' && state.otherTexts[field.key]) {
        displayVal = 'Altro: ' + state.otherTexts[field.key];
      }

      const item = el('div', { className: 'review-item' });
      item.appendChild(el('div', { className: 'review-question', textContent: field.label.replace(/^\d+[\-bis\.ter]*\.\s*/, '') }));
      item.appendChild(el('div', { className: 'review-answer', textContent: displayVal }));
      bodyInner.appendChild(item);
    });

    body.appendChild(bodyInner);

    header.addEventListener('click', () => {
      header.classList.toggle('open');
      body.classList.toggle('open');
    });

    section.appendChild(header);
    section.appendChild(body);
    card.appendChild(section);
  });

  // Info moduli selezionati
  const moduliInfo = el('div', { className: 'module-auto-hint mt-24' });
  const selectedNames = MODULES.filter(m => state.selectedModules.has(m.key)).map(m => m.name);
  moduliInfo.innerHTML = `<strong>Moduli compilati:</strong> ${selectedNames.length > 0 ? selectedNames.join(' · ') : 'Nessun modulo specifico (solo sezioni obbligatorie)'}`;
  card.appendChild(moduliInfo);

  // Buttons
  const btnRow = el('div', { className: 'btn-row mt-32' });
  btnRow.appendChild(el('button', {
    className: 'btn btn-secondary',
    innerHTML: ICONS.arrowLeft + ' Modifica risposte',
    onClick: () => goPrev(),
  }));

  const submitBtn = el('button', {
    className: 'btn btn-primary',
    id: 'submitBtn',
    innerHTML: 'Invia questionario ' + ICONS.arrowRight,
    onClick: () => submitForm(),
  });
  btnRow.appendChild(submitBtn);
  card.appendChild(btnRow);
  container.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER: SUCCESS
// ──────────────────────────────────────────────
function renderSuccess(container) {
  const card = el('div', { className: 'glass-card' });
  card.innerHTML = `
    <div class="success-screen">
      <div class="success-icon">${ICONS.successCheck}</div>
      <h2 class="success-title">Questionario inviato con successo</h2>
      <p class="success-text">Le risposte sono state registrate correttamente.<br>L'amministrazione provvederà a elaborare i risultati e, ove necessario, a richiedere eventuali integrazioni.</p>
      <a href="https://www.gestoredellacrisi.it" class="btn btn-secondary" style="display: inline-flex;">Torna al sito</a>
    </div>
  `;
  container.appendChild(card);
  $('.progress-container').style.display = 'none';
}

// ──────────────────────────────────────────────
// AUTO-SUGGEST MODULES
// ──────────────────────────────────────────────
function autoSuggestModules(area) {
  const suggested = AREA_MODULE_MAP[area] || [];
  if (state.selectedModules.size === 0) {
    suggested.forEach(k => state.selectedModules.add(k));
  }
}

// ──────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────
function goNext() {
  const step = state.visibleSteps[state.currentStep];

  if (step.type === 'form' && !validateStep(step)) {
    return;
  }

  computeVisibleSteps();

  if (state.currentStep < state.visibleSteps.length - 1) {
    state.currentStep++;
    render();
  }
}

function goPrev() {
  if (state.currentStep > 0) {
    state.currentStep--;
    render();
  }
}

// ──────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────
function validateStep(step) {
  let valid = true;

  step.fields.forEach(field => {
    if (!field.required) return;

    const val = state.answers[field.key];
    let fieldValid = true;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'date':
      case 'select':
        fieldValid = !!val && val.trim() !== '';
        // Per select con hasOther, verificare anche il testo "Altro"
        if (field.hasOther && val === 'Altro') {
          fieldValid = !!state.otherTexts[field.key] && state.otherTexts[field.key].trim() !== '';
          if (!fieldValid) {
            showFieldError(field.key, 'Specificare la risposta.');
            valid = false;
            return;
          }
        }
        break;
      case 'radio':
      case 'scale':
        fieldValid = val !== undefined && val !== null && val !== '';
        break;
      case 'radio_other':
        fieldValid = val !== undefined && val !== null && val !== '';
        if (val === '__altro__') {
          const otherText = state.otherTexts[field.key];
          if (!otherText || otherText.trim() === '') {
            showFieldError(field.key, 'Specificare la risposta "Altro".');
            valid = false;
            return;
          }
        }
        break;
      case 'checkbox':
        fieldValid = Array.isArray(val) && val.length > 0;
        break;
      case 'checkbox_other':
        fieldValid = Array.isArray(val) && val.length > 0;
        if (fieldValid && val.includes('__altro__')) {
          const otherText = state.otherTexts[field.key];
          if (!otherText || otherText.trim() === '') {
            showFieldError(field.key, 'Specificare la risposta "Altro".');
            valid = false;
            return;
          }
        }
        break;
      case 'consent':
        fieldValid = !!val;
        break;
    }

    // Special "Confermo" validation
    if (field.validation === 'confermo' && val) {
      fieldValid = /^(Confermo|CONFERMO|confermo)$/i.test(val.trim());
      if (!fieldValid) {
        showFieldError(field.key, 'Digitare esattamente "Confermo".');
        valid = false;
        return;
      }
    }

    // Email validation
    if (field.inputType === 'email' && val) {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!fieldValid) {
        showFieldError(field.key, 'Inserire un indirizzo email valido.');
        valid = false;
        return;
      }
    }

    if (!fieldValid) {
      showFieldError(field.key, 'Campo obbligatorio.');
      valid = false;
    }
  });

  if (!valid) {
    const firstError = document.querySelector('.field-error.visible');
    if (firstError) {
      firstError.closest('.field-group').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return valid;
}

function showFieldError(key, msg) {
  const errorEl = document.querySelector(`[data-error="${key}"]`);
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }
  const group = document.querySelector(`[data-field="${key}"]`);
  if (group) {
    const input = group.querySelector('.input, .textarea, .select');
    if (input) input.classList.add('error');
    const radioGroup = group.querySelector('.radio-group, .checkbox-group, .scale-group');
    if (radioGroup) radioGroup.classList.add('error');
  }
}

function clearFieldError(key) {
  const errorEl = document.querySelector(`[data-error="${key}"]`);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
  const group = document.querySelector(`[data-field="${key}"]`);
  if (group) {
    const input = group.querySelector('.input, .textarea, .select');
    if (input) input.classList.remove('error');
    const radioGroup = group.querySelector('.radio-group, .checkbox-group, .scale-group');
    if (radioGroup) radioGroup.classList.remove('error');
  }
}

// ──────────────────────────────────────────────
// SUBMIT TO GOOGLE SHEETS
// ──────────────────────────────────────────────
async function submitForm() {
  const btn = $('#submitBtn');
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Invio in corso...';

  // Prepare payload — resolve "Altro" values
  const payload = {
    timestamp: new Date().toISOString(),
    moduli_selezionati: Array.from(state.selectedModules).join(', '),
  };

  // Process each answer
  Object.keys(state.answers).forEach(key => {
    let val = state.answers[key];

    if (val === '__altro__') {
      // radio_other: replace with actual text
      val = 'Altro: ' + (state.otherTexts[key] || '');
    } else if (Array.isArray(val)) {
      // checkbox_other / checkbox: resolve __altro__ entries
      val = val.map(v => {
        if (v === '__altro__') return 'Altro: ' + (state.otherTexts[key] || '');
        return v;
      }).join('; ');
    } else if (typeof val === 'boolean') {
      val = val ? 'Sì' : 'No';
    }

    // For selects with hasOther
    if (val === 'Altro' && state.otherTexts[key]) {
      val = 'Altro: ' + state.otherTexts[key];
    }

    payload[key] = val;
  });

  if (!CONFIG.GOOGLE_SCRIPT_URL) {
    console.warn('⚠️ GOOGLE_SCRIPT_URL non configurato. Simulazione invio...');
    console.log('Payload che verrebbe inviato:', payload);
    await new Promise(r => setTimeout(r, 1500));
    state.currentStep++;
    render();
    return;
  }

  try {
    const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    state.currentStep++;
    render();
  } catch (error) {
    console.error('Errore invio:', error);
    btn.disabled = false;
    btn.innerHTML = 'Invia questionario ' + ICONS.arrowRight;
    alert('Si è verificato un errore durante l\'invio. Riprova o contatta l\'amministratore.');
  }
}

// ──────────────────────────────────────────────
// INITIALIZE
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  computeVisibleSteps();
  render();
});
