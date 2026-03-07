# Migrazione Google Apps Script e Google Sheets -- Questionario OAC v2.0

## Indice

1. [Panoramica della migrazione](#1-panoramica-della-migrazione)
2. [Cosa NON cambia](#2-cosa-non-cambia)
3. [Cosa cambia](#3-cosa-cambia)
4. [Nuova COLUMN_MAP completa](#4-nuova-column_map-completa)
5. [Intestazioni Google Sheets](#5-intestazioni-google-sheets)
6. [Codice Google Apps Script v2.0](#6-codice-google-apps-script-v20)
7. [Strategia di compatibilita](#7-strategia-di-compatibilita)
8. [Checklist operativa](#8-checklist-operativa)

---

## 1. Panoramica della migrazione

Il questionario OAC e stato aggiornato dalla versione `OAC_v1.0` alla versione `OAC_v2.0`.
Le modifiche riguardano:

- **Nuovi campi tecnici/metadata** aggiunti al payload
- **Nuove chiavi di campo (field keys)** per le domande del questionario
- **Punteggi (scores)** calcolati e inviati nel payload
- **Campi dinamici** per "Altro" (`_altro`) e testi aggiuntivi (`_text`)

Il meccanismo di invio (POST via iframe con campo `payload` contenente JSON) rimane **identico**.

---

## 2. Cosa NON cambia

### Flusso di invio dati

```
Frontend (app.js) --> submitViaIframe(payload) --> form POST con campo hidden "payload"
    --> Google Apps Script doPost(e) --> e.parameter.payload --> JSON.parse --> write to sheet
```

- La funzione `submitViaIframe` continua a creare un `<form>` con un campo `<input type="hidden" name="payload">` contenente `JSON.stringify(payload)`.
- Il Google Apps Script continua a leggere `e.parameter.payload` e a fare `JSON.parse()`.
- **Non serve modificare la logica di parsing del `doPost()`.**

### Struttura del payload

Il payload e sempre un oggetto JSON piatto (flat), serializzato come stringa nel campo `payload` del form.

---

## 3. Cosa cambia

### 3.1 Versione del questionario

| Campo                    | v1.0          | v2.0          |
|--------------------------|---------------|---------------|
| `questionnaire_version`  | `"OAC_v1.0"`  | `"OAC_v2.0"`  |

### 3.2 Nuovi campi tecnici/metadata

Questi campi sono **completamente nuovi** nel v2.0 e vanno aggiunti come colonne nel foglio Google Sheets:

| Campo                | Tipo       | Descrizione                                                |
|----------------------|------------|------------------------------------------------------------|
| `questionnaire_version` | string  | Versione del questionario (`"OAC_v2.0"`)                   |
| `interview_uuid`     | string     | UUID univoco dell'intervista (generato lato client)         |
| `started_at`         | string     | Timestamp ISO 8601 dell'inizio compilazione                 |
| `submitted_at`       | string     | Timestamp ISO 8601 dell'invio                               |
| `duration_minutes`   | number     | Durata in minuti della compilazione                         |
| `suggested_modules`  | string     | Moduli suggeriti dal sistema (es. `"A, B"`)                 |
| `selected_modules`   | string     | Moduli selezionati dall'utente (es. `"A, C, F"`)            |
| `source_device`      | string     | `"mobile"` oppure `"desktop"`                               |
| `completion_status`  | string     | Sempre `"submitted"` al momento dell'invio                  |

### 3.3 Chiavi di campo (field keys) -- Elenco completo per step

#### Step 1 -- Anagrafica
| Chiave            | Descrizione                          |
|-------------------|--------------------------------------|
| `consenso`        | Consenso al trattamento              |
| `email`           | Email intervistato                   |
| `data_intervista` | Data dell'intervista                 |
| `nome`            | Nome intervistato                    |
| `ruolo`           | Ruolo ricoperto                      |
| `sede`            | Sede operativa                       |
| `area`            | Area funzionale                      |
| `anzianita`       | Anzianita in azienda                 |
| `M0_1`            | Campo modulo 0 - domanda 1           |
| `M0_2`            | Campo modulo 0 - domanda 2           |
| `M0_3`            | Campo modulo 0 - domanda 3           |

#### Step 2 -- Dashboard
| Chiave | Descrizione              |
|--------|--------------------------|
| `P1`   | Processi presidiati      |
| `P2`   | Attivita operative       |

#### Step 3 -- Governance
| Chiave | Descrizione                  |
|--------|------------------------------|
| `G1`   | Governance domanda 1         |
| `G2`   | Governance domanda 2         |
| `G3`   | Governance domanda 3         |
| `G4`   | Governance domanda 4         |
| `G5`   | Governance domanda 5         |
| `G6`   | Governance domanda 6         |
| `G7`   | Governance domanda 7         |
| `G8`   | Governance domanda 8         |

#### Step 4 -- Continuita
| Chiave     | Descrizione                         |
|------------|-------------------------------------|
| `C1`       | Continuita domanda 1                |
| `C2`       | Continuita domanda 2                |
| `C3`       | Continuita domanda 3                |
| `C4`       | Continuita domanda 4                |
| `C5`       | Continuita domanda 5                |
| `C6`       | Continuita domanda 6 (checkbox)     |
| `C6_text`  | Testo aggiuntivo per C6             |
| `C7`       | Continuita domanda 7                |
| `C8`       | Continuita domanda 8                |

#### Step 5 -- Contesto Organizzativo
| Chiave   | Descrizione                    |
|----------|--------------------------------|
| `D1`     | Ruolo nell'organizzazione      |
| `D2`     | Interlocutori                  |
| `D3`     | Strumenti/sistemi              |
| `D4`     | Criticita struttura            |
| `D4bis`  | Chiarezza ruolo                |
| `E2`     | Documenti aggiornati           |
| `E3`     | Responsabile archiviazione     |
| `E4`     | Reperibilita documenti         |

#### Step 6 -- Vendite (Modulo A)
| Chiave     | Descrizione                  |
|------------|------------------------------|
| `D5a`      | Vendite domanda 5a           |
| `D5b`      | Vendite domanda 5b           |
| `D5bis`    | Scontistiche/promozioni      |
| `D5ter`    | Vendite domanda 5ter         |
| `D6`       | Resi/cambi                   |
| `D6bis`    | Vendite domanda 6bis         |
| `D7`       | Chiusura cassa               |
| `D7bis`    | Vendite domanda 7bis         |
| `D8`       | Controlli incassi            |
| `D9`       | Accessi POS                  |
| `D9bis`    | Vendite domanda 9bis         |
| `D10`      | Criticita cassa              |

#### Step 7 -- Magazzino (Modulo B)
| Chiave        | Descrizione                    |
|---------------|--------------------------------|
| `D11`         | Ricezione merce                |
| `D11bis`      | Magazzino domanda 11bis        |
| `D12`         | Trasferimenti                  |
| `D12bis`      | Magazzino domanda 12bis        |
| `D13`         | Inventari                      |
| `D13bis`      | Magazzino domanda 13bis        |
| `D14`         | Resi fornitori                 |
| `D14bis`      | Stagionalita                   |
| `D14ter`      | Shrinkage                      |
| `D14quater`   | Magazzino domanda 14quater     |
| `D15`         | Processo acquisto              |
| `D16`         | Controlli ordini               |
| `D16bis`      | Magazzino domanda 16bis        |
| `D16ter`      | Magazzino domanda 16ter        |
| `D16quater`   | Magazzino domanda 16quater     |

#### Step 8 -- Acquisti (Modulo C)
| Chiave        | Descrizione                  |
|---------------|------------------------------|
| `D19`         | Acquisti domanda 19          |
| `D19bis`      | Acquisti domanda 19bis       |
| `D20`         | Acquisti domanda 20          |
| `D20bis`      | Acquisti domanda 20bis       |
| `D21`         | Acquisti domanda 21          |
| `D21bis`      | Acquisti domanda 21bis       |
| `D21ter`      | Acquisti domanda 21ter       |
| `D21quater`   | Acquisti domanda 21quater    |
| `D22`         | Riconciliazioni bancarie     |
| `D22bis`      | Acquisti domanda 22bis       |
| `D22ter`      | Acquisti domanda 22ter       |
| `D22quater`   | Acquisti domanda 22quater    |

#### Step 9 -- Contabilita (Modulo D)
| Chiave        | Descrizione                    |
|---------------|--------------------------------|
| `D23`         | Contabilita domanda 23         |
| `D23bis`      | Contabilita domanda 23bis      |
| `D24`         | Contabilita domanda 24         |
| `D24bis`      | Contabilita domanda 24bis      |
| `D25`         | Contabilita domanda 25         |
| `D25bis`      | Contabilita domanda 25bis      |
| `D26`         | Contabilita domanda 26         |
| `D27`         | Gestione accessi               |
| `D27bis`      | Contabilita domanda 27bis      |
| `D27ter`      | Contabilita domanda 27ter      |
| `D28`         | Continuita operativa           |
| `D28bis`      | Contabilita domanda 28bis      |
| `D28ter`      | Contabilita domanda 28ter      |
| `D28quater`   | Contabilita domanda 28quater   |

#### Step 10 -- Paghe (Modulo E)
| Chiave     | Descrizione                 |
|------------|-----------------------------|
| `D29`      | Paghe domanda 29            |
| `D30`      | Procedure scritte           |
| `D31`      | Reporting                   |
| `D32`      | Escalation                  |
| `D33`      | Criticita prioritarie       |
| `D33bis`   | Criticita piu urgente       |
| `D33ter`   | Motivazione urgenza         |
| `D34`      | Miglioramenti suggeriti     |

#### Step 11 -- IT (Modulo F)
| Chiave | Descrizione         |
|--------|---------------------|
| `D35`  | IT domanda 35       |
| `D36`  | Documenti disponibili|
| `D37`  | Archiviazione       |
| `D38`  | Conferma/Attestazione|

#### Step 12 -- Controlli Trasversali
| Chiave | Descrizione                     |
|--------|---------------------------------|
| `X1`   | Controllo trasversale 1         |
| `X2`   | Controllo trasversale 2         |
| `X3`   | Controllo trasversale 3         |
| `X4`   | Controllo trasversale 4         |
| `X5`   | Controllo trasversale 5         |
| `X6`   | Controllo trasversale 6         |

#### Step 13 -- Criticita e Suggerimenti
| Chiave     | Descrizione                              |
|------------|------------------------------------------|
| `D33`      | Principali criticita (checkbox_other)    |
| `D33bis`   | Criticita piu urgente (radio dinamico)   |
| `D33ter`   | Motivazione urgenza (textarea)           |
| `D34`      | Miglioramenti suggeriti (checkbox_other) |
| `D35`      | Osservazioni aggiuntive (textarea)       |

#### Step 14 -- Remediation e Priorita
| Chiave | Descrizione                              |
|--------|------------------------------------------|
| `R1`   | Area primo intervento correttivo         |
| `R2`   | Budget per remediation                   |
| `R3`   | Tempistiche previste                     |
| `R4`   | Responsabile interno del miglioramento   |

#### Step 15 -- Documenti, Evidenze, Archivi
| Chiave | Descrizione                                    |
|--------|------------------------------------------------|
| `D36`  | Documenti/evidenze disponibili (checkbox)      |
| `E2`   | Documenti aggiornati e reperibili (radio)      |
| `D37`  | Dove sono archiviati i documenti (radio_other) |
| `E3`   | Responsabile archiviazione (radio_other)       |
| `E4`   | Rapidita recupero documenti (radio)            |

#### Step 17 -- Attestazione Finale
| Chiave | Descrizione                      |
|--------|----------------------------------|
| `D38`  | Attestazione/conferma (consent)  |

### 3.4 Campi punteggio (scores)

Il frontend calcola i punteggi per area e li inserisce nel payload con questa logica:

```javascript
const safeKey = 'score_' + areaName.replace(/[^a-zA-Z0-9]/g, '_');
payload[safeKey] = data.score.toFixed(2);        // es. "2.75"
payload[safeKey + '_class'] = data.class;         // es. "sufficiente"
```

Le aree di scoring definite in `SCORING_AREAS` sono:

| Area originale              | Chiave payload (score)                  | Chiave payload (classe)                       |
|-----------------------------|-----------------------------------------|-----------------------------------------------|
| Governance e deleghe        | `score_Governance_e_deleghe`            | `score_Governance_e_deleghe_class`            |
| Continuita / reporting      | `score_Continuit__reporting`*           | `score_Continuit__reporting_class`*           |
| Vendite / cassa             | `score_Vendite___cassa`                 | `score_Vendite___cassa_class`                 |
| Magazzino                   | `score_Magazzino`                       | `score_Magazzino_class`                       |
| Acquisti                    | `score_Acquisti`                        | `score_Acquisti_class`                        |
| Contabilita                 | `score_Contabilit_`                     | `score_Contabilit__class`                     |
| Paghe                       | `score_Paghe`                           | `score_Paghe_class`                           |
| IT                          | `score_IT`                              | `score_IT_class`                              |
| Controlli trasversali       | `score_Controlli_trasversali`           | `score_Controlli_trasversali_class`           |

> *Nota: i caratteri speciali (accento su "a", spazio, "/") vengono sostituiti da `_` tramite la regex `replace(/[^a-zA-Z0-9]/g, '_')`. La chiave esatta dipende dalla codifica del nome area nel codice sorgente. Verificare con un test reale i nomi esatti delle chiavi.*

Le classi possibili per ogni punteggio sono:

| Punteggio medio | Classe                |
|------------------|-----------------------|
| < 1.5            | `criticita elevata`   |
| 1.5 -- 2.49      | `assetto fragile`     |
| 2.5 -- 3.24      | `sufficiente`         |
| >= 3.25          | `buono / maturo`      |
| N/D              | `n/d`                 |

### 3.5 Campi "Altro" (`_altro`)

Quando l'utente seleziona "Altro" in un campo `radio_other` o `checkbox_other`, il payload include un campo aggiuntivo:

```
{fieldKey}_altro = "testo libero inserito dall'utente"
```

Esempio: se l'utente seleziona "Altro" in `D37`, il payload conterra:
- `D37` = `"Altro"`
- `D37_altro` = `"Sistema proprietario interno"`

**Tutti i campi di tipo `radio_other` e `checkbox_other` possono generare un campo `_altro`.**

### 3.6 Campi "checkbox_with_text" (`_text`)

Per i campi di tipo `checkbox_with_text` (es. `C6`), il payload include un campo aggiuntivo:

```
{fieldKey}_text = "testo inserito dall'utente"
```

Esempio:
- `C6` = `"Opzione selezionata"`
- `C6_text` = `"Dettaglio aggiuntivo fornito dall'utente"`

---

## 4. Nuova COLUMN_MAP completa

Di seguito la `COLUMN_MAP` aggiornata per il v2.0, che definisce l'ordine delle colonne nel foglio Google Sheets.

```javascript
var COLUMN_MAP = [
  // ── Metadata tecnici ──
  'questionnaire_version',
  'interview_uuid',
  'started_at',
  'submitted_at',
  'duration_minutes',
  'source_device',
  'completion_status',

  // ── Anagrafica (Step 1) ──
  'consenso',
  'email',
  'data_intervista',
  'nome',
  'ruolo',
  'sede',
  'area',
  'anzianita',
  'M0_1',
  'M0_2',
  'M0_3',

  // ── Dashboard (Step 2) ──
  'P1',
  'P2',
  'suggested_modules',
  'selected_modules',

  // ── Governance (Step 3) ──
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8',

  // ── Continuita (Step 4) ──
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C6_text', 'C7', 'C8',

  // ── Contesto Organizzativo (Step 5) ──
  'D1', 'D2', 'D3', 'D4', 'D4bis',

  // ── Vendite / Modulo A (Step 6) ──
  'D5a', 'D5b', 'D5bis', 'D5ter', 'D6', 'D6bis', 'D7', 'D7bis',
  'D8', 'D9', 'D9bis', 'D10',

  // ── Magazzino / Modulo B (Step 7) ──
  'D11', 'D11bis', 'D12', 'D12bis', 'D13', 'D13bis',
  'D14', 'D14bis', 'D14ter', 'D14quater',
  'D15', 'D16', 'D16bis', 'D16ter', 'D16quater',

  // ── Acquisti / Modulo C (Step 8) ──
  'D19', 'D19bis', 'D20', 'D20bis', 'D21', 'D21bis', 'D21ter', 'D21quater',
  'D22', 'D22bis', 'D22ter', 'D22quater',

  // ── Contabilita / Modulo D (Step 9) ──
  'D23', 'D23bis', 'D24', 'D24bis', 'D25', 'D25bis',
  'D26', 'D27', 'D27bis', 'D27ter',
  'D28', 'D28bis', 'D28ter', 'D28quater',

  // ── Paghe / Modulo E (Step 10) ──
  'D29', 'D30', 'D31', 'D32',

  // ── IT / Modulo F (Step 11) ──

  // ── Controlli Trasversali (Step 12) ──
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6',

  // ── Criticita e Suggerimenti (Step 13) ──
  'D33', 'D33bis', 'D33ter', 'D34', 'D35',

  // ── Remediation (Step 14) ──
  'R1', 'R2', 'R3', 'R4',

  // ── Evidenze Documentali (Step 15) ──
  'D36', 'E2', 'D37', 'E3', 'E4',

  // ── Attestazione (Step 17) ──
  'D38',

  // ── Punteggi (Scores) ──
  'score_Governance_e_deleghe',
  'score_Governance_e_deleghe_class',
  'score_Continuit____reporting',
  'score_Continuit____reporting_class',
  'score_Vendite___cassa',
  'score_Vendite___cassa_class',
  'score_Magazzino',
  'score_Magazzino_class',
  'score_Acquisti',
  'score_Acquisti_class',
  'score_Contabilit_',
  'score_Contabilit__class',
  'score_Paghe',
  'score_Paghe_class',
  'score_IT',
  'score_IT_class',
  'score_Controlli_trasversali',
  'score_Controlli_trasversali_class',
];
```

> **Nota importante sui campi `_altro`:** i campi `_altro` sono dinamici (esistono solo quando l'utente seleziona "Altro") e non sono elencati nella `COLUMN_MAP` principale. Vengono gestiti separatamente nel codice (vedi sezione 6).

---

## 5. Intestazioni Google Sheets

Creare un nuovo foglio (tab) denominato **"Risposte_v2"** con le seguenti intestazioni nella riga 1.

Le colonne seguono l'ordine della `COLUMN_MAP` definita sopra:

| Colonna | Intestazione                             |
|---------|------------------------------------------|
| A1      | Versione Questionario                    |
| B1      | UUID Intervista                          |
| C1      | Inizio Compilazione                      |
| D1      | Invio                                    |
| E1      | Durata (min)                             |
| F1      | Dispositivo                              |
| G1      | Stato Completamento                      |
| H1      | Consenso                                 |
| I1      | Email                                    |
| J1      | Data Intervista                          |
| K1      | Nome                                     |
| L1      | Ruolo                                    |
| M1      | Sede                                     |
| N1      | Area                                     |
| O1      | Anzianita                                |
| P1      | M0_1                                     |
| Q1      | M0_2                                     |
| R1      | M0_3                                     |
| S1      | P1 - Processi presidiati                 |
| T1      | P2 - Attivita operative                  |
| U1      | Moduli Suggeriti                         |
| V1      | Moduli Selezionati                       |
| W1      | G1 - Governance                          |
| X1      | G2 - Governance                          |
| Y1      | G3 - Governance                          |
| Z1      | G4 - Governance                          |
| AA1     | G5 - Governance                          |
| AB1     | G6 - Governance                          |
| AC1     | G7 - Governance                          |
| AD1     | G8 - Governance                          |
| AE1     | C1 - Continuita                          |
| AF1     | C2 - Continuita                          |
| AG1     | C3 - Continuita                          |
| AH1     | C4 - Continuita                          |
| AI1     | C5 - Continuita                          |
| AJ1     | C6 - Continuita                          |
| AK1     | C6_text                                  |
| AL1     | C7 - Continuita                          |
| AM1     | C8 - Continuita                          |
| AN1     | D1 - Contesto                            |
| AO1     | D2 - Contesto                            |
| AP1     | D3 - Contesto                            |
| AQ1     | D4 - Contesto                            |
| AR1     | D4bis - Contesto                         |
| AS1     | D5a - Vendite                            |
| AT1     | D5b - Vendite                            |
| AU1     | D5bis - Vendite                          |
| AV1     | D5ter - Vendite                          |
| AW1     | D6 - Vendite                             |
| AX1     | D6bis - Vendite                          |
| AY1     | D7 - Vendite                             |
| AZ1     | D7bis - Vendite                          |
| BA1     | D8 - Vendite                             |
| BB1     | D9 - Vendite                             |
| BC1     | D9bis - Vendite                          |
| BD1     | D10 - Vendite                            |
| BE1     | D11 - Magazzino                          |
| BF1     | D11bis - Magazzino                       |
| BG1     | D12 - Magazzino                          |
| BH1     | D12bis - Magazzino                       |
| BI1     | D13 - Magazzino                          |
| BJ1     | D13bis - Magazzino                       |
| BK1     | D14 - Magazzino                          |
| BL1     | D14bis - Magazzino                       |
| BM1     | D14ter - Magazzino                       |
| BN1     | D14quater - Magazzino                    |
| BO1     | D15 - Magazzino                          |
| BP1     | D16 - Magazzino                          |
| BQ1     | D16bis - Magazzino                       |
| BR1     | D16ter - Magazzino                       |
| BS1     | D16quater - Magazzino                    |
| BT1     | D19 - Acquisti                           |
| BU1     | D19bis - Acquisti                        |
| BV1     | D20 - Acquisti                           |
| BW1     | D20bis - Acquisti                        |
| BX1     | D21 - Acquisti                           |
| BY1     | D21bis - Acquisti                        |
| BZ1     | D21ter - Acquisti                        |
| CA1     | D21quater - Acquisti                     |
| CB1     | D22 - Acquisti                           |
| CC1     | D22bis - Acquisti                        |
| CD1     | D22ter - Acquisti                        |
| CE1     | D22quater - Acquisti                     |
| CF1     | D23 - Contabilita                        |
| CG1     | D23bis - Contabilita                     |
| CH1     | D24 - Contabilita                        |
| CI1     | D24bis - Contabilita                     |
| CJ1     | D25 - Contabilita                        |
| CK1     | D25bis - Contabilita                     |
| CL1     | D26 - Contabilita                        |
| CM1     | D27 - Contabilita                        |
| CN1     | D27bis - Contabilita                     |
| CO1     | D27ter - Contabilita                     |
| CP1     | D28 - Contabilita                        |
| CQ1     | D28bis - Contabilita                     |
| CR1     | D28ter - Contabilita                     |
| CS1     | D28quater - Contabilita                  |
| CT1     | D29 - Paghe                              |
| CU1     | D30 - Paghe                              |
| CV1     | D31 - Paghe                              |
| CW1     | D32 - Paghe                              |
| CX1     | X1 - Controlli Trasversali               |
| CY1     | X2 - Controlli Trasversali               |
| CZ1     | X3 - Controlli Trasversali               |
| DA1     | X4 - Controlli Trasversali               |
| DB1     | X5 - Controlli Trasversali               |
| DC1     | X6 - Controlli Trasversali               |
| DD1     | D33 - Criticita                          |
| DE1     | D33bis - Criticita urgente               |
| DF1     | D33ter - Motivazione urgenza             |
| DG1     | D34 - Miglioramenti                      |
| DH1     | D35 - Osservazioni                       |
| DI1     | R1 - Remediation                         |
| DJ1     | R2 - Remediation                         |
| DK1     | R3 - Remediation                         |
| DL1     | R4 - Remediation                         |
| DM1     | D36 - Evidenze documentali               |
| DN1     | E2 - Documenti aggiornati                |
| DO1     | D37 - Archiviazione                      |
| DP1     | E3 - Responsabile archiviazione          |
| DQ1     | E4 - Reperibilita documenti              |
| DR1     | D38 - Attestazione                       |
| DS1     | Score Governance e deleghe               |
| DT1     | Classe Governance e deleghe              |
| DU1     | Score Continuita / reporting             |
| DV1     | Classe Continuita / reporting            |
| DW1     | Score Vendite / cassa                    |
| DX1     | Classe Vendite / cassa                   |
| DY1     | Score Magazzino                          |
| DZ1     | Classe Magazzino                         |
| EA1     | Score Acquisti                           |
| EB1     | Classe Acquisti                          |
| EC1     | Score Contabilita                        |
| ED1     | Classe Contabilita                       |
| EE1     | Score Paghe                              |
| EF1     | Classe Paghe                             |
| EG1     | Score IT                                 |
| EH1     | Classe IT                                |
| EI1     | Score Controlli trasversali              |
| EJ1     | Classe Controlli trasversali             |
| EK1     | Campi "Altro" (JSON)                     |

> L'ultima colonna `EK1` raccoglie tutti i campi `_altro` in formato JSON, per evitare di dover creare una colonna per ogni possibile campo "Altro".

---

## 6. Codice Google Apps Script v2.0

Di seguito il codice completo aggiornato per il v2.0. Sostituisce integralmente il contenuto del file `GOOGLE_APPS_SCRIPT.js`.

```javascript
/**
 * ============================================================
 * ROSS GROUP S.R.L. -- Google Apps Script per Google Sheets
 * Questionario OAC v2.0
 * Riceve i dati dal questionario web e li salva nel foglio
 * ============================================================
 */

// Nome del foglio per la versione v2
var SHEET_NAME_V2 = 'Risposte_v2';

// Nome del foglio per la versione v1 (backward compatibility)
var SHEET_NAME_V1 = 'Risposte';

// Ordine colonne nel foglio v2 (deve corrispondere alle intestazioni)
var COLUMN_MAP_V2 = [
  // Metadata tecnici
  'questionnaire_version',
  'interview_uuid',
  'started_at',
  'submitted_at',
  'duration_minutes',
  'source_device',
  'completion_status',

  // Anagrafica (Step 1)
  'consenso',
  'email',
  'data_intervista',
  'nome',
  'ruolo',
  'sede',
  'area',
  'anzianita',
  'M0_1',
  'M0_2',
  'M0_3',

  // Dashboard (Step 2)
  'P1',
  'P2',
  'suggested_modules',
  'selected_modules',

  // Governance (Step 3)
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8',

  // Continuita (Step 4)
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C6_text', 'C7', 'C8',

  // Contesto Organizzativo (Step 5)
  'D1', 'D2', 'D3', 'D4', 'D4bis',

  // Vendite / Modulo A (Step 6)
  'D5a', 'D5b', 'D5bis', 'D5ter', 'D6', 'D6bis', 'D7', 'D7bis',
  'D8', 'D9', 'D9bis', 'D10',

  // Magazzino / Modulo B (Step 7)
  'D11', 'D11bis', 'D12', 'D12bis', 'D13', 'D13bis',
  'D14', 'D14bis', 'D14ter', 'D14quater',
  'D15', 'D16', 'D16bis', 'D16ter', 'D16quater',

  // Acquisti / Modulo C (Step 8)
  'D19', 'D19bis', 'D20', 'D20bis', 'D21', 'D21bis', 'D21ter', 'D21quater',
  'D22', 'D22bis', 'D22ter', 'D22quater',

  // Contabilita / Modulo D (Step 9)
  'D23', 'D23bis', 'D24', 'D24bis', 'D25', 'D25bis',
  'D26', 'D27', 'D27bis', 'D27ter',
  'D28', 'D28bis', 'D28ter', 'D28quater',

  // Paghe / Modulo E (Step 10)
  'D29', 'D30', 'D31', 'D32',

  // Controlli Trasversali (Step 12)
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6',

  // Criticita e Suggerimenti (Step 13)
  'D33', 'D33bis', 'D33ter', 'D34', 'D35',

  // Remediation (Step 14)
  'R1', 'R2', 'R3', 'R4',

  // Evidenze Documentali (Step 15)
  'D36', 'E2', 'D37', 'E3', 'E4',

  // Attestazione (Step 17)
  'D38',

  // Punteggi (Scores)
  'score_Governance_e_deleghe',
  'score_Governance_e_deleghe_class',
  'score_Continuit____reporting',
  'score_Continuit____reporting_class',
  'score_Vendite___cassa',
  'score_Vendite___cassa_class',
  'score_Magazzino',
  'score_Magazzino_class',
  'score_Acquisti',
  'score_Acquisti_class',
  'score_Contabilit_',
  'score_Contabilit__class',
  'score_Paghe',
  'score_Paghe_class',
  'score_IT',
  'score_IT_class',
  'score_Controlli_trasversali',
  'score_Controlli_trasversali_class',
];

// Colonne v1 (mantenute per backward compatibility)
var COLUMN_MAP_V1 = [
  'timestamp',
  'email',
  'data_intervista',
  'nome',
  'ruolo',
  'sede',
  'area',
  'anzianita',
  'intervistatore',
  'moduli_selezionati',
  'consenso',
  'D1', 'D2', 'D3', 'D4', 'D4bis',
  'D5', 'D5bis', 'D6', 'D7', 'D8', 'D9', 'D10',
  'D11', 'D12', 'D13', 'D14', 'D14bis', 'D14ter',
  'D15', 'D16', 'D17', 'D18',
  'D19', 'D20', 'D21', 'D22',
  'D23', 'D24', 'D25',
  'D26', 'D27', 'D28',
  'D29', 'D30', 'D31', 'D32',
  'D33', 'D34', 'D35',
  'D36', 'D37', 'D38'
];

/**
 * Gestisce le richieste POST dal questionario web.
 * Supporta sia v1 che v2 del questionario, instradando
 * i dati al foglio corretto in base alla versione.
 */
function doPost(e) {
  try {
    // Prova prima il form field 'payload', poi il JSON body diretto
    var rawData;
    if (e.parameter && e.parameter.payload) {
      rawData = e.parameter.payload;
    } else if (e.postData && e.postData.contents) {
      rawData = e.postData.contents;
    } else {
      throw new Error('Nessun dato ricevuto nella richiesta');
    }

    var data = JSON.parse(rawData);

    // Determina la versione e seleziona foglio + colonne
    var version = data.questionnaire_version || 'OAC_v1.0';
    var sheetName, columnMap;

    if (version === 'OAC_v2.0') {
      sheetName = SHEET_NAME_V2;
      columnMap = COLUMN_MAP_V2;
    } else {
      sheetName = SHEET_NAME_V1;
      columnMap = COLUMN_MAP_V1;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      // Crea il foglio se non esiste
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
      // Scrive le intestazioni
      var headers = columnMap.map(function(key) {
        return key;
      });
      if (version === 'OAC_v2.0') {
        headers.push('altri_campi_json'); // Colonna extra per campi _altro
      }
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }

    // Costruisce la riga nell'ordine corretto delle colonne
    var row = columnMap.map(function(key) {
      var value = data[key];
      if (value === undefined || value === null) return '';
      if (typeof value === 'boolean') return value ? 'Si' : 'No';
      if (Array.isArray(value)) return value.join(', ');
      return String(value);
    });

    // Per v2: raccoglie tutti i campi _altro e _text non mappati
    if (version === 'OAC_v2.0') {
      var extraFields = {};
      var mappedKeys = {};
      columnMap.forEach(function(k) { mappedKeys[k] = true; });

      Object.keys(data).forEach(function(key) {
        if (!mappedKeys[key] && (key.indexOf('_altro') > -1)) {
          extraFields[key] = data[key];
        }
      });

      row.push(Object.keys(extraFields).length > 0 ? JSON.stringify(extraFields) : '');
    }

    // Aggiunge la riga al foglio
    sheet.appendRow(row);

    // Risposta di successo
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        message: 'Dati salvati con successo',
        version: version,
        sheet: sheetName
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Risposta di errore
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gestisce richieste GET (per test)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Endpoint questionario Ross Group attivo',
      version: '2.0',
      supportedVersions: ['OAC_v1.0', 'OAC_v2.0'],
      columns_v1: COLUMN_MAP_V1.length,
      columns_v2: COLUMN_MAP_V2.length
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Funzione di test v2: simula l'invio di un questionario v2
 */
function testDoPost_v2() {
  var testData = {
    parameter: {
      payload: JSON.stringify({
        questionnaire_version: 'OAC_v2.0',
        interview_uuid: 'test-uuid-1234-5678',
        started_at: '2026-03-01T10:00:00.000Z',
        submitted_at: new Date().toISOString(),
        duration_minutes: 45,
        source_device: 'desktop',
        completion_status: 'submitted',
        consenso: 'Si',
        email: 'test@rossgroup.com',
        data_intervista: '2026-03-01',
        nome: 'Mario Rossi',
        ruolo: 'Responsabile amministrativo',
        sede: 'Sede amministrativa / ufficio',
        area: 'Amministrazione / Contabilita',
        anzianita: 'Da 2 a 5 anni',
        M0_1: 'Risposta M0_1',
        M0_2: 'Risposta M0_2',
        M0_3: 'Risposta M0_3',
        P1: 'Vendite, Magazzino',
        P2: 'Gestione ordini, Fatturazione',
        suggested_modules: 'A, B',
        selected_modules: 'A, B, D',
        G1: 'Risposta G1',
        D38: true,
        score_Governance_e_deleghe: '3.25',
        score_Governance_e_deleghe_class: 'buono / maturo',
        score_Magazzino: '1.20',
        score_Magazzino_class: 'criticita elevata',
        D37_altro: 'Sistema proprietario interno'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}

/**
 * Funzione di test v1: simula l'invio di un questionario v1 (backward compat)
 */
function testDoPost_v1() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: 'test@esempio.com',
        data_intervista: '2026-02-25',
        nome: 'Test Utente',
        ruolo: 'Test Ruolo',
        sede: 'Sede amministrativa / ufficio',
        area: 'Amministrazione / Contabilita',
        anzianita: 'Da 2 a 5 anni',
        intervistatore: 'Questionario compilato in autonomia',
        moduli_selezionati: 'A, D',
        consenso: 'Si',
        D1: 'Risposta test domanda 1',
        D38: 'Confermo'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

---

## 7. Strategia di compatibilita

### Approccio consigliato: fogli separati con routing automatico

Lo script sopra implementa la strategia raccomandata:

1. **Foglio `Risposte`** -- continua a ricevere i dati v1.0 (se il questionario v1 e ancora in uso)
2. **Foglio `Risposte_v2`** -- riceve i dati v2.0

Il routing e automatico, basato sul campo `questionnaire_version` nel payload:

```
questionnaire_version === "OAC_v2.0"  -->  Risposte_v2
questionnaire_version === "OAC_v1.0"  -->  Risposte  (o assente)
```

### Vantaggi di questo approccio

| Aspetto                    | Dettaglio                                                  |
|----------------------------|------------------------------------------------------------|
| Nessuna perdita dati       | I dati v1 esistenti restano intatti nel foglio originale    |
| Indipendenza strutturale   | Le colonne v2 possono essere completamente diverse da v1   |
| Rollback semplice          | Se si torna a v1, basta reinstradare al foglio originale   |
| Unico endpoint             | Lo stesso URL Google Script serve entrambe le versioni     |
| Creazione automatica       | Se il foglio v2 non esiste, viene creato automaticamente   |

### Alternativa: foglio unico

Se si preferisce un foglio unico, e sufficiente:
- Aggiungere le nuove colonne (metadata, nuovi field keys, scores) in coda alle colonne esistenti
- Usare una sola `COLUMN_MAP` che include tutte le chiavi
- Le celle non valorizzate resteranno vuote per i record v1

> Questa alternativa e **sconsigliata** per la difficolta di gestire le differenze strutturali tra v1 e v2.

---

## 8. Checklist operativa

### Passo 1: Preparare Google Sheets

- [ ] Aprire il Google Sheet esistente "Ross Group - Questionario OAC - Risposte"
- [ ] Verificare che il foglio `Risposte` (v1) contenga i dati storici
- [ ] Creare un nuovo foglio (tab) denominato `Risposte_v2`
- [ ] Inserire le intestazioni nella riga 1 come da tabella nella sezione 5
- [ ] Formattare le intestazioni in grassetto
- [ ] (Opzionale) Congelare la riga 1 per mantenerla visibile durante lo scroll

### Passo 2: Aggiornare Google Apps Script

- [ ] Aprire il foglio > Estensioni > Apps Script
- [ ] Sostituire **tutto** il codice con quello fornito nella sezione 6
- [ ] Salvare (Ctrl+S)
- [ ] Eseguire `testDoPost_v2()` dall'editor per verificare il funzionamento
- [ ] Verificare che una nuova riga appaia nel foglio `Risposte_v2` con i dati di test
- [ ] Eseguire `testDoPost_v1()` per verificare la backward compatibility con il foglio `Risposte`

### Passo 3: Deploy aggiornato

- [ ] Cliccare "Distribuzione" > "Gestione distribuzione"
- [ ] Creare una **Nuova versione** della distribuzione esistente
- [ ] Descrizione: "Aggiornamento per questionario OAC v2.0"
- [ ] Esegui come: "Me" (il proprio account)
- [ ] Chi ha accesso: "Chiunque" (Anyone)
- [ ] Cliccare "Distribuisci"
- [ ] **IMPORTANTE:** L'URL dell'endpoint rimane lo stesso. Non serve aggiornare `CONFIG.GOOGLE_SCRIPT_URL` nel frontend.

### Passo 4: Test end-to-end

- [ ] Compilare il questionario v2.0 dal frontend
- [ ] Verificare che i dati arrivino nel foglio `Risposte_v2`
- [ ] Controllare che tutti i campi siano popolati correttamente
- [ ] Verificare i punteggi (scores e classi)
- [ ] Verificare i campi `_altro` nella colonna JSON
- [ ] Controllare che `interview_uuid`, `started_at`, `submitted_at`, `duration_minutes` siano corretti

### Passo 5: Verifica campi score

Per verificare che le chiavi dei punteggi siano corrette, e possibile:

1. Aprire la console del browser durante un invio di test
2. Aggiungere un `console.log(JSON.stringify(payload, null, 2))` prima di `submitViaIframe(payload)` in `app.js`
3. Copiare le chiavi `score_*` esatte dal log
4. Confrontarle con quelle nella `COLUMN_MAP_V2`
5. Aggiornare se necessario (il nome delle chiavi dipende dalla codifica dei caratteri speciali nel nome dell'area)

---

## Note finali

### Chiavi score e caratteri speciali

Le chiavi dei punteggi vengono generate con:

```javascript
const safeKey = 'score_' + areaName.replace(/[^a-zA-Z0-9]/g, '_');
```

I nomi delle aree nel codice contengono caratteri speciali (accenti, spazi, "/") che vengono sostituiti da underscore `_`. La sostituzione multipla puo generare underscore consecutivi (es. `Continuita / reporting` diventa `Continuit____reporting` perche la "a" accentata, lo spazio, "/", e lo spazio vengono tutti sostituiti).

**Si raccomanda di eseguire un test reale e verificare le chiavi esatte nel payload prima del deploy definitivo.**

### Dimensione del payload

Il payload v2.0 e significativamente piu grande del v1.0 a causa dei nuovi campi. Tuttavia, il limite di Google Apps Script per `e.parameter` e di circa 50 KB, ampiamente sufficiente per il questionario.

### Sicurezza

- L'endpoint resta configurato con "Chiunque" (Anyone) come accesso, come nella v1.0
- Il campo `interview_uuid` permette di tracciare univocamente ogni compilazione
- I timestamp `started_at` e `submitted_at` consentono audit temporali
