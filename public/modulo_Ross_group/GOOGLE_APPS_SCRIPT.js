/**
 * ============================================================
 * ROSS GROUP S.R.L. — Google Apps Script per Google Sheets
 * Riceve i dati dal questionario web (v2.0) e li salva nel foglio
 * ============================================================
 *
 * APPROCCIO DINAMICO: lo script legge le intestazioni dalla riga 1
 * e mappa automaticamente i dati del payload nelle colonne corrette.
 * Non serve più mantenere un COLUMN_MAP sincronizzato.
 *
 * ═══════════════════════════════════════════════════════════════
 * GUIDA PASSO-PASSO PER LA CONFIGURAZIONE
 * ═══════════════════════════════════════════════════════════════
 *
 * STEP 1: Creare il Google Sheet
 *   1. Vai su https://sheets.google.com
 *   2. Crea un nuovo foglio di calcolo
 *   3. Rinominalo: "Ross Group - Questionario OAC"
 *   4. Rinomina il primo foglio (tab in basso): "Risposte"
 *
 * STEP 2: Impostare le intestazioni
 *   Esegui la funzione impostaIntestazioniV2() (vedi file setHeaders.js)
 *   oppure copia le 180 intestazioni nella riga 1 del foglio.
 *
 * STEP 3: Aprire Apps Script
 *   1. Nel foglio, vai su: Estensioni > Apps Script
 *   2. Si aprirà l'editor di script
 *   3. Cancella tutto il codice esistente
 *   4. Copia e incolla TUTTO il codice qui sotto
 *   5. Salva (Ctrl+S)
 *
 * STEP 4: Deploy come Web App
 *   1. Clicca "Esegui il deployment" > "Nuova distribuzione"
 *   2. Tipo: "App web"
 *   3. Descrizione: "Endpoint questionario Ross Group v2.0"
 *   4. Esegui come: "Me" (il tuo account)
 *   5. Chi ha accesso: "Chiunque" (Anyone)
 *   6. Clicca "Distribuisci"
 *   7. Autorizza l'app quando richiesto
 *   8. COPIA L'URL che viene mostrato
 *
 * STEP 5: Configurare il frontend
 *   1. Apri il file: public/modulo_Ross_group/js/app.js
 *   2. Cerca la riga: GOOGLE_SCRIPT_URL: ''
 *   3. Incolla l'URL copiato tra gli apici:
 *      GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/XXXXXXX/exec'
 *
 * STEP 6: IMPORTANTE — Aggiornare il deployment
 *   Dopo ogni modifica a questo script:
 *   1. Clicca "Esegui il deployment" > "Gestisci deployment"
 *   2. Clicca l'icona matita (modifica) sul deployment attivo
 *   3. Nella sezione "Versione", seleziona "Nuova versione"
 *   4. Clicca "Distribuisci"
 *   (L'URL resta lo stesso, ma il codice viene aggiornato)
 *
 * ═══════════════════════════════════════════════════════════════
 * FINE GUIDA — CODICE APPS SCRIPT DA COPIARE QUI SOTTO
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Gestisce le richieste POST dal questionario web.
 *
 * APPROCCIO DINAMICO:
 * 1. Legge le intestazioni dalla riga 1 del foglio "Risposte"
 * 2. Per ogni chiave nel payload JSON, trova la colonna corrispondente
 * 3. Scrive il valore nella colonna giusta
 *
 * Questo approccio è robusto: se aggiungi/rimuovi colonne nel foglio,
 * lo script continua a funzionare senza modifiche al codice.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Risposte');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    // --- Parsing del payload ---
    var rawData;
    if (e.parameter && e.parameter.payload) {
      rawData = e.parameter.payload;           // iframe form POST
    } else if (e.postData && e.postData.contents) {
      rawData = e.postData.contents;           // JSON body diretto
    } else {
      throw new Error('Nessun dato ricevuto nella richiesta');
    }

    var data = JSON.parse(rawData);

    // --- Leggi intestazioni dalla riga 1 ---
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      throw new Error('Nessuna intestazione trovata nella riga 1 del foglio');
    }
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // --- Costruisci la riga mappando payload → intestazioni ---
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var header = String(headers[i]).trim();

      // Colonna "Timestamp" → genera automaticamente
      if (header.toLowerCase() === 'timestamp') {
        row.push(new Date());
        continue;
      }

      // Cerca il valore nel payload usando il nome intestazione come chiave
      var value = data[header];

      if (value === undefined || value === null) {
        row.push('');
      } else if (typeof value === 'boolean') {
        row.push(value ? 'Sì' : 'No');
      } else if (Array.isArray(value)) {
        row.push(value.join(', '));
      } else {
        row.push(String(value));
      }
    }

    // --- Aggiungi la riga al foglio ---
    sheet.appendRow(row);

    // --- Log per debug ---
    var keyCount = Object.keys(data).length;
    var filledCount = row.filter(function(v) { return v !== ''; }).length;

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'ok',
        message: 'Dati salvati con successo',
        payload_keys: keyCount,
        columns_filled: filledCount,
        total_columns: headers.length
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gestisce richieste GET (per test / health-check)
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Risposte');
  var colCount = sheet ? sheet.getLastColumn() : 0;
  var rowCount = sheet ? Math.max(sheet.getLastRow() - 1, 0) : 0;

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Endpoint questionario Ross Group attivo',
      version: '2.0',
      columns: colCount,
      responses: rowCount
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Funzione di test: simula l'invio di un questionario v2.0
 * Eseguire manualmente per verificare che il foglio riceva i dati
 */
function testDoPost() {
  var testData = {
    parameter: {
      payload: JSON.stringify({
        consenso: 'Sì',
        email: 'blackazure@gmail.com',
        data_intervista: '2026-03-07',
        nome: 'Rossi Mario',
        ruolo: 'Magazziniere',
        sede: 'P.V. Raffadali - Via F16 n. 5',
        area: 'Magazzino / Logistica / Inventari',
        anzianita: 'Da 2 a 5 anni',
        M0_1: 'Risposta M0_1 test',
        M0_2: 'Risposta M0_2 test',
        M0_3: 'Risposta M0_3 test',
        P1: 'Magazzino / Logistica / Inventari',
        G1: 'Sì, esiste e lo conosco',
        G2: 'Sì, con procedure chiare',
        C1: 'Sì, regolarmente',
        D1: 'Magazziniere',
        D11: 'Sì, con DDT e verifica quantità',
        D12: 'Tramite sistema gestionale',
        D38: 'Confermo',
        questionnaire_version: 'OAC_v2.0',
        interview_uuid: 'test-uuid-12345',
        started_at: '2026-03-07T10:00:00.000Z',
        submitted_at: '2026-03-07T10:45:00.000Z',
        duration_minutes: 45,
        suggested_modules: 'B',
        selected_modules: 'B',
        source_device: 'desktop',
        completion_status: 'submitted',
        score_Governance_e_deleghe: '2.85',
        score_Governance_e_deleghe_class: 'sufficiente',
        score_Magazzino: '3.00',
        score_Magazzino_class: 'sufficiente'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
