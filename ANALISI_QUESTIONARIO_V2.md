# ANALISI E REVISIONE — Modulo Ross Group, Questionario Struttura (Assetti OAC)

**Documento tecnico per la progettazione della versione 2.0**
**Data:** 6 marzo 2026

---

## SEZIONE 1 — GIUDIZIO ESECUTIVO

### Natura dello strumento

Il questionario nella sua forma attuale è una **mappatura descrittiva dei processi operativi** più che un vero strumento di *assessment* degli assetti OAC. Raccoglie informazioni su come vengono svolte le attività (vendite, magazzino, contabilità, ecc.), ma non misura in modo sistematico il **livello di adeguatezza** di ciascun presidio rispetto ai requisiti dell'art. 2086 c.c. e dell'art. 3 CCII.

### Punti di forza reali

1. **Struttura modulare intelligente**: il branching per area funzionale (6 moduli) riduce il carico cognitivo e permette di somministrare solo le sezioni pertinenti al ruolo. È una scelta progettuale valida.
2. **Sezioni trasversali obbligatorie**: Contesto, Controlli, Criticità e Follow-up sono sempre visibili, indipendentemente dai moduli selezionati. Questo garantisce un minimo di copertura per ogni intervistato.
3. **Glossario integrato con tooltip**: 20+ termini tecnici (DDT, LIPE, shrinkage, SOP, ecc.) con spiegazioni contestuali. Riduce il rischio di incomprensione per operativi non specializzati.
4. **Pluralità di tipi di domanda**: radio, checkbox, scale, textarea, consent. Consente una raccolta dati diversificata.
5. **Auto-suggerimento moduli** basato sull'area funzionale dichiarata. Migliora l'usabilità.

### Limiti strutturali rilevanti

1. **Assenza totale di una sezione su governance, deleghe, organigramma e linea gerarchica.** È la lacuna più grave. L'art. 2086 c.c. impone assetti *organizzativi* adeguati, ma il questionario non indaga affatto chi decide cosa, con quali limiti, con quali deleghe formalizzate.
2. **Assenza di domande sulla continuità aziendale e sugli indicatori di crisi.** L'art. 3 CCII richiede assetti che consentano di verificare la sostenibilità dei debiti e la continuità almeno sui 12 mesi. Il questionario non affronta il tema.
3. **Nessun modello di scoring.** Le risposte vengono raccolte ma non valutate. Non è possibile produrre una heatmap, un indice di maturità, né un rating di rischio per area.
4. **Domande prevalentemente classificatorie.** La maggior parte delle domande chiede "come fate X?" anziché "quanto è adeguato il modo in cui fate X?". Il risultato è una fotografia, non una valutazione.
5. **Nessuna raccolta di evidenze.** Le risposte sono auto-dichiarazioni. Non viene mai chiesto "può fornire il documento?", "l'ha visto di recente?", "quando è stato aggiornato l'ultima volta?".
6. **Segregazione dei compiti non indagata.** Non c'è una sola domanda che chieda se chi autorizza è diverso da chi esegue, se chi registra è diverso da chi custodisce, ecc.
7. **Sezione IT troppo superficiale (3 domande).** In un'azienda retail multi-sede, i flussi dati, gli accessi, il disaster recovery e la profilazione utenti richiedono un approfondimento ben maggiore.

### Utilizzabilità professionale

Il questionario è **utilizzabile come strumento di primo contatto** per raccogliere informazioni qualitative, ma **non è ancora spendibile** come prodotto professionale da allegare a un lavoro di verifica degli assetti OAC. Manca di rigore valutativo, manca di tracciabilità delle evidenze, e non produce output quantificabili.

### Rischi principali

- **Rischio di falsa rassicurazione**: risposte "positive" (es. "riconciliazione mensile") senza evidenza documentale possono dare un'impressione di adeguatezza non verificata.
- **Rischio di incompletezza**: un intervistato può completare l'intero questionario senza mai essere interrogato su deleghe, limiti di spesa, segregazione, continuità aziendale, budget o forecast.
- **Rischio di non comparabilità**: le scale sono disomogenee (1-5 in un caso, 0-5 in un altro) e la maggior parte delle domande non usa scale, rendendo impossibile un confronto strutturato tra sedi.

---

## SEZIONE 2 — ANALISI AUTONOMA SU TRE PIANI

### A. Architettura logica

#### Struttura attuale

| Posizione | Sezione | Tipo |
|-----------|---------|------|
| Step 0 | Welcome | Fisso |
| Step 1 | Metadata/profilazione | Fisso |
| Step 2 | Dashboard selezione moduli | Fisso |
| Step 3 | I — Contesto Organizzativo | Sempre visibile |
| Step 4-9 | II-A/F — Moduli funzionali | Modulari |
| Step 10 | III — Controlli e Presidi | Sempre visibile |
| Step 11 | IV — Criticità e Suggerimenti | Sempre visibile |
| Step 12 | V — Follow-up e Documentazione | Sempre visibile |
| Step 13 | Review | Fisso |
| Step 14 | Success | Fisso |

#### Valutazione

**Cosa funziona:**
- La profilazione iniziale (ruolo, sede, area, anzianità) è un buon punto di partenza.
- Il dashboard di selezione moduli con auto-suggerimento è efficace.
- La separazione tra sezioni trasversali e moduli funzionali è corretta concettualmente.

**Cosa non funziona:**
- **Manca un blocco centrale su governance/deleghe/organigramma** tra la profilazione e i moduli funzionali. Il questionario passa direttamente dal "chi sei" al "come funziona il processo", saltando completamente il "chi decide cosa e con quali limiti".
- **Manca una sezione su continuità aziendale e indicatori di crisi** (budget, forecast, DSCR, monitoraggio squilibri). Queste sono le informazioni che l'art. 3 CCII richiede espressamente.
- **La sezione Controlli (III) è posizionata dopo i moduli funzionali**, ma i controlli dovrebbero essere indagati *all'interno* di ciascun modulo (es. "chi controlla la cassa?" va nella sezione Vendite, non in una sezione generica a valle).
- **La sezione Follow-up/Documenti è troppo generica.** Una checklist di evidenze da 7 voci è insufficiente; dovrebbe essere collegata a ciascun modulo funzionale ("per il processo X, disponi del documento Y?").
- **Non c'è una sezione di remediation.** Il questionario raccoglie criticità ma non chiede quali azioni correttive siano già in corso, con quale responsabile e con quale scadenza.

