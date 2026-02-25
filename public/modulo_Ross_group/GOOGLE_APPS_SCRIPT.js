/**
 * ============================================================
 * ROSS GROUP S.R.L. — Google Apps Script per Google Sheets
 * Riceve i dati dal questionario web e li salva nel foglio
 * ============================================================
 *
 * ═══════════════════════════════════════════════════════════════
 * GUIDA PASSO-PASSO PER LA CONFIGURAZIONE
 * ═══════════════════════════════════════════════════════════════
 *
 * STEP 1: Creare il Google Sheet
 *   1. Vai su https://sheets.google.com
 *   2. Crea un nuovo foglio di calcolo
 *   3. Rinominalo: "Ross Group - Questionario OAC - Risposte"
 *   4. Rinomina il primo foglio (tab in basso): "Risposte"
 *
 * STEP 2: Aggiungere le intestazioni colonne
 *   Nella riga 1, inserisci queste intestazioni (una per cella, da A1 in poi):
 *
 *   A1:  Timestamp
 *   B1:  Email
 *   C1:  Data Intervista
 *   D1:  Nome
 *   E1:  Ruolo
 *   F1:  Sede
 *   G1:  Area
 *   H1:  Anzianità
 *   I1:  Intervistatore
 *   J1:  Moduli Selezionati
 *   K1:  Consenso
 *   L1:  D1 - Ruolo organizzazione
 *   M1:  D2 - Interlocutori
 *   N1:  D3 - Strumenti/sistemi
 *   O1:  D4 - Criticità struttura
 *   P1:  D4bis - Chiarezza ruolo
 *   Q1:  D5 - Procedura vendita
 *   R1:  D5bis - Scontistiche/promozioni
 *   S1:  D6 - Resi/cambi
 *   T1:  D7 - Chiusura cassa
 *   U1:  D8 - Controlli incassi
 *   V1:  D9 - Accessi POS
 *   W1:  D10 - Criticità cassa
 *   X1:  D11 - Ricezione merce
 *   Y1:  D12 - Trasferimenti
 *   Z1:  D13 - Inventari
 *   AA1: D14 - Resi fornitori
 *   AB1: D14bis - Stagionalità
 *   AC1: D14ter - Shrinkage
 *   AD1: D15 - Processo acquisto
 *   AE1: D16 - Controlli ordini
 *   AF1: D17 - Pagamenti
 *   AG1: D18 - Ritardi pagamento
 *   AH1: D19 - Chiusura contabile
 *   AI1: D20 - IVA/LIPE
 *   AJ1: D21 - Scadenze fiscali
 *   AK1: D22 - Riconciliazioni bancarie
 *   AL1: D23 - Presenze/turni
 *   AM1: D24 - Flusso paghe
 *   AN1: D25 - Contributi
 *   AO1: D26 - Flussi dati
 *   AP1: D27 - Gestione accessi
 *   AQ1: D28 - Continuità operativa
 *   AR1: D29 - Controlli
 *   AS1: D30 - Procedure scritte
 *   AT1: D31 - Reporting
 *   AU1: D32 - Escalation
 *   AV1: D33 - Criticità prioritarie
 *   AW1: D34 - Miglioramenti
 *   AX1: D35 - Osservazioni
 *   AY1: D36 - Documenti disponibili
 *   AZ1: D37 - Archiviazione documenti
 *   BA1: D38 - Conferma
 *
 * STEP 3: Aprire Apps Script
 *   1. Nel foglio, vai su: Estensioni > Apps Script
 *   2. Si aprirà l'editor di script
 *   3. Cancella tutto il codice esistente
 *   4. Copia e incolla TUTTO il codice qui sotto (dalla riga "function doPost" in poi)
 *   5. Salva (Ctrl+S)
 *
 * STEP 4: Deploy come Web App
 *   1. Clicca "Distribuzione" > "Nuova distribuzione"
 *   2. Tipo: "App web"
 *   3. Descrizione: "Endpoint questionario Ross Group"
 *   4. Esegui come: "Me" (il tuo account)
 *   5. Chi ha accesso: "Chiunque" (Anyone)
 *   6. Clicca "Distribuisci"
 *   7. Autorizza l'app quando richiesto
 *   8. COPIA L'URL che viene mostrato (inizia con https://script.google.com/macros/s/...)
 *
 * STEP 5: Configurare il frontend
 *   1. Apri il file: public/modulo_Ross_group/js/app.js
 *   2. Cerca la riga: GOOGLE_SCRIPT_URL: ''
 *   3. Incolla l'URL copiato tra gli apici:
 *      GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXXX/exec'
 *   4. Salva il file e fai push su GitHub
 *
 * ═══════════════════════════════════════════════════════════════
 * FINE GUIDA — CODICE APPS SCRIPT DA COPIARE QUI SOTTO
 * ═══════════════════════════════════════════════════════════════
 */

// Ordine colonne nel foglio (deve corrispondere alle intestazioni)
var COLUMN_MAP = [
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
 * Supporta due modalità di ricezione dati:
 *   1. Form submission (e.parameter.payload) — metodo principale, più affidabile
 *   2. JSON body (e.postData.contents) — metodo alternativo/fallback
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Risposte');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName('Risposte');
    }

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

    // Costruisce la riga nell'ordine corretto delle colonne
    var row = COLUMN_MAP.map(function(key) {
      var value = data[key];
      if (value === undefined || value === null) return '';
      if (typeof value === 'boolean') return value ? 'Sì' : 'No';
      return String(value);
    });

    // Aggiunge la riga al foglio
    sheet.appendRow(row);

    // Risposta di successo
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'Dati salvati con successo' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Risposta di errore
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
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
      version: '1.0',
      columns: COLUMN_MAP.length
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Funzione di test: simula l'invio di un questionario
 * Eseguire manualmente per verificare che il foglio riceva i dati
 */
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: 'test@esempio.com',
        data_intervista: '2026-02-25',
        nome: 'Test Utente',
        ruolo: 'Test Ruolo',
        sede: 'Sede amministrativa / ufficio',
        area: 'Amministrazione / Contabilità',
        anzianita: 'Da 2 a 5 anni',
        intervistatore: 'Questionario compilato in autonomia',
        moduli_selezionati: 'A, D',
        consenso: 'Sì',
        D1: 'Risposta test domanda 1',
        D38: 'Confermo'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
