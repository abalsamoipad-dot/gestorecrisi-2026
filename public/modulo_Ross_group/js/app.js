/* ============================================================
   ROSS GROUP S.R.L. — QUESTIONARIO ASSETTI OAC v2.0
   Applicazione SPA — Logica form, validazione, Google Sheets
   v2.0 — Assessment strutturato assetti OAC
   ============================================================ */

// ──────────────────────────────────────────────
// CONFIGURAZIONE
// ──────────────────────────────────────────────
const CONFIG = {
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxkGrVKLlHERwzQj01ZtgXfRXqNCgyz0gkSvHidQnB9Nvc0Gpbgw0Lv1ftnQFUf-XgUqA/exec',
  QUESTIONNAIRE_VERSION: 'OAC_v2.0',
};

// ──────────────────────────────────────────────
// SVG ICONS
// ──────────────────────────────────────────────
const ICONS = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  checkWhite: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrowDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrowRight: '\u2192',
  arrowLeft: '\u2190',
  successCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
};

// ──────────────────────────────────────────────
// GLOSSARIO TERMINI TECNICI (tooltip)
// ──────────────────────────────────────────────
const GLOSSARY = {
  'Z-report': 'Riepilogo fiscale di fine giornata stampato dal registratore di cassa. Riassume tutti gli incassi, i reparti e i totali IVA della giornata.',
  'Z-Report': 'Riepilogo fiscale di fine giornata stampato dal registratore di cassa. Riassume tutti gli incassi, i reparti e i totali IVA della giornata.',
  'SOP': 'Standard Operating Procedure \u2014 procedura operativa standard: un documento che descrive passo-passo come svolgere un\'attivit\u00e0 in modo uniforme.',
  'POS': 'Point of Sale \u2014 punto vendita/cassa. Indica sia il terminale per pagamenti con carta sia il sistema di gestione vendite.',
  'DDT': 'Documento di Trasporto \u2014 documento fiscale che accompagna la merce durante il trasporto, attestando mittente, destinatario e contenuto.',
  'LIPE': 'Liquidazioni Periodiche IVA \u2014 comunicazione trimestrale obbligatoria all\'Agenzia delle Entrate con i dati delle liquidazioni IVA.',
  'IVA': 'Imposta sul Valore Aggiunto \u2014 imposta indiretta sui beni e servizi applicata in ogni fase della filiera produttiva/distributiva.',
  'IBAN': 'International Bank Account Number \u2014 codice internazionale che identifica univocamente un conto corrente bancario.',
  'RiBa': 'Ricevuta Bancaria \u2014 strumento di pagamento con cui il creditore incarica la banca di incassare un importo dal debitore a scadenza.',
  'SDD': 'SEPA Direct Debit \u2014 addebito diretto europeo: il creditore preleva automaticamente l\'importo dal conto del debitore previa autorizzazione.',
  'shrinkage': 'Termine inglese per "ammanchi" \u2014 indica la differenza tra le giacenze teoriche e quelle reali, causata da furti, errori o deterioramento.',
  'Shrinkage': 'Termine inglese per "ammanchi" \u2014 indica la differenza tra le giacenze teoriche e quelle reali, causata da furti, errori o deterioramento.',
  'Cloud': 'Sistema di archiviazione online (es. Google Drive, Dropbox) \u2014 i file sono salvati su server remoti accessibili via internet.',
  'NAS': 'Network Attached Storage \u2014 dispositivo di archiviazione collegato alla rete locale, usato come server di backup o condivisione file.',
  'ERP': 'Enterprise Resource Planning \u2014 software gestionale integrato che collega vendite, magazzino, contabilit\u00e0 e altri processi aziendali.',
  'audit': 'Verifica sistematica e indipendente di processi, conti o conformit\u00e0 normativa, svolta da soggetti interni o esterni all\'azienda.',
  'Audit': 'Verifica sistematica e indipendente di processi, conti o conformit\u00e0 normativa, svolta da soggetti interni o esterni all\'azienda.',
  'escalation': 'Procedura di segnalazione verso un livello gerarchico superiore quando si riscontra un problema che non pu\u00f2 essere risolto autonomamente.',
  'Escalation': 'Procedura di segnalazione verso un livello gerarchico superiore quando si riscontra un problema che non pu\u00f2 essere risolto autonomamente.',
  'quick win': 'Azione migliorativa rapida e a basso costo che produce risultati visibili in tempi brevi, senza interventi strutturali complessi.',
  'SS/FW': 'Spring-Summer / Fall-Winter \u2014 le due stagioni principali delle collezioni moda: Primavera-Estate e Autunno-Inverno.',
  'Black Friday': 'Giornata promozionale di fine novembre con forti sconti, originaria degli USA e ormai diffusa a livello globale.',
  'barcode': 'Codice a barre \u2014 sequenza di linee e spazi stampata sulle etichette dei prodotti, letta da scanner per identificare l\'articolo.',
  'fidelity card': 'Carta fedelt\u00e0 \u2014 tessera che accumula punti o d\u00e0 diritto a sconti dedicati per incentivare il cliente a tornare.',
  'Fidelity card': 'Carta fedelt\u00e0 \u2014 tessera che accumula punti o d\u00e0 diritto a sconti dedicati per incentivare il cliente a tornare.',
  'voucher': 'Buono / credito cartaceo o digitale utilizzabile per un acquisto futuro, spesso emesso come alternativa al rimborso.',
  'stakeholder': 'Soggetto portatore di interessi rispetto all\'azienda: soci, dipendenti, fornitori, clienti, banche, enti pubblici.',
  'OAC': 'Organizzativi, Amministrativi e Contabili \u2014 i tre ambiti degli assetti aziendali che il Codice della Crisi impone di adeguare.',
  'CCII': 'Codice della Crisi d\'Impresa e dell\'Insolvenza (D.Lgs. 14/2019) \u2014 normativa che disciplina prevenzione della crisi e procedure concorsuali.',
  'MFA': 'Multi-Factor Authentication \u2014 autenticazione a pi\u00f9 fattori: metodo di sicurezza che richiede almeno due verifiche di identit\u00e0 (es. password + codice SMS).',
  'forecast': 'Previsione economico-finanziaria \u2014 stima prospettica di ricavi, costi, flussi di cassa e fabbisogni finanziari su un orizzonte temporale definito.',
  'Forecast': 'Previsione economico-finanziaria \u2014 stima prospettica di ricavi, costi, flussi di cassa e fabbisogni finanziari su un orizzonte temporale definito.',
  'compliance': 'Conformit\u00e0 normativa \u2014 insieme di processi e controlli che assicurano il rispetto di leggi, regolamenti e standard applicabili all\'attivit\u00e0 aziendale.',
  'segregazione': 'Separazione dei compiti (Segregation of Duties) \u2014 principio di controllo interno per cui chi esegue un\'operazione non deve essere lo stesso soggetto che la autorizza o la controlla.',
  'Check-list': 'Lista di controllo \u2014 elenco strutturato di punti da verificare per assicurarsi che ogni passaggio di un processo sia stato completato correttamente.',
  'check-list': 'Lista di controllo \u2014 elenco strutturato di punti da verificare per assicurarsi che ogni passaggio di un processo sia stato completato correttamente.',
  'Log Accessi': 'Registro cronologico degli accessi al sistema \u2014 traccia chi ha effettuato login, quando, da quale dispositivo e quali operazioni ha svolto.',
  'log accessi': 'Registro cronologico degli accessi al sistema \u2014 traccia chi ha effettuato login, quando, da quale dispositivo e quali operazioni ha svolto.',
  'Log': 'Registro cronologico di eventi o operazioni \u2014 file che tiene traccia di tutte le attivit\u00e0 svolte in un sistema informatico (accessi, errori, modifiche).',
  'Backup': 'Copia di sicurezza dei dati \u2014 duplicazione periodica dei file e delle informazioni aziendali su supporti esterni o cloud per proteggerli da perdite.',
  'backup': 'Copia di sicurezza dei dati \u2014 duplicazione periodica dei file e delle informazioni aziendali su supporti esterni o cloud per proteggerli da perdite.',
  'Restore': 'Ripristino dei dati \u2014 procedura di recupero delle informazioni da una copia di backup in caso di guasto, errore o perdita accidentale.',
  'restore': 'Ripristino dei dati \u2014 procedura di recupero delle informazioni da una copia di backup in caso di guasto, errore o perdita accidentale.',
  'workflow': 'Flusso di lavoro \u2014 sequenza strutturata di attivit\u00e0, approvazioni e passaggi operativi che compongono un processo aziendale, spesso gestita tramite software.',
  'Workflow': 'Flusso di lavoro \u2014 sequenza strutturata di attivit\u00e0, approvazioni e passaggi operativi che compongono un processo aziendale, spesso gestita tramite software.',
  'HR': 'Human Resources \u2014 Risorse Umane: funzione aziendale che gestisce il personale, le assunzioni, la formazione, le presenze e le politiche retributive.',
  'Report IT': 'Report generato dai sistemi informatici \u2014 documento prodotto automaticamente dai software aziendali che riepiloga dati, accessi, operazioni o anomalie.',
};

// ──────────────────────────────────────────────
// MODULI SELEZIONABILI (Dashboard)
// ──────────────────────────────────────────────
const MODULES = [
  { key: 'A', icon: '\uD83C\uDFEA', name: 'Vendite / POS / Cassa', desc: 'Procedure di vendita, resi, chiusura cassa, incassi' },
  { key: 'B', icon: '\uD83D\uDCE6', name: 'Magazzino / Logistica', desc: 'Ricezione merce, trasferimenti, inventari, stagionalit\u00e0' },
  { key: 'C', icon: '\uD83D\uDED2', name: 'Acquisti / Fornitori', desc: 'Processo acquisto, controlli DDT/fatture, pagamenti' },
  { key: 'D', icon: '\uD83D\uDCCA', name: 'Contabilit\u00e0 / Fiscale', desc: 'Chiusure contabili, IVA, riconciliazioni bancarie' },
  { key: 'E', icon: '\uD83D\uDC65', name: 'Presenze / Paghe', desc: 'Turni, presenze, flusso paghe, contributi' },
  { key: 'F', icon: '\uD83D\uDCBB', name: 'IT / Sistemi / Dati', desc: 'Flussi dati, gestione accessi, continuit\u00e0 operativa' },
];

// Auto-suggestion: Area funzionale → Moduli consigliati
const AREA_MODULE_MAP = {
  'Vendite / Cassa / POS': ['A'],
  'Magazzino / Logistica / Inventari': ['B'],
  'Acquisti / Fornitori': ['C'],
  'Amministrazione / Contabilit\u00e0': ['C', 'D'],
  'Fiscale / Adempimenti': ['D'],
  'HR / Presenze / Supporto paghe': ['E'],
  'IT / Supporto sistemi': ['F'],
  'Amministrazione interna': ['C', 'D'],
  'IT / supporto sistemi': ['F'],
  'Direzione / propriet\u00e0': ['A', 'B', 'C', 'D', 'E', 'F'],
  'Altro': [],
};