#### Come ridisegnare l'architettura

L'ordine logico ottimale è:

1. **Profilazione** → chi è l'intervistato
2. **Governance e assetti organizzativi** → organigramma, deleghe, limiti, segregazione (sempre visibile)
3. **Continuità aziendale e presidi anticrisi** → budget, reporting, tesoreria, indicatori (sempre visibile)
4. **Moduli funzionali** → vendite, magazzino, acquisti, contabilità, paghe, IT (modulari)
5. **Controlli trasversali** → segregazione, IT security, escalation, rischio frode (sempre visibile)
6. **Criticità, priorità, remediation** → problemi, proposte, azioni in corso (sempre visibile)
7. **Evidenze, attestazione, audit trail** → documenti, archiviazione, firma (sempre visibile)

### B. Qualità metodologica delle domande

#### Problemi identificati

1. **Domande descrittive, non valutative.** Esempio: D5 "Come si svolge la procedura di vendita standard?" raccoglie una descrizione del flusso, ma non valuta se quel flusso è adeguato, tracciato, documentato, controllato. Una domanda di assessment dovrebbe chiedere *quanto* è strutturato, non solo *come* funziona.

2. **Opzioni di risposta che presuppongono la risposta.** Le opzioni sono spesso elenchi di possibili procedure operative, ciascuna con un diverso livello di strutturazione implicita. L'intervistato è portato a scegliere l'opzione che "suona meglio", non necessariamente quella vera. Manca un ancoraggio a evidenze verificabili.

3. **Assenza sistematica dell'opzione "Non so / Non di mia competenza".** Un cassiere potrebbe non sapere come avvengono le riconciliazioni bancarie. Costringerlo a rispondere produce dati inattendibili. Le opzioni "non so" e "non applicabile" devono essere sempre presenti e tracciate separatamente nello scoring.

4. **Scale disomogenee.** D4-bis usa scala 1-5, D10 usa scala 0-5 (con 0 = "N/A"). Ci sono solo 2 domande su scala in tutto il questionario; le altre 36 sono categoriali. Questo impedisce qualsiasi aggregazione quantitativa.

5. **Domande composite.** D33 "Quali sono le principali criticità?" con 7 opzioni eterogenee (procedure, IT, comunicazione, formazione, controlli, liquidità, magazzino) mescola piani diversi in un unico item. Ogni criticità dovrebbe emergere dalla sezione dedicata, non da un'auto-valutazione generica.

6. **Nessuna domanda di "controprova".** Non esistono domande incrociate per verificare la coerenza delle risposte. Se il responsabile PV dice "controllo cassa ogni giorno" ma l'addetto dice "nessun controllo sistematico", il questionario non lo rileva.

7. **Tipologie sbilanciate.** 24 domande su 38 sono `radio_other` (scelta singola). Il questionario è di fatto un multiple-choice. Mancano domande aperte qualitative, domande con richiesta di frequenza/data, domande condizionali.

#### Correzioni metodologiche prioritarie

- Introdurre **scala di maturità uniforme 0-4** per tutte le domande valutative:
  - 0 = Non applicabile / Non so
  - 1 = Assente o completamente informale
  - 2 = Parzialmente strutturato, non documentato
  - 3 = Strutturato e documentato, ma non verificato
  - 4 = Strutturato, documentato, verificato e aggiornato
