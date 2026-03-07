/* ===================================================================
   GDC - Gestore della Crisi — Google Apps Script Backend

   Da incollare in: Extensions > Apps Script del Google Sheet
   Sheet ID: 1M_aNbrwAy4Xl0PRa3Kh4y-cX58TPYtT3_kPCDn3lVKo
   =================================================================== */

// ===================== CONFIGURAZIONE =====================

const SPREADSHEET_ID = '1M_aNbrwAy4Xl0PRa3Kh4y-cX58TPYtT3_kPCDn3lVKo';
const ROOT_FOLDER_ID = '1Vc_2vvspgiL5N_0Z4EOSO5njHWNK0ZNn';
const NOTIFICATION_EMAIL = 'info@gestoredellacrisi.it';
const ADMIN_NOTIFICATION_EMAIL = 'info@gestoredellacrisi.it';
const SITE_NAME = 'Gestore della Crisi';
const SITE_URL = 'https://www.gestoredellacrisi.it';
// URL visibile ai clienti nelle email (dominio principale, mai GitHub Pages)
const AREA_CLIENTI_URL = SITE_URL + '/';
// URL tecnico GitHub Pages (usato SOLO internamente per reset password con token)
const AREA_CLIENTI_DIRECT_URL = 'https://abalsamoipad-dot.github.io/gestorecrisi-2026/area-clienti/';

// Nomi dei fogli
const SHEET_CLIENTS = 'Clienti';
const SHEET_UPLOADS = 'UploadLog';
const SHEET_TASKS = 'Tasks';
const SHEET_SETTINGS = 'Impostazioni';
const SHEET_ADMIN = 'Admin';
const SHEET_RESET_TOKENS = 'ResetTokens';

// Sottocartelle per categoria (devono corrispondere a config.js)
const CATEGORY_FOLDERS = {
  'bilanci': 'Bilanci',
  'situazione_debitoria': 'Situazione debitoria',
  'estratti_conto': 'Estratti conto',
  'contratti_accordi': 'Contratti e accordi',
  'documentazione_fiscale': 'Documentazione fiscale',
  'visure_certificati': 'Visure e certificati',
  'atti_legali': 'Atti legali',
  'corrispondenza': 'Corrispondenza',
  'altro': 'Altro'
};

// ===================== ENTRY POINTS (GET / POST) =====================