// ──────────────────────────────────────────────
// DATI COMPLETI DELLE DOMANDE (v2.0 — Assessment OAC)
// ──────────────────────────────────────────────
const STEPS = [
  // ─── STEP 0: WELCOME ───
  {
    id: 'welcome',
    type: 'welcome',
    companyName: 'Ross Group S.R.L.',
    title: 'Questionario Assetti Organizzativi, Amministrativi e Contabili',
    subtitle: 'Rilevazione strutturata dei processi, dei presidi e delle criticit\u00e0 aziendali',
    introText: 'Gentile Collaboratore di Ross Group,\n\nquesto questionario \u00e8 parte del percorso di analisi e rafforzamento degli assetti organizzativi, amministrativi e contabili della nostra azienda, in ottemperanza a quanto previsto dal Codice della Crisi d\u2019Impresa (D.Lgs. 14/2019).\n\nIl Suo contributo \u00e8 fondamentale: le risposte che fornir\u00e0 ci aiuteranno a fotografare i processi reali, individuare le aree di miglioramento e costruire insieme un\u2019organizzazione pi\u00f9 solida e trasparente.\n\nRisponda con riferimento ai fatti e ai processi effettivamente conosciuti alla data di compilazione. Se una domanda non rientra nella Sua area di competenza, selezioni \u201cNon so / non di mia competenza\u201d.',
  },

  // ─── STEP 1: METADATA E PROFILAZIONE INTERVISTATO ───
  {
    id: 'metadata',
    type: 'form',
    label: 'Sezione 0',
    title: 'Premessa e dati intervistato',
    subtitle: 'Compilare i dati identificativi e la dichiarazione di riservatezza.',
    alwaysShow: true,
    fields: [
      {
        key: 'consenso',
        type: 'consent',
        label: 'Presa visione e riservatezza',
        consentText: 'Dichiaro di aver preso visione dell\u2019informativa relativa alla raccolta delle informazioni e di essere consapevole che le risposte saranno utilizzate esclusivamente per finalit\u00e0 di analisi organizzativa, amministrativa e contabile.',
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
          'Addetto amministrazione', 'Responsabile contabilit\u00e0',
          'Responsabile IT/sistemi', 'Consulente esterno', 'Titolare / Direzione',
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
          'P.V. Canicatt\u00ec - Via R. Livatino n. 2',
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
          'Amministrazione / Contabilit\u00e0',
          'Fiscale / Adempimenti',
          'HR / Presenze / Supporto paghe',
          'IT / Supporto sistemi',
          'Amministrazione interna',
          'IT / supporto sistemi',
          'Direzione / propriet\u00e0',
          'Altro',
        ],
        required: true,
      },
      {
        key: 'anzianita',
        type: 'radio',
        label: 'Anzianit\u00e0 nel ruolo (fascia)',
        options: ['Meno di 6 mesi', 'Da 6 mesi a 2 anni', 'Da 2 a 5 anni', 'Oltre 5 anni'],
        required: true,
      },
      {
        key: 'M0_1',
        type: 'radio',
        label: 'Tipologia compilazione',
        options: [
          'Compilazione autonoma',
          'Compilazione assistita da intervistatore',
          'Intervista verbalizzata da terzo',
        ],
        required: true,
      },
      {
        key: 'M0_2',
        type: 'radio',
        label: 'Livello di conoscenza dei processi aziendali',
        options: [
          'Limitato alla mia attivit\u00e0',
          'Buona conoscenza della mia area',
          'Visione trasversale di pi\u00f9 aree',
          'Visione complessiva aziendale',
        ],
        required: true,
      },
      {
        key: 'M0_3',
        type: 'checkbox',
        label: 'Ha responsabilit\u00e0 autorizzative o di controllo?',
        options: [
          'Autorizzo operazioni',
          'Eseguo operazioni',
          'Registro operazioni',
          'Controllo operazioni altrui',
          'Nessuna delle precedenti',
        ],
        required: true,
      },
    ],
    footerNote: 'Le domande successive saranno adattate in base al ruolo, alla funzione prevalente e alle aree con cui Lei interagisce operativamente.',
  },

  // ─── STEP 2: DASHBOARD ───
  {
    id: 'dashboard',
    type: 'dashboard',
    label: 'Selezione Moduli',
    title: 'Seleziona le aree di competenza',
    subtitle: 'In base al Suo ruolo e alle aree con cui interagisce, Le proponiamo i moduli pi\u00f9 rilevanti. Pu\u00f2 aggiungere altri moduli se ritiene di poter fornire risposte attendibili.',
    fields: [
      {
        key: 'P1',
        type: 'checkbox',
        label: 'Con quali aree interagisce operativamente e ritiene di poter fornire risposte attendibili?',
        options: [
          'Vendite / cassa / resi',
          'Magazzino / logistica / inventari',
          'Acquisti / fornitori',
          'Amministrazione / contabilit\u00e0 / banche',
          'Presenze / paghe / turni',
          'Sistemi informativi / dati / accessi',
          'Direzione / supervisione / approvazioni',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 3: GOVERNANCE, RESPONSABILITÀ E DELEGHE (sempre) ───
  {
    id: 'governance',
    type: 'form',
    label: 'Governance',
    title: 'Governance, responsabilit\u00e0 e deleghe',
    subtitle: 'Questa sezione rileva la chiarezza dell\u2019assetto organizzativo, delle responsabilit\u00e0, dei poteri decisionali e delle deleghe operative.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'G1',
        type: 'radio',
        label: 'La linea gerarchica del Suo ruolo \u00e8 chiaramente definita?',
        options: [
          'S\u00ec, \u00e8 formalizzata e mi \u00e8 nota',
          'S\u00ec, ma solo in via informale',
          'Non sempre \u00e8 chiaro a chi devo riportare',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G2',
        type: 'radio',
        label: 'In caso di assenza del Suo responsabile, sa chi \u00e8 autorizzato a sostituirlo per le decisioni operative?',
        options: [
          'S\u00ec, \u00e8 definito formalmente',
          'S\u00ec, ma per prassi non formalizzata',
          'Talvolta s\u00ec, talvolta no',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G3',
        type: 'radio',
        label: 'L\u2019impresa dispone di organigramma e/o mansionario aggiornati e conosciuti dal personale interessato?',
        options: [
          'S\u00ec, aggiornati e reperibili',
          'S\u00ec, esistono ma non sono aggiornati o non sono facilmente reperibili',
          'Esistono solo informalmente',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G4',
        type: 'radio',
        label: 'Esiste una matrice di deleghe o di limiti autorizzativi per sconti, resi, ordini, spese, pagamenti o accessi ai sistemi?',
        options: [
          'S\u00ec, formalizzata e applicata',
          'S\u00ec, formalizzata ma non sempre rispettata',
          'Esiste solo informalmente',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G5',
        type: 'scale',
        label: 'Le responsabilit\u00e0 del Suo ruolo sono chiare e non si sovrappongono in modo critico con quelle di altri?',
        min: 1,
        max: 5,
        labels: { 1: 'Per nulla', 5: 'Pienamente' },
        extraOptions: ['Non so', 'Non di mia competenza'],
        required: true,
      },
      {
        key: 'G6',
        type: 'radio',
        label: 'Le decisioni rilevanti della Sua area sono tracciate in modo verificabile?',
        options: [
          'S\u00ec, sempre tramite email / gestionale / firma / workflow',
          'S\u00ec, nella maggior parte dei casi',
          'Solo per alcune decisioni',
          'No, prevalentemente in modo informale',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G7',
        type: 'radio',
        label: 'Sono previsti momenti periodici di coordinamento tra direzione e funzioni operative?',
        options: [
          'S\u00ec, periodici e verbalizzati',
          'S\u00ec, periodici ma non verbalizzati',
          'Saltuari',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'G8',
        type: 'checkbox_other',
        label: 'Quali criticit\u00e0 riscontra maggiormente nell\u2019assetto organizzativo? (max 3)',
        maxSelections: 3,
        options: [
          'Ruoli poco chiari',
          'Delega decisionale non formalizzata',
          'Eccessiva concentrazione di compiti in poche persone',
          'Comunicazione inefficace tra sedi/funzioni',
          'Assenza o debolezza di procedure',
          'Sovrapposizioni tra funzioni operative e di controllo',
          'Nessuna criticit\u00e0 rilevante',
          'Altro',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 4: CONTINUITÀ AZIENDALE, REPORTING, TESORERIA (sempre) ───
  {
    id: 'continuita',
    type: 'form',
    label: 'Continuit\u00e0',
    title: 'Continuit\u00e0 aziendale, reporting, budgeting e tesoreria',
    subtitle: 'Questa sezione rileva se l\u2019impresa dispone di strumenti idonei a monitorare liquidit\u00e0, sostenibilit\u00e0 dei debiti, andamento gestionale e prospettive di continuit\u00e0.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    showForRoles: ['Responsabile punto vendita', 'Addetto amministrazione', 'Responsabile contabilit\u00e0', 'Titolare / Direzione', 'Responsabile acquisti', 'Consulente esterno'],
    fields: [
      {
        key: 'C1',
        type: 'radio',
        label: 'L\u2019impresa predispone un budget economico-finanziario annuale?',
        options: [
          'S\u00ec, formalizzato e approvato',
          'S\u00ec, esiste ma in forma semplificata',
          'Esistono solo previsioni informali',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'C2',
        type: 'radio',
        label: 'L\u2019impresa dispone di un forecast di cassa / piano di tesoreria aggiornato periodicamente?',
        options: [
          'S\u00ec, con orizzonte almeno 12 mesi',
          'S\u00ec, con orizzonte inferiore a 12 mesi',
          'Esiste solo un monitoraggio informale della liquidit\u00e0',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'C3',
        type: 'radio',
        label: 'Con quale frequenza vengono analizzati incassi attesi, pagamenti in scadenza e fabbisogni finanziari?',
        options: [
          'Almeno settimanalmente',
          'Mensilmente',
          'Saltuariamente',
          'Solo in presenza di tensioni finanziarie',
          'Mai / non so',
        ],
        required: true,
      },
      {
        key: 'C4',
        type: 'radio',
        label: 'Gli scostamenti tra previsioni e dati consuntivi vengono analizzati?',
        options: [
          'S\u00ec, regolarmente e con azioni correttive',
          'S\u00ec, ma senza sistematica formalizzazione',
          'Solo in caso di anomalie rilevanti',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'C5',
        type: 'radio',
        label: 'Esiste un monitoraggio specifico degli scaduti verso Erario, enti previdenziali, banche e fornitori strategici?',
        options: [
          'S\u00ec, sistematico e tracciato',
          'S\u00ec, ma non sistematico',
          'Solo per alcune categorie di debito',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'C6',
        type: 'checkbox_with_text',
        label: 'Chi riceve la reportistica economico-finanziaria e con quale frequenza?',
        options: [
          'Direzione / titolare',
          'Responsabile amministrativo',
          'Responsabili di funzione',
          'Commercialista esterno',
          'Organo di controllo / revisore',
          'Nessuna reportistica periodica',
        ],
        textLabel: 'Indicare la frequenza prevalente',
        hideTextIf: 'Nessuna reportistica periodica',
        required: true,
      },
      {
        key: 'C7',
        type: 'scale',
        label: 'Ritiene che l\u2019impresa disponga di informazioni sufficienti per valutare tempestivamente criticit\u00e0 di continuit\u00e0 aziendale?',
        min: 1,
        max: 5,
        labels: { 1: 'Per nulla', 5: 'Pienamente' },
        extraOptions: ['Non so'],
        required: true,
      },
      {
        key: 'C8',
        type: 'radio',
        label: 'In caso di criticit\u00e0 economico-finanziarie, esistono procedure o prassi per l\u2019escalation alla direzione?',
        options: [
          'S\u00ec, formalizzate',
          'S\u00ec, informali ma conosciute',
          'Solo occasionalmente',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 5: CONTESTO ORGANIZZATIVO (sempre) ───
  {
    id: 'contesto',
    type: 'form',
    label: 'Contesto',
    title: 'Contesto Organizzativo',
    subtitle: 'Descrivere il proprio inquadramento e le interazioni operative.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'D1',
        type: 'radio_other',
        label: 'Qual \u00e8 la Sua principale responsabilit\u00e0 operativa effettiva?',
        options: [
          'Gestione vendite e rapporto con clienti',
          'Gestione magazzino e logistica',
          'Amministrazione e contabilit\u00e0',
          'Coordinamento e supervisione di pi\u00f9 aree',
          'Autorizzazioni / controlli / supervisione',
        ],
        required: true,
      },
      {
        key: 'D2',
        type: 'checkbox_other',
        label: 'Con quali interlocutori interagisce maggiormente?',
        options: [
          'Colleghi dello stesso punto vendita',
          'Responsabili / direzione aziendale',
          'Fornitori e corrieri',
          'Consulente paghe / commercialista',
          'Clienti finali',
          'Amministrazione interna',
          'IT / supporto sistemi',
          'Direzione / propriet\u00e0',
          'Banche / intermediari finanziari',
        ],
        required: true,
      },
      {
        key: 'D3',
        type: 'checkbox_other',
        label: 'Quali strumenti/sistemi utilizza quotidianamente?',
        options: [
          'POS / registratore di cassa',
          'Gestionale interno (magazzino/vendite)',
          'Fogli Excel / Google Sheets',
          'Email / WhatsApp per comunicazioni operative',
          'Software contabilit\u00e0',
          'ERP / sistema integrato',
          'Portale fornitori / portale consulente',
          'App timbrature / HR',
        ],
        required: true,
      },
      {
        key: 'D4',
        type: 'checkbox_other',
        label: 'Quali criticit\u00e0 organizzative riscontra nella Sua area di attivit\u00e0?',
        options: [
          'Ruoli e responsabilit\u00e0 poco chiari',
          'Comunicazione lenta tra sedi/funzioni',
          'Procedure non formalizzate o assenti',
          'Sistemi informatici inadeguati o scollegati',
          'Nessuna criticit\u00e0 rilevante',
          'Assenza di deleghe chiare',
          'Controlli non indipendenti',
          'Eccessivo uso di credenziali condivise',
          'Mancanza di reportistica periodica',
        ],
        required: true,
      },
      {
        key: 'D4bis',
        type: 'scale',
        label: 'Quanto sono chiare (per Lei) le responsabilit\u00e0 e i confini operativi del Suo ruolo?',
        min: 1,
        max: 5,
        labels: { 1: 'Per nulla chiare', 2: 'Poco chiare', 3: 'Abbastanza chiare', 4: 'Chiare', 5: 'Pienamente chiare' },
        required: true,
      },
    ],
  },

  // ─── STEP 6: A. VENDITE / POS / CASSA ───
  {
    id: 'vendite',
    type: 'form',
    label: 'Sezione A',
    title: 'Vendite / POS / Cassa',
    subtitle: 'Procedure di vendita, resi, chiusura cassa, gestione incassi.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'A',
    fields: [
      {
        key: 'D5a',
        type: 'checkbox',
        label: 'Quali modalit\u00e0 di vendita vengono effettivamente utilizzate?',
        options: [
          'Vendita assistita con supporto del personale',
          'Vendita rapida a cassa con barcode / POS',
          'Vendita con preventivo / ordine / fattura',
          'Procedura diversa per clienti B2B',
          'Procedura diversa per clienti B2C',
          'Altro',
        ],
        required: true,
      },
      {
        key: 'D5bis',
        type: 'radio_other',
        label: 'Come vengono gestite scontistiche e promozioni?',
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
        key: 'D5ter',
        type: 'radio',
        label: 'Chi pu\u00f2 autorizzare sconti fuori soglia o deroghe alle promozioni standard?',
        options: [
          'Nessuno, non sono consentite deroghe',
          'Responsabile punto vendita',
          'Direzione',
          'Amministrazione / titolare',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D6',
        type: 'radio_other',
        label: 'Come vengono gestiti resi e cambi merce?',
        options: [
          'Reso/cambio con scontrino entro 30 gg, autorizzato dal responsabile',
          'Cambio taglia/colore diretto senza autorizzazione',
          'Buono/voucher al posto del rimborso',
          'Procedura non formalizzata, decisa caso per caso',
        ],
        required: true,
      },
      {
        key: 'D6bis',
        type: 'radio',
        label: 'I resi/cambi sono tracciati con evidenza verificabile?',
        options: [
          'S\u00ec, sempre su sistema o modulo dedicato',
          'S\u00ec, ma non sempre',
          'Solo in parte',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D7',
        type: 'radio_other',
        label: 'Come avviene la chiusura cassa di fine giornata?',
        options: [
          'Z-report + quadratura contante + deposito in cassaforte',
          'Z-report + verifica POS + invio report alla direzione',
          'Chiusura automatica dal gestionale + verifica manuale',
          'Solo Z-report senza quadratura sistematica',
        ],
        required: true,
        showIf: { field: 'ruolo', oneOf: ['Responsabile punto vendita', 'Titolare / Direzione', 'Cassiere'] },
      },
      {
        key: 'D7bis',
        type: 'radio',
        label: 'La quadratura di cassa \u00e8 verificata da soggetto diverso da chi ha effettuato la chiusura?',
        options: [
          'S\u00ec, sempre',
          'S\u00ec, a campione',
          'No, di norma coincide',
          'Non so',
        ],
        required: true,
        showIf: { field: 'ruolo', oneOf: ['Responsabile punto vendita', 'Titolare / Direzione', 'Cassiere'] },
      },
      {
        key: 'D8',
        type: 'radio_other',
        label: 'Chi effettua i controlli su incassi giornalieri?',
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
        label: 'Come vengono gestiti gli accessi al POS/gestionale?',
        options: [
          'Credenziali personali per ogni operatore, gestite dalla direzione',
          'Credenziali condivise tra pi\u00f9 operatori dello stesso PV',
          'Accesso unico senza password / sempre aperto',
          'Accesso con badge/impronta + password personale',
        ],
        required: true,
      },
      {
        key: 'D9bis',
        type: 'radio',
        label: 'Gli accessi vengono revocati o modificati quando un addetto cambia ruolo o cessa il rapporto?',
        options: [
          'S\u00ec, con procedura definita',
          'S\u00ec, ma senza procedura formalizzata',
          'Solo in alcuni casi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D10',
        type: 'scale',
        label: 'Con quale frequenza riscontra criticit\u00e0 nella gestione di cassa, incassi, sconti o resi?',
        min: 1,
        max: 5,
        labels: { 1: 'Mai', 5: 'Molto frequentemente' },
        required: true,
      },
    ],
  },

  // ─── STEP 7: B. MAGAZZINO / LOGISTICA ───
  {
    id: 'magazzino',
    type: 'form',
    label: 'Sezione B',
    title: 'Magazzino / Logistica / Inventari',
    subtitle: 'Ricezione merce, trasferimenti, inventari, gestione stagionale.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'B',
    fields: [
      {
        key: 'D11',
        type: 'radio_other',
        label: 'Come avviene la ricezione merce dai fornitori?',
        options: [
          'Controllo DDT + verifica quantit\u00e0/qualit\u00e0 + caricamento a gestionale',
          'Verifica sommaria quantit\u00e0 + firma DDT + caricamento successivo',
          'Scarico diretto senza controllo immediato, verifica posticipata',
          'Ricezione automatizzata con lettura barcode e verifica a sistema',
        ],
        required: true,
      },
      {
        key: 'D11bis',
        type: 'radio_other',
        label: 'Chi valida gli scostamenti tra merce ricevuta e documenti del fornitore?',
        options: [
          'Responsabile magazzino',
          'Responsabile acquisti',
          'Direzione / amministrazione',
          'Nessuna validazione formale',
        ],
        required: true,
      },
      {
        key: 'D12',
        type: 'radio_other',
        label: 'Come vengono gestiti i trasferimenti merce tra punti vendita?',
        options: [
          'Documento di trasferimento interno + aggiornamento su gestionale',
          'Comunicazione informale (WhatsApp/telefono) + aggiornamento manuale',
          'Trasferimenti automatici da gestionale centralizzato',
          'Non vengono effettuati trasferimenti tra PV',
        ],
        required: true,
      },
      {
        key: 'D12bis',
        type: 'radio',
        label: 'I trasferimenti tra punti vendita sono sempre tracciati in modo riconciliabile?',
        options: [
          'S\u00ec, sempre',
          'S\u00ec, quasi sempre',
          'Solo in parte',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D13',
        type: 'radio_other',
        label: 'Come e con quale frequenza si effettua l\'inventario fisico?',
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
        key: 'D13bis',
        type: 'radio',
        label: 'Le differenze inventariali vengono analizzate, approvate e documentate?',
        options: [
          'S\u00ec, sempre',
          'S\u00ec, ma non in modo sistematico',
          'Solo per differenze rilevanti',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D14',
        type: 'radio_other',
        label: 'Come vengono gestiti resi a fornitori e merce difettosa?',
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
        label: 'Come viene gestita la stagionalit\u00e0 delle collezioni?',
        options: [
          'Passaggio collezione pianificato (SS/FW) con riordini centralizzati',
          'Saldi di fine stagione + smaltimento / outlet tra PV',
          'Gestione informale, riassortimenti su richiesta del PV',
          'Merce a stock continuativo, stagionalit\u00e0 poco rilevante',
        ],
        required: true,
      },
      {
        key: 'D14ter',
        type: 'radio_other',
        label: 'Quali misure di prevenzione ammanchi (shrinkage) esistono?',
        options: [
          'Sistemi antitaccheggio (placche/barriere) + conte periodiche',
          'Videosorveglianza + controlli inventariali periodici',
          'Solo conte inventariali, nessun sistema antitaccheggio',
          'Analisi differenze inventariali con azioni correttive documentate',
          'Nessuna misura strutturata',
        ],
        required: true,
      },
      {
        key: 'D14quater',
        type: 'radio',
        label: 'In caso di ammanchi o differenze anomale, esiste una procedura di escalation?',
        options: [
          'S\u00ec, formalizzata',
          'S\u00ec, solo di prassi',
          'Solo nei casi pi\u00f9 gravi',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 8: C. ACQUISTI / FORNITORI ───
  {
    id: 'acquisti',
    type: 'form',
    label: 'Modulo C',
    title: 'Acquisti / Fornitori',
    subtitle: 'Processo di acquisto, controlli documentali, gestione ordini.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'C',
    fields: [
      {
        key: 'D15',
        type: 'radio_other',
        label: 'Come si svolge il processo di acquisto?',
        options: [
          'Fabbisogno dal PV \u2192 approvazione direzione \u2192 ordine \u2192 ricezione \u2192 fattura \u2192 pagamento',
          'Ordini diretti dal responsabile PV con limiti di spesa predefiniti',
          'Acquisti centralizzati dalla direzione senza input dai PV',
          'Processo misto: riordini automatici + acquisti su richiesta',
        ],
        required: true,
      },
      {
        key: 'D16',
        type: 'radio_other',
        label: 'Quali controlli esistono su ordini/DDT/fatture?',
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
        key: 'D16bis',
        type: 'radio_other',
        label: 'Chi verifica gli scostamenti tra ordine, DDT e fattura?',
        options: [
          'Responsabile acquisti',
          'Amministrazione',
          'Direzione',
          'Nessuna verifica formale',
        ],
        required: true,
      },
      {
        key: 'D16ter',
        type: 'radio_other',
        label: 'Se esistono eccezioni o discordanze, come vengono gestite?',
        options: [
          'Blocco pagamento fino a chiarimento',
          'Approvazione eccezione con autorizzazione',
          'Gestione informale',
          'Non esiste procedura definita',
        ],
        required: true,
      },
      {
        key: 'D16quater',
        type: 'radio',
        label: 'Esistono limiti autorizzativi per ordini, riordini o spese straordinarie?',
        options: [
          'S\u00ec, formalizzati per importo / tipologia',
          'S\u00ec, ma solo informalmente',
          'Solo per alcune spese',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 9: D. CONTABILITÀ / ADEMPIMENTI FISCALI ───
  {
    id: 'contabilita',
    type: 'form',
    label: 'Modulo D',
    title: 'Contabilit\u00e0 / Adempimenti Fiscali',
    subtitle: 'Chiusure contabili, adempimenti IVA, liquidit\u00e0, pagamenti, riconciliazioni.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'D',
    fields: [
      {
        key: 'D19',
        type: 'radio_other',
        label: 'Come si svolge la chiusura contabile mensile?',
        options: [
          'Riconciliazione cassa, banche, IVA e fornitori con check-list e validazione',
          'Chiusura parziale (solo banche e IVA) con verifica trimestrale completa',
          'Registrazioni contabili mensili senza riconciliazione sistematica',
          'Chiusura gestita interamente dal commercialista esterno',
        ],
        required: true,
      },
      {
        key: 'D19bis',
        type: 'radio',
        label: 'La chiusura mensile segue una check-list formale?',
        options: [
          'S\u00ec',
          'S\u00ec, ma non sempre utilizzata',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D20',
        type: 'radio_other',
        label: 'Come vengono gestiti IVA/LIPE e adempimenti fiscali ricorrenti?',
        options: [
          'Gestione interna con calendario scadenze + verifica commercialista',
          'Delegati interamente al commercialista esterno',
          'Gestione interna con software dedicato, commercialista solo per dichiarazioni annuali',
          'Gestione mista con frequenti ritardi o dimenticanze',
        ],
        required: true,
      },
      {
        key: 'D20bis',
        type: 'radio',
        label: 'Esiste un calendario scadenze condiviso e verificabile?',
        options: [
          'S\u00ec, aggiornato e condiviso',
          'S\u00ec, ma non condiviso',
          'Esiste solo informalmente',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D21',
        type: 'radio_other',
        label: 'Come viene monitorata la liquidit\u00e0 aziendale nel breve periodo?',
        options: [
          'Scadenziario su gestionale + previsione di cassa settimanale',
          'Controllo manuale su Excel con aggiornamento periodico',
          'Monitoraggio informale basato sull\'esperienza',
          'Nessun monitoraggio strutturato della liquidit\u00e0',
        ],
        required: true,
      },
      {
        key: 'D21bis',
        type: 'radio_other',
        label: 'Come viene gestita l\'autorizzazione al pagamento?',
        options: [
          'Scadenziario gestito dall\'amministrazione, pagamento autorizzato dalla direzione',
          'Pagamenti automatici a scadenza (RiBa/SDD)',
          'Pagamenti manuali su richiesta del fornitore, approvati dalla direzione',
          'Gestione mista: automatici per fornitori ricorrenti, manuali per gli altri',
        ],
        required: true,
      },
      {
        key: 'D21ter',
        type: 'radio_other',
        label: 'Come vengono gestiti ritardi o problemi di pagamento?',
        options: [
          'Comunicazione diretta con il fornitore + accordo scritto di rientro',
          'Gestione tramite amministrazione con piano di pagamento rateale',
          'Segnalazione alla direzione che decide caso per caso',
          'Nessuna procedura, si gestisce al momento',
        ],
        required: true,
      },
      {
        key: 'D21quater',
        type: 'radio',
        label: 'L\'impresa dispone di una previsione dei flussi di cassa sui successivi 3\u201312 mesi?',
        options: [
          'S\u00ec, sistematica',
          'S\u00ec, ma semplificata',
          'Solo in caso di tensione finanziaria',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D22',
        type: 'radio_other',
        label: 'Come avvengono le riconciliazioni bancarie?',
        options: [
          'Riconciliazione mensile sistematica con gestionale/software',
          'Riconciliazione periodica su Excel / manuale',
          'Solo a chiusura annuale dal commercialista',
          'Riconciliazione automatica dal gestionale con verifica manuale eccezioni',
        ],
        required: true,
      },
      {
        key: 'D22bis',
        type: 'radio',
        label: 'Le eccezioni emerse in riconciliazione vengono riesaminate e chiuse con evidenza documentale?',
        options: [
          'S\u00ec, sempre',
          'S\u00ec, ma non sempre formalmente',
          'Solo per differenze rilevanti',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D22ter',
        type: 'radio',
        label: 'Esiste una reportistica periodica destinata alla direzione su liquidit\u00e0, scaduti, banche, debiti fiscali e previdenziali?',
        options: [
          'S\u00ec, mensile o pi\u00f9 frequente',
          'S\u00ec, ma non regolare',
          'Solo in caso di problemi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D22quater',
        type: 'radio',
        label: 'Gli scostamenti economici e finanziari rispetto alle previsioni vengono analizzati con azioni correttive?',
        options: [
          'S\u00ec, sistematicamente',
          'S\u00ec, ma solo in parte',
          'Solo se emerge un\'anomalia importante',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 10: E. PRESENZE / PAGHE / CONTRIBUTI ───
  {
    id: 'paghe',
    type: 'form',
    label: 'Modulo E',
    title: 'Presenze / Paghe / Contributi',
    subtitle: 'Rilevazione presenze, flusso verso consulente paghe, adempimenti lavoro.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'E',
    fields: [
      {
        key: 'D23',
        type: 'radio_other',
        label: 'Come vengono rilevate presenze, permessi e ferie?',
        options: [
          'Timbratura elettronica (badge/app) + approvazione responsabile',
          'Registro presenze cartaceo compilato dal responsabile PV',
          'Foglio Excel condiviso aggiornato manualmente',
          'Comunicazione informale al responsabile, nessun registro sistematico',
        ],
        required: true,
      },
      {
        key: 'D23bis',
        type: 'radio_other',
        label: 'Chi approva straordinari, permessi e ferie prima dell\'invio al consulente paghe?',
        options: [
          'Responsabile punto vendita',
          'Direzione / titolare',
          'Amministrazione',
          'Nessuna approvazione formale',
        ],
        required: true,
      },
      {
        key: 'D24',
        type: 'radio_other',
        label: 'Come vengono trasmessi i dati al consulente paghe?',
        options: [
          'Invio mensile via email con prospetto presenze validato',
          'Accesso diretto del consulente al sistema di rilevazione presenze',
          'Comunicazione telefonica/WhatsApp con riepilogo informale',
          'Invio tramite portale del consulente paghe',
        ],
        required: true,
      },
      {
        key: 'D24bis',
        type: 'radio',
        label: 'I dati inviati al consulente sono validati da un soggetto responsabile?',
        options: [
          'S\u00ec, sempre',
          'S\u00ec, ma non sempre',
          'Solo per alcuni dipendenti / casi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D25',
        type: 'radio_other',
        label: 'Quali controlli esistono su scadenze e versamenti contributivi?',
        options: [
          'Controllo interno con calendario scadenze + verifica consulente',
          'Interamente delegato al consulente paghe',
          'Controllo occasionale, nessun monitoraggio sistematico',
          'Software dedicato con alert automatici',
        ],
        required: true,
      },
      {
        key: 'D25bis',
        type: 'radio',
        label: 'Esiste un riscontro dell\'avvenuto controllo dei versamenti contributivi e delle relative scadenze?',
        options: [
          'S\u00ec, documentato',
          'S\u00ec, ma non sempre documentato',
          'Solo tramite consulente',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 11: F. IT / SISTEMI / FLUSSI DATI ───
  {
    id: 'it',
    type: 'form',
    label: 'Modulo F',
    title: 'IT / Sistemi / Flussi Dati',
    subtitle: 'Flussi dati tra POS, magazzino e contabilit\u00e0. Gestione accessi e continuit\u00e0 operativa.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    moduleKey: 'F',
    fields: [
      {
        key: 'D26',
        type: 'radio_other',
        label: 'Come arrivano i dati vendita/magazzino alla contabilit\u00e0?',
        options: [
          'Flusso automatico POS \u2192 gestionale \u2192 contabilit\u00e0',
          'Esportazione manuale dal POS + importazione in contabilit\u00e0',
          'Registrazione manuale dalla contabilit\u00e0 basata su report giornalieri',
          'Sistema integrato unico (ERP) che gestisce tutto automaticamente',
        ],
        required: true,
      },
      {
        key: 'D27',
        type: 'radio_other',
        label: 'Come vengono gestiti utenti e autorizzazioni sui sistemi?',
        options: [
          'Profili utente individuali con permessi differenziati gestiti dall\'IT',
          'Credenziali condivise per ruolo (es. tutti i cassieri stesso login)',
          'Accesso unico amministratore, nessuna profilazione',
          'Gestione centralizzata con revisione periodica degli accessi',
        ],
        required: true,
      },
      {
        key: 'D27bis',
        type: 'radio',
        label: 'Gli utenti cessati o trasferiti vengono disabilitati o riprofilati tempestivamente?',
        options: [
          'S\u00ec, sempre tramite procedura',
          'S\u00ec, ma senza procedura formalizzata',
          'Solo in parte',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D27ter',
        type: 'radio',
        label: 'Esistono profili differenziati per funzione e livello autorizzativo?',
        options: [
          'S\u00ec, strutturati e riesaminati periodicamente',
          'S\u00ec, ma senza revisione periodica',
          'Solo per alcuni sistemi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D28',
        type: 'radio_other',
        label: 'Come vengono gestiti i backup?',
        options: [
          'Backup automatico giornaliero su cloud + procedura di ripristino documentata',
          'Backup periodico su disco esterno / NAS locale',
          'Backup gestito dal fornitore del gestionale',
          'Nessun backup strutturato / non so come funziona',
        ],
        required: true,
      },
      {
        key: 'D28bis',
        type: 'radio',
        label: 'Viene effettuato almeno periodicamente un test di ripristino dei backup?',
        options: [
          'S\u00ec, documentato',
          'S\u00ec, ma non documentato',
          'Raramente',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D28ter',
        type: 'radio',
        label: 'Esiste una procedura per incidenti informatici o indisponibilit\u00e0 dei sistemi?',
        options: [
          'S\u00ec, formalizzata',
          'S\u00ec, informale ma conosciuta',
          'Solo per alcuni casi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D28quater',
        type: 'checkbox',
        label: 'Quali misure di sicurezza base sono attive sui dispositivi o sistemi aziendali?',
        options: [
          'Antivirus / antimalware gestito',
          'Firewall / protezione rete',
          'Aggiornamenti periodici',
          'Controllo accessi / password robuste',
          'MFA / autenticazione rafforzata',
          'Non so',
          'Nessuna misura strutturata conosciuta',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 12: CONTROLLI TRASVERSALI, SEGREGAZIONE, PRESIDI ───
  {
    id: 'controlli',
    type: 'form',
    label: 'Controlli trasversali',
    title: 'Controlli Trasversali, Segregazione, Presidi',
    subtitle: 'Questa sezione rileva la robustezza dei controlli interni trasversali, la separazione dei compiti e le modalit\u00e0 di gestione delle anomalie.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'X1',
        type: 'radio',
        label: 'Nella Sua area, chi esegue un\'operazione \u00e8 normalmente diverso da chi la autorizza e da chi la controlla?',
        options: [
          'S\u00ec, in modo sistematico',
          'S\u00ec, nella maggior parte dei casi',
          'Solo per alcune operazioni',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'X2',
        type: 'radio',
        label: 'Se non \u00e8 possibile una piena segregazione dei compiti, esistono controlli compensativi?',
        options: [
          'S\u00ec, formalizzati',
          'S\u00ec, ma informali',
          'Solo in alcuni casi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'X3',
        type: 'checkbox_other',
        label: 'Quali controlli compensativi esistono?',
        options: [
          'Doppia approvazione',
          'Verifica periodica da responsabile diverso',
          'Check-list di controllo',
          'Report eccezioni',
          'Log di sistema',
          'Verifiche a campione',
          'Altro',
        ],
        showIf: { field: 'X1', notEqual: 'S\u00ec, in modo sistematico' },
        required: true,
      },
      {
        key: 'X4',
        type: 'radio',
        label: 'Le anomalie operative o documentali vengono segnalate con una procedura definita?',
        options: [
          'S\u00ec, tramite canale formale scritto',
          'S\u00ec, ma in modo informale',
          'Solo per anomalie gravi',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'X5',
        type: 'scale',
        label: 'Nella Sua area ritiene esistano rischi di irregolarit\u00e0 nella gestione di denaro, merce, resi, sconti, ordini o documenti?',
        min: 1,
        max: 5,
        labels: { 1: 'Per nulla', 5: 'Pienamente' },
        extraOptions: ['Preferisco non rispondere', 'Non so'],
        required: true,
      },
      {
        key: 'X6',
        type: 'radio',
        label: 'L\'impresa dispone di canali di segnalazione interna di anomalie o irregolarit\u00e0, ove previsti o ritenuti opportuni?',
        options: [
          'S\u00ec, formalizzati',
          'S\u00ec, ma solo informali',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D29',
        type: 'checkbox_other',
        label: 'Quali controlli vengono effettuati sui processi di Sua competenza?',
        options: [
          'Controllo da parte del responsabile diretto (periodico)',
          'Report automatici dal gestionale / sistema',
          'Verifica a campione da parte della direzione',
          'Audit / verifica da parte di consulente esterno',
          'Verifica indipendente di seconda linea',
          'Riesame periodico da direzione / amministrazione',
          'Nessuna evidenza di controllo',
          'Nessun controllo formale',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D30',
        type: 'radio',
        label: 'Per le attivit\u00e0 di Sua competenza esistono procedure o istruzioni operative scritte?',
        options: [
          'S\u00ec, aggiornate e normalmente utilizzate',
          'S\u00ec, esistono ma non sempre aggiornate',
          'S\u00ec, esistono ma sono poco utilizzate',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D31',
        type: 'checkbox_other',
        label: 'Quali strumenti/report utilizza per monitorare performance e anomalie?',
        options: [
          'Report vendite giornaliero/settimanale',
          'Report differenze cassa',
          'Report giacenze / movimenti magazzino',
          'Scadenziario pagamenti / incassi',
          'Report scaduti fiscali / contributivi',
          'Forecast di cassa / tesoreria',
          'Report accessi / log di sistema',
          'Report eccezioni / anomalie',
          'Nessun report strutturato',
        ],
        required: true,
      },
      {
        key: 'D32',
        type: 'radio_other',
        label: 'Come vengono comunicate irregolarit\u00e0/anomalie?',
        options: [
          'Segnalazione scritta (email/ticket) al responsabile diretto',
          'Comunicazione verbale / telefonica al responsabile',
          'Segnalazione tramite WhatsApp o chat informale',
          'Segnalazione tramite modulo standard / workflow',
          'Segnalazione ad amministrazione / direzione con tracciatura',
          'Nessuna escalation definita',
          'Non esiste una procedura definita di escalation',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 13: CRITICITÀ E SUGGERIMENTI ───
  {
    id: 'criticita',
    type: 'form',
    label: 'Criticit\u00e0',
    title: 'Criticit\u00e0 e Suggerimenti',
    subtitle: 'Spazio dedicato a problemi ricorrenti e proposte migliorative.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'D33',
        type: 'checkbox_other',
        label: 'Quali sono le principali criticit\u00e0 da affrontare? (max 3)',
        maxSelections: 3,
        options: [
          'Mancanza di procedure scritte',
          'Deleghe / responsabilit\u00e0 non chiarite',
          'Assenza di controlli indipendenti',
          'Sistemi informatici non integrati',
          'Scarsa tracciabilit\u00e0 delle approvazioni',
          'Carenza di reportistica',
          'Debole monitoraggio di liquidit\u00e0 / scaduti',
          'Gestione magazzino poco accurata',
          'Credenziali condivise / profili non controllati',
          'Formazione insufficiente',
        ],
        required: true,
      },
      {
        key: 'D33bis',
        type: 'radio',
        label: 'Tra le criticit\u00e0 selezionate, quale ritiene la pi\u00f9 urgente?',
        dynamicOptionsFrom: 'D33',
        required: true,
      },
      {
        key: 'D34',
        type: 'checkbox_other',
        label: 'Quali miglioramenti suggerirebbe?',
        options: [
          'Introduzione di procedure scritte per ogni processo',
          'Integrazione/aggiornamento dei sistemi informatici',
          'Formazione periodica del personale',
          'Riunioni operative regolari tra sedi',
          'Introduzione di controlli e report periodici',
          'Formalizzazione deleghe e limiti autorizzativi',
          'Migliore segregazione / controlli compensativi',
          'Reportistica periodica per direzione',
          'Budget / forecast / tesoreria',
          'Maggiore sicurezza e profilazione dei sistemi',
        ],
        required: true,
      },
      {
        key: 'D35',
        type: 'textarea',
        label: 'Ulteriori osservazioni o proposte migliorative non ancora indicate',
        placeholder: 'Eventuali rischi, punti di attenzione, proposte non incluse sopra...',
        requiredIf: { anyOf: [{ field: 'D33', includes: '__altro__' }, { field: 'D34', includes: '__altro__' }] },
        required: false,
      },
    ],
  },

  // ─── STEP 14: REMEDIATION E PRIORITÀ ───
  {
    id: 'remediation',
    type: 'form',
    label: 'Remediation',
    title: 'Remediation e Priorit\u00e0',
    subtitle: 'In questa sezione si raccolgono indicazioni operative sulle priorit\u00e0 di miglioramento, sui responsabili interni e sui tempi di attuazione.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'R1',
        type: 'radio',
        label: 'Quale area richiede il primo intervento correttivo?',
        options: [
          'Governance / deleghe',
          'Vendite / cassa',
          'Magazzino / inventari',
          'Acquisti / fornitori',
          'Contabilit\u00e0 / liquidit\u00e0 / scaduti',
          'Presenze / paghe',
          'IT / accessi / backup',
          'Controlli trasversali / escalation',
        ],
        required: true,
      },
      {
        key: 'R2',
        type: 'radio',
        label: 'Il miglioramento prioritario richiesto \u00e8 di tipo:',
        options: [
          'Organizzativo',
          'Procedurale',
          'Informatico / sistemi',
          'Formativo',
          'Di controllo / audit',
          'Documentale',
        ],
        required: true,
      },
      {
        key: 'R3',
        type: 'radio',
        label: 'Entro quale orizzonte temporale ritiene opportuno intervenire?',
        options: [
          'Entro 30 giorni',
          'Entro 60 giorni',
          'Entro 90 giorni',
          'Entro 6 mesi',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'R4',
        type: 'radio_other',
        label: 'Chi dovrebbe essere il responsabile interno del miglioramento?',
        options: [
          'Direzione / titolare',
          'Responsabile amministrativo',
          'Responsabile punto vendita',
          'Responsabile magazzino',
          'Consulente esterno',
          'IT / fornitore sistemi',
          'Altro',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 15: DOCUMENTI, EVIDENZE, ARCHIVI ───
  {
    id: 'documenti',
    type: 'form',
    label: 'Documenti',
    title: 'Documenti, Evidenze, Archivi',
    subtitle: 'Indicare documenti/evidenze effettivamente disponibili nella propria struttura.',
    sectionNote: 'Risponda con riferimento alla prassi effettiva, non alla procedura teorica.',
    alwaysShow: true,
    fields: [
      {
        key: 'D36',
        type: 'checkbox',
        label: 'Documenti/evidenze disponibili (selezionare quanto presente)',
        options: [
          'Organigramma',
          'Mansionario / funzionigramma',
          'Matrice deleghe / limiti autorizzativi',
          'Procedure operative (SOP)',
          'Check-list di chiusura / controllo',
          'Report vendite / cassa',
          'Report scaduti / liquidit\u00e0 / banche',
          'Report inventariali / differenze',
          'Evidenze approvative (email, firme, workflow)',
          'Log accessi / report IT',
          'Evidenze backup / restore',
          'Nessun documento formalizzato / non disponibile',
        ],
        required: true,
      },
      {
        key: 'E2',
        type: 'radio',
        label: 'Per i documenti selezionati, sono aggiornati e facilmente reperibili?',
        options: [
          'S\u00ec, generalmente s\u00ec',
          'Solo in parte',
          'No',
          'Non so',
        ],
        required: true,
      },
      {
        key: 'D37',
        type: 'radio_other',
        label: 'Dove sono archiviati i documenti disponibili?',
        options: [
          'Cartella condivisa su PC / server locale',
          'Cloud (Google Drive, Dropbox, OneDrive)',
          'Archivio cartaceo in ufficio/magazzino',
          'Nel gestionale / software dedicato',
          'Archivio misto cartaceo + digitale',
          'Gestione presso consulente / fornitore esterno',
          'Non so dove siano archiviati',
        ],
        required: true,
      },
      {
        key: 'E3',
        type: 'radio_other',
        label: 'Chi \u00e8 normalmente responsabile dell\'archiviazione e della reperibilit\u00e0 dei documenti?',
        options: [
          'Amministrazione',
          'Direzione / titolare',
          'Responsabile di funzione',
          'Consulente esterno',
          'Non \u00e8 definito',
        ],
        required: true,
      },
      {
        key: 'E4',
        type: 'radio',
        label: 'In caso di controllo interno o richiesta della direzione, i documenti vengono recuperati rapidamente?',
        options: [
          'S\u00ec, normalmente entro la giornata',
          'S\u00ec, ma con difficolt\u00e0',
          'Solo per alcuni documenti',
          'No',
          'Non so',
        ],
        required: true,
      },
    ],
  },

  // ─── STEP 16: REVIEW ───
  {
    id: 'review',
    type: 'review',
    title: 'Riepilogo e Valutazione',
    subtitle: 'Verifica le risposte prima dell\'invio. Il presente riepilogo sintetizza le informazioni rese dall\'intervistato e non sostituisce la successiva valutazione professionale.',
  },

  // ─── STEP 17: ATTESTAZIONE FINALE ───
  {
    id: 'attestazione',
    type: 'form',
    label: 'Attestazione',
    title: 'Attestazione Finale',
    subtitle: 'La validazione finale registra data e ora di invio, versione del questionario e identificativo univoco della compilazione.',
    alwaysShow: true,
    fields: [
      {
        key: 'D38',
        type: 'consent',
        label: 'Attestazione finale',
        consentText: 'Dichiaro che le risposte fornite corrispondono, per quanto a mia conoscenza, ai fatti e ai processi aziendali rilevati alla data odierna.',
        required: true,
      },
    ],
  },

  // ─── STEP 18: SUCCESS ───
  {
    id: 'success',
    type: 'success',
  },
];

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
const state = {
  currentStep: 0,
  selectedModules: new Set(),
  answers: {},
  otherTexts: {},
  visibleSteps: [],
  suggestedModules: new Set(),
  // Hidden technical fields
  interview_uuid: '',
  started_at: '',
  submitted_at: '',
  completion_status: 'started',
};

// ──────────────────────────────────────────────
// UUID GENERATOR
// ──────────────────────────────────────────────
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ──────────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') e.className = v;
    else if (k === 'innerHTML') e.innerHTML = v;
    else if (k === 'textContent') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ──────────────────────────────────────────────
// COMPUTE VISIBLE STEPS
// ──────────────────────────────────────────────
function computeVisibleSteps() {
  state.visibleSteps = [];
  const ruolo = state.answers['ruolo'] || '';
  STEPS.forEach((step, i) => {
    // Role-based step filtering
    if (step.showForRoles && step.showForRoles.length > 0) {
      if (!step.showForRoles.includes(ruolo)) return;
    }
    if (step.type === 'welcome' || step.type === 'dashboard' || step.type === 'review' || step.type === 'success') {
      state.visibleSteps.push(i);
    } else if (step.alwaysShow) {
      state.visibleSteps.push(i);
    } else if (step.moduleKey && state.selectedModules.has(step.moduleKey)) {
      state.visibleSteps.push(i);
    }
  });
}

// ──────────────────────────────────────────────
// FIELD VISIBILITY (showIf)
// ──────────────────────────────────────────────
function isFieldVisible(field) {
  if (!field.showIf) return true;
  const cond = field.showIf;
  const val = state.answers[cond.field];
  if (cond.notEqual !== undefined) {
    return val !== cond.notEqual;
  }
  if (cond.equals !== undefined) {
    return val === cond.equals;
  }
  if (cond.oneOf !== undefined) {
    return cond.oneOf.includes(val);
  }
  return true;
}

// ──────────────────────────────────────────────
// TOOLTIPS
// ──────────────────────────────────────────────
function applyTooltips(container) {
  const labels = container.querySelectorAll('label, .field-label, .option-text, .scale-label, .consent-text, .section-note');
  labels.forEach((label) => {
    // Skip if already processed
    if (label.querySelector('.glossary-term')) return;
    Object.keys(GLOSSARY).forEach((term) => {
      const regex = new RegExp('\\b(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b', 'g');
      if (label.innerHTML.match(regex) && !label.innerHTML.includes('glossary-term')) {
        label.innerHTML = label.innerHTML.replace(
          regex,
          '<span class="glossary-term" tabindex="0" data-tooltip="' + escapeHtml(GLOSSARY[term]) + '">$1</span>'
        );
      }
    });
  });
}

// ──────────────────────────────────────────────
// PROGRESS BAR
// ──────────────────────────────────────────────
function updateProgress() {
  const bar = $('#progressBar');
  const text = $('#progressText');
  const container = $('.progress-container');
  if (!bar || !text) return;

  const step = STEPS[state.currentStep];
  if (step && (step.type === 'welcome' || step.type === 'success')) {
    if (container) container.style.display = 'none';
    return;
  }
  if (container) container.style.display = '';

  const total = state.visibleSteps.length - 1;
  const current = state.visibleSteps.indexOf(state.currentStep);
  if (current < 0) return;
  const pct = Math.round((current / total) * 100);
  bar.style.setProperty('--progress', pct + '%');
  text.textContent = 'Step ' + (current + 1) + ' di ' + (total + 1);
}

// ──────────────────────────────────────────────
// RENDER MAIN
// ──────────────────────────────────────────────
function render() {
  const app = $('#formContainer');
  if (!app) return;
  app.innerHTML = '';
  const step = STEPS[state.currentStep];
  if (!step) return;

  switch (step.type) {
    case 'welcome':
      renderWelcome(app, step);
      break;
    case 'form':
      renderForm(app, step);
      break;
    case 'dashboard':
      renderDashboard(app, step);
      break;
    case 'review':
      renderReview(app, step);
      break;
    case 'success':
      renderSuccess(app, step);
      break;
    default:
      app.appendChild(el('p', { textContent: 'Tipo step sconosciuto: ' + step.type }));
  }

  updateProgress();
  applyTooltips(app);
  // Scroll to top only on step navigation, not on field re-renders
  if (state._scrollToTop) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    state._scrollToTop = false;
  }
}

// ──────────────────────────────────────────────
// RENDER WELCOME
// ──────────────────────────────────────────────
function renderWelcome(app, step) {
  const card = el('div', { className: 'glass-card' });

  const hero = el('div', { className: 'welcome-hero' });
  hero.appendChild(el('div', { className: 'welcome-badge', textContent: 'Progetto Assetti OAC' }));
  if (step.companyName) {
    hero.appendChild(el('h1', { className: 'welcome-company', textContent: step.companyName }));
  }
  hero.appendChild(el('h2', { className: 'welcome-title', textContent: step.title }));
  if (step.subtitle) {
    hero.appendChild(el('p', { className: 'welcome-project', textContent: step.subtitle }));
  }
  hero.appendChild(el('div', { className: 'welcome-divider' }));
  if (step.introText) {
    const info = el('div', { className: 'welcome-info' });
    step.introText.split('\n').forEach((paragraph) => {
      if (paragraph.trim()) {
        info.appendChild(el('p', { textContent: paragraph.trim() }));
      }
    });
    hero.appendChild(info);
  }
  card.appendChild(hero);

  const btnRow = el('div', { className: 'btn-row' });
  btnRow.style.justifyContent = 'center';
  const btnStart = el('button', {
    className: 'btn btn-primary',
    onClick: () => goNext(),
  });
  btnStart.innerHTML = 'Inizia il questionario ' + ICONS.arrowRight;
  btnRow.appendChild(btnStart);
  card.appendChild(btnRow);

  app.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER FORM
// ──────────────────────────────────────────────
function renderForm(app, step) {
  const card = el('div', { className: 'glass-card' });

  if (step.label) {
    card.appendChild(el('span', { className: 'step-label', textContent: step.label }));
  }
  card.appendChild(el('h2', { className: 'step-title', textContent: step.title }));
  if (step.subtitle) {
    card.appendChild(el('p', { className: 'step-subtitle', textContent: step.subtitle }));
  }
  if (step.sectionNote) {
    const note = el('p', { className: 'section-note' });
    note.innerHTML = '<em>' + escapeHtml(step.sectionNote) + '</em>';
    card.appendChild(note);
  }

  const visibleFields = (step.fields || []).filter((f) => isFieldVisible(f));
  visibleFields.forEach((field) => {
    card.appendChild(renderField(field));
  });

  if (step.footerNote) {
    const fn = el('p', { className: 'footer-note' });
    fn.innerHTML = '<em>' + escapeHtml(step.footerNote) + '</em>';
    card.appendChild(fn);
  }

  // Navigation buttons
  const btnRow = el('div', { className: 'btn-row' });
  if (state.currentStep > 0) {
    btnRow.appendChild(
      el('button', {
        className: 'btn btn-secondary',
        innerHTML: ICONS.arrowLeft + ' Indietro',
        onClick: () => goPrev(),
      })
    );
  }
  btnRow.appendChild(
    el('button', {
      className: 'btn btn-primary',
      innerHTML: 'Avanti ' + ICONS.arrowRight,
      onClick: () => goNext(),
    })
  );
  card.appendChild(btnRow);

  app.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER FIELD
// ──────────────────────────────────────────────
function renderField(field) {
  const wrapper = el('div', { className: 'field-group', id: 'field-' + field.key });

  const labelEl = el('label', { className: 'field-label', textContent: field.label });
  if (field.required) {
    labelEl.appendChild(el('span', { className: 'required', textContent: ' *' }));
  } else if (field.requiredIf) {
    // Show asterisk only if condition is met
    if (isRequiredIfMet(field)) {
      labelEl.appendChild(el('span', { className: 'required', textContent: ' *' }));
    }
  }
  wrapper.appendChild(labelEl);

  switch (field.type) {
    case 'text':
      wrapper.appendChild(renderTextField(field));
      break;
    case 'textarea':
      wrapper.appendChild(renderTextareaField(field));
      break;
    case 'date':
      wrapper.appendChild(renderDateField(field));
      break;
    case 'select':
      wrapper.appendChild(renderSelectField(field));
      break;
    case 'radio':
      wrapper.appendChild(renderRadioField(field));
      break;
    case 'radio_other':
      wrapper.appendChild(renderRadioOtherField(field));
      break;
    case 'checkbox':
      wrapper.appendChild(renderCheckboxField(field));
      break;
    case 'checkbox_other':
      wrapper.appendChild(renderCheckboxOtherField(field));
      break;
    case 'checkbox_with_text':
      wrapper.appendChild(renderCheckboxWithTextField(field));
      break;
    case 'scale':
      wrapper.appendChild(renderScaleField(field));
      break;
    case 'consent':
      wrapper.appendChild(renderConsentField(field));
      break;
    default:
      wrapper.appendChild(el('p', { textContent: 'Tipo campo sconosciuto: ' + field.type }));
  }

  // Error slot
  wrapper.appendChild(el('div', { className: 'field-error', id: 'error-' + field.key }));

  return wrapper;
}

// ── TEXT ──
function renderTextField(field) {
  const input = el('input', {
    type: field.inputType || 'text',
    className: 'input',
    id: 'input-' + field.key,
    placeholder: field.placeholder || '',
    value: state.answers[field.key] || '',
  });
  input.addEventListener('input', (e) => {
    state.answers[field.key] = e.target.value;
    clearFieldError(field.key);
  });
  return input;
}

// ── TEXTAREA ──
function renderTextareaField(field) {
  const ta = el('textarea', {
    className: 'textarea',
    id: 'input-' + field.key,
    placeholder: field.placeholder || '',
    rows: '4',
  });
  ta.value = state.answers[field.key] || '';
  ta.addEventListener('input', (e) => {
    state.answers[field.key] = e.target.value;
    clearFieldError(field.key);
  });
  return ta;
}

// ── DATE ──
function renderDateField(field) {
  // Auto-fill today's date if empty
  if (!state.answers[field.key]) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    state.answers[field.key] = yyyy + '-' + mm + '-' + dd;
  }
  const input = el('input', {
    type: 'date',
    className: 'input',
    id: 'input-' + field.key,
    value: state.answers[field.key] || '',
  });
  input.addEventListener('change', (e) => {
    state.answers[field.key] = e.target.value;
    clearFieldError(field.key);
  });
  return input;
}

// ── SELECT ──
function renderSelectField(field) {
  const select = el('select', {
    className: 'select',
    id: 'input-' + field.key,
  });
  (field.options || []).forEach((opt) => {
    const option = el('option', { value: opt, textContent: opt || '-- Selezionare --' });
    if (state.answers[field.key] === opt) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener('change', (e) => {
    state.answers[field.key] = e.target.value;
    clearFieldError(field.key);
    if (field.hasOther && e.target.value === 'Altro') {
      render();
    }
  });

  // If has "Altro" and it's selected, wrap select + other-input in a container
  if (field.hasOther && state.answers[field.key] === 'Altro') {
    const wrap = el('div');
    wrap.appendChild(select);
    const otherWrap = el('div', { className: 'other-input-wrap' });
    const otherInput = el('input', {
      type: 'text',
      className: 'input other-input',
      placeholder: 'Specificare...',
      value: state.otherTexts[field.key] || '',
    });
    otherInput.addEventListener('input', (e) => {
      state.otherTexts[field.key] = e.target.value;
    });
    otherWrap.appendChild(otherInput);
    wrap.appendChild(otherWrap);
    return wrap;
  }

  return select;
}

// ── RADIO ──
function renderRadioField(field) {
  const wrap = el('div', { className: 'radio-group' });

  // Handle dynamicOptionsFrom
  let options = field.options;
  if (field.dynamicOptionsFrom) {
    const sourceAnswers = state.answers[field.dynamicOptionsFrom];
    if (Array.isArray(sourceAnswers) && sourceAnswers.length > 0) {
      options = sourceAnswers.filter((o) => o !== '__altro__');
      if (options.length === 0) {
        wrap.appendChild(el('p', { className: 'info-message', textContent: 'Selezionare prima le criticit\u00e0 nella domanda precedente.' }));
        return wrap;
      }
    } else {
      wrap.appendChild(el('p', { className: 'info-message', textContent: 'Selezionare prima le criticit\u00e0 nella domanda precedente.' }));
      return wrap;
    }
  }

  if (!options || options.length === 0) {
    wrap.appendChild(el('p', { className: 'info-message', textContent: 'Nessuna opzione disponibile.' }));
    return wrap;
  }

  options.forEach((opt) => {
    const isSelected = state.answers[field.key] === opt;
    const optDiv = el('div', {
      className: 'radio-option' + (isSelected ? ' selected' : ''),
    });
    optDiv.innerHTML = '<span class="radio-circle"></span><span class="option-text">' + escapeHtml(opt) + '</span>';
    optDiv.addEventListener('click', () => {
      state.answers[field.key] = opt;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  });
  return wrap;
}

// ── RADIO OTHER ──
function renderRadioOtherField(field) {
  const wrap = el('div', { className: 'radio-group' });
  (field.options || []).forEach((opt) => {
    const isSelected = state.answers[field.key] === opt;
    const optDiv = el('div', {
      className: 'radio-option' + (isSelected ? ' selected' : ''),
    });
    optDiv.innerHTML = '<span class="radio-circle"></span><span class="option-text">' + escapeHtml(opt) + '</span>';
    optDiv.addEventListener('click', () => {
      state.answers[field.key] = opt;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  });

  // "Altro" option
  const isOther = state.answers[field.key] === '__altro__';
  const otherDiv = el('div', {
    className: 'radio-option' + (isOther ? ' selected' : ''),
  });
  otherDiv.innerHTML = '<span class="radio-circle"></span><span class="option-text">Altro</span>';
  otherDiv.addEventListener('click', () => {
    state.answers[field.key] = '__altro__';
    clearFieldError(field.key);
    render();
  });
  wrap.appendChild(otherDiv);

  if (isOther) {
    const otherWrap = el('div', { className: 'other-input-wrap' });
    const otherInput = el('input', {
      type: 'text',
      className: 'input other-input',
      placeholder: 'Specificare...',
      value: state.otherTexts[field.key] || '',
    });
    otherInput.addEventListener('input', (e) => {
      state.otherTexts[field.key] = e.target.value;
    });
    otherWrap.appendChild(otherInput);
    wrap.appendChild(otherWrap);
  }
  return wrap;
}

// ── CHECKBOX ──
function renderCheckboxField(field) {
  const wrap = el('div', { className: 'checkbox-group' });
  const current = Array.isArray(state.answers[field.key]) ? state.answers[field.key] : [];

  (field.options || []).forEach((opt) => {
    const isSelected = current.includes(opt);
    const optDiv = el('div', {
      className: 'checkbox-option' + (isSelected ? ' selected' : ''),
    });
    optDiv.innerHTML = '<span class="check-box">' + ICONS.check + '</span><span class="option-text">' + escapeHtml(opt) + '</span>';
    optDiv.addEventListener('click', () => {
      let arr = Array.isArray(state.answers[field.key]) ? [...state.answers[field.key]] : [];
      if (arr.includes(opt)) {
        arr = arr.filter((x) => x !== opt);
      } else {
        if (field.maxSelections && arr.length >= field.maxSelections) {
          arr.shift();
        }
        arr.push(opt);
      }
      state.answers[field.key] = arr;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  });
  return wrap;
}

// ── CHECKBOX OTHER ──
function renderCheckboxOtherField(field) {
  const wrap = el('div', { className: 'checkbox-group' });
  const current = Array.isArray(state.answers[field.key]) ? state.answers[field.key] : [];

  (field.options || []).forEach((opt) => {
    const val = opt === 'Altro' ? '__altro__' : opt;
    const isSelected = current.includes(val);
    const optDiv = el('div', {
      className: 'checkbox-option' + (isSelected ? ' selected' : ''),
    });
    optDiv.innerHTML = '<span class="check-box">' + ICONS.check + '</span><span class="option-text">' + escapeHtml(opt) + '</span>';
    optDiv.addEventListener('click', () => {
      let arr = Array.isArray(state.answers[field.key]) ? [...state.answers[field.key]] : [];
      if (arr.includes(val)) {
        arr = arr.filter((x) => x !== val);
      } else {
        if (field.maxSelections && arr.length >= field.maxSelections) {
          arr.shift();
        }
        arr.push(val);
      }
      state.answers[field.key] = arr;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  });

  // "Altro" text input
  if (current.includes('__altro__')) {
    const otherWrap = el('div', { className: 'other-input-wrap' });
    const otherInput = el('input', {
      type: 'text',
      className: 'input other-input',
      placeholder: 'Specificare...',
      value: state.otherTexts[field.key] || '',
    });
    otherInput.addEventListener('input', (e) => {
      state.otherTexts[field.key] = e.target.value;
    });
    otherWrap.appendChild(otherInput);
    wrap.appendChild(otherWrap);
  }
  return wrap;
}

// ── CHECKBOX WITH TEXT ──
function renderCheckboxWithTextField(field) {
  const wrap = el('div', { className: 'checkbox-group' });
  const current = Array.isArray(state.answers[field.key]) ? state.answers[field.key] : [];

  (field.options || []).forEach((opt) => {
    const isSelected = current.includes(opt);
    const optDiv = el('div', {
      className: 'checkbox-option' + (isSelected ? ' selected' : ''),
    });
    optDiv.innerHTML = '<span class="check-box">' + ICONS.check + '</span><span class="option-text">' + escapeHtml(opt) + '</span>';
    optDiv.addEventListener('click', () => {
      let arr = Array.isArray(state.answers[field.key]) ? [...state.answers[field.key]] : [];
      if (arr.includes(opt)) {
        arr = arr.filter((x) => x !== opt);
      } else {
        arr.push(opt);
      }
      state.answers[field.key] = arr;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  });

  // Text input below checkboxes — hide if "hideTextIf" option is selected
  const shouldHideText = field.hideTextIf && current.includes(field.hideTextIf);
  if (!shouldHideText) {
    const textLabel = el('label', { className: 'field-label field-label-sub', textContent: field.textLabel || '' });
    wrap.appendChild(textLabel);
    const textInput = el('input', {
      type: 'text',
      className: 'input',
      placeholder: field.textLabel || '',
      value: state.answers[field.key + '_text'] || '',
    });
    textInput.addEventListener('input', (e) => {
      state.answers[field.key + '_text'] = e.target.value;
      clearFieldError(field.key);
    });
    wrap.appendChild(textInput);
  }

  return wrap;
}

// ── SCALE ──
function renderScaleField(field) {
  const wrap = el('div', { className: 'scale-group' });

  for (let i = field.min; i <= field.max; i++) {
    const isSelected = state.answers[field.key] === i;
    const optDiv = el('div', {
      className: 'scale-option' + (isSelected ? ' selected' : ''),
    });
    const numberSpan = el('span', { className: 'scale-number', textContent: String(i) });
    optDiv.appendChild(numberSpan);

    // Add label if available
    if (field.labels && field.labels[i]) {
      const labelSpan = el('span', { className: 'scale-label', textContent: field.labels[i] });
      optDiv.appendChild(labelSpan);
    }

    optDiv.addEventListener('click', () => {
      state.answers[field.key] = i;
      clearFieldError(field.key);
      render();
    });
    wrap.appendChild(optDiv);
  }

  // Extra options (like "Non applicabile") rendered as radio-style options below
  if (field.extraOptions && field.extraOptions.length > 0) {
    const extraRow = el('div', { className: 'extra-options-row' });
    field.extraOptions.forEach((eo) => {
      const isExtraSelected = state.answers[field.key] === eo;
      const eoDiv = el('div', {
        className: 'radio-option' + (isExtraSelected ? ' selected' : ''),
      });
      eoDiv.innerHTML = '<span class="radio-circle"></span><span class="option-text">' + escapeHtml(eo) + '</span>';
      eoDiv.addEventListener('click', () => {
        state.answers[field.key] = eo;
        clearFieldError(field.key);
        render();
      });
      extraRow.appendChild(eoDiv);
    });
    wrap.appendChild(extraRow);
  }

  return wrap;
}

// ── CONSENT ──
function renderConsentField(field) {
  const wrap = el('div', { className: 'consent-group' });
  const isChecked = state.answers[field.key] === true;

  const label = el('label', { className: 'consent-label' });

  const checkbox = el('input', {
    type: 'checkbox',
    className: 'consent-checkbox',
    id: 'input-' + field.key,
  });
  checkbox.checked = isChecked;
  checkbox.addEventListener('change', (e) => {
    state.answers[field.key] = e.target.checked;
    clearFieldError(field.key);
  });
  label.appendChild(checkbox);

  const text = el('span', { className: 'consent-text', textContent: field.consentText });
  label.appendChild(text);

  wrap.appendChild(label);
  return wrap;
}

// ──────────────────────────────────────────────
// RENDER DASHBOARD
// ──────────────────────────────────────────────
function renderDashboard(app, step) {
  const card = el('div', { className: 'glass-card' });

  card.appendChild(el('h2', { className: 'step-title', textContent: step.title }));
  if (step.subtitle) {
    card.appendChild(el('p', { className: 'step-subtitle', textContent: step.subtitle }));
  }

  // Render P1 field
  if (step.fields && step.fields.length > 0) {
    step.fields.forEach((field) => {
      card.appendChild(renderField(field));
    });
  }

  // Auto-suggest modules
  autoSuggestModules();

  // Show suggestion summary
  if (state.suggestedModules.size > 0) {
    const suggestWrap = el('div', { className: 'suggest-info' });
    const suggestTitle = el('p');
    const suggestedNames = MODULES.filter((m) => state.suggestedModules.has(m.key)).map((m) => m.name);
    suggestTitle.innerHTML = '<strong>Moduli consigliati:</strong> ' + suggestedNames.map((n) => escapeHtml(n)).join(', ');
    suggestWrap.appendChild(suggestTitle);
    suggestWrap.appendChild(el('p', { textContent: 'Pu\u00f2 confermare o modificare la selezione sottostante.' }));
    card.appendChild(suggestWrap);
  } else {
    card.appendChild(el('p', { className: 'suggest-info', textContent: 'Seleziona le aree in cui interagisci sopra per ricevere suggerimenti sui moduli da compilare.' }));
  }

  // Module grid
  const grid = el('div', { className: 'module-grid' });
  MODULES.forEach((mod) => {
    const isSelected = state.selectedModules.has(mod.key);
    const isSuggested = state.suggestedModules.has(mod.key);
    const moduleCard = el('div', {
      className: 'module-card' + (isSelected ? ' selected' : '') + (isSuggested ? ' suggested' : ''),
    });
    moduleCard.innerHTML =
      '<div class="module-icon">' + mod.icon + '</div>' +
      '<div class="module-name">' + escapeHtml(mod.name) + '</div>' +
      '<div class="module-desc">' + escapeHtml(mod.desc) + '</div>' +
      (isSuggested ? '<div class="module-suggested-badge">Consigliato</div>' : '') +
      '<div class="module-check">' + (isSelected ? ICONS.checkWhite : '') + '</div>';
    moduleCard.addEventListener('click', (e) => {
      if (!state._manuallyDeselected) state._manuallyDeselected = new Set();
      if (state.selectedModules.has(mod.key)) {
        state.selectedModules.delete(mod.key);
        state._manuallyDeselected.add(mod.key);
      } else {
        state.selectedModules.add(mod.key);
        state._manuallyDeselected.delete(mod.key);
      }
      computeVisibleSteps();
      // No scroll on module toggle - preserve position
      render();
    });
    grid.appendChild(moduleCard);
  });
  card.appendChild(grid);

  // Buttons
  const btnRow = el('div', { className: 'btn-row' });
  btnRow.appendChild(
    el('button', {
      className: 'btn btn-secondary',
      innerHTML: ICONS.arrowLeft + ' Indietro',
      onClick: () => goPrev(),
    })
  );
  btnRow.appendChild(
    el('button', {
      className: 'btn btn-primary',
      innerHTML: 'Conferma e continua ' + ICONS.arrowRight,
      onClick: () => {
        // Select all suggested modules if none manually selected
        if (state.selectedModules.size === 0) {
          state.suggestedModules.forEach((key) => state.selectedModules.add(key));
        }
        computeVisibleSteps();
        goNext();
      },
    })
  );
  card.appendChild(btnRow);

  app.appendChild(card);
}

// ──────────────────────────────────────────────
// AUTO-SUGGEST MODULES
// ──────────────────────────────────────────────
function autoSuggestModules() {
  state.suggestedModules = new Set();
  const area = state.answers['area'] || '';
  const ruolo = (state.answers['ruolo'] || '').toLowerCase();
  const p1 = Array.isArray(state.answers['P1']) ? state.answers['P1'] : [];

  // Suggest from area funzionale
  if (area.includes('Vendite')) state.suggestedModules.add('A');
  if (area.includes('Magazzino')) state.suggestedModules.add('B');
  if (area.includes('Acquisti')) state.suggestedModules.add('C');
  if (area.includes('Amministrazione') || area.includes('Fiscale')) state.suggestedModules.add('D');
  if (area.includes('HR') || area.includes('Presenze')) state.suggestedModules.add('E');
  if (area.includes('IT')) state.suggestedModules.add('F');

  // Module D also from role
  if (
    ruolo.includes('direzione') ||
    ruolo.includes('titolare') ||
    ruolo.includes('responsabile amministrativo') ||
    ruolo.includes('responsabile contabilit')
  ) {
    state.suggestedModules.add('D');
  }

  // P1 selects area → suggest corresponding module
  p1.forEach((p) => {
    if (p.includes('Vendite') || p.includes('cassa')) state.suggestedModules.add('A');
    if (p.includes('Magazzino') || p.includes('logistica')) state.suggestedModules.add('B');
    if (p.includes('Acquisti') || p.includes('fornitori')) state.suggestedModules.add('C');
    if (p.includes('Amministrazione') || p.includes('contabilit')) state.suggestedModules.add('D');
    if (p.includes('Presenze') || p.includes('paghe') || p.includes('turni')) state.suggestedModules.add('E');
    if (p.includes('Sistemi informativi') || p.includes('dati') || p.includes('accessi')) state.suggestedModules.add('F');
  });

  // Direzione / proprieta gets all
  if (area.includes('Direzione') || area.includes('propriet')) {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((k) => state.suggestedModules.add(k));
  }
  if (p1.some((x) => x.includes('Direzione') || x.includes('supervisione') || x.includes('approvazioni'))) {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((k) => state.suggestedModules.add(k));
  }

  // Auto-select suggested modules (unless manually deselected by user)
  if (!state._manuallyDeselected) state._manuallyDeselected = new Set();
  state.suggestedModules.forEach((key) => {
    if (!state._manuallyDeselected.has(key)) {
      state.selectedModules.add(key);
    }
  });
  computeVisibleSteps();
}

// ──────────────────────────────────────────────
// SCORING ENGINE
// ──────────────────────────────────────────────
const SCORING_AREAS = {
  'Governance e deleghe': ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'],
  'Continuit\u00e0 / reporting': ['C1', 'C2', 'C3', 'C4', 'C5', 'C7', 'C8'],
  'Vendite / cassa': ['D5ter', 'D6bis', 'D7bis', 'D9bis', 'D10'],
  'Magazzino': ['D12bis', 'D13bis', 'D14quater'],
  'Acquisti': ['D16bis', 'D16ter', 'D16quater'],
  'Contabilit\u00e0': ['D19bis', 'D20bis', 'D21quater', 'D22bis', 'D22ter', 'D22quater'],
  'Paghe': ['D24bis', 'D25bis'],
  'IT': ['D27bis', 'D27ter', 'D28bis', 'D28ter'],
  'Controlli trasversali': ['X1', 'X2', 'X4', 'X5', 'X6', 'D30'],
};

function scoreField(fieldKey) {
  const val = state.answers[fieldKey];
  if (val === undefined || val === null || val === '') return null;

  // Scale fields: numeric 1-5 mapped to 0-4
  if (typeof val === 'number') {
    return val - 1; // 1->0, 2->1, 3->2, 4->3, 5->4
  }

  // String values: "Non so" / "Non applicabile" / "Non di mia competenza" -> null
  if (typeof val === 'string') {
    const lower = val.toLowerCase();
    if (lower.includes('non so') || lower.includes('non applicabile') || lower.includes('non di mia competenza') || lower.includes('preferisco non rispondere')) {
      return null;
    }

    // Find the field definition to get the options
    let fieldDef = null;
    for (const step of STEPS) {
      if (step.fields) {
        const found = step.fields.find((f) => f.key === fieldKey);
        if (found) {
          fieldDef = found;
          break;
        }
      }
    }

    if (fieldDef && fieldDef.options) {
      // Filter out "Non so" type options for index calculation
      const scorableOptions = fieldDef.options.filter((o) => {
        const ol = o.toLowerCase();
        return !ol.includes('non so') && !ol.includes('non applicabile') && !ol.includes('non di mia competenza');
      });
      const idx = scorableOptions.indexOf(val);
      if (idx >= 0 && scorableOptions.length > 1) {
        // First option (best) = 4, last = 0
        const maxIdx = scorableOptions.length - 1;
        return Math.round((1 - idx / maxIdx) * 4);
      }
    }

    // Extra option strings from scale fields (e.g., "Non so", "Non di mia competenza")
    return null;
  }

  return null;
}

function computeScores() {
  const results = {};
  const d36 = Array.isArray(state.answers['D36']) ? state.answers['D36'] : [];
  const evidenceCap = d36.includes('Nessun documento formalizzato / non disponibile');

  Object.entries(SCORING_AREAS).forEach(([areaName, fieldKeys]) => {
    let total = 0;
    let count = 0;
    const fieldResults = [];

    fieldKeys.forEach((fk) => {
      const score = scoreField(fk);
      fieldResults.push({ key: fk, score: score });
      if (score !== null) {
        total += score;
        count++;
      }
    });

    let avg = count > 0 ? total / count : null;
    if (avg !== null && evidenceCap && avg > 2) {
      avg = 2;
    }

    let riskClass = '';
    let riskColor = '';
    if (avg === null) {
      riskClass = 'n/d';
      riskColor = '#999';
    } else if (avg < 1.5) {
      riskClass = 'criticit\u00e0 elevata';
      riskColor = '#e74c3c';
    } else if (avg < 2.5) {
      riskClass = 'assetto fragile';
      riskColor = '#f39c12';
    } else if (avg < 3.25) {
      riskClass = 'sufficiente';
      riskColor = '#f1c40f';
    } else {
      riskClass = 'buono / maturo';
      riskColor = '#27ae60';
    }

    results[areaName] = {
      score: avg !== null ? Math.round(avg * 100) / 100 : null,
      maxScore: 4,
      class: riskClass,
      color: riskColor,
      fields: fieldResults,
    };
  });

  return results;
}

// ──────────────────────────────────────────────
// INCONSISTENCY DETECTION
// ──────────────────────────────────────────────
function detectInconsistencies() {
  const warnings = [];
  const d30 = state.answers['D30'] || '';
  const d36 = Array.isArray(state.answers['D36']) ? state.answers['D36'] : [];
  const d27 = state.answers['D27'] || '';
  const d22 = state.answers['D22'] || '';
  const d4 = Array.isArray(state.answers['D4']) ? state.answers['D4'] : [];
  const d33 = Array.isArray(state.answers['D33']) ? state.answers['D33'] : [];

  // 1. Claims "procedure aggiornate" (D30) but "Nessun documento formalizzato" in D36
  if (d30.includes('aggiornate') && d36.includes('Nessun documento formalizzato / non disponibile')) {
    warnings.push('Dichiara procedure aggiornate (D30) ma non risultano documenti formalizzati disponibili (D36).');
  }

  // 2. Claims "credenziali personali" (D27) but "Non so" on access management
  if (d27.includes('Profili utente individuali') && state.answers['D27bis'] === 'Non so') {
    warnings.push('Dichiara profili utente individuali (D27) ma indica "Non so" sulla gestione degli accessi cessati (D27bis).');
  }

  // 3. Claims "riconciliazioni sistematiche" (D22) but no evidence in D36
  if (d22.includes('sistematica') && !d36.some((x) => x.includes('Report scaduti') || x.includes('Evidenze approvative'))) {
    warnings.push('Dichiara riconciliazioni sistematiche (D22) ma non risultano evidenze documentali correlate (D36).');
  }

  // 4. Claims "Nessuna criticit\u00e0 rilevante" in D4 but selects issues in D33
  if (d4.includes('Nessuna criticit\u00e0 rilevante') && d33.length > 0 && !d33.every((x) => x === 'Nessuna criticit\u00e0 rilevante')) {
    warnings.push('Indica nessuna criticit\u00e0 nel contesto (D4) ma seleziona criticit\u00e0 specifiche (D33).');
  }

  return warnings;
}

// ──────────────────────────────────────────────
// RENDER REVIEW
// ──────────────────────────────────────────────
function renderReview(app, step) {
  const card = el('div', { className: 'glass-card' });
  card.appendChild(el('h2', { className: 'step-title', textContent: step.title }));
  if (step.subtitle) {
    card.appendChild(el('p', { className: 'step-subtitle', textContent: step.subtitle }));
  }

  // Interview data summary
  const infoSection = el('div', { className: 'review-info-section' });
  infoSection.innerHTML =
    '<h3>Dati intervista</h3>' +
    '<table class="review-info-table">' +
    '<tr><td><strong>Intervistato:</strong></td><td>' + escapeHtml(state.answers['nome'] || 'N/D') + '</td></tr>' +
    '<tr><td><strong>Ruolo:</strong></td><td>' + escapeHtml(state.answers['ruolo'] || 'N/D') + '</td></tr>' +
    '<tr><td><strong>Data:</strong></td><td>' + escapeHtml(state.answers['data_intervista'] || 'N/D') + '</td></tr>' +
    '<tr><td><strong>Sede:</strong></td><td>' + escapeHtml(state.answers['sede'] || 'N/D') + '</td></tr>' +
    '<tr><td><strong>UUID intervista:</strong></td><td><code>' + escapeHtml(state.interview_uuid) + '</code></td></tr>' +
    '<tr><td><strong>Moduli compilati:</strong></td><td>' + escapeHtml(Array.from(state.selectedModules).join(', ') || 'Nessuno') + '</td></tr>' +
    '</table>';
  card.appendChild(infoSection);

  // Scoring summary
  const scores = computeScores();
  const scoreSection = el('div', { className: 'review-score-section' });
  scoreSection.appendChild(el('h3', { textContent: 'Sintesi punteggi per area' }));

  const heatmap = el('div', { className: 'risk-heatmap' });
  Object.entries(scores).forEach(([areaName, data]) => {
    const row = el('div', { className: 'heatmap-row' });
    row.innerHTML =
      '<div class="heatmap-label">' + escapeHtml(areaName) + '</div>' +
      '<div class="heatmap-bar-wrap">' +
      '<div class="heatmap-bar" style="width:' + (data.score !== null ? (data.score / 4) * 100 : 0) + '%;background:' + data.color + '"></div>' +
      '</div>' +
      '<div class="heatmap-value">' + (data.score !== null ? data.score.toFixed(2) + '/4' : 'N/D') + '</div>' +
      '<div class="heatmap-class" style="color:' + data.color + '">' + escapeHtml(data.class) + '</div>';
    heatmap.appendChild(row);
  });
  scoreSection.appendChild(heatmap);
  card.appendChild(scoreSection);

  // Inconsistency warnings
  const warnings = detectInconsistencies();
  if (warnings.length > 0) {
    const warnSection = el('div', { className: 'review-warnings' });
    warnSection.appendChild(el('h3', { textContent: 'Segnalazioni di incoerenza' }));
    const warnList = el('ul', { className: 'warning-list' });
    warnings.forEach((w) => {
      const li = el('li', { className: 'warning-item' });
      li.innerHTML = '\u26a0\ufe0f ' + escapeHtml(w);
      warnList.appendChild(li);
    });
    warnSection.appendChild(warnList);
    card.appendChild(warnSection);
  }

  // Collapsible review sections
  state.visibleSteps.forEach((si) => {
    const s = STEPS[si];
    if (s.type !== 'form' || !s.fields) return;

    const section = el('div', { className: 'review-section' });
    const header = el('div', { className: 'review-header' });
    header.innerHTML = '<span class="review-header-title">' + escapeHtml(s.title) + '</span><span class="review-header-arrow">' + ICONS.arrowDown + '</span>';
    header.addEventListener('click', () => {
      const body = section.querySelector('.review-body');
      body.classList.toggle('open');
      header.classList.toggle('open');
    });
    section.appendChild(header);

    const body = el('div', { className: 'review-body' });
    const bodyInner = el('div', { className: 'review-body-inner' });
    s.fields.forEach((f) => {
      if (!isFieldVisible(f)) return;
      const row = el('div', { className: 'review-item' });
      let answer = state.answers[f.key];
      let display = '';
      if (Array.isArray(answer)) {
        display = answer.join(', ');
      } else if (answer === true) {
        display = 'S\u00ec';
      } else if (answer === false || answer === undefined || answer === null || answer === '') {
        display = '\u2014';
      } else {
        display = String(answer);
      }
      // Include "other" text
      if (state.otherTexts[f.key]) {
        display += ' (' + state.otherTexts[f.key] + ')';
      }
      // Include _text for checkbox_with_text
      if (f.type === 'checkbox_with_text' && state.answers[f.key + '_text']) {
        display += ' | ' + state.answers[f.key + '_text'];
      }
      row.innerHTML = '<div class="review-question">' + escapeHtml(f.label) + '</div><div class="review-answer">' + escapeHtml(display) + '</div>';
      bodyInner.appendChild(row);
    });
    body.appendChild(bodyInner);
    section.appendChild(body);
    card.appendChild(section);
  });

  // Disclaimer text
  const disclaimer = el('p', { className: 'review-disclaimer' });
  disclaimer.textContent = 'Il presente riepilogo sintetizza le informazioni rese dall\u2019intervistato e non sostituisce la successiva valutazione professionale dell\u2019adeguatezza degli assetti, che richiede analisi delle evidenze, riscontri documentali e lettura integrata delle risposte.';
  card.appendChild(disclaimer);

  // Navigation buttons
  const btnRow = el('div', { className: 'btn-row' });
  btnRow.appendChild(
    el('button', {
      className: 'btn btn-secondary',
      innerHTML: ICONS.arrowLeft + ' Indietro',
      onClick: () => goPrev(),
    })
  );
  btnRow.appendChild(
    el('button', {
      className: 'btn btn-primary',
      innerHTML: 'Conferma e invia ' + ICONS.arrowRight,
      onClick: () => goNext(),
    })
  );
  card.appendChild(btnRow);

  app.appendChild(card);
}

// ──────────────────────────────────────────────
// RENDER SUCCESS
// ──────────────────────────────────────────────
function renderSuccess(app, step) {
  const card = el('div', { className: 'glass-card' });
  const screen = el('div', { className: 'success-screen' });
  screen.innerHTML =
    '<div class="success-icon">' + ICONS.successCheck + '</div>' +
    '<h2 class="success-title">Questionario inviato</h2>' +
    '<p class="success-text">Grazie. La compilazione \u00e8 stata registrata correttamente. Un riepilogo sintetico sar\u00e0 associato al codice della presente intervista.</p>' +
    '<p class="success-text"><strong>Codice intervista:</strong> <code>' + escapeHtml(state.interview_uuid) + '</code></p>';
  card.appendChild(screen);
  app.appendChild(card);
}

// ──────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────
function isRequiredIfMet(field) {
  if (!field.requiredIf) return false;
  const cond = field.requiredIf;

  if (cond.field && cond.hasSelection !== undefined) {
    const val = state.answers[cond.field];
    return Array.isArray(val) && val.length > 0;
  }

  if (cond.anyOf) {
    return cond.anyOf.some((sub) => {
      const val = state.answers[sub.field];
      if (sub.includes !== undefined) {
        return Array.isArray(val) && val.includes(sub.includes);
      }
      return false;
    });
  }

  return false;
}

function validateStep() {
  const step = STEPS[state.currentStep];
  if (!step || !step.fields) return true;

  let valid = true;

  step.fields.forEach((field) => {
    // Skip validation for hidden fields
    if (!isFieldVisible(field)) return;

    const isRequired = field.required || (field.requiredIf && isRequiredIfMet(field));
    if (!isRequired) return;

    const val = state.answers[field.key];

    // For dynamicOptionsFrom fields: required only if options are available
    if (field.dynamicOptionsFrom) {
      const sourceAnswers = state.answers[field.dynamicOptionsFrom];
      if (!Array.isArray(sourceAnswers) || sourceAnswers.filter((o) => o !== '__altro__').length === 0) {
        return; // No options available, skip validation
      }
    }

    let fieldValid = true;

    switch (field.type) {
      case 'text':
      case 'date':
      case 'textarea':
        if (!val || String(val).trim() === '') fieldValid = false;
        break;
      case 'select':
        if (!val || val === '') fieldValid = false;
        break;
      case 'radio':
      case 'radio_other':
        if (!val || val === '') fieldValid = false;
        if (val === '__altro__' && (!state.otherTexts[field.key] || state.otherTexts[field.key].trim() === '')) {
          fieldValid = false;
        }
        break;
      case 'checkbox':
      case 'checkbox_other':
        if (!Array.isArray(val) || val.length === 0) fieldValid = false;
        if (Array.isArray(val) && val.includes('__altro__') && (!state.otherTexts[field.key] || state.otherTexts[field.key].trim() === '')) {
          fieldValid = false;
        }
        break;
      case 'checkbox_with_text':
        if (!Array.isArray(val) || val.length === 0) fieldValid = false;
        if (!state.answers[field.key + '_text'] || state.answers[field.key + '_text'].trim() === '') {
          fieldValid = false;
        }
        break;
      case 'scale':
        if (val === undefined || val === null || val === '') fieldValid = false;
        break;
      case 'consent':
        if (val !== true) fieldValid = false;
        break;
    }

    if (!fieldValid) {
      showFieldError(field.key, 'Questo campo \u00e8 obbligatorio.');
      valid = false;
    }
  });

  return valid;
}

function showFieldError(key, msg) {
  const errEl = document.getElementById('error-' + key);
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.add('visible');
  }
  const fieldEl = document.getElementById('field-' + key);
  if (fieldEl) {
    fieldEl.classList.add('has-error');
    // Add .error to inner input/select/textarea
    const inputEl = fieldEl.querySelector('.input, .textarea, .select');
    if (inputEl) inputEl.classList.add('error');
    // Add .error to group elements (radio, checkbox, scale)
    const groupEl = fieldEl.querySelector('.radio-group, .checkbox-group, .scale-group');
    if (groupEl) groupEl.classList.add('error');
    // Scroll to first error
    if (!document.querySelector('.field-group.has-error.scrolled')) {
      fieldEl.classList.add('scrolled');
      fieldEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

function clearFieldError(key) {
  const errEl = document.getElementById('error-' + key);
  if (errEl) {
    errEl.textContent = '';
    errEl.classList.remove('visible');
  }
  const fieldEl = document.getElementById('field-' + key);
  if (fieldEl) {
    fieldEl.classList.remove('has-error', 'scrolled');
    const inputEl = fieldEl.querySelector('.input, .textarea, .select');
    if (inputEl) inputEl.classList.remove('error');
    const groupEl = fieldEl.querySelector('.radio-group, .checkbox-group, .scale-group');
    if (groupEl) groupEl.classList.remove('error');
  }
}

// ──────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────
function goNext() {
  // Remove scrolled markers
  $$('.field-group.scrolled').forEach((el) => el.classList.remove('scrolled'));

  const step = STEPS[state.currentStep];

  // Validate unless welcome or review->next (which triggers submit)
  if (step.type === 'form' || step.type === 'dashboard') {
    if (!validateStep()) return;
  }

  // If we're on attestazione step, trigger submit
  if (step.id === 'attestazione') {
    submitForm();
    return;
  }

  // Recompute visible steps before advancing
  computeVisibleSteps();

  const currentIdx = state.visibleSteps.indexOf(state.currentStep);
  if (currentIdx < state.visibleSteps.length - 1) {
    state.currentStep = state.visibleSteps[currentIdx + 1];
    state._scrollToTop = true;
    render();
  }
}

function goPrev() {
  computeVisibleSteps();
  const currentIdx = state.visibleSteps.indexOf(state.currentStep);
  if (currentIdx > 0) {
    state.currentStep = state.visibleSteps[currentIdx - 1];
    state._scrollToTop = true;
    render();
  }
}

// ──────────────────────────────────────────────
// SUBMIT
// ──────────────────────────────────────────────
function submitForm() {
  const payload = {};

  // Collect all answers
  Object.entries(state.answers).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      payload[key] = val.join(', ');
    } else if (val === true) {
      payload[key] = 'S\u00ec';
    } else if (val === false) {
      payload[key] = 'No';
    } else {
      payload[key] = val;
    }
  });

  // Collect other texts
  Object.entries(state.otherTexts).forEach(([key, val]) => {
    if (val) payload[key + '_altro'] = val;
  });

  // Hidden technical fields
  payload.questionnaire_version = CONFIG.QUESTIONNAIRE_VERSION || 'OAC_v2.0';
  payload.interview_uuid = state.interview_uuid;
  payload.started_at = state.started_at;
  payload.submitted_at = new Date().toISOString();
  payload.duration_minutes = Math.round((Date.now() - new Date(state.started_at).getTime()) / 60000);
  payload.suggested_modules = state.suggestedModules ? Array.from(state.suggestedModules).join(', ') : '';
  payload.selected_modules = Array.from(state.selectedModules).join(', ');
  payload.source_device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  payload.completion_status = 'submitted';

  // Scoring
  const scores = computeScores();
  Object.entries(scores).forEach(([area, data]) => {
    const safeKey = 'score_' + area.replace(/[^a-zA-Z0-9]/g, '_');
    payload[safeKey] = data.score !== null ? data.score.toFixed(2) : 'N/D';
    payload[safeKey + '_class'] = data.class;
  });

  state.completion_status = 'submitted';
  state.submitted_at = payload.submitted_at;

  submitViaIframe(payload);
}

function submitViaIframe(payload) {
  // Show loading state
  const app = $('#formContainer');
  if (app) {
    app.innerHTML = '<div class="glass-card"><p style="text-align:center;padding:3rem;">Invio in corso...</p></div>';
  }

  const iframeName = 'gsheet_iframe_' + Date.now();
  const iframe = document.createElement('iframe');
  iframe.name = iframeName;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = CONFIG.GOOGLE_SCRIPT_URL;
  form.target = iframeName;

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'payload';
  input.value = JSON.stringify(payload);
  form.appendChild(input);

  document.body.appendChild(form);

  const cleanup = () => {
    try { document.body.removeChild(form); } catch (e) {}
    try { document.body.removeChild(iframe); } catch (e) {}
  };

  iframe.addEventListener('load', () => {
    setTimeout(() => {
      cleanup();
      const successIdx = STEPS.findIndex((s) => s.type === 'success');
      if (successIdx >= 0) {
        state.currentStep = successIdx;
        state._scrollToTop = true;
        render();
      }
    }, 500);
  });

  // Fallback timeout
  setTimeout(() => {
    cleanup();
    const successIdx = STEPS.findIndex((s) => s.type === 'success');
    if (successIdx >= 0) {
      state.currentStep = successIdx;
      state._scrollToTop = true;
      render();
    }
  }, 5000);

  form.submit();
}

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  state.interview_uuid = generateUUID();
  state.started_at = new Date().toISOString();
  computeVisibleSteps();
  state._scrollToTop = true;
  render();
});