- Separare chiaramente **domande classificatorie** (che descrivono il processo) da **domande valutative** (che ne misurano l'adeguatezza).
- Aggiungere **"Non so / Non di mia competenza"** come opzione distinta (non equivalente a "N/A").
- Aggiungere **domande di evidenza**: "Può indicare l'ultimo documento/report che ha visionato relativo a questo processo?"
- Eliminare le domande composite a favore di domande monotematiche.

#### Regole per riscrivere le domande

1. Ogni domanda deve indagare UN solo concetto.
2. Le opzioni devono essere ordinabili per livello di maturità (dal peggiore al migliore).
3. Ogni domanda valutativa deve avere un collegamento esplicito a un'evidenza documentale.
4. Le scale devono essere uniformi in tutto il questionario.
5. Il wording deve essere neutrale: evitare "adeguato", "efficace", "corretto" nelle opzioni (giudizi impliciti).

### C. Utilità pratica per assetti/OAC

#### Cosa consente di fare oggi

- Raccogliere una fotografia qualitativa dei processi operativi per area funzionale.
- Identificare le aree dove "non esiste una procedura" vs. quelle dove "c'è qualcosa".
- Raccogliere percezioni soggettive su criticità e suggerimenti.
- Censire a grandi linee la documentazione disponibile.

#### Cosa NON consente di fare

- **Verificare l'adeguatezza degli assetti organizzativi**: mancano organigramma, deleghe, segregazione, limiti autorizzativi.
- **Verificare l'adeguatezza degli assetti amministrativi**: mancano budget, forecast, analisi scostamenti, reporting periodico, tesoreria.
- **Verificare l'adeguatezza degli assetti contabili**: mancano chiusure periodiche con evidenza, riconciliazioni con trail documentale, monitoraggio scaduti.
- **Verificare la capacità di rilevare tempestivamente la crisi**: mancano indicatori, soglie, frequenza di monitoraggio, DSCR (ove applicabile).
- **Produrre un rating o un punteggio di maturità**: nessuno scoring.
- **Confrontare sedi/intervistati in modo strutturato**: scale disomogenee e domande prevalentemente categoriali.
- **Costruire un remediation plan**: manca la sezione remediation con owner, tempi, priorità.
- **Fornire evidenze a un organo di controllo o revisore**: nessuna tracciabilità delle evidenze.

#### Integrazioni necessarie per uso professionale

1. Sezione governance/deleghe/organigramma (nuova, obbligatoria)
2. Sezione continuità aziendale/indicatori (nuova, obbligatoria)
3. Modello di scoring con scala uniforme
4. Domande di evidenza collegate a ogni area
5. Sezione remediation con responsabili e tempi
6. Domande di controprova / coerenza incrociata
7. Report finale con heatmap per area e sede

---

## SEZIONE 3 — VERIFICA DELLA FONDATEZZA DELLE CRITICHE GIÀ FORMULATE

> **Nota**: il prompt di riferimento menziona "le 10 critiche già ricevute" ma non ne fornisce il testo. In assenza di critiche specifiche da validare, questa sezione riporta le **10 critiche più probabili e ricorrenti** per un questionario di questo tipo, con valutazione di fondatezza.

### Critica 1: "Manca una sezione su governance, deleghe e organigramma"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: L'art. 2086 c.c. pone al centro gli assetti *organizzativi*. Un organigramma formale, un funzionigramma, un mansionario, deleghe con limiti e la segregazione dei compiti sono prerequisiti. Il questionario non li affronta.
- **Impatto**: Critico. Senza questa sezione, il questionario non verifica il primo dei tre pilastri OAC.

### Critica 2: "Non c'è nulla sulla continuità aziendale e gli indicatori di crisi"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: L'art. 3 CCII richiede assetti che consentano di verificare sostenibilità dei debiti e continuità aziendale almeno sui 12 mesi. Il questionario non contiene domande su budget, forecast, cash flow previsionali, monitoraggio scaduti, DSCR.
- **Cosa va precisato**: Il DSCR non è un indicatore obbligatorio in ogni contesto; è rilevante nelle composizioni negoziate e nei piani di risanamento. In una verifica degli assetti "ordinaria", è sufficiente che l'azienda disponga di strumenti di previsione di cassa e monitoraggio della liquidità, senza necessariamente calcolare il DSCR.
- **Impatto**: Critico. Rende il questionario incompleto rispetto al suo obiettivo dichiarato.

### Critica 3: "Le domande sono descrittive, non valutative"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: 24 delle 38 domande chiedono "come funziona?" anziché "quanto è adeguato?". Il risultato è una mappa dei processi, non un assessment.
- **Come riformulare**: Ogni domanda descrittiva deve essere affiancata da una domanda di maturità su scala uniforme e da una richiesta di evidenza.
- **Impatto**: Alto. Determina la differenza tra un "questionario conoscitivo" e un "tool di assessment".

### Critica 4: "Non c'è un modello di scoring"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: Senza scoring non è possibile produrre un rating, una heatmap, un confronto tra sedi, né un report quantitativo.
- **Impatto**: Alto. Limita l'utilità del questionario a una raccolta qualitativa.

### Critica 5: "Manca la segregazione dei compiti"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: La segregazione (separation of duties) è un principio cardine del controllo interno. Il questionario non chiede mai se chi autorizza è diverso da chi esegue, se chi registra è diverso da chi custodisce.
- **Impatto**: Alto. È un pilastro del sistema di controllo interno.

### Critica 6: "La sezione IT è troppo superficiale"

- **Giudizio**: Fondata con riserve.
- **Perché è corretta**: 3 domande sono insufficienti per un'azienda multi-sede retail. Mancano profilazione accessi, revoca credenziali, gestione incidenti, continuità operativa IT, policy password, cifratura dati.
- **Cosa va precisato**: La profondità IT va calibrata sulla dimensione aziendale. Per una PMI retail con 4 PV, non serve un assessment ISO 27001 completo, ma servono almeno 6-8 domande sui temi essenziali.
- **Impatto**: Medio-alto.

### Critica 7: "La validazione finale ('Confermo') non ha valore probatorio"

- **Giudizio**: Fondata con riserve.
- **Perché è corretta**: Digitare "Confermo" in un campo di testo non equivale a una firma digitale né ha valore probatorio in senso stretto. È un meccanismo di attenzione, non di autenticazione.
- **Cosa va precisato**: Non è necessario (né realistico, per un web form) pretendere una firma qualificata. Tuttavia, la validazione dovrebbe raccogliere almeno: timestamp, IP (se privacy lo consente), durata compilazione, dichiarazione esplicita più articolata.
- **Impatto**: Medio. Migliora l'audit trail senza trasformare il form in un atto notarile.

### Critica 8: "Le risposte non sono collegate a evidenze documentali"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: Un assessment serio richiede che le risposte siano ancorate a evidenze. "Facciamo riconciliazione mensile" senza poter indicare l'ultimo documento di riconciliazione è un'auto-dichiarazione non verificabile.
- **Come intervenire**: Aggiungere domande di evidenza ("Indicare data/riferimento dell'ultimo documento di riconciliazione") o almeno domande binarie ("Può esibire documentazione a supporto? Sì/No").
- **Impatto**: Alto. È la differenza tra percezione e fatto.

### Critica 9: "Non esiste un remediation plan"

- **Giudizio**: Pienamente fondata.
- **Perché è corretta**: Il questionario si ferma alla raccolta delle criticità (D33-D34) senza chiedere quali azioni siano già in corso, chi ne è responsabile, con quale scadenza. Un assessment completo deve produrre un piano di intervento.
- **Impatto**: Alto. Senza remediation, l'assessment è fine a sé stesso.

### Critica 10: "Manca una sezione whistleblowing/segnalazioni interne ex art. 12 CCII"

- **Giudizio**: Solo parzialmente fondata — con imprecisione normativa da correggere.
- **Perché è parzialmente corretta**: Prevedere canali di segnalazione interna è una buona prassi organizzativa. Ma il riferimento all'art. 12 CCII è errato: l'art. 12 disciplina la composizione negoziata della crisi (presupposti e accesso), non i canali di segnalazione interna.
- **Riferimenti corretti**: I canali di segnalazione interna rilevano ai sensi del d.lgs. 24/2023 (whistleblowing) e, per le segnalazioni dell'organo di controllo, degli artt. 25-octies e 25-novies CCII. Nel contesto degli assetti, l'art. 2086 c.c. impone implicitamente flussi informativi che consentano l'emersione tempestiva di anomalie.
- **Impatto**: Basso. È un'integrazione utile ma non è tra le priorità più alte per un questionario retail.

---

## SEZIONE 4 — LACUNE CHE EMERGONO ANCHE SE NON GIÀ SEGNALATE

### 4.1 Organigramma, funzionigramma, mansionario

**Stato attuale**: Completamente assente. Non esiste una domanda che chieda se l'azienda dispone di un organigramma formale, se è aggiornato, se è noto ai dipendenti.

**Cosa serve**: Domanda sulla esistenza e aggiornamento dell'organigramma; domanda su funzionigramma/mansionario; domanda su conoscenza della linea gerarchica da parte dell'intervistato.

### 4.2 Deleghe e limiti autorizzativi

**Stato attuale**: Assente. Nessuna domanda su chi ha delega per autorizzare acquisti, pagamenti, sconti, assunzioni, e con quali limiti di importo.

**Cosa serve**: Domande specifiche su esistenza deleghe formali, limiti di spesa, processi di autorizzazione per acquisti sopra soglia.

### 4.3 Sostituzioni in caso di assenza

**Stato attuale**: Assente. Se il responsabile PV è assente, chi decide? Chi ha le credenziali? Chi autorizza?

**Cosa serve**: Domanda su piano di sostituzione (deputy) per i ruoli chiave.

### 4.4 Segregazione dei compiti e controlli compensativi

**Stato attuale**: Completamente assente.

**Cosa serve**: Domande su separazione tra chi autorizza/esegue/registra/custodisce per processi critici (cassa, pagamenti, magazzino). Ove la segregazione non sia possibile (organico ridotto), domande sui controlli compensativi.

### 4.5 Reporting periodico e analisi degli scostamenti

**Stato attuale**: D31 chiede genericamente quali report vengono usati, ma non se esiste un reporting periodico verso la direzione con analisi degli scostamenti rispetto al budget.

**Cosa serve**: Domande su frequenza del reporting, destinatari, contenuto, confronto con budget, azioni correttive.

### 4.6 Budget, forecast, tesoreria e flussi di cassa

**Stato attuale**: Completamente assente. D21 chiede dello scadenziario ma non del budget né del forecast di cassa.

**Cosa serve**: Domande su esistenza del budget annuale, forecast rolling, previsione di cassa, monitoraggio della posizione finanziaria netta.

### 4.7 Riconciliazioni, controlli su scaduti, monitoraggio squilibri

**Stato attuale**: D22 chiede genericamente delle riconciliazioni bancarie. Manca il monitoraggio degli scaduti attivi e passivi, l'aging analysis, il controllo degli squilibri patrimoniali/economici.

**Cosa serve**: Domande su aging clienti/fornitori, gestione insoluti, monitoraggio del debito scaduto, rapporto debiti/patrimonio.

### 4.8 Revoca accessi, profilazione utenti, incident management

**Stato attuale**: D27 chiede genericamente della gestione utenti. Mancano: revoca accessi al termine del rapporto, revisione periodica dei profili, gestione degli incidenti di sicurezza, policy password.

**Cosa serve**: Almeno 3-4 domande aggiuntive su lifecycle delle credenziali, revisione periodica, incident response.

### 4.9 Rischio frode e canali di escalation

**Stato attuale**: D32 chiede come vengono comunicate irregolarità, ma non indaga specificamente il rischio frode (cassa, acquisti, inventario) né l'esistenza di canali formali di escalation protetti.

**Cosa serve**: Domande specifiche su rischio frode per area (ammanchi cassa, fatture fittizie, conflitti d'interesse fornitori) e su canali di segnalazione riservati.

### 4.10 Contraddizioni tra risposte

**Stato attuale**: Nessun meccanismo di verifica incrociata. Se il responsabile PV dice "controllo cassa ogni giorno" ma l'addetto dice "nessun controllo sistematico", il questionario non lo rileva.

**Cosa serve**: Logica di controprova nel reporting (non necessariamente nel form, ma nel foglio di analisi). Domande "specchio" per ruoli diversi sullo stesso processo.

### 4.11 Livello di conoscenza dell'intervistato

**Stato attuale**: D4-bis chiede quanto sono chiari i confini del ruolo, ma non quanto l'intervistato conosca effettivamente il processo su cui sta rispondendo.

**Cosa serve**: Per ogni modulo, una domanda iniziale tipo "Con quale frequenza è direttamente coinvolto in questo processo?" con scala (quotidianamente / settimanalmente / raramente / mai). Questo permette di pesare l'attendibilità delle risposte.

### 4.12 Remediation plan con owner e tempi

**Stato attuale**: Assente. D33-D34 raccolgono criticità e suggerimenti, ma non azioni in corso.

**Cosa serve**: Sezione finale che chieda se per le criticità identificate esistono già azioni correttive pianificate, con responsabile e tempistica.

---

## SEZIONE 5 — PIANO DI INTERVENTO CON PRIORITÀ

### PRIORITÀ ALTA — Da implementare subito

#### 5.1 Aggiungere sezione Governance/Deleghe/Organigramma

- **Cosa**: Nuova sezione (sempre visibile) con 5-6 domande su organigramma, deleghe, limiti di spesa, segregazione compiti, piano sostituzione.
- **Perché**: Senza questa sezione il questionario non verifica il primo pilastro degli assetti OAC.
- **Dove**: Dopo la profilazione, prima dei moduli funzionali (nuova Sezione I).
- **Beneficio**: Il questionario diventa conforme all'art. 2086 c.c. sulla parte organizzativa.

#### 5.2 Aggiungere sezione Continuità aziendale/Indicatori

- **Cosa**: Nuova sezione (sempre visibile) con 4-5 domande su budget, forecast, reporting, monitoraggio liquidità, indicatori di allerta.
- **Perché**: L'art. 3 CCII lo richiede espressamente.
- **Dove**: Dopo la sezione Governance, prima dei moduli funzionali (nuova Sezione II).
- **Beneficio**: Il questionario copre il requisito della rilevazione tempestiva della crisi.

#### 5.3 Introdurre scala di maturità uniforme

- **Cosa**: Affiancare a ogni domanda classificatoria una domanda valutativa su scala 0-4 (0=N/A, 1=assente/informale, 2=parziale/non documentato, 3=documentato/non verificato, 4=documentato+verificato+aggiornato).
- **Perché**: Senza scala uniforme non c'è scoring, non c'è heatmap, non c'è confronto.
- **Dove**: In ogni sezione, subito dopo la domanda descrittiva.
- **Beneficio**: Il questionario produce dati quantificabili e comparabili.

#### 5.4 Aggiungere opzione "Non so / Non di mia competenza"

- **Cosa**: Aggiungere a tutte le domande le opzioni "Non so" e "Non applicabile al mio ruolo" come scelte distinte.
- **Perché**: Un cassiere costretto a rispondere sulle riconciliazioni bancarie produce dati inattendibili.
- **Dove**: In tutte le domande radio_other e checkbox_other.
- **Beneficio**: Dati più attendibili; possibilità di filtrare le risposte per competenza.

#### 5.5 Aggiungere domande di evidenza

- **Cosa**: Per ogni processo critico, aggiungere "Può indicare l'ultimo documento/report relativo a questo processo? (data, riferimento, disponibilità)" o almeno "Esiste documentazione a supporto? Sì / No / Non so".
- **Perché**: Le auto-dichiarazioni senza evidenza non hanno valore probatorio.
- **Dove**: In ogni modulo funzionale, come domanda accessoria.
- **Beneficio**: Il questionario distingue tra percezione e fatto documentato.

### PRIORITÀ MEDIA

#### 5.6 Espandere sezione IT (da 3 a 7-8 domande)

- **Cosa**: Aggiungere domande su revoca accessi, policy password, revisione profili, restore test, incident management, cifratura dati sensibili.
- **Perché**: 3 domande sono insufficienti per un'azienda multi-sede con flussi dati POS-gestionale-contabilità.
- **Dove**: Modulo F (IT).
- **Beneficio**: Copertura adeguata del presidio IT.

#### 5.7 Aggiungere sezione Remediation

- **Cosa**: Sezione finale con domande su azioni correttive in corso, responsabile, scadenza, stato di avanzamento.
- **Perché**: Un assessment che non produce un piano d'azione è incompleto.
- **Dove**: Dopo le criticità, prima della review.
- **Beneficio**: Il questionario diventa un tool operativo, non solo diagnostico.

#### 5.8 Aggiungere domanda di coinvolgimento nel processo

- **Cosa**: All'inizio di ogni modulo, domanda "Con quale frequenza è direttamente coinvolto in questo processo?" (quotidianamente / settimanalmente / raramente / mai).
- **Perché**: Permette di pesare l'attendibilità delle risposte.
- **Dove**: Prima domanda di ogni modulo funzionale.
- **Beneficio**: Migliore qualità dei dati raccolti.

#### 5.9 Segregazione dei compiti

- **Cosa**: 2-3 domande nella sezione Controlli trasversali su separazione tra chi autorizza/esegue/registra/custodisce.
- **Perché**: Principio cardine del controllo interno, oggi assente.
- **Dove**: Sezione Controlli trasversali.
- **Beneficio**: Copertura del principio di segregazione.

### PRIORITÀ BASSA — Miglioramenti evolutivi

#### 5.10 Domande di controprova

- **Cosa**: Nella fase di reporting/analisi (non necessariamente nel form), logica per incrociare risposte di intervistati diversi sullo stesso processo.
- **Beneficio**: Individuazione di incoerenze.

#### 5.11 Versioning e audit trail migliorato

- **Cosa**: Registrare timestamp di inizio/fine compilazione, durata per sezione, eventuali modifiche a risposte precedenti.
- **Beneficio**: Maggiore tracciabilità.

#### 5.12 Export automatico del remediation plan

- **Cosa**: Il foglio Google genera automaticamente un piano d'azione basato sulle risposte con punteggio basso.
- **Beneficio**: Output immediatamente operativo.

---

## SEZIONE 6 — NUOVA ARCHITETTURA OTTIMALE DEL QUESTIONARIO

### Struttura v2.0 proposta

| Step | Sezione | Titolo | Visibilità | Domande stimate |
|------|---------|--------|------------|:---:|
| 0 | — | Welcome | Fisso | — |
| 1 | Sez. 0 | Profilazione intervistato | Fisso | 8 campi |
| 2 | — | Dashboard selezione moduli | Fisso | — |
| 3 | Sez. I | Governance, Deleghe, Organigramma | **Sempre** | 6-7 |
| 4 | Sez. II | Continuità Aziendale, Reporting, Indicatori | **Sempre** | 5-6 |
| 5 | Sez. III-A | Vendite / POS / Cassa | Modulo A | 7-8 |
| 6 | Sez. III-B | Magazzino / Logistica | Modulo B | 6-7 |
| 7 | Sez. III-C | Acquisti / Fornitori | Modulo C | 5-6 |
| 8 | Sez. III-D | Contabilità / Fiscale | Modulo D | 5-6 |
| 9 | Sez. III-E | Presenze / Paghe | Modulo E | 4-5 |
| 10 | Sez. III-F | IT / Sistemi / Dati | Modulo F | 7-8 |
| 11 | Sez. IV | Controlli Trasversali, Segregazione, Escalation | **Sempre** | 5-6 |
| 12 | Sez. V | Criticità, Priorità e Remediation | **Sempre** | 5-6 |
| 13 | Sez. VI | Evidenze, Attestazione e Audit Trail | **Sempre** | 4-5 |
| 14 | — | Review | Fisso | — |
| 15 | — | Success | Fisso | — |

**Totale stimato**: 60-75 domande (vs. 38 attuali), di cui circa 25-30 sempre visibili.

### Logica di branching v2.0

1. **Profilazione** → ruolo e area funzionale determinano auto-suggerimento moduli (come oggi).
2. **Sez. I e II** → sempre visibili, ma con sotto-domande condizionali per ruoli direzionali vs operativi.
   - Se ruolo = Titolare/Direzione/Responsabile → domande più approfondite su deleghe, budget, forecast.
   - Se ruolo = operativo → domande più essenziali sulla conoscenza della struttura.
3. **Moduli funzionali** → selezionati dal dashboard. Ogni modulo inizia con domanda di coinvolgimento per pesare l'attendibilità.
4. **Sez. IV-VI** → sempre visibili per tutti.

### Interfacce tra funzioni

Le domande trasversali sulle interfacce (es. "come arrivano i dati dal POS alla contabilità?") vanno collocate:
- Nel modulo dell'area che **riceve** il dato (es. nella sezione Contabilità, non nella sezione Vendite).
- Con riferimento esplicito all'area di provenienza.

---

## SEZIONE 7 — MODELLO DI SCORING E MATRICE DI RISCHIO

### 7.1 Distinzione tra domande

| Tipo | Funzione | Scoring |
|------|----------|---------|
| **Classificatoria** | Descrive il processo (come funziona) | No scoring diretto |
| **Valutativa** | Misura la maturità/adeguatezza | Sì, scala 0-4 |
| **Evidenza** | Verifica l'esistenza di documentazione | Sì, binaria/cap |
| **Coinvolgimento** | Misura l'attendibilità | Peso sulla risposta |

### 7.2 Scala di maturità proposta (0-4)

| Punteggio | Significato | Criteri |
|:---------:|-------------|---------|
| **N/S** | Non so / Non di mia competenza | Escluso dallo scoring per questo intervistato |
| **N/A** | Non applicabile | Escluso dallo scoring per tutti |
| **0** | Assente | Il presidio non esiste o è completamente informale |
| **1** | Iniziale | Esiste una prassi non documentata, applicata in modo disomogeneo |
| **2** | Strutturato | Procedura definita e applicata, ma non documentata formalmente |
| **3** | Documentato | Procedura formalizzata, documentata, nota ai responsabili |
| **4** | Controllato | Procedura documentata, verificata periodicamente, con evidenze e trail |

### 7.3 Regola di cap per assenza di evidenza

Una risposta di livello 3 o 4 **senza evidenza documentale** viene automaticamente **ridotta a livello 2** nel punteggio finale. Questo evita che auto-dichiarazioni non supportate generino un rating inflazionato.

### 7.4 Domande knock-out

Alcune domande, se la risposta è inferiore a una soglia, attivano un **flag di rischio alto** indipendentemente dal punteggio aggregato:

| Domanda | Soglia knock-out |
|---------|-----------------|
| Esistenza organigramma formale | Se = 0 (assente) |
| Deleghe con limiti autorizzativi | Se = 0 (assente) |
| Budget annuale o previsione di cassa | Se = 0 (assente) |
| Riconciliazioni bancarie | Se ≤ 1 |
| Segregazione su pagamenti | Se = 0 |
| Backup e disaster recovery | Se = 0 |

### 7.5 Pesi per area

| Area | Peso | Motivazione |
|------|:----:|-------------|
| Governance/Deleghe | 25% | Primo pilastro OAC |
| Continuità/Indicatori | 20% | Requisito art. 3 CCII |
| Moduli funzionali (media ponderata) | 25% | Assetti operativi |
| Controlli trasversali | 20% | Controllo interno |
| Evidenze e documentazione | 10% | Tracciabilità |

### 7.6 Classi finali di rischio/maturità

| Classe | Range punteggio | Significato |
|--------|:--------------:|-------------|
| **A — Adeguato** | 3.2 – 4.0 | Assetti sostanzialmente adeguati, con evidenze |
| **B — Parzialmente adeguato** | 2.4 – 3.1 | Struttura presente ma con lacune di documentazione/controllo |
| **C — Inadeguato** | 1.6 – 2.3 | Lacune rilevanti su più aree |
| **D — Gravemente inadeguato** | 0.0 – 1.5 | Assetti assenti o completamente informali |

**Con knock-out**: qualsiasi flag knock-out attivo impedisce la classe A, indipendentemente dal punteggio.

### 7.7 Heatmap finale

La heatmap deve essere generabile automaticamente dal foglio Google Sheets e mostrare:
- Righe: aree/sezioni del questionario
- Colonne: sedi / punti vendita
- Celle: punteggio medio con codice colore (verde/giallo/arancione/rosso)
- Flag knock-out evidenziati con simbolo dedicato

---

## SEZIONE 8 — RISCRITTURA MIGLIORATIVA DI DOMANDE CHIAVE

### D-GOV1 — Organigramma e linea gerarchica (NUOVA)

- **Testo**: "L'azienda dispone di un organigramma formale aggiornato che rappresenti la struttura gerarchica e le linee di riporto?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esiste un organigramma
  - 1 — Esiste un organigramma informale/non aggiornato
  - 2 — Esiste un organigramma aggiornato ma non diffuso ai dipendenti
  - 3 — Esiste, è aggiornato e noto ai responsabili
  - 4 — Esiste, è aggiornato, diffuso a tutti, con mansionario collegato
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se = 0
- **Evidenza collegata**: "Può indicare dove è reperibile l'organigramma? (percorso file / cartella / non disponibile)"

### D-GOV2 — Deleghe e limiti di spesa (NUOVA)

- **Testo**: "Esistono deleghe formali con limiti di importo per le principali decisioni operative (acquisti, pagamenti, sconti, assunzioni)?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esistono deleghe formalizzate
  - 1 — Le deleghe sono di fatto implicite, basate sulla consuetudine
  - 2 — Esistono deleghe verbali con limiti non sempre chiari
  - 3 — Esistono deleghe scritte con limiti definiti per i ruoli principali
  - 4 — Sistema di deleghe formalizzato, con limiti, revisione periodica e traccia delle autorizzazioni
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se = 0
- **Evidenza**: "Indicare il documento di riferimento per le deleghe (se disponibile)"

### D-GOV3 — Segregazione dei compiti (NUOVA)

- **Testo**: "Nei processi critici (cassa, pagamenti, magazzino), le funzioni di autorizzazione, esecuzione, registrazione e custodia sono affidate a persone diverse?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Una sola persona gestisce l'intero processo
  - 1 — Parziale separazione solo in alcuni processi
  - 2 — Segregazione prevista ma non sempre rispettata
  - 3 — Segregazione applicata con supervisione del responsabile
  - 4 — Segregazione formalizzata, con controlli compensativi dove non possibile
  - N/A — Non applicabile (operatività individuale)
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se = 0
- **Evidenza**: N/A (la segregazione si verifica in sede di audit, non con un documento singolo)

### D-GOV4 — Piano di sostituzione (NUOVA)

- **Testo**: "Per i ruoli chiave (responsabile PV, responsabile cassa, referente contabile), è previsto un piano di sostituzione in caso di assenza?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non è previsto alcun piano di sostituzione
  - 1 — Le sostituzioni avvengono in modo informale
  - 2 — Esiste un piano di sostituzione verbale/implicito
  - 3 — Esiste un piano di sostituzione scritto per i ruoli principali
  - 4 — Piano di sostituzione formalizzato, testato, con cross-training del personale
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "È disponibile un documento che individui i sostituti per i ruoli chiave?"

### D-CONT1 — Budget e forecast (NUOVA)

- **Testo**: "L'azienda predispone un budget annuale e/o un forecast aggiornato con previsione dei flussi di cassa?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non viene predisposto alcun budget né previsione di cassa
  - 1 — Budget approssimativo, non formalizzato, senza forecast di cassa
  - 2 — Budget annuale predisposto, senza aggiornamento periodico
  - 3 — Budget annuale con revisione semestrale e previsione di cassa
  - 4 — Budget rolling con forecast mensile, monitoraggio scostamenti e alert
  - N/S — Non so / Non di mia competenza
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se = 0
- **Evidenza**: "Indicare se è disponibile l'ultimo budget/forecast (data e formato)"

### D-CONT2 — Reporting periodico (NUOVA)

- **Testo**: "Con quale frequenza e modalità vengono prodotti report gestionali per la direzione (vendite, margini, scostamenti budget, liquidità)?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non vengono prodotti report gestionali
  - 1 — Report occasionali, su richiesta, non standardizzati
  - 2 — Report mensili su vendite/cassa, senza analisi scostamenti
  - 3 — Report mensili strutturati con confronto budget e commento
  - 4 — Dashboard periodico con KPI, analisi scostamenti, alert automatici
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "Indicare un esempio di report gestionale recente (se disponibile)"

### D-CONT3 — Monitoraggio scaduti e liquidità (NUOVA)

- **Testo**: "Come viene monitorata la posizione di liquidità e il debito scaduto verso fornitori, banche e fisco?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esiste un monitoraggio strutturato
  - 1 — Controllo occasionale degli estratti conto bancari
  - 2 — Scadenziario aggiornato ma senza analisi dell'aging o dei ritardi
  - 3 — Monitoraggio periodico con aging analysis e reportistica alla direzione
  - 4 — Monitoraggio continuo con alert su scaduti, soglie critiche e piano di rientro
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "È disponibile un aging dei debiti scaduti aggiornato? (Sì / No / Non so)"

### D5 v2 — Procedura di vendita (RISCRITTURA)

- **Testo originale**: "Come si svolge la procedura di vendita standard?"
- **Testo migliorato**: "Come valuta il livello di strutturazione della procedura di vendita nel suo punto vendita?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esiste una procedura definita; ogni operatore agisce in autonomia
  - 1 — Esiste una prassi consolidata ma non documentata
  - 2 — Procedura definita verbalmente dal responsabile, applicata in modo omogeneo
  - 3 — Procedura scritta (SOP), nota agli operatori, con step definiti
  - 4 — SOP scritta, aggiornata, verificata periodicamente, con checklist e trail
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "Esiste una SOP scritta per il processo di vendita? (Sì / No / Non so)"

### D7 v2 — Chiusura cassa (RISCRITTURA)

- **Testo originale**: "Come avviene la chiusura cassa di fine giornata?"
- **Testo migliorato**: "Come valuta il livello di strutturazione e controllo della procedura di chiusura cassa?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esiste una procedura di chiusura strutturata
  - 1 — Z-report stampato, senza quadratura sistematica
  - 2 — Z-report + quadratura contante, senza supervisione
  - 3 — Z-report + quadratura + deposito + report inviato alla direzione
  - 4 — Procedura completa documentata, con doppio controllo e archiviazione delle quadrature
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "È disponibile un esempio di quadratura cassa recente? (Sì / No / Non so)"

### D13 v2 — Inventario (RISCRITTURA)

- **Testo originale**: "Come e con quale frequenza si effettua l'inventario fisico?"
- **Testo migliorato**: "Come valuta il livello di strutturazione del processo inventariale?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — L'inventario fisico non viene effettuato o è sporadico
  - 1 — Inventario annuale senza riconciliazione con il gestionale
  - 2 — Inventario annuale con riconciliazione, senza analisi differenze
  - 3 — Inventario semestrale/annuale con riconciliazione e analisi delle differenze
  - 4 — Inventario periodico con riconciliazione, analisi differenze, azioni correttive documentate
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "È disponibile l'ultimo verbale/report di inventario? (Sì / No / Non so)"

### D22 v2 — Riconciliazioni bancarie (RISCRITTURA)

- **Testo originale**: "Come avvengono le riconciliazioni bancarie?"
- **Testo migliorato**: "Come valuta il livello di strutturazione delle riconciliazioni bancarie?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non vengono effettuate riconciliazioni bancarie
  - 1 — Solo a chiusura annuale dal commercialista
  - 2 — Riconciliazione periodica manuale senza formalizzazione
  - 3 — Riconciliazione mensile con evidenza documentale
  - 4 — Riconciliazione mensile sistematica con gestionale, verifica eccezioni e archiviazione
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se ≤ 1
- **Evidenza**: "È disponibile l'ultima riconciliazione bancaria? (data / Sì / No / Non so)"

### D-IT1 — Gestione accessi e revoca credenziali (NUOVA)

- **Testo**: "Come viene gestito il ciclo di vita delle credenziali di accesso ai sistemi (creazione, modifica, revoca)?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Credenziali condivise, nessuna gestione del ciclo di vita
  - 1 — Credenziali individuali, nessuna procedura di revoca
  - 2 — Credenziali individuali, revoca al termine del rapporto ma senza revisione periodica
  - 3 — Procedura di creazione/modifica/revoca definita, con revisione periodica
  - 4 — Gestione centralizzata con log, revisione semestrale dei profili, revoca automatica
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "Esiste un registro/log degli accessi ai sistemi? (Sì / No / Non so)"

### D-IT2 — Backup e restore test (RISCRITTURA D28)

- **Testo originale**: "Come vengono gestiti backup e incidenti informatici?"
- **Testo migliorato**: "Come valuta il livello di strutturazione dei backup e della capacità di ripristino?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Nessun backup strutturato
  - 1 — Backup manuale occasionale su dispositivo locale
  - 2 — Backup automatico periodico, senza test di ripristino
  - 3 — Backup automatico giornaliero con procedura di ripristino documentata
  - 4 — Backup automatico con replica off-site/cloud, test di restore periodico documentato
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì — knock-out se = 0
- **Evidenza**: "È disponibile evidenza dell'ultimo test di ripristino? (data / Sì / No / Non so)"

### D-ESC1 — Escalation e rischio frode (NUOVA)

- **Testo**: "Esiste un canale formale per segnalare anomalie, irregolarità o sospetti di frode, accessibile a tutti i dipendenti?"
- **Tipo**: `radio` (scala maturità)
- **Opzioni**:
  - 0 — Non esiste alcun canale formale
  - 1 — Le segnalazioni avvengono solo verbalmente al superiore diretto
  - 2 — Esiste un indirizzo email dedicato, ma senza protezione dell'identità del segnalante
  - 3 — Canale strutturato con protezione del segnalante, gestito dalla direzione
  - 4 — Canale formalizzato conforme al d.lgs. 24/2023 (ove applicabile) o equivalente best practice
  - N/A — Non applicabile
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: Sì
- **Evidenza**: "Indicare il canale di segnalazione disponibile (email, piattaforma, procedura)"

### D-REM1 — Azioni correttive in corso (NUOVA)

- **Testo**: "Per le criticità da Lei identificate, sono già in corso azioni correttive o sono state pianificate?"
- **Tipo**: `radio_other`
- **Opzioni**:
  - Sì, con responsabile e scadenza definiti
  - Sì, ma senza scadenza formalizzata
  - Sono state discusse ma non ancora avviate
  - No, non sono state pianificate azioni correttive
  - N/S — Non so
- **Obbligatoria**: Sì
- **Scoring**: No (domanda operativa, non valutativa)
- **Evidenza**: "Se in corso, indicare brevemente l'azione e il responsabile"

---

## SEZIONE 9 — COME RENDERE IL QUESTIONARIO "QUASI PERFETTO"

### Le 5 modifiche decisive

1. **Aggiungere le due sezioni mancanti** (Governance/Deleghe e Continuità/Indicatori). Senza di esse, il questionario non copre i requisiti fondamentali degli artt. 2086 c.c. e 3 CCII.

2. **Introdurre scala di maturità uniforme (0-4)** per tutte le domande valutative. È l'unico modo per passare da una raccolta descrittiva a un vero assessment con output quantificabile.

3. **Collegare ogni domanda valutativa a un'evidenza documentale.** Il cap automatico (senza evidenza = max livello 2) è il meccanismo che distingue un questionario serio da un'auto-valutazione compiacente.

4. **Implementare il modello di scoring con knock-out e heatmap.** Il foglio Google Sheets deve calcolare automaticamente il punteggio per area/sede e generare la heatmap. I flag knock-out devono emergere visivamente.

5. **Aggiungere la sezione Remediation.** Un assessment senza piano d'azione è un esercizio accademico. Le criticità devono essere tradotte in interventi con owner e tempi.

### Errori da evitare assolutamente

1. **Non trasformare il questionario in un esame.** L'intervistato deve sentirsi aiutato a descrivere la realtà, non giudicato. Il wording deve restare neutrale e non colpevolizzante.

2. **Non inflazionare il numero di domande.** Passare da 38 a 75 domande è accettabile solo se il branching è efficace e l'intervistato ne vede al massimo 35-40 per sessione.

3. **Non pretendere risposte su ciò che non si conosce.** L'opzione "Non so / Non di mia competenza" non è un difetto: è un dato prezioso che indica i confini della conoscenza organizzativa.

4. **Non equiparare "procedura dichiarata" a "procedura esistente".** Senza evidenza, una dichiarazione resta un'opinione.

5. **Non usare il questionario come sostituto dell'audit.** Il questionario raccoglie percezioni e auto-dichiarazioni. La verifica delle evidenze è un passo successivo, guidato dai risultati del questionario.

### Bilanciamento semplicità/profondità

- **Per ruoli operativi** (cassiere, magazziniere, addetto): domande focalizzate sul processo quotidiano, scala semplice, opzione "Non so" sempre visibile. Target: 20-25 domande, 15 minuti.
- **Per ruoli direzionali** (titolare, responsabile, consulente): domande aggiuntive su governance, deleghe, budget, forecast, indicatori. Target: 35-40 domande, 25-30 minuti.
- Il branching deve essere *doppio*: per area funzionale (come oggi) E per livello di ruolo (nuovo).

### Come evitare che diventi un esercizio formale

1. **Rendere visibile il punteggio** all'intervistato al termine della compilazione (almeno in forma aggregata).
2. **Collegare ogni sezione a un'azione**: "sulla base delle risposte di questa sezione, le aree di intervento suggerite sono...".
3. **Prevedere una somministrazione periodica** (annuale o semestrale) per misurare il miglioramento.
4. **Includere nel report finale un confronto tra sedi**, se applicabile, per stimolare il miglioramento competitivo.
5. **Formalizzare il questionario come strumento dell'organo di controllo**, non come mero adempimento interno.

---

*Fine documento di analisi — Versione per la progettazione del Questionario OAC v2.0*