function doGet(e) {
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Nessun parametro ricevuto' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const params = e.parameter;
  const action = params.action;

  let result;
  try {
    switch (action) {
      // Admin-only GET endpoints (richiedono adminToken)
      case 'getClients':
        result = requireAdminGet(params) || getClients();
        break;
      case 'getUploadLogs':
        result = requireAdminGet(params) || getUploadLogs();
        break;
      case 'getTasks':
        result = requireAdminGet(params) || getTasks();
        break;
      case 'getSettings':
        result = requireAdminGet(params) || getSettings();
        break;

      // Client GET endpoints (richiedono token cliente)
      case 'getUploadHistory':
        result = getUploadHistory(params);
        break;
      case 'getClientTasks':
        result = getClientTasks(params);
        break;

      // Public GET endpoints
      case 'getKeywords':
        result = getKeywords();
        break;
      default:
        result = { success: false, error: 'Azione non valida' };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  if (!e || !e.postData) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Nessun dato ricevuto' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false, error: 'Dati non validi'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const action = data.action;
  let result;

  try {
    switch (action) {
      // Auth
      case 'login':
        result = login(data);
        break;
      case 'changePassword':
        result = changePassword(data);
        break;
      case 'requestPasswordReset':
        result = requestPasswordReset(data);
        break;
      case 'resetPassword':
        result = resetPassword(data);
        break;

      // Admin Auth
      case 'adminLogin':
        result = adminLogin(data);
        break;

      // Clients (admin-only)
      case 'createClient':
        result = requireAdmin(data) || createClient(data);
        break;
      case 'updateClient':
        result = requireAdmin(data) || updateClient(data);
        break;
      case 'deleteClient':
        result = requireAdmin(data) || deleteClient(data);
        break;

      // Password Management (admin-only)
      case 'adminSetPassword':
        result = requireAdmin(data) || adminSetPassword(data);
        break;

      // Upload
      case 'uploadFile':
        result = uploadFile(data);
        break;
      case 'sendNotification':
        result = sendNotification(data);
        break;
      case 'clientDeleteFile':
        result = clientDeleteFile(data);
        break;

      // Tasks
      case 'createTask':
        result = requireAdmin(data) || createTask(data);
        break;
      case 'completeTask':
        result = completeTask(data);
        break;
      case 'deleteTask':
        result = requireAdmin(data) || deleteTask(data);
        break;

      // Settings (admin-only)
      case 'updateSettings':
        result = requireAdmin(data) || updateSettings(data);
        break;

      // Keywords (admin-only per update)
      case 'updateKeywords':
        result = requireAdmin(data) || updateKeywords(data);
        break;
      case 'logKeywordAccess':
        result = logKeywordAccess(data);
        break;

      // Email documenti mancanti (admin-only)
      case 'sendMissingDocsEmail':
        result = requireAdmin(data) || sendMissingDocsEmail(data);
        break;

      default:
        result = { success: false, error: 'Azione non valida: ' + action };
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===================== UTILITY =====================

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function generateToken() {
  return Utilities.getUuid();
}

function generatePassword(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pwd = '';
  for (let i = 0; i < (length || 10); i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

function generateTaskId() {
  return 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

function findClientRow(email) {
  const sheet = getSheet(SHEET_CLIENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toLowerCase() === email.toLowerCase()) {
      return { row: i + 1, data: data[i] };
    }
  }
  return null;
}

/**
 * Recupera le estensioni file consentite dalle impostazioni.
 * Fallback a lista default se non configurate.
 */
function getAllowedExtensions() {
  try {
    const sheet = getSheet(SHEET_SETTINGS);
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === 'allowed_extensions') {
        return (data[i][1] || '').split(',').map(function(e) { return e.trim().toLowerCase(); }).filter(Boolean);
      }
    }
  } catch (err) {
    Logger.log('Errore lettura estensioni: ' + err.message);
  }
  // Fallback default
  return ['pdf', 'doc', 'docx', 'csv', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
}

function validateToken(token) {
  const sheet = getSheet(SHEET_CLIENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] === token) { // colonna H = token
      const expiry = new Date(data[i][8]); // colonna I = token expiry
      if (expiry > new Date()) {
        return {
          email: data[i][0],
          nome: data[i][1],
          cognome: data[i][2],
          row: i + 1
        };
      }
    }
  }
  return null;
}

// ===================== AUTENTICAZIONE CLIENTI =====================

function login(data) {
  const email = (data.email || '').trim().toLowerCase();
  const password = data.password || '';

  if (!email || !password) {
    return { success: false, error: 'Email e password sono obbligatori' };
  }

  const client = findClientRow(email);
  if (!client) {
    return { success: false, error: 'Credenziali non valide' };
  }

  const row = client.data;
  const storedPassword = row[4]; // colonna E = password
  const isActive = row[5] === true || row[5] === 'TRUE' || row[5] === 'true';

  if (!isActive) {
    return { success: false, error: 'Account disattivato. Contatta lo studio.' };
  }

  if (password !== storedPassword) {
    return { success: false, error: 'Credenziali non valide' };
  }

  // Genera token di sessione
  const token = generateToken();
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 8); // 8 ore

  const sheet = getSheet(SHEET_CLIENTS);
  sheet.getRange(client.row, 8).setValue(token);  // Token
  sheet.getRange(client.row, 9).setValue(expiry.toISOString()); // Token Expiry

  const mustChangePassword = row[6] === true || row[6] === 'TRUE' || row[6] === 'true';

  return {
    success: true,
    token: token,
    email: email,
    nome: row[1] || '',
    cognome: row[2] || '',
    mustChangePassword: mustChangePassword
  };
}

function changePassword(data) {
  const token = data.token;
  const currentPassword = data.currentPassword;
  const newPassword = data.newPassword;

  if (!token || !currentPassword || !newPassword) {
    return { success: false, error: 'Dati mancanti' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'La nuova password deve avere almeno 6 caratteri' };
  }

  const user = validateToken(token);
  if (!user) {
    return { success: false, error: 'Sessione scaduta' };
  }

  const sheet = getSheet(SHEET_CLIENTS);
  const storedPwd = sheet.getRange(user.row, 5).getValue(); // colonna E

  if (currentPassword !== storedPwd) {
    return { success: false, error: 'Password attuale non corretta' };
  }

  sheet.getRange(user.row, 5).setValue(newPassword);
  sheet.getRange(user.row, 7).setValue(false); // mustChangePassword = false

  return { success: true };
}

function requestPasswordReset(data) {
  const email = (data.email || '').trim().toLowerCase();
  if (!email) {
    return { success: false, error: 'Email obbligatoria' };
  }

  const client = findClientRow(email);
  if (!client) {
    // Non rivelare se l'email esiste
    return { success: true, message: 'Se l\'email esiste, riceverai le istruzioni' };
  }

  // Genera token di reset
  const resetToken = generateToken();
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 2); // 2 ore validita'

  const sheet = getSheet(SHEET_RESET_TOKENS);
  // Assicurati che le intestazioni esistano
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Email', 'Token', 'Expiry', 'Used']);
  }
  sheet.appendRow([email, resetToken, expiry.toISOString(), false]);

  // Invia email
  const resetUrl = AREA_CLIENTI_DIRECT_URL + 'reset-password.html?token=' + resetToken;
  const clientName = client.data[2] + ' ' + (client.data[1] || '');

  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Reset Password - ' + SITE_NAME,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#005f73;">Reset Password</h2>
          <p>Gentile ${clientName.trim()},</p>
          <p>Hai richiesto il reset della password per la tua area clienti.</p>
          <p>Clicca sul link seguente per impostare una nuova password:</p>
          <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">Reimposta Password</a></p>
          <p style="font-size:0.85em;color:#888;">Il link scade tra 2 ore. Se non hai richiesto il reset, ignora questa email.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
        </div>
      `
    });
  } catch (err) {
    Logger.log('Errore invio email reset: ' + err.message);
  }

  return { success: true, message: 'Se l\'email esiste, riceverai le istruzioni' };
}

function resetPassword(data) {
  const token = data.token;
  const newPassword = data.newPassword;

  if (!token || !newPassword) {
    return { success: false, error: 'Dati mancanti' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'La password deve avere almeno 6 caratteri' };
  }

  // Cerca token valido
  const sheet = getSheet(SHEET_RESET_TOKENS);
  const data2 = sheet.getDataRange().getValues();

  for (let i = 1; i < data2.length; i++) {
    if (data2[i][1] === token) {
      const used = data2[i][3] === true || data2[i][3] === 'TRUE';
      if (used) {
        return { success: false, error: 'Link gia\' utilizzato' };
      }

      const expiry = new Date(data2[i][2]);
      if (expiry < new Date()) {
        return { success: false, error: 'Link scaduto' };
      }

      const email = data2[i][0];

      // Aggiorna password
      const client = findClientRow(email);
      if (!client) {
        return { success: false, error: 'Utente non trovato' };
      }

      const clientSheet = getSheet(SHEET_CLIENTS);
      clientSheet.getRange(client.row, 5).setValue(newPassword);
      clientSheet.getRange(client.row, 7).setValue(false); // mustChangePassword = false

      // Segna token come usato
      sheet.getRange(i + 1, 4).setValue(true);

      return { success: true };
    }
  }

  return { success: false, error: 'Link non valido' };
}

// ===================== AUTENTICAZIONE ADMIN =====================

function adminLogin(data) {
  const username = (data.username || '').trim();
  const password = data.password || '';

  if (!username || !password) {
    return { success: false, error: 'Username e password sono obbligatori' };
  }

  const sheet = getSheet(SHEET_ADMIN);
  const rows = sheet.getDataRange().getValues();

  // Controlla se il foglio ha dati (oltre all'header)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === username && rows[i][1] === password) {
      // Genera token admin
      const adminToken = generateToken();
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 8); // 8 ore

      // Salva token (colonna C = Token, D = Expiry)
      sheet.getRange(i + 1, 3).setValue(adminToken);
      sheet.getRange(i + 1, 4).setValue(expiry.toISOString());

      return { success: true, adminToken: adminToken };
    }
  }

  return { success: false, error: 'Credenziali non valide' };
}

/**
 * Valida il token admin. Ritorna true se valido, false altrimenti.
 */
function validateAdminToken(token) {
  if (!token) return false;

  const sheet = getSheet(SHEET_ADMIN);
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] === token) {
      const expiry = new Date(rows[i][3]);
      if (expiry > new Date()) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Helper: verifica admin auth per POST (token nel body JSON).
 * Ritorna oggetto errore se non valido, null se OK.
 */
function requireAdmin(data) {
  const token = data.adminToken || data.admin_token || '';
  if (!validateAdminToken(token)) {
    return { success: false, error: 'Sessione admin scaduta. Effettua di nuovo il login.' };
  }
  return null; // OK
}

/**
 * Helper: verifica admin auth per GET (token nei query params).
 * Ritorna oggetto errore se non valido, null se OK.
 */
function requireAdminGet(params) {
  const token = params.adminToken || params.admin_token || '';
  if (!validateAdminToken(token)) {
    return { success: false, error: 'Sessione admin scaduta. Effettua di nuovo il login.' };
  }
  return null; // OK
}

// ===================== GESTIONE CLIENTI =====================

function getClients() {
  const sheet = getSheet(SHEET_CLIENTS);
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) {
    return { success: true, clients: [] };
  }

  const clients = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue; // Salta righe vuote
    clients.push({
      email: data[i][0],
      nome: data[i][1] || '',
      cognome: data[i][2] || '',
      telefono: data[i][3] || '',
      active: data[i][5] === true || data[i][5] === 'TRUE' || data[i][5] === 'true',
      mustChangePassword: data[i][6] === true || data[i][6] === 'TRUE' || data[i][6] === 'true',
      createdDate: data[i][9] || '',
      folderId: data[i][10] || ''
    });
  }

  return { success: true, clients: clients };
}

function createClient(data) {
  const email = (data.email || '').trim().toLowerCase();
  const nome = (data.nome || '').trim();
  const cognome = (data.cognome || '').trim();
  const telefono = (data.telefono || '').trim();
  const password = data.password || '';

  if (!email || !cognome) {
    return { success: false, error: 'Email e cognome/denominazione sono obbligatori' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'La password deve avere almeno 6 caratteri' };
  }

  // Controlla se email gia' esiste
  const existing = findClientRow(email);
  if (existing) {
    return { success: false, error: 'Email gia\' registrata' };
  }

  // Crea cartella su Google Drive
  let folderId = '';
  try {
    const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);
    const clientFolderName = cognome + (nome ? ' ' + nome : '') + ' (' + email + ')';
    const clientFolder = rootFolder.createFolder(clientFolderName);
    folderId = clientFolder.getId();

    // Crea sottocartelle per ogni categoria
    Object.values(CATEGORY_FOLDERS).forEach(folderName => {
      clientFolder.createFolder(folderName);
    });

    // Crea cartella "Cancellati dal cliente"
    clientFolder.createFolder('Cancellati dal cliente');
  } catch (err) {
    Logger.log('Errore creazione cartella: ' + err.message);
  }

  // Aggiungi al foglio
  const sheet = getSheet(SHEET_CLIENTS);
  // Colonne: Email | Nome | Cognome | Telefono | Password | Active | MustChangePassword | Token | TokenExpiry | CreatedDate | FolderId
  sheet.appendRow([
    email,
    nome,
    cognome,
    telefono,
    password,
    true,       // active
    true,       // mustChangePassword
    '',         // token
    '',         // tokenExpiry
    new Date().toISOString(), // createdDate
    folderId
  ]);

  // Invia email con credenziali
  try {
    const clientName = cognome + (nome ? ' ' + nome : '');
    MailApp.sendEmail({
      to: email,
      subject: 'Benvenuto nell\'Area Clienti - ' + SITE_NAME,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#005f73;">Benvenuto nell'Area Clienti</h2>
          <p>Gentile ${clientName},</p>
          <p>Il tuo account per l'Area Clienti di ${SITE_NAME} e' stato creato.</p>
          <div style="background:#f5f6f7;padding:16px;border-radius:8px;margin:20px 0;">
            <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
            <p style="margin:0 0 8px;"><strong>Password temporanea:</strong> <code style="background:#e8e8e8;padding:2px 8px;border-radius:4px;font-size:1.1em;">${password}</code></p>
          </div>
          <p><strong>Al primo accesso ti verra' chiesto di cambiare la password.</strong></p>
          <p>
            <a href="${AREA_CLIENTI_URL}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
              Accedi all'Area Clienti
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
        </div>
      `
    });
  } catch (err) {
    Logger.log('Errore invio email benvenuto: ' + err.message);
  }

  return { success: true };
}

