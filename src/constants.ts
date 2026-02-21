import type { TeamMember, FAQItem, StatItem } from './types';

import meImg from '@/assets/images/Me.png';
import vizziImg from '@/assets/images/Vizzi.png';
import broImg from '@/assets/images/Bro.png';

export const NAV_ITEMS = [
  { id: 'expertise', label: 'Expertise' },
  { id: 'faq', label: 'FAQ CCII' },
  { id: 'team', label: 'Il Team' },
  { id: 'news', label: 'Aggiornamenti' },
  { id: 'contact', label: 'Analisi Riservata', isCta: true },
] as const;

export const HERO_BENEFITS = [
  'Valutazione Riservata',
  'Mappatura Priorita\u0300',
  'Opzioni Strategiche CCII',
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Antonio Balsamo',
    role: 'Managing Partner',
    bio: 'Dottore Commercialista e Revisore Legale con esperienza decennale in operazioni di risanamento e procedure concorsuali.',
    imageSrc: meImg,
    imageAlt: 'Antonio Balsamo',
  },
  {
    name: 'Marco Vizzini',
    role: 'Senior Advisor Legale',
    bio: 'Avvocato specializzato in diritto societario e fallimentare, esperto in accordi stragiudiziali e protezione patrimoniale.',
    imageSrc: vizziImg,
    imageAlt: 'Marco Vizzini',
  },
  {
    name: 'Giuseppe Marotta',
    role: 'Advisor Finanziario',
    bio: 'Esperto in controllo di gestione, pianificazione finanziaria e monitoraggio dei flussi di cassa aziendali.',
    imageSrc: broImg,
    imageAlt: 'Giuseppe Marotta',
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "Cos'\u00e8 la composizione negoziata e quando conviene attivarla?",
    answer: "\u00c8 un percorso stragiudiziale e riservato per le imprese in squilibrio. Conviene attivarla non appena si percepiscono tensioni finanziarie, per negoziare con i creditori sotto la guida di un esperto e con misure protettive attive.",
    iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    question: 'Quali sono le misure protettive e cosa comportano?',
    answer: 'Sono provvedimenti del tribunale che impediscono ai creditori di avviare azioni esecutive (pignoramenti) o cautelari sul patrimonio aziendale durante le trattative di risanamento.',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    question: 'Qual \u00e8 la differenza tra composizione negoziata e accordi di ristrutturazione?',
    answer: "La composizione \u00e8 una negoziazione assistita stragiudiziale; gli accordi di ristrutturazione (Art. 57 CCII) sono strumenti pi\u00f9 formali che richiedono l'omologazione del Tribunale e percentuali di adesione specifiche.",
    iconPath: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
  },
  {
    question: "Cos'\u00e8 un piano attestato di risanamento (Art. 56)?",
    answer: "\u00c8 un piano d'azione volto a riequilibrare i debiti la cui fattibilit\u00e0 \u00e8 attestata da un professionista indipendente. Se attuato, protegge da revocatorie e alcuni reati concorsuali in caso di successiva insolvenza.",
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
  {
    question: 'Quando si valuta il concordato preventivo?',
    answer: "Viene valutato quando la crisi \u00e8 profonda. Pu\u00f2 essere in continuit\u00e0 (per salvare l'attivit\u00e0) o liquidatorio (per gestire la chiusura ordinata pagando parzialmente i creditori).",
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    question: "Cosa si intende per 'Adeguati Assetti'?",
    answer: 'Sono i sistemi di controllo interno che ogni societ\u00e0 deve avere per legge (Art. 2086 c.c.) per monitorare la cassa e prevedere i flussi finanziari a 12 mesi, evitando la crisi.',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    question: 'Come viene gestita la riservatezza delle informazioni?',
    answer: 'Il nostro metodo garantisce la massima riservatezza. Le prime analisi avvengono in modo confidenziale per mappare le opzioni senza allertare prematuramente i mercati.',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
];

export const STATS_DATA: StatItem[] = [
  { value: 20, suffix: '+', label: 'Anni di Esperienza' },
  { value: 120, suffix: '+', label: 'Casi Gestiti' },
  { value: 95, suffix: '%', label: 'Tasso di Successo' },
  { value: 48, suffix: 'h', label: 'Tempo Medio Risposta' },
];

export const EXPERTISE_DATA = [
  {
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Diagnosi e Gestione Crisi',
    description: 'Analisi tempestiva degli squilibri patrimoniali ed economico-finanziari per intercettare i segnali di allerta prima dell\u2019insolvenza.',
  },
  {
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1',
    title: 'Ristrutturazione del Debito',
    description: 'Negoziazione con istituti di credito, fornitori ed erario per definire piani di rientro sostenibili e accordi di ristrutturazione.',
  },
  {
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'Adeguati Assetti CCII',
    description: 'Progettazione di assetti organizzativi, amministrativi e contabili conformi al Codice della Crisi per il monitoraggio continuo della sostenibilità aziendale.',
  },
];

export const FORMSPREE_URL = 'https://formspree.io/f/xnnljgoa';

export const ROLE_OPTIONS = [
  { value: '', label: 'Seleziona...' },
  { value: 'Titolare/Amministratore', label: 'Titolare / Amministratore' },
  { value: 'Direzione Finanza', label: 'Direzione Finanza (CFO)' },
  { value: 'Consulente', label: 'Consulente / Advisor' },
  { value: 'Altro', label: 'Altro' },
];

export const OBJECTIVE_OPTIONS = [
  { value: '', label: 'Cosa desideri ottenere?' },
  { value: 'Continuit\u00e0 aziendale', label: 'Salvare la continuit\u00e0 aziendale' },
  { value: 'Composizione negoziata', label: 'Accesso Composizione Negoziata' },
  { value: 'Ristrutturazione debito', label: 'Ristrutturazione debito' },
  { value: 'Altro', label: 'Altra consulenza tecnica' },
];

export const URGENCY_OPTIONS = [
  { value: 'Immediata', label: 'Entro 7 giorni' },
  { value: 'Breve', label: 'Entro 1 mese' },
  { value: 'Informativa', label: 'Solo orientamento' },
];

export const CRITICALITIES = [
  { name: 'critica_liquidita', label: 'Tensione liquidit\u00e0' },
  { name: 'critica_banche', label: 'Debiti bancari' },
  { name: 'critica_fisco', label: 'Debiti Fisco/INPS' },
  { name: 'critica_fornitori', label: 'Debiti fornitori' },
];
