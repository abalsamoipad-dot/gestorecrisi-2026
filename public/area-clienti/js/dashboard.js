/* ===================================================================
   GDC - Gestore della Crisi — Dashboard Upload
   =================================================================== */

// Stato della dashboard
const Dashboard = {
    selectedCategory: null,
    fileQueue: [],
    isUploading: false,
    uploadHistory: [],
    tasks: [],

    // Inizializzazione
    init() {
        const session = Auth.requireAuth();
        if (!session) return;

        // Popola UI con dati utente
        const displayName = session.nome ? `${session.nome} ${session.cognome}` : session.cognome;
        document.getElementById('userName').textContent = displayName;
        document.getElementById('userNameMobile').textContent = displayName;

        // Renderizza categorie
        this.renderCategories();

        // Renderizza filtri storico dinamicamente da CONFIG.CATEGORIES
        this.renderHistoryFilters();

        // Inizializza dropzone
        this.initDropzone();

        // Carica storico
        this.loadHistory();

        // Carica tasks
        this.loadTasks();

        // Animazioni entrata
        this.animateEntrance();

        // Inizializza icone
        lucide.createIcons();

        // Controlla se cambio password obbligatorio
        if (session.mustChangePassword) {
            this.showForcedPasswordChange();
        }
    },

    // Mostra cambio password forzato (non dismissibile)
    showForcedPasswordChange() {
        const modal = document.getElementById('passwordModal');
        const closeBtn = document.getElementById('passwordModalClose');
        const cancelBtn = document.getElementById('passwordCancelBtn');
        const forceMsg = document.getElementById('passwordForceMsg');

        // Mostra messaggio forzato
        forceMsg.style.display = 'flex';

        // Nascondi bottoni di chiusura/annulla
        if (closeBtn) closeBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';

        // Aggiungi classe force-change
        modal.classList.add('force-change');

        // Mostra modal
        modal.classList.add('active');

        // Impedisci chiusura cliccando overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modal.classList.contains('force-change')) {
                e.stopPropagation();
            }
        });

        lucide.createIcons({ nodes: [modal] });
    },

    // ====== TASKS ======

    async loadTasks() {
        const session = Auth.getSession();
        if (!session) return;

        try {
            const result = await apiCall('getClientTasks', {
                email: session.email,
                token: session.token
            }, 'GET');

            if (result.success) {
                this.tasks = result.tasks || [];
                this.renderTasks();
            }
        } catch (err) {
            console.error('Errore caricamento tasks:', err);
        }
    },

    renderTasks() {
        const container = document.getElementById('clientTaskList');
        const emptyState = document.getElementById('tasksEmpty');
        const counter = document.getElementById('tasksCounter');
        const counterText = document.getElementById('tasksCounterText');
        const section = document.getElementById('tasksSection');

        if (!container) return;

        if (this.tasks.length === 0) {
            emptyState.classList.remove('hidden');
            container.innerHTML = '';
            counter.style.display = 'none';
            return;
        }

        emptyState.classList.add('hidden');

        // Conta pendenti
        const pendingCount = this.tasks.filter(t => t.status === 'pending').length;
        counter.style.display = 'inline-flex';

        if (pendingCount === 0) {
            counterText.textContent = 'Tutto completato!';
            counter.classList.add('all-done');
            counter.classList.remove('pending');
        } else {
            counterText.textContent = `${pendingCount} pendente${pendingCount !== 1 ? 'i' : ''}`;
            counter.classList.remove('all-done');
        }

        // Ordina: pendenti prima, poi per data decrescente
        const sorted = [...this.tasks].sort((a, b) => {
            if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const priorityLabels = { alta: 'Alta', media: 'Media', bassa: 'Bassa' };

        container.innerHTML = sorted.map(task => {
            const isCompleted = task.status === 'completed';
            const hasDeadline = !!task.deadline;
            const isOverdue = hasDeadline && !isCompleted && new Date(task.deadline) < new Date();
            const deadlineStr = hasDeadline ? formatDate(task.deadline) : '';

            return `
            <div class="task-card ${isCompleted ? 'completed' : ''}">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${isCompleted ? 'checked disabled' : ''}
                    onchange="Dashboard.toggleTask('${task.id}', this.checked)"
                    title="${isCompleted ? 'Completato' : 'Segna come completato'}"
                >
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.description)}</div>
                    <div class="task-meta">
                        <span class="task-meta-item">
                            <i data-lucide="clock" style="width:12px;height:12px;"></i>
                            ${formatDate(task.createdAt)}
                        </span>
                        ${deadlineStr ? `
                        <span class="task-meta-item" style="${isOverdue ? 'color:var(--color-error);font-weight:600;' : ''}">
                            <i data-lucide="calendar" style="width:12px;height:12px;"></i>
                            Scadenza: ${deadlineStr}
                            ${isOverdue ? ' (scaduto!)' : ''}
                        </span>` : ''}
                        <span class="task-priority ${task.priority || 'media'}">${priorityLabels[task.priority] || 'Media'}</span>
                        ${isCompleted && task.completedAt ? `
                        <span class="task-meta-item" style="color:var(--color-success);">
                            <i data-lucide="check-circle" style="width:12px;height:12px;"></i>
                            Completato: ${formatDate(task.completedAt)}
                        </span>` : ''}
                    </div>
                </div>
                ${hasDeadline && !isCompleted ? `
                <button class="btn btn-outline btn-sm" onclick="Dashboard.downloadCalendarEvent('${task.id}')" title="Aggiungi al calendario" style="flex-shrink:0;padding:6px 10px;">
                    <i data-lucide="calendar-plus" style="width:14px;height:14px;"></i>
                </button>` : ''}
            </div>`;
        }).join('');

        lucide.createIcons({ nodes: [container] });
    },

    // Segna task come completato
    async toggleTask(taskId, completed) {
        const session = Auth.getSession();
        if (!session) return;

        try {
            const result = await apiCall('completeTask', {
                taskId,
                token: session.token,
                completed
            });

            if (result.success) {
                Toast.success('Attivita\' completata');
                this.loadTasks();
            } else {
                Toast.error(result.error || 'Errore nell\'aggiornamento');
                this.loadTasks(); // Ricarica per ripristinare stato corretto
            }
        } catch (err) {
            Toast.error('Errore di connessione');
            this.loadTasks();
        }
    },

    // Genera e scarica file .ics per evento calendario (multipiattaforma)
    downloadCalendarEvent(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || !task.deadline) return;

        const session = Auth.getSession();
        const clientName = session ? `${session.nome || ''} ${session.cognome || ''}`.trim() : 'Cliente';

        // Costruisci data evento
        const deadlineDate = new Date(task.deadline);
        const startStr = this.formatICSDate(deadlineDate);

        // Fine evento: 1 ora dopo la scadenza
        const endDate = new Date(deadlineDate.getTime() + 60 * 60 * 1000);
        const endStr = this.formatICSDate(endDate);

        // Reminder: 1 giorno e 1 ora prima
        const now = new Date();
        const uid = `task-${taskId}-${now.getTime()}@gestoredellacrisi.it`;

        // Descrizione pulita
        const description = task.description.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
        const priorityMap = { alta: 1, media: 5, bassa: 9 };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Gestore della Crisi//Task//IT',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Gestore della Crisi',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${this.formatICSDate(now)}`,
            `DTSTART:${startStr}`,
            `DTEND:${endStr}`,
            `SUMMARY:GDC - ${task.description.substring(0, 60)}`,
            `DESCRIPTION:${description}\\n\\nTask assegnato da Gestore della Crisi\\nPriorita\\': ${task.priority || 'media'}`,
            `PRIORITY:${priorityMap[task.priority] || 5}`,
            'STATUS:CONFIRMED',
            `ORGANIZER;CN=Gestore della Crisi:mailto:info@gestoredellacrisi.it`,
            `ATTENDEE;CN=${clientName}:mailto:${session?.email || ''}`,
            // Promemoria 1 giorno prima
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Scadenza task - Gestore della Crisi',
            'END:VALARM',
            // Promemoria 1 ora prima
            'BEGIN:VALARM',
            'TRIGGER:-PT1H',
            'ACTION:DISPLAY',
            'DESCRIPTION:Scadenza task tra 1 ora - Gestore della Crisi',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        // Crea e scarica file .ics
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `task-scadenza-${taskId.substring(0, 8)}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Toast.success('File calendario scaricato. Apri il file per aggiungere l\'evento al tuo calendario.');
    },

    // Formatta data per formato ICS (YYYYMMDDTHHMMSSZ)
    formatICSDate(date) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ====== CATEGORIE ======

    // Renderizza le card delle categorie
    renderCategories() {
        const grid = document.getElementById('categoryGrid');
        grid.innerHTML = CONFIG.CATEGORIES.map(cat => `
            <div class="category-card" data-category="${cat.id}" onclick="Dashboard.selectCategory('${cat.id}')">
                <i data-lucide="${cat.icon}" class="category-icon" style="width:28px;height:28px;"></i>
                <span class="category-name">${cat.label}</span>
                <span class="category-count" id="count-${cat.id}">0 file</span>
            </div>
        `).join('');
    },

    // Renderizza filtri storico dinamicamente
    renderHistoryFilters() {
        const container = document.getElementById('historyFilters');
        if (!container) return;

        let html = '<button class="filter-btn active" data-filter="all" onclick="Dashboard.filterHistory(\'all\')">Tutti</button>';

        CONFIG.CATEGORIES.forEach(cat => {
            html += `<button class="filter-btn" data-filter="${cat.id}" onclick="Dashboard.filterHistory('${cat.id}')">${cat.label}</button>`;
        });

        container.innerHTML = html;
    },

    // Seleziona categoria
    selectCategory(categoryId) {
        this.selectedCategory = categoryId;

        // Aggiorna UI
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.toggle('active', card.dataset.category === categoryId);
        });

        // Abilita dropzone
        const dropzone = document.getElementById('uploadZone');
        dropzone.classList.remove('disabled');

        // Aggiorna testo dropzone
        const cat = CONFIG.CATEGORIES.find(c => c.id === categoryId);
        document.getElementById('dropzoneCategory').textContent = cat ? cat.label : '';

        lucide.createIcons();
    },

    // ====== UPLOAD ======

    // Inizializza drag & drop
    initDropzone() {
        const dropzone = document.getElementById('uploadZone');
        const input = document.getElementById('fileInput');

        ['dragenter', 'dragover'].forEach(event => {
            dropzone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.selectedCategory && !this.isUploading) {
                    dropzone.classList.add('dragover');
                }
            });
        });

        ['dragleave', 'drop'].forEach(event => {
            dropzone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            if (!this.selectedCategory || this.isUploading) return;
            const files = e.dataTransfer.files;
            this.addFiles(files);
        });

        dropzone.addEventListener('click', () => {
            if (!this.selectedCategory || this.isUploading) return;
            input.click();
        });

        input.addEventListener('change', (e) => {
            this.addFiles(e.target.files);
            input.value = '';
        });
    },

    // Aggiungi file alla coda
    addFiles(fileList) {
        if (!this.selectedCategory) {
            Toast.warning('Seleziona prima una categoria');
            return;
        }

        const files = Array.from(fileList);
        let addedCount = 0;

        files.forEach(file => {
            const validation = this.validateFile(file);
            if (validation.valid) {
                const exists = this.fileQueue.some(f =>
                    f.file.name === file.name && f.file.size === file.size
                );
                if (!exists) {
                    this.fileQueue.push({
                        id: Date.now() + Math.random(),
                        file: file,
                        status: 'pending',
                        progress: 0,
                        error: null
                    });
                    addedCount++;
                }
            } else {
                Toast.error(validation.error);
            }
        });

        if (addedCount > 0) {
            this.renderFileQueue();
        }
    },

    // Valida singolo file
    validateFile(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
            return { valid: false, error: `Formato .${ext} non supportato per "${file.name}"` };
        }
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            return { valid: false, error: `"${file.name}" supera il limite di 25MB` };
        }
        if (file.size === 0) {
            return { valid: false, error: `"${file.name}" e' un file vuoto` };
        }
        return { valid: true };
    },

    // Renderizza coda file
    renderFileQueue() {
        const container = document.getElementById('fileQueue');
        const list = document.getElementById('fileQueueList');
        const countEl = document.getElementById('queueCount');
        const uploadBtn = document.getElementById('uploadBtn');

        if (this.fileQueue.length === 0) {
            container.classList.remove('has-files');
            return;
        }

        container.classList.add('has-files');
        countEl.textContent = `${this.fileQueue.length} file`;

        list.innerHTML = this.fileQueue.map(item => `
            <div class="file-item ${item.status}" data-id="${item.id}">
                <i data-lucide="${getFileIcon(item.file.name)}" class="file-item-icon" style="width:20px;height:20px;"></i>
                <div class="file-item-info">
                    <div class="file-item-name">${this.escapeHtml(item.file.name)}</div>
                    <div class="file-item-size">${formatFileSize(item.file.size)}</div>
                </div>
                <div class="file-item-status">
                    ${item.status === 'pending' ? `
                        <button class="remove-btn" onclick="Dashboard.removeFile(${item.id})" title="Rimuovi">
                            <i data-lucide="x" style="width:16px;height:16px;"></i>
                        </button>
                    ` : ''}
                    ${item.status === 'uploading' ? `
                        <div class="file-item-progress">
                            <div class="file-item-progress-bar" style="width:${item.progress}%"></div>
                        </div>
                        <div class="spinner"></div>
                    ` : ''}
                    ${item.status === 'success' ? `
                        <i data-lucide="check-circle" class="file-item-status-icon" style="width:20px;height:20px;"></i>
                    ` : ''}
                    ${item.status === 'error' ? `
                        <i data-lucide="alert-circle" class="file-item-status-icon" style="width:20px;height:20px;"></i>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Aggiorna stato bottone upload
        const pendingFiles = this.fileQueue.filter(f => f.status === 'pending');
        uploadBtn.disabled = pendingFiles.length === 0 || this.isUploading;
        uploadBtn.querySelector('span').textContent =
            this.isUploading ? 'Caricamento in corso...' :
            `Carica ${pendingFiles.length} File`;

        lucide.createIcons({ nodes: [list] });
    },

    // Rimuovi file dalla coda
    removeFile(id) {
        this.fileQueue = this.fileQueue.filter(f => f.id !== id);
        this.renderFileQueue();
    },

    // Svuota coda
    clearQueue() {
        this.fileQueue = this.fileQueue.filter(f => f.status === 'uploading');
        this.renderFileQueue();
    },

    // Carica tutti i file
    async uploadAll() {
        if (this.isUploading || !this.selectedCategory) return;

        const session = Auth.getSession();
        if (!session) {
            Toast.error('Sessione scaduta. Effettua di nuovo il login.');
            setTimeout(() => Auth.logout(), 2000);
            return;
        }

        this.isUploading = true;
        const pendingFiles = this.fileQueue.filter(f => f.status === 'pending');
        const uploadedFiles = [];

        this.renderFileQueue();

        for (const item of pendingFiles) {
            item.status = 'uploading';
            item.progress = 10;
            this.renderFileQueue();

            try {
                const base64 = await this.readFileAsBase64(item.file);
                item.progress = 40;
                this.renderFileQueue();

                const datePrefix = getDatePrefix();
                const renamedFile = `${datePrefix}_${item.file.name}`;

                const result = await apiCall('uploadFile', {
                    token: session.token,
                    fileName: renamedFile,
                    originalName: item.file.name,
                    mimeType: item.file.type || 'application/octet-stream',
                    base64Data: base64,
                    category: this.selectedCategory,
                    clientEmail: session.email
                });

                item.progress = 100;

                if (result.success) {
                    item.status = 'success';
                    uploadedFiles.push({
                        fileName: renamedFile,
                        originalName: item.file.name,
                        category: this.selectedCategory
                    });
                } else {
                    item.status = 'error';
                    item.error = result.error;
                    Toast.error(`Errore upload "${item.file.name}": ${result.error}`);
                }
            } catch (err) {
                item.status = 'error';
                item.error = 'Errore di rete';
                Toast.error(`Errore upload "${item.file.name}"`);
            }

            this.renderFileQueue();
        }

        if (uploadedFiles.length > 0) {
            try {
                await apiCall('sendNotification', {
                    token: session.token,
                    files: uploadedFiles
                });
            } catch (err) {
                console.error('Errore invio notifica:', err);
            }

            Toast.success(`${uploadedFiles.length} file caricati con successo!`);
            this.loadHistory();
            this.updateCategoryCounts();
        }

        this.isUploading = false;
        this.renderFileQueue();

        setTimeout(() => {
            this.fileQueue = this.fileQueue.filter(f => f.status !== 'success');
            this.renderFileQueue();
        }, 3000);
    },

    // Leggi file come Base64
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsDataURL(file);
        });
    },

    // ====== STORICO ======

    // Carica storico caricamenti
    async loadHistory() {
        const session = Auth.getSession();
        if (!session) return;

        const result = await apiCall('getUploadHistory', {
            email: session.email,
            token: session.token
        }, 'GET');

        if (result.success) {
            this.uploadHistory = result.uploads || [];
            this.renderHistory();
            this.updateCategoryCounts();
        }
    },

    // Renderizza tabella storico
    renderHistory(filterCategory = null) {
        const tbody = document.getElementById('historyBody');
        const emptyState = document.getElementById('historyEmpty');
        const tableContainer = document.getElementById('historyTable');

        let filtered = this.uploadHistory;
        if (filterCategory && filterCategory !== 'all') {
            filtered = filtered.filter(u => u.category === filterCategory);
        }

        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        tableContainer.classList.remove('hidden');

        const categoryLabels = {};
        CONFIG.CATEGORIES.forEach(c => { categoryLabels[c.id] = c.label; });

        tbody.innerHTML = filtered.map(upload => {
            const safeName = this.escapeHtml(upload.originalName || upload.fileName);
            const safeNameAttr = (upload.originalName || upload.fileName).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            return `
            <tr>
                <td>${formatDate(upload.timestamp)}</td>
                <td>
                    <div class="flex gap-8" style="align-items:center;">
                        <i data-lucide="${getFileIcon(upload.originalName || upload.fileName)}" style="width:16px;height:16px;color:var(--color-accent);flex-shrink:0;"></i>
                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:300px;" title="${safeNameAttr}">
                            ${safeName}
                        </span>
                    </div>
                </td>
                <td><span class="badge badge-neutral">${this.escapeHtml(categoryLabels[upload.category] || upload.category)}</span></td>
                <td>
                    <div class="flex gap-8" style="align-items:center;">
                        <span class="badge badge-success">Caricato</span>
                        <button class="btn-delete-file" onclick="Dashboard.deleteFile('${upload.fileId}', '${safeNameAttr}')" title="Elimina file">
                            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        lucide.createIcons({ nodes: [tbody] });
    },

    // Aggiorna contatori per categoria
    updateCategoryCounts() {
        CONFIG.CATEGORIES.forEach(cat => {
            const count = this.uploadHistory.filter(u => u.category === cat.id).length;
            const el = document.getElementById(`count-${cat.id}`);
            if (el) el.textContent = `${count} file`;
        });
    },

    // Elimina file
    async deleteFile(fileId, fileName) {
        if (!confirm(`Sei sicuro di voler eliminare "${fileName}"?\nIl file verra' spostato nella cartella "Cancellati dal cliente".`)) {
            return;
        }

        const session = Auth.getSession();
        if (!session) return;

        const result = await apiCall('clientDeleteFile', {
            token: session.token,
            fileId: fileId
        });

        if (result.success) {
            Toast.success('File eliminato');
            this.loadHistory();
        } else {
            Toast.error(result.error || 'Errore nell\'eliminazione');
        }
    },

    // Filtra storico per categoria
    filterHistory(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === category);
        });
        this.renderHistory(category);
    },

    // Animazioni entrata
    animateEntrance() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to('.dashboard-header', { opacity: 1, y: 0, duration: 0.8 })
          .to('.tasks-section', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
          .to('.category-section', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
          .to('.upload-section', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
          .to('.history-section', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }
};

// Mostra modale cambio password
function showPasswordModal() {
    document.getElementById('passwordModal').classList.add('active');
}

function hidePasswordModal() {
    const modal = document.getElementById('passwordModal');
    // Non chiudere se e' un cambio forzato
    if (modal.classList.contains('force-change')) return;
    modal.classList.remove('active');
    document.getElementById('passwordForm').reset();
    document.getElementById('passwordError').classList.add('hidden');
}

async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    const errorEl = document.getElementById('passwordError');
    const errorText = document.getElementById('passwordErrorText');

    errorEl.classList.add('hidden');

    if (newPwd.length < 6) {
        errorText.textContent = 'La nuova password deve avere almeno 6 caratteri';
        errorEl.classList.remove('hidden');
        return;
    }

    if (newPwd !== confirmPwd) {
        errorText.textContent = 'Le password non corrispondono';
        errorEl.classList.remove('hidden');
        return;
    }

    const btn = document.getElementById('passwordBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Salvataggio...';

    const result = await Auth.changePassword(currentPwd, newPwd);

    if (result.success) {
        Toast.success('Password aggiornata con successo');

        const modal = document.getElementById('passwordModal');
        if (modal.classList.contains('force-change')) {
            modal.classList.remove('force-change');
            const closeBtn = document.getElementById('passwordModalClose');
            const cancelBtn = document.getElementById('passwordCancelBtn');
            if (closeBtn) closeBtn.style.display = '';
            if (cancelBtn) cancelBtn.style.display = '';
            document.getElementById('passwordForceMsg').style.display = 'none';
        }
        modal.classList.remove('active');
        document.getElementById('passwordForm').reset();
    } else {
        errorText.textContent = result.error || 'Errore nel cambio password';
        errorEl.classList.remove('hidden');
    }

    btn.disabled = false;
    btn.querySelector('span').textContent = 'Salva Password';
}

// Inizializza quando il DOM e' pronto
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