function updateClient(data) {
  const email = (data.originalEmail || data.email || '').trim().toLowerCase();

  const client = findClientRow(email);
  if (!client) {
    return { success: false, error: 'Cliente non trovato' };
  }

  const sheet = getSheet(SHEET_CLIENTS);
  const row = client.row;

  // Aggiorna solo i campi forniti
  if (data.email && data.email !== email) {
    sheet.getRange(row, 1).setValue(data.email.trim().toLowerCase());
  }
  if (data.nome !== undefined) sheet.getRange(row, 2).setValue(data.nome);
  if (data.cognome !== undefined) sheet.getRange(row, 3).setValue(data.cognome);
  if (data.telefono !== undefined) sheet.getRange(row, 4).setValue(data.telefono);
  if (data.password) sheet.getRange(row, 5).setValue(data.password);
  if (data.active !== undefined) sheet.getRange(row, 6).setValue(data.active);
  if (data.mustChangePassword !== undefined) sheet.getRange(row, 7).setValue(data.mustChangePassword);

  return { success: true };
}

function deleteClient(data) {
  const email = (data.email || '').trim().toLowerCase();

  const client = findClientRow(email);
  if (!client) {
    return { success: false, error: 'Cliente non trovato' };
  }

  const sheet = getSheet(SHEET_CLIENTS);
  sheet.deleteRow(client.row);

  return { success: true };
}

// ===================== PASSWORD MANAGEMENT (ADMIN) =====================

function adminSetPassword(data) {
  const email = (data.email || '').trim().toLowerCase();
  const newPassword = data.newPassword || '';
  const sendEmail = data.sendEmail !== false;
  const mustChangePassword = data.mustChangePassword !== false;

  if (!email || newPassword.length < 6) {
    return { success: false, error: 'Password deve avere almeno 6 caratteri' };
  }

  const client = findClientRow(email);
  if (!client) {
    return { success: false, error: 'Cliente non trovato' };
  }

  const sheet = getSheet(SHEET_CLIENTS);
  sheet.getRange(client.row, 5).setValue(newPassword);
  sheet.getRange(client.row, 7).setValue(mustChangePassword);

  // Invalida token esistente
  sheet.getRange(client.row, 8).setValue('');
  sheet.getRange(client.row, 9).setValue('');

  // Invia email se richiesto
  if (sendEmail) {
    try {
      const clientName = client.data[2] + ' ' + (client.data[1] || '');
      MailApp.sendEmail({
        to: email,
        subject: 'Nuova Password - ' + SITE_NAME,
        htmlBody: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#005f73;">Nuova Password</h2>
            <p>Gentile ${clientName.trim()},</p>
            <p>La tua password per l'Area Clienti e' stata aggiornata.</p>
            <div style="background:#f5f6f7;padding:16px;border-radius:8px;margin:20px 0;">
              <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:0;"><strong>Nuova password:</strong> <code style="background:#e8e8e8;padding:2px 8px;border-radius:4px;font-size:1.1em;">${newPassword}</code></p>
            </div>
            ${mustChangePassword ? '<p><strong>Al prossimo accesso ti verra\' chiesto di scegliere una nuova password.</strong></p>' : ''}
            <p>
              <a href="${AREA_CLIENTI_URL}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
                Accedi all'Area Clienti
              </a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
            <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
          </div>
        `
      });
    } catch (err) {
      Logger.log('Errore invio email password: ' + err.message);
    }
  }

  return { success: true };
}

// ===================== UPLOAD FILE =====================

function uploadFile(data) {
  const token = data.token;
  const fileName = data.fileName;
  const base64Data = data.base64Data;
  const mimeType = data.mimeType || 'application/octet-stream';
  const category = data.category;
  const clientEmail = data.clientEmail;

  // Valida token
  const user = validateToken(token);
  if (!user) {
    return { success: false, error: 'Sessione scaduta. Effettua di nuovo il login.' };
  }

  // Valida estensione file lato server
  const originalName = data.originalName || fileName || '';
  const ext = originalName.split('.').pop().toLowerCase();
  const allowedExtensions = getAllowedExtensions();
  if (!allowedExtensions.includes(ext)) {
    return { success: false, error: 'Formato file .' + ext + ' non consentito' };
  }

  // Valida nome file (blocca path traversal)
  if (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\')) {
    return { success: false, error: 'Nome file non valido' };
  }

  // Trova cartella cliente
  const client = findClientRow(user.email);
  if (!client || !client.data[10]) {
    return { success: false, error: 'Cartella cliente non trovata' };
  }

  try {
    const clientFolder = DriveApp.getFolderById(client.data[10]);

    // Trova o crea sottocartella per categoria
    const categoryFolderName = CATEGORY_FOLDERS[category] || 'Altro';
    let targetFolder;
    const folders = clientFolder.getFoldersByName(categoryFolderName);
    if (folders.hasNext()) {
      targetFolder = folders.next();
    } else {
      targetFolder = clientFolder.createFolder(categoryFolderName);
    }

    // Decodifica e salva file
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = targetFolder.createFile(blob);

    // Registra nel log
    const logSheet = getSheet(SHEET_UPLOADS);
    if (logSheet.getLastRow() === 0) {
      logSheet.appendRow(['Timestamp', 'ClientEmail', 'ClientName', 'FileName', 'OriginalName', 'Category', 'FileId', 'MimeType']);
    }

    const clientName = user.cognome + ' ' + (user.nome || '');
    logSheet.appendRow([
      new Date().toISOString(),
      user.email,
      clientName.trim(),
      fileName,
      data.originalName || fileName,
      category,
      file.getId(),
      mimeType
    ]);

    return { success: true, fileId: file.getId() };
  } catch (err) {
    return { success: false, error: 'Errore upload: ' + err.message };
  }
}

function getUploadHistory(params) {
  const email = (params.email || '').toLowerCase();
  const token = params.token;

  if (!email || !token) {
    return { success: false, error: 'Dati mancanti' };
  }

  // Valida token
  const user = validateToken(token);
  if (!user || user.email.toLowerCase() !== email) {
    return { success: false, error: 'Sessione non valida' };
  }

  const sheet = getSheet(SHEET_UPLOADS);
  const data = sheet.getDataRange().getValues();

  const uploads = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === email) {
      uploads.push({
        timestamp: data[i][0],
        clientEmail: data[i][1],
        clientName: data[i][2],
        fileName: data[i][3],
        originalName: data[i][4],
        category: data[i][5],
        fileId: data[i][6],
        mimeType: data[i][7]
      });
    }
  }

  return { success: true, uploads: uploads };
}

function getUploadLogs() {
  const sheet = getSheet(SHEET_UPLOADS);
  const data = sheet.getDataRange().getValues();

  const logs = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    logs.push({
      timestamp: data[i][0],
      clientEmail: data[i][1],
      clientName: data[i][2],
      fileName: data[i][3],
      originalName: data[i][4],
      category: data[i][5],
      fileId: data[i][6]
    });
  }

  return { success: true, logs: logs };
}

function sendNotification(data) {
  const token = data.token;
  const files = data.files || [];

  const user = validateToken(token);
  if (!user) {
    return { success: false, error: 'Sessione non valida' };
  }

  if (files.length === 0) return { success: true };

  try {
    const clientName = user.cognome + ' ' + (user.nome || '');
    const categoryLabels = {};
    Object.keys(CATEGORY_FOLDERS).forEach(k => { categoryLabels[k] = CATEGORY_FOLDERS[k]; });

    const fileList = files.map(f =>
      `<li><strong>${f.originalName || f.fileName}</strong> - ${categoryLabels[f.category] || f.category}</li>`
    ).join('');

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: `Nuovi documenti caricati da ${clientName.trim()} - ${SITE_NAME}`,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#005f73;">Nuovi Documenti Caricati</h2>
          <p>Il cliente <strong>${clientName.trim()}</strong> (${user.email}) ha caricato ${files.length} documento/i:</p>
          <ul>${fileList}</ul>
          <p style="margin-top:20px;">
            <a href="https://drive.google.com/drive/folders/${ROOT_FOLDER_ID}" style="display:inline-block;padding:10px 20px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
              Apri Google Drive
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:0.8em;color:#aaa;">${SITE_NAME}</p>
        </div>
      `
    });
  } catch (err) {
    Logger.log('Errore invio notifica: ' + err.message);
  }

  return { success: true };
}

function clientDeleteFile(data) {
  const token = data.token;
  const fileId = data.fileId;

  const user = validateToken(token);
  if (!user) {
    return { success: false, error: 'Sessione non valida' };
  }

  try {
    const file = DriveApp.getFileById(fileId);

    // Sposta nella cartella "Cancellati dal cliente"
    const client = findClientRow(user.email);
    if (client && client.data[10]) {
      const clientFolder = DriveApp.getFolderById(client.data[10]);
      const deletedFolders = clientFolder.getFoldersByName('Cancellati dal cliente');
      let deletedFolder;
      if (deletedFolders.hasNext()) {
        deletedFolder = deletedFolders.next();
      } else {
        deletedFolder = clientFolder.createFolder('Cancellati dal cliente');
      }
      file.moveTo(deletedFolder);
    }

    // Rimuovi dal log
    const logSheet = getSheet(SHEET_UPLOADS);
    const logData = logSheet.getDataRange().getValues();
    for (let i = logData.length - 1; i >= 1; i--) {
      if (logData[i][6] === fileId) {
        logSheet.deleteRow(i + 1);
        break;
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Errore eliminazione: ' + err.message };
  }
}

// ===================== TASKS =====================

function createTask(data) {
  const clientEmail = (data.clientEmail || '').trim().toLowerCase();
  const clientName = data.clientName || '';
  const description = (data.description || '').trim();
  const priority = data.priority || 'media';
  const deadline = data.deadline || '';

  if (!clientEmail || !description) {
    return { success: false, error: 'Cliente e descrizione sono obbligatori' };
  }

  const taskId = generateTaskId();
  const createdAt = new Date().toISOString();

  const sheet = getSheet(SHEET_TASKS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['TaskId', 'ClientEmail', 'ClientName', 'Description', 'Priority', 'Deadline', 'Status', 'CreatedAt', 'CompletedAt']);
  }

  sheet.appendRow([
    taskId,
    clientEmail,
    clientName,
    description,
    priority,
    deadline,
    'pending',
    createdAt,
    ''
  ]);

  // Invia email al cliente
  try {
    const priorityLabels = { alta: 'Alta', media: 'Media', bassa: 'Bassa' };
    const priorityColors = { alta: '#dc2626', media: '#d97706', bassa: '#059669' };

    let deadlineHtml = '';
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const deadlineStr = deadlineDate.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      // Genera file .ics come allegato
      const icsContent = createICSContent(taskId, description, deadline, clientEmail, clientName);

      deadlineHtml = `
        <p><strong>Scadenza:</strong> ${deadlineStr}</p>
        <p style="font-size:0.85em;color:#888;">In allegato trovi il file per aggiungere la scadenza al tuo calendario.</p>
      `;

      // Invia con allegato .ics
      const icsBlob = Utilities.newBlob(icsContent, 'text/calendar', 'scadenza-task.ics');

      MailApp.sendEmail({
        to: clientEmail,
        cc: ADMIN_NOTIFICATION_EMAIL,
        subject: 'Nuova attivita\' assegnata - ' + SITE_NAME,
        htmlBody: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#005f73;">Nuova Attivita' Assegnata</h2>
            <p>Gentile ${clientName},</p>
            <p>Ti e' stata assegnata una nuova attivita':</p>
            <div style="background:#f5f6f7;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid ${priorityColors[priority] || '#d97706'};">
              <p style="margin:0 0 8px;font-size:1.05em;"><strong>${description}</strong></p>
              <p style="margin:0 0 4px;">Priorita': <span style="color:${priorityColors[priority] || '#d97706'};font-weight:600;">${priorityLabels[priority] || 'Media'}</span></p>
              ${deadlineHtml}
            </div>
            <p>Accedi alla tua Area Clienti per visualizzare e completare l'attivita':</p>
            <p>
              <a href="${AREA_CLIENTI_URL}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
                Vai all'Area Clienti
              </a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
            <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
          </div>
        `,
        attachments: [icsBlob]
      });
    } else {
      // Senza scadenza, no allegato .ics
      MailApp.sendEmail({
        to: clientEmail,
        cc: ADMIN_NOTIFICATION_EMAIL,
        subject: 'Nuova attivita\' assegnata - ' + SITE_NAME,
        htmlBody: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#005f73;">Nuova Attivita' Assegnata</h2>
            <p>Gentile ${clientName},</p>
            <p>Ti e' stata assegnata una nuova attivita':</p>
            <div style="background:#f5f6f7;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid ${priorityColors[priority] || '#d97706'};">
              <p style="margin:0 0 8px;font-size:1.05em;"><strong>${description}</strong></p>
              <p style="margin:0;">Priorita': <span style="color:${priorityColors[priority] || '#d97706'};font-weight:600;">${priorityLabels[priority] || 'Media'}</span></p>
            </div>
            <p>Accedi alla tua Area Clienti per visualizzare e completare l'attivita':</p>
            <p>
              <a href="${AREA_CLIENTI_URL}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
                Vai all'Area Clienti
              </a>
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
            <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
          </div>
        `
      });
    }
  } catch (err) {
    Logger.log('Errore invio email task: ' + err.message);
  }

  return { success: true, taskId: taskId };
}

// Genera contenuto .ics per allegato email
function createICSContent(taskId, description, deadline, clientEmail, clientName) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const endDate = new Date(deadlineDate.getTime() + 60 * 60 * 1000); // +1 ora

  const formatICS = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
           'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  };

  const uid = 'task-' + taskId + '-' + now.getTime() + '@gestoredellacrisi.it';
  const cleanDesc = description.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gestore della Crisi//Task//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Gestore della Crisi',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + formatICS(now),
    'DTSTART:' + formatICS(deadlineDate),
    'DTEND:' + formatICS(endDate),
    'SUMMARY:GDC - ' + description.substring(0, 60),
    'DESCRIPTION:' + cleanDesc + '\\n\\nTask assegnato da Gestore della Crisi',
    'PRIORITY:5',
    'STATUS:CONFIRMED',
    'ORGANIZER;CN=Gestore della Crisi:mailto:' + ADMIN_NOTIFICATION_EMAIL,
    'ATTENDEE;CN=' + clientName + ':mailto:' + clientEmail,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Scadenza task domani - Gestore della Crisi',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Scadenza task tra 1 ora - Gestore della Crisi',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function getTasks() {
  const sheet = getSheet(SHEET_TASKS);
  const data = sheet.getDataRange().getValues();

  const tasks = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    tasks.push({
      id: data[i][0],
      clientEmail: data[i][1],
      clientName: data[i][2],
      description: data[i][3],
      priority: data[i][4],
      deadline: data[i][5],
      status: data[i][6],
      createdAt: data[i][7],
      completedAt: data[i][8]
    });
  }

  return { success: true, tasks: tasks };
}

function getClientTasks(params) {
  const email = (params.email || '').toLowerCase();
  const token = params.token;

  if (!email || !token) {
    return { success: false, error: 'Dati mancanti' };
  }

  const user = validateToken(token);
  if (!user || user.email.toLowerCase() !== email) {
    return { success: false, error: 'Sessione non valida' };
  }

  const sheet = getSheet(SHEET_TASKS);
  const data = sheet.getDataRange().getValues();

  const tasks = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === email) {
      tasks.push({
        id: data[i][0],
        clientEmail: data[i][1],
        clientName: data[i][2],
        description: data[i][3],
        priority: data[i][4],
        deadline: data[i][5],
        status: data[i][6],
        createdAt: data[i][7],
        completedAt: data[i][8]
      });
    }
  }

  return { success: true, tasks: tasks };
}

function completeTask(data) {
  const taskId = data.taskId;
  const token = data.token;
  const completed = data.completed;

  if (!taskId || !token) {
    return { success: false, error: 'Dati mancanti' };
  }

  const user = validateToken(token);
  if (!user) {
    return { success: false, error: 'Sessione non valida' };
  }

  const sheet = getSheet(SHEET_TASKS);
  const taskData = sheet.getDataRange().getValues();

  for (let i = 1; i < taskData.length; i++) {
    if (taskData[i][0] === taskId) {
      // Verifica che il task appartenga al cliente
      if (taskData[i][1].toString().toLowerCase() !== user.email.toLowerCase()) {
        return { success: false, error: 'Non autorizzato' };
      }

      if (completed) {
        sheet.getRange(i + 1, 7).setValue('completed');
        sheet.getRange(i + 1, 9).setValue(new Date().toISOString());
      } else {
        sheet.getRange(i + 1, 7).setValue('pending');
        sheet.getRange(i + 1, 9).setValue('');
      }

      // Notifica admin del completamento
      if (completed) {
        try {
          MailApp.sendEmail({
            to: ADMIN_NOTIFICATION_EMAIL,
            subject: 'Task completato da ' + (user.cognome + ' ' + user.nome).trim() + ' - ' + SITE_NAME,
            htmlBody: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
                <h2 style="color:#059669;">Task Completato</h2>
                <p>Il cliente <strong>${(user.cognome + ' ' + user.nome).trim()}</strong> (${user.email}) ha completato il seguente task:</p>
                <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid #059669;">
                  <p style="margin:0;font-size:1.05em;"><strong>${taskData[i][3]}</strong></p>
                </div>
                <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                <p style="font-size:0.8em;color:#aaa;">${SITE_NAME}</p>
              </div>
            `
          });
        } catch (err) {
          Logger.log('Errore notifica completamento: ' + err.message);
        }
      }

      return { success: true };
    }
  }

  return { success: false, error: 'Task non trovato' };
}

function deleteTask(data) {
  const taskId = data.taskId;

  if (!taskId) {
    return { success: false, error: 'ID task mancante' };
  }

  const sheet = getSheet(SHEET_TASKS);
  const taskData = sheet.getDataRange().getValues();

  for (let i = 1; i < taskData.length; i++) {
    if (taskData[i][0] === taskId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }

  return { success: false, error: 'Task non trovato' };
}

// ===================== EMAIL DOCUMENTI MANCANTI =====================

function sendMissingDocsEmail(data) {
  const email = (data.email || '').trim();
  const clientName = data.clientName || '';
  const missingCategories = data.missingCategories || [];

  if (!email || missingCategories.length === 0) {
    return { success: false, error: 'Dati mancanti' };
  }

  try {
    const catList = missingCategories.map(c => `<li style="padding:4px 0;">${c}</li>`).join('');

    MailApp.sendEmail({
      to: email,
      cc: ADMIN_NOTIFICATION_EMAIL,
      subject: 'Documenti mancanti - ' + SITE_NAME,
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <h2 style="color:#005f73;">Documenti Mancanti</h2>
          <p>Gentile ${clientName},</p>
          <p>Per procedere con la tua pratica, abbiamo bisogno dei seguenti documenti che risultano ancora mancanti:</p>
          <div style="background:#fff7ed;padding:16px;border-radius:8px;margin:20px 0;border-left:4px solid #d97706;">
            <ul style="margin:0;padding-left:20px;">${catList}</ul>
          </div>
          <p>Ti preghiamo di caricare i documenti il prima possibile nella tua Area Clienti:</p>
          <p>
            <a href="${AREA_CLIENTI_URL}" style="display:inline-block;padding:12px 24px;background:#005f73;color:white;text-decoration:none;border-radius:25px;">
              Carica Documenti
            </a>
          </p>
          <p style="font-size:0.85em;color:#888;">Se hai difficolta' o domande, non esitare a contattarci.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:0.8em;color:#aaa;">${SITE_NAME} - ${SITE_URL}</p>
        </div>
      `
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Errore invio email: ' + err.message };
  }
}

// ===================== IMPOSTAZIONI =====================

function getSettings() {
  const sheet = getSheet(SHEET_SETTINGS);
  const data = sheet.getDataRange().getValues();

  const settings = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      settings[data[i][0]] = data[i][1];
    }
  }

  return { success: true, settings: settings };
}

function updateSettings(data) {
  const settings = data.settings || {};
  const sheet = getSheet(SHEET_SETTINGS);

  // Assicurati che l'header esista
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Key', 'Value']);
  }

  const existingData = sheet.getDataRange().getValues();

  Object.keys(settings).forEach(key => {
    let found = false;
    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(settings[key]);
        found = true;
        break;
      }
    }
    if (!found) {
      sheet.appendRow([key, settings[key]]);
    }
  });

  return { success: true };
}

// ===================== KEYWORDS (PAROLE CHIAVE) =====================

function getKeywords() {
  const sheet = getSheet(SHEET_SETTINGS);
  const data = sheet.getDataRange().getValues();

  let keywordsJson = '[]';
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'keywords_config') {
      keywordsJson = data[i][1] || '[]';
      break;
    }
  }

  try {
    const keywords = JSON.parse(keywordsJson);
    return { success: true, keywords: keywords };
  } catch (err) {
    return { success: true, keywords: [] };
  }
}

function updateKeywords(data) {
  const keywords = data.keywords;
  if (!Array.isArray(keywords)) {
    return { success: false, error: 'Formato keywords non valido' };
  }

  // Valida ogni entry
  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    if (!kw.keyword || !kw.keyword.trim()) {
      return { success: false, error: 'Ogni parola chiave deve avere un valore' };
    }
    if (!kw.url || !kw.url.trim()) {
      return { success: false, error: 'Ogni parola chiave deve avere un URL' };
    }
    keywords[i].keyword = kw.keyword.trim().toLowerCase();
    keywords[i].label = (kw.label || '').trim();
    keywords[i].url = kw.url.trim();
  }

  // Controlla duplicati
  const kwSet = {};
  for (var j = 0; j < keywords.length; j++) {
    if (kwSet[keywords[j].keyword]) {
      return { success: false, error: 'Parola chiave duplicata: ' + keywords[j].keyword };
    }
    kwSet[keywords[j].keyword] = true;
  }

  const jsonStr = JSON.stringify(keywords);
  const sheet = getSheet(SHEET_SETTINGS);
  const existingData = sheet.getDataRange().getValues();

  var found = false;
  for (var i = 1; i < existingData.length; i++) {
    if (existingData[i][0] === 'keywords_config') {
      sheet.getRange(i + 1, 2).setValue(jsonStr);
      found = true;
      break;
    }
  }
  if (!found) {
    sheet.appendRow(['keywords_config', jsonStr]);
  }

  return { success: true };
}

function logKeywordAccess(data) {
  try {
    const keyword = data.keyword || 'sconosciuta';
    const label = data.label || '';
    const url = data.url || '';
    const ip = data.ip || 'sconosciuto';
    const userAgent = data.userAgent || 'sconosciuto';
    const deviceType = data.deviceType || 'sconosciuto';
    const timestamp = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

    const subject = '[GDC] Accesso Modulo: "' + keyword + '" da IP ' + ip;

    const body = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">'
      + '<div style="background:#005f73;color:white;padding:20px;border-radius:8px 8px 0 0;">'
      + '<h2 style="margin:0;font-size:18px;">Notifica Accesso Modulo</h2>'
      + '<p style="margin:4px 0 0;opacity:0.85;font-size:13px;">gestoredellacrisi.it</p>'
      + '</div>'
      + '<div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">'
      + '<table style="width:100%;border-collapse:collapse;font-size:14px;">'
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;width:140px;border-bottom:1px solid #f3f4f6;">Parola chiave</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;"><code style="background:#f0fdfa;color:#005f73;padding:2px 8px;border-radius:4px;font-weight:600;">' + keyword + '</code></td></tr>'
      + (label ? '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">Descrizione</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">' + label + '</td></tr>' : '')
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">URL destinazione</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;word-break:break-all;"><a href="' + url + '" style="color:#005f73;">' + url + '</a></td></tr>'
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">Indirizzo IP</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-family:monospace;font-weight:600;">' + ip + '</td></tr>'
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">Dispositivo</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;">' + deviceType + '</td></tr>'
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;border-bottom:1px solid #f3f4f6;">User Agent</td>'
      + '<td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#6b7280;word-break:break-all;">' + userAgent + '</td></tr>'
      + '<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">Data e ora</td>'
      + '<td style="padding:8px 12px;">' + timestamp + '</td></tr>'
      + '</table>'
      + '</div></div>';

    MailApp.sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: body
    });

    return { success: true };
  } catch (err) {
    // Non bloccare in caso di errore email
    Logger.log('Errore logKeywordAccess: ' + err.message);
    return { success: true };
  }
}

// ===================== SETUP INIZIALE =====================
// Esegui questa funzione UNA SOLA VOLTA per creare la struttura

function setupInitial() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // 1. Foglio Clienti
  let sheet = ss.getSheetByName(SHEET_CLIENTS);
  if (!sheet) sheet = ss.insertSheet(SHEET_CLIENTS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Email', 'Nome', 'Cognome', 'Telefono', 'Password',
      'Active', 'MustChangePassword', 'Token', 'TokenExpiry',
      'CreatedDate', 'FolderId'
    ]);
    // Formatta header
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 2. Foglio UploadLog
  sheet = ss.getSheetByName(SHEET_UPLOADS);
  if (!sheet) sheet = ss.insertSheet(SHEET_UPLOADS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'ClientEmail', 'ClientName', 'FileName', 'OriginalName', 'Category', 'FileId', 'MimeType']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 3. Foglio Tasks
  sheet = ss.getSheetByName(SHEET_TASKS);
  if (!sheet) sheet = ss.insertSheet(SHEET_TASKS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['TaskId', 'ClientEmail', 'ClientName', 'Description', 'Priority', 'Deadline', 'Status', 'CreatedAt', 'CompletedAt']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 4. Foglio Impostazioni
  sheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!sheet) sheet = ss.insertSheet(SHEET_SETTINGS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Key', 'Value']);
    sheet.appendRow(['notification_email', NOTIFICATION_EMAIL]);
    sheet.appendRow(['allowed_extensions', 'pdf,doc,docx,csv,xls,xlsx,jpg,jpeg,png']);
    sheet.appendRow(['keywords_config', JSON.stringify([
      { keyword: 'ross', label: 'Questionario Ross Group', url: 'https://abalsamoipad-dot.github.io/gestorecrisi-2026/modulo_Ross_group/' }
    ])]);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 5. Foglio Admin
  sheet = ss.getSheetByName(SHEET_ADMIN);
  if (!sheet) sheet = ss.insertSheet(SHEET_ADMIN);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Username', 'Password', 'Token', 'TokenExpiry']);
    sheet.appendRow(['admin', 'test.2026', '', '']); // Credenziali iniziali
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 6. Foglio ResetTokens
  sheet = ss.getSheetByName(SHEET_RESET_TOKENS);
  if (!sheet) sheet = ss.insertSheet(SHEET_RESET_TOKENS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Email', 'Token', 'Expiry', 'Used']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#005f73').setFontColor('white');
  }

  // 7. Rimuovi il foglio "Sheet1" / "Foglio1" se esiste ed e' vuoto
  const defaultSheet = ss.getSheetByName('Foglio1') || ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  Logger.log('Setup completato con successo!');
  SpreadsheetApp.getUi().alert('Setup completato! Tutti i fogli sono stati creati.');
}
