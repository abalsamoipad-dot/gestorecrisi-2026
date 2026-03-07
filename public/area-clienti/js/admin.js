/* ===================================================================
   GDC - Gestore della Crisi — Pannello Admin
   =================================================================== */

const Admin = {
    authenticated: false,
    clients: [],
    uploadLogs: [],
    tasks: [],
    keywords: [],
    editingKeywordIndex: -1,
    currentView: 'clients',
    editingClient: null,
    clientType: 'persona',
    passwordSetEmail: null,

    // Ritorna il token admin salvato in sessionStorage
    getAdminToken() {
        return sessionStorage.getItem('gdc_admin_token') || '';
    },

    // Helper per chiamate API admin (POST) — include automaticamente adminToken
    async adminApiCall(action, data = {}) {
        data.adminToken = this.getAdminToken();
        const result = await apiCall(action, data);
        // Se sessione scaduta, forza logout
        if (!result.success && result.error && result.error.includes('Sessione admin scaduta')) {
            Toast.error('Sessione admin scaduta. Effettua di nuovo il login.');
            setTimeout(() => this.logout(), 2000);
            return result;
        }
        return result;
    },

    // Helper per chiamate API admin (GET) — include automaticamente adminToken
    async adminApiGet(action, params = {}) {
        params.adminToken = this.getAdminToken();
        const result = await apiCall(action, params, 'GET');
        if (!result.success && result.error && result.error.includes('Sessione admin scaduta')) {
            Toast.error('Sessione admin scaduta. Effettua di nuovo il login.');
            setTimeout(() => this.logout(), 2000);
            return result;
        }
        return result;
    },

    // Inizializzazione
    init() {
        // Controlla se admin gia' autenticato in questa sessione (con token valido)
        if (sessionStorage.getItem('gdc_admin') === 'true' && this.getAdminToken()) {
            this.authenticated = true;
            this.showPanel();
        } else {
            // Nessuna sessione valida: mostra overlay login
            const overlay = document.getElementById('adminLoginOverlay');
            if (overlay) {
                overlay.style.display = '';
                overlay.classList.remove('hidden');
            }
        }
        lucide.createIcons();
    },

    // Login admin con username + password
    async login(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const btn = document.getElementById('adminLoginBtn');
        const error = document.getElementById('adminError');

        error.classList.add('hidden');
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Verifica...';

        const result = await apiCall('adminLogin', { username, password });

        if (result.success) {
            this.authenticated = true;
            sessionStorage.setItem('gdc_admin', 'true');
            sessionStorage.setItem('gdc_admin_token', result.adminToken || '');
            this.showPanel();
        } else {
            error.classList.remove('hidden');
            document.getElementById('adminErrorText').textContent =
                result.error || 'Credenziali non valide';
            gsap.fromTo('.login-card', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        }

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Accedi';
    },

    // Mostra pannello admin
    showPanel() {
        document.getElementById('adminLoginOverlay').classList.add('hidden');
        document.getElementById('adminLayout').classList.add('active');
        this.loadClients();
        this.loadLogs();
        this.loadTasks();
        this.loadSettings();
        this.loadKeywords();
    },

    // Logout admin
    logout() {
        sessionStorage.removeItem('gdc_admin');
        sessionStorage.removeItem('gdc_admin_token');
        window.location.reload();
    },

    // Naviga tra le viste
    navigate(view) {
        this.currentView = view;

        // Aggiorna menu
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Aggiorna contenuto
        document.querySelectorAll('.admin-view').forEach(v => {
            v.classList.toggle('active', v.id === `view-${view}`);
        });

        // Ri-renderizza la vista corrente
        if (view === 'clients') this.renderClients();
        if (view === 'logs') this.renderLogs();
        if (view === 'tasks') this.renderAdminTasks();
        if (view === 'settings') this.renderKeywords();

        // Chiudi sidebar mobile
        this.closeSidebar();
    },

    // ====== CLIENTI ======

    async loadClients() {
        const result = await this.adminApiGet('getClients');
        if (result.success) {
            this.clients = result.clients || [];
            this.renderClients();
            this.populateLogClientFilter();
            this.populateTaskClientFilter();
            this.updateStats();
        }
    },

    populateLogClientFilter() {
        const select = document.getElementById('logClientFilter');
        if (!select) return;
        const currentVal = select.value;
        select.innerHTML = '<option value="">Tutti i clienti</option>';
        const sorted = [...this.clients].sort((a, b) => {
            const nameA = (a.cognome + ' ' + a.nome).toLowerCase();
            const nameB = (b.cognome + ' ' + b.nome).toLowerCase();
            return nameA.localeCompare(nameB);
        });
        sorted.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.email;
            opt.textContent = c.cognome + ' ' + c.nome;
            select.appendChild(opt);
        });
        if (currentVal) select.value = currentVal;
    },

    populateTaskClientFilter() {
        // Filtro nella vista tasks
        const filterSelect = document.getElementById('taskClientFilter');
        if (filterSelect) {
            const currentVal = filterSelect.value;
            filterSelect.innerHTML = '<option value="">Tutti i clienti</option>';
            const sorted = [...this.clients].sort((a, b) =>
                (a.cognome + ' ' + a.nome).toLowerCase().localeCompare((b.cognome + ' ' + b.nome).toLowerCase())
            );
            sorted.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.email;
                opt.textContent = c.cognome + ' ' + c.nome;
                filterSelect.appendChild(opt);
            });
            if (currentVal) filterSelect.value = currentVal;
        }

        // Checkbox list nella modale task
        const taskClientList = document.getElementById('taskClientList');
        if (taskClientList) {
            const sorted = [...this.clients].sort((a, b) =>
                (a.cognome + ' ' + a.nome).toLowerCase().localeCompare((b.cognome + ' ' + b.nome).toLowerCase())
            );
            taskClientList.innerHTML = sorted
                .filter(c => c.active === true || c.active === 'TRUE')
                .map(c => {
                    const safeEmail = (c.email || '').replace(/"/g, '&quot;');
                    const safeName = (c.cognome + ' ' + c.nome).replace(/</g, '&lt;');
                    return `<label style="display:flex;align-items:center;gap:8px;padding:4px 6px;cursor:pointer;font-size:0.85rem;border-radius:4px;" onmouseover="this.style.background='var(--color-primary-bg, #e8f4f8)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" class="task-client-cb" value="${safeEmail}" data-name="${safeName}" style="accent-color:var(--color-accent);width:16px;height:16px;flex-shrink:0;" onchange="Admin.updateTaskClientCount()">
                        <span>${safeName}</span>
                        <span style="color:var(--color-text-tertiary);font-size:0.75rem;margin-left:auto;">${safeEmail}</span>
                    </label>`;
                }).join('');
            this.updateTaskClientCount();
            if (currentVal) taskClientSelect.value = currentVal;
        }
    },

    // Ricerca clienti
    searchClients(query) {
        const q = query.toLowerCase().trim();
        const tbody = document.getElementById('clientsBody');
        const rows = tbody.querySelectorAll('tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = !q || text.includes(q) ? '' : 'none';
        });
    },

    renderClients() {
        const tbody = document.getElementById('clientsBody');
        const empty = document.getElementById('clientsEmpty');
        const table = document.getElementById('clientsTable');

        if (this.clients.length === 0) {
            empty.classList.remove('hidden');
            table.classList.add('hidden');
            return;
        }

        empty.classList.add('hidden');
        table.classList.remove('hidden');

        tbody.innerHTML = this.clients.map(client => {
            const isActive = client.active === true || client.active === 'TRUE';
            const safeEmail = client.email.replace(/'/g, "\\'");
            return `
            <tr>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:var(--color-accent-glow);display:flex;align-items:center;justify-content:center;color:var(--color-accent);font-weight:600;font-size:0.8rem;flex-shrink:0;">
                            ${this.escapeHtml((client.nome || '?')[0])}${this.escapeHtml((client.cognome || '?')[0])}
                        </div>
                        <div>
                            <div style="color:var(--color-text);font-weight:500;">${this.escapeHtml(client.cognome)} ${this.escapeHtml(client.nome)}</div>
                            <div style="font-size:0.75rem;color:var(--color-text-tertiary);">${this.escapeHtml(client.email)}</div>
                        </div>
                    </div>
                </td>
                <td class="hide-mobile">${this.escapeHtml(client.telefono || '-')}</td>
                <td>
                    <span class="badge ${isActive ? 'badge-success' : 'badge-error'}">
                        ${isActive ? 'Attivo' : 'Disattivo'}
                    </span>
                </td>
                <td class="hide-mobile" style="font-size:0.75rem;color:var(--color-text-tertiary);">
                    ${client.createdDate ? formatDate(client.createdDate) : '-'}
                </td>
                <td>
                    <div class="actions">
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.viewClientDocs('${safeEmail}')" title="Documenti" style="color:var(--color-accent);">
                            <i data-lucide="folder-open" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.showPasswordSetModal('${safeEmail}')" title="Imposta Password" style="color:var(--color-warning);">
                            <i data-lucide="key-round" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.editClient('${safeEmail}')" title="Modifica">
                            <i data-lucide="pencil" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.toggleClientStatus('${safeEmail}', ${!isActive})" title="${isActive ? 'Disattiva' : 'Attiva'}">
                            <i data-lucide="${isActive ? 'user-x' : 'user-check'}" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.confirmDeleteClient('${safeEmail}')" title="Elimina" style="color:var(--color-error);">
                            <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        lucide.createIcons({ nodes: [tbody] });

        // Ripristina eventuale ricerca
        const searchInput = document.getElementById('clientSearchInput');
        if (searchInput && searchInput.value) {
            this.searchClients(searchInput.value);
        }
    },

    // Toggle tipo cliente (persona / denominazione)
    setClientType(type) {
        this.clientType = type;
        const btnPersona = document.getElementById('btnTypePersona');
        const btnDenom = document.getElementById('btnTypeDenom');
        const fieldsPersona = document.getElementById('clientFieldsPersona');
        const fieldsDenom = document.getElementById('clientFieldsDenom');

        if (type === 'denominazione') {
            btnPersona.classList.remove('active');
            btnDenom.classList.add('active');
            fieldsPersona.classList.add('hidden');
            fieldsDenom.classList.remove('hidden');
        } else {
            btnPersona.classList.add('active');
            btnDenom.classList.remove('active');
            fieldsPersona.classList.remove('hidden');
            fieldsDenom.classList.add('hidden');
        }
    },

    // Mostra modale nuovo cliente
    showAddClientModal() {
        this.editingClient = null;
        document.getElementById('clientModalTitle').textContent = 'Nuovo Cliente';
        document.getElementById('clientForm').reset();
        document.getElementById('clientEmail').disabled = false;
        document.getElementById('clientPasswordGroup').classList.remove('hidden');
        document.getElementById('clientPassword').required = true;
        document.getElementById('clientPasswordHint').textContent = 'Minimo 6 caratteri. La password verra\' inviata al cliente via email.';
        document.getElementById('clientError').classList.add('hidden');
        this.setClientType('persona');
        document.getElementById('clientDenominazione').value = '';
        document.getElementById('clientModal').classList.add('active');
    },

    // Mostra modale modifica cliente
    editClient(email) {
        const client = this.clients.find(c => c.email === email);
        if (!client) return;

        this.editingClient = email;
        document.getElementById('clientModalTitle').textContent = 'Modifica Cliente';

        if (client.nome && client.nome.trim()) {
            this.setClientType('persona');
            document.getElementById('clientNome').value = client.nome;
            document.getElementById('clientCognome').value = client.cognome;
            document.getElementById('clientDenominazione').value = '';
        } else {
            this.setClientType('denominazione');
            document.getElementById('clientDenominazione').value = client.cognome;
            document.getElementById('clientNome').value = '';
            document.getElementById('clientCognome').value = '';
        }

        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientEmail').disabled = false;
        document.getElementById('clientTelefono').value = client.telefono || '';
        document.getElementById('clientPassword').value = '';
        document.getElementById('clientPassword').required = false;
        document.getElementById('clientPasswordHint').textContent = 'Lascia vuoto per non cambiare. Usa il pulsante chiave per gestione avanzata.';
        document.getElementById('clientPasswordGroup').classList.remove('hidden');
        document.getElementById('clientError').classList.add('hidden');
        document.getElementById('clientModal').classList.add('active');
    },

    hideClientModal() {
        document.getElementById('clientModal').classList.remove('active');
        this.editingClient = null;
    },

    // Salva cliente (nuovo o modifica)
    async saveClient(e) {
        e.preventDefault();

        const data = {
            email: document.getElementById('clientEmail').value.trim(),
            telefono: document.getElementById('clientTelefono').value.trim(),
            password: document.getElementById('clientPassword').value
        };

        if (this.clientType === 'denominazione') {
            data.denominazione = document.getElementById('clientDenominazione').value.trim();
            data.nome = '';
            data.cognome = data.denominazione;
        } else {
            data.nome = document.getElementById('clientNome').value.trim();
            data.cognome = document.getElementById('clientCognome').value.trim();
        }

        const errorEl = document.getElementById('clientError');
        const errorText = document.getElementById('clientErrorText');
        const btn = document.getElementById('clientSaveBtn');

        errorEl.classList.add('hidden');
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Salvataggio...';

        let result;
        if (this.editingClient) {
            if (!data.password) delete data.password;
            data.originalEmail = this.editingClient;
            result = await this.adminApiCall('updateClient', data);
        } else {
            if (!data.password) {
                errorText.textContent = 'La password e\' obbligatoria';
                errorEl.classList.remove('hidden');
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Salva';
                return;
            }
            result = await this.adminApiCall('createClient', data);
        }

        if (result.success) {
            Toast.success(this.editingClient ? 'Cliente aggiornato' : 'Cliente creato con successo');
            this.hideClientModal();
            this.loadClients();
        } else {
            errorText.textContent = result.error || 'Errore nel salvataggio';
            errorEl.classList.remove('hidden');
        }

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Salva';
    },

    // Toggle stato attivo/disattivo
    async toggleClientStatus(email, active) {
        const result = await this.adminApiCall('updateClient', { email, active });
        if (result.success) {
            Toast.success(`Cliente ${active ? 'attivato' : 'disattivato'}`);
            this.loadClients();
        } else {
            Toast.error(result.error || 'Errore');
        }
    },

    // Conferma eliminazione
    confirmDeleteClient(email) {
        const client = this.clients.find(c => c.email === email);
        if (!client) return;

        document.getElementById('deleteClientName').textContent =
            `${client.cognome} ${client.nome}`;
        document.getElementById('deleteClientEmail').textContent = email;
        document.getElementById('deleteConfirmBtn').onclick = () => this.deleteClient(email);
        document.getElementById('deleteModal').classList.add('active');
    },

    hideDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
    },

    async deleteClient(email) {
        const result = await this.adminApiCall('deleteClient', { email });
        if (result.success) {
            Toast.success('Cliente eliminato');
            this.hideDeleteModal();
            this.loadClients();
        } else {
            Toast.error(result.error || 'Errore nell\'eliminazione');
        }
    },

    // ====== PASSWORD MANAGEMENT ======

    showPasswordSetModal(email) {
        const client = this.clients.find(c => c.email === email);
        if (!client) return;

        this.passwordSetEmail = email;
        document.getElementById('pwdSetClientName').textContent = `${client.cognome} ${client.nome}`;
        document.getElementById('pwdSetClientEmail').textContent = email;
        document.getElementById('pwdSetValue').value = '';
        document.getElementById('pwdSetError').classList.add('hidden');
        document.getElementById('pwdGenerated').classList.add('hidden');
        document.getElementById('pwdSendEmail').checked = true;
        document.getElementById('pwdForceChange').checked = true;
        document.getElementById('passwordSetModal').classList.add('active');
        lucide.createIcons({ nodes: [document.getElementById('passwordSetModal')] });
    },

    hidePasswordSetModal() {
        document.getElementById('passwordSetModal').classList.remove('active');
        this.passwordSetEmail = null;
    },

    generateRandomPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById('pwdSetValue').value = password;

        // Mostra area generata
        document.getElementById('pwdGeneratedValue').textContent = password;
        document.getElementById('pwdGenerated').classList.remove('hidden');
        lucide.createIcons({ nodes: [document.getElementById('pwdGenerated')] });
    },

    copyPassword() {
        const pwd = document.getElementById('pwdGeneratedValue').textContent;
        navigator.clipboard.writeText(pwd).then(() => {
            Toast.success('Password copiata negli appunti');
        }).catch(() => {
            // Fallback
            const temp = document.createElement('textarea');
            temp.value = pwd;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            Toast.success('Password copiata');
        });
    },

    async saveNewPassword() {
        if (!this.passwordSetEmail) return;

        const password = document.getElementById('pwdSetValue').value.trim();
        const sendEmail = document.getElementById('pwdSendEmail').checked;
        const forceChange = document.getElementById('pwdForceChange').checked;
        const errorEl = document.getElementById('pwdSetError');
        const errorText = document.getElementById('pwdSetErrorText');

        if (password.length < 6) {
            errorText.textContent = 'La password deve avere almeno 6 caratteri';
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        const btn = document.getElementById('pwdSetSaveBtn');
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Salvataggio...';

        try {
            const result = await this.adminApiCall('adminSetPassword', {
                email: this.passwordSetEmail,
                newPassword: password,
                sendEmail: sendEmail,
                mustChangePassword: forceChange
            });

            if (result.success) {
                Toast.success(`Password ${sendEmail ? 'impostata e inviata' : 'impostata'} con successo`);
                this.hidePasswordSetModal();
                this.loadClients();
            } else {
                errorText.textContent = result.error || 'Errore nel salvataggio';
                errorEl.classList.remove('hidden');
            }
        } catch (err) {
            errorText.textContent = 'Errore di connessione';
            errorEl.classList.remove('hidden');
        }

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Salva Password';
    },

    // ====== TASKS ======

    async loadTasks() {
        const result = await this.adminApiGet('getTasks');
        if (result.success) {
            this.tasks = result.tasks || [];
            this.renderAdminTasks();
            this.updateStats();
        }
    },

    renderAdminTasks() {
        const container = document.getElementById('adminTaskList');
        const empty = document.getElementById('tasksEmpty');
        if (!container || !empty) return;

        // Applica filtri
        const clientFilter = document.getElementById('taskClientFilter')?.value || '';
        const statusFilter = document.getElementById('taskStatusFilter')?.value || '';

        let filtered = [...this.tasks];
        if (clientFilter) filtered = filtered.filter(t => t.clientEmail === clientFilter);
        if (statusFilter) filtered = filtered.filter(t => t.status === statusFilter);

        // Ordina: pendenti prima, poi per data decrescente
        filtered.sort((a, b) => {
            if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (filtered.length === 0) {
            empty.classList.remove('hidden');
            container.innerHTML = '';
            return;
        }

        empty.classList.add('hidden');

        const priorityLabels = { alta: 'Alta', media: 'Media', bassa: 'Bassa' };

        container.innerHTML = filtered.map(task => {
            const client = this.clients.find(c => c.email === task.clientEmail);
            const clientName = client ? `${client.cognome} ${client.nome}` : task.clientEmail;
            const isCompleted = task.status === 'completed';
            const deadlineStr = task.deadline ? formatDate(task.deadline) : '';
            const isOverdue = task.deadline && !isCompleted && new Date(task.deadline) < new Date();

            return `
            <div class="task-card ${isCompleted ? 'completed' : ''}">
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.description)}</div>
                    <div class="task-meta">
                        <span class="task-meta-item">
                            <i data-lucide="user" style="width:12px;height:12px;"></i>
                            ${this.escapeHtml(clientName)}
                        </span>
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
                        <span class="task-status-badge ${task.status}">${isCompleted ? 'Completato' : 'Pendente'}</span>
                        ${isCompleted && task.completedAt ? `
                        <span class="task-meta-item" style="color:var(--color-success);">
                            <i data-lucide="check-circle" style="width:12px;height:12px;"></i>
                            Completato: ${formatDate(task.completedAt)}
                        </span>` : ''}
                    </div>
                </div>
                <div style="flex-shrink:0;">
                    <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.deleteTask('${task.id}')" title="Elimina task" style="color:var(--color-error);">
                        <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

        lucide.createIcons({ nodes: [container] });
    },

    filterTasks() {
        this.renderAdminTasks();
    },

    showTaskModal() {
        document.getElementById('taskForm').reset();
        document.getElementById('taskError').classList.add('hidden');
        // Popola lista checkbox clienti
        this.populateTaskClientFilter();
        // Reset tutte le checkbox
        document.querySelectorAll('.task-client-cb').forEach(cb => cb.checked = false);
        this.updateTaskClientCount();
        document.getElementById('taskModal').classList.add('active');
        lucide.createIcons({ nodes: [document.getElementById('taskModal')] });
    },

    hideTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
    },

    // Contatore clienti selezionati
    updateTaskClientCount() {
        const checked = document.querySelectorAll('.task-client-cb:checked');
        const countEl = document.getElementById('taskClientCount');
        if (countEl) countEl.textContent = checked.length + ' client' + (checked.length === 1 ? 'e selezionato' : 'i selezionati');
    },

    // Seleziona/deseleziona tutti
    toggleAllTaskClients(state) {
        document.querySelectorAll('.task-client-cb').forEach(cb => cb.checked = state);
        this.updateTaskClientCount();
    },

    async saveTask(e) {
        e.preventDefault();

        // Raccogli clienti selezionati
        const checkedBoxes = document.querySelectorAll('.task-client-cb:checked');
        const selectedClients = Array.from(checkedBoxes).map(cb => ({
            email: cb.value,
            name: cb.dataset.name || cb.value
        }));

        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const deadline = document.getElementById('taskDeadline').value;
        const errorEl = document.getElementById('taskError');
        const errorText = document.getElementById('taskErrorText');

        if (selectedClients.length === 0 || !description) {
            errorText.textContent = 'Seleziona almeno un cliente e inserisci una descrizione';
            errorEl.classList.remove('hidden');
            return;
        }

        errorEl.classList.add('hidden');
        const btn = document.getElementById('taskSaveBtn');
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Invio a ' + selectedClients.length + ' client' + (selectedClients.length === 1 ? 'e' : 'i') + '...';

        let successes = 0;
        let failures = 0;

        for (const client of selectedClients) {
            try {
                const result = await this.adminApiCall('createTask', {
                    clientEmail: client.email,
                    clientName: client.name,
                    description,
                    priority,
                    deadline: deadline || null
                });
                if (result.success) {
                    successes++;
                } else {
                    failures++;
                }
            } catch (err) {
                failures++;
            }
        }

        if (successes > 0) {
            Toast.success('Task inviato a ' + successes + ' client' + (successes === 1 ? 'e' : 'i') + (failures > 0 ? ' (' + failures + ' errori)' : ''));
            this.hideTaskModal();
            this.loadTasks();
        } else {
            errorText.textContent = 'Errore nell\'invio. Nessun task creato.';
            errorEl.classList.remove('hidden');
        }

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Invia Task';
    },

    async deleteTask(taskId) {
        if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

        try {
            const result = await this.adminApiCall('deleteTask', { taskId });
            if (result.success) {
                Toast.success('Task eliminato');
                this.loadTasks();
            } else {
                Toast.error(result.error || 'Errore nell\'eliminazione');
            }
        } catch (err) {
            Toast.error('Errore di connessione');
        }
    },

    // ====== LOG CARICAMENTI ======

    async loadLogs() {
        const result = await this.adminApiGet('getUploadLogs');
        if (result.success) {
            this.uploadLogs = result.logs || [];
            this.renderLogs();
            this.updateStats();
        }
    },

    renderLogs(filter = null) {
        const tbody = document.getElementById('logsBody');
        const empty = document.getElementById('logsEmpty');
        const table = document.getElementById('logsTable');

        let logs = this.uploadLogs;
        if (filter) {
            logs = logs.filter(l => l.clientEmail === filter || l.category === filter);
        }

        // Ordina per data decrescente
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (logs.length === 0) {
            empty.classList.remove('hidden');
            table.classList.add('hidden');
            return;
        }

        empty.classList.add('hidden');
        table.classList.remove('hidden');

        const categoryLabels = {};
        CONFIG.CATEGORIES.forEach(c => { categoryLabels[c.id] = c.label; });

        tbody.innerHTML = logs.map(log => {
            let dateDisplay = '-';
            try { dateDisplay = formatDate(log.timestamp); } catch(e) { dateDisplay = String(log.timestamp || '-'); }
            return `
            <tr>
                <td style="font-size:0.8rem;white-space:nowrap;">${dateDisplay}</td>
                <td style="color:var(--color-text);font-weight:500;">${this.escapeHtml(log.clientName || log.clientEmail || '-')}</td>
                <td style="max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${this.escapeHtml(log.originalName || log.fileName || '')}">
                    ${this.escapeHtml(log.originalName || log.fileName || '-')}
                </td>
                <td><span class="badge badge-neutral">${this.escapeHtml(categoryLabels[log.category] || log.category || '-')}</span></td>
                <td>
                    ${log.fileId ? `<a href="https://drive.google.com/file/d/${log.fileId}/view" target="_blank" class="btn btn-icon btn-ghost btn-sm" title="Apri su Drive" style="color:var(--color-accent);"><i data-lucide="external-link" style="width:14px;height:14px;"></i></a>` : '-'}
                </td>
            </tr>`;
        }).join('');

        lucide.createIcons({ nodes: [tbody] });
    },

    filterLogs() {
        const clientFilter = document.getElementById('logClientFilter').value;
        this.renderLogs(clientFilter || null);
    },

    // ====== IMPOSTAZIONI ======

    settings: {},

    async loadSettings() {
        const result = await this.adminApiGet('getSettings');
        if (result.success) {
            this.settings = result.settings || {};
            this.renderSettings();
        }
    },

    renderSettings() {
        document.getElementById('notificationEmail').value =
            this.settings.notification_email || 'info@studiobalsamo.com';

        const extensions = (this.settings.allowed_extensions || 'pdf,doc,docx,csv,xls,xlsx,jpg,jpeg,png').split(',');
        this.renderExtensions(extensions);
    },

    renderExtensions(extensions) {
        const container = document.getElementById('extensionTags');
        container.innerHTML = extensions.map(ext => `
            <span class="extension-tag">
                .${ext.trim()}
                <button class="remove-ext" onclick="Admin.removeExtension('${ext.trim()}')">&times;</button>
            </span>
        `).join('');
    },

    addExtension() {
        const input = document.getElementById('newExtension');
        const ext = input.value.trim().toLowerCase().replace(/^\./, '');
        if (!ext) return;

        const current = (this.settings.allowed_extensions || '').split(',').map(e => e.trim());
        if (current.includes(ext)) {
            Toast.warning(`Estensione .${ext} gia' presente`);
            return;
        }

        current.push(ext);
        this.settings.allowed_extensions = current.join(',');
        this.renderExtensions(current);
        input.value = '';
    },

    removeExtension(ext) {
        const current = (this.settings.allowed_extensions || '').split(',')
            .map(e => e.trim())
            .filter(e => e !== ext);
        this.settings.allowed_extensions = current.join(',');
        this.renderExtensions(current);
    },

    async saveSettings() {
        const email = document.getElementById('notificationEmail').value.trim();
        const btn = document.getElementById('saveSettingsBtn');

        btn.disabled = true;
        btn.querySelector('span').textContent = 'Salvataggio...';

        const result = await this.adminApiCall('updateSettings', {
            settings: {
                notification_email: email,
                allowed_extensions: this.settings.allowed_extensions
            }
        });

        if (result.success) {
            Toast.success('Impostazioni salvate');
        } else {
            Toast.error(result.error || 'Errore nel salvataggio');
        }

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Salva Impostazioni';
    },

    // ====== PAROLE CHIAVE (KEYWORDS) ======

    async loadKeywords() {
        const result = await apiCall('getKeywords', {}, 'GET');
        if (result.success) {
            this.keywords = result.keywords || [];
            this.renderKeywords();
        }
    },

    renderKeywords() {
        const tbody = document.getElementById('keywordsBody');
        const empty = document.getElementById('keywordsEmpty');
        const tableContainer = document.getElementById('keywordsTableContainer');
        if (!tbody || !empty || !tableContainer) return;

        if (this.keywords.length === 0) {
            empty.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            return;
        }

        empty.classList.add('hidden');
        tableContainer.classList.remove('hidden');

        tbody.innerHTML = this.keywords.map((kw, index) => {
            const safeUrl = this.escapeHtml(kw.url);
            const truncatedUrl = kw.url.length > 50
                ? kw.url.substring(0, 50) + '...'
                : kw.url;
            return `
            <tr>
                <td>
                    <code style="background:var(--color-accent-glow);color:var(--color-accent);padding:2px 8px;border-radius:4px;font-size:0.85rem;font-weight:600;">
                        ${this.escapeHtml(kw.keyword)}
                    </code>
                </td>
                <td style="color:var(--color-text-secondary);font-size:0.85rem;">
                    ${this.escapeHtml(kw.label || '-')}
                </td>
                <td class="hide-mobile" style="font-size:0.75rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${safeUrl}">
                    <a href="${safeUrl}" target="_blank" style="color:var(--color-accent);">
                        ${this.escapeHtml(truncatedUrl)}
                    </a>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.editKeyword(${index})" title="Modifica">
                            <i data-lucide="pencil" style="width:16px;height:16px;"></i>
                        </button>
                        <button class="btn btn-icon btn-ghost btn-sm" onclick="Admin.deleteKeyword(${index})" title="Elimina" style="color:var(--color-error);">
                            <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        lucide.createIcons({ nodes: [tbody] });
    },

    showKeywordModal(editIndex) {
        this.editingKeywordIndex = (editIndex !== undefined && editIndex >= 0) ? editIndex : -1;
        const form = document.getElementById('keywordForm');
        const title = document.getElementById('keywordModalTitle');
        const errorEl = document.getElementById('keywordFormError');

        form.reset();
        errorEl.classList.add('hidden');

        if (this.editingKeywordIndex >= 0 && this.keywords[this.editingKeywordIndex]) {
            const kw = this.keywords[this.editingKeywordIndex];
            title.innerHTML = '<i data-lucide="key" style="width:18px;height:18px;vertical-align:-3px;margin-right:8px;color:var(--color-accent);"></i> Modifica Parola Chiave';
            document.getElementById('kwKeyword').value = kw.keyword;
            document.getElementById('kwLabel').value = kw.label || '';
            document.getElementById('kwUrl').value = kw.url;
        } else {
            title.innerHTML = '<i data-lucide="key" style="width:18px;height:18px;vertical-align:-3px;margin-right:8px;color:var(--color-accent);"></i> Nuova Parola Chiave';
        }

        document.getElementById('keywordModal').classList.add('active');
        lucide.createIcons({ nodes: [document.getElementById('keywordModal')] });
    },

    hideKeywordModal() {
        document.getElementById('keywordModal').classList.remove('active');
        this.editingKeywordIndex = -1;
    },

    editKeyword(index) {
        this.showKeywordModal(index);
    },

    async deleteKeyword(index) {
        const kw = this.keywords[index];
        if (!kw) return;

        if (!confirm('Eliminare la parola chiave "' + kw.keyword + '"?')) return;

        this.keywords.splice(index, 1);
        await this.saveKeywordsToBackend();
    },

    async saveKeyword(e) {
        e.preventDefault();

        const keyword = document.getElementById('kwKeyword').value.trim().toLowerCase();
        const label = document.getElementById('kwLabel').value.trim();
        const url = document.getElementById('kwUrl').value.trim();
        const errorEl = document.getElementById('keywordFormError');
        const errorText = document.getElementById('keywordFormErrorText');
        const btn = document.getElementById('kwSaveBtn');

        errorEl.classList.add('hidden');

        if (!keyword) {
            errorText.textContent = 'La parola chiave e\' obbligatoria';
            errorEl.classList.remove('hidden');
            return;
        }

        if (!url) {
            errorText.textContent = 'L\'URL e\' obbligatorio';
            errorEl.classList.remove('hidden');
            return;
        }

        // Controlla duplicati (escluso quello in modifica)
        const duplicateIndex = this.keywords.findIndex((kw, i) =>
            kw.keyword === keyword && i !== this.editingKeywordIndex
        );
        if (duplicateIndex >= 0) {
            errorText.textContent = 'Questa parola chiave esiste gia\'';
            errorEl.classList.remove('hidden');
            return;
        }

        const entry = { keyword: keyword, label: label, url: url };

        if (this.editingKeywordIndex >= 0) {
            this.keywords[this.editingKeywordIndex] = entry;
        } else {
            this.keywords.push(entry);
        }

        btn.disabled = true;
        btn.querySelector('span').textContent = 'Salvataggio...';

        const success = await this.saveKeywordsToBackend();

        btn.disabled = false;
        btn.querySelector('span').textContent = 'Salva';

        if (success) {
            this.hideKeywordModal();
        }
    },

    async saveKeywordsToBackend() {
        const result = await this.adminApiCall('updateKeywords', { keywords: this.keywords });

        if (result.success) {
            Toast.success('Parole chiave aggiornate');
            this.renderKeywords();
            return true;
        } else {
            Toast.error(result.error || 'Errore nel salvataggio delle parole chiave');
            await this.loadKeywords();
            return false;
        }
    },

    // ====== DOCUMENTI CLIENTE ======

    docsClientEmail: null,

    viewClientDocs(email) {
        const client = this.clients.find(c => c.email === email);
        if (!client) return;

        this.docsClientEmail = email;
        document.getElementById('docsClientName').textContent = `${client.cognome} ${client.nome}`;

        // Popola filtro categorie
        const filterSelect = document.getElementById('docsCategoryFilter');
        filterSelect.innerHTML = '<option value="">Tutte le categorie</option>';
        CONFIG.CATEGORIES.forEach(cat => {
            filterSelect.innerHTML += `<option value="${cat.id}">${cat.label}</option>`;
        });
        filterSelect.value = '';

        // Link alla cartella Drive
        const driveLink = document.getElementById('docsDriveLink');
        if (client.folderId) {
            driveLink.href = `https://drive.google.com/drive/folders/${client.folderId}`;
            driveLink.style.display = '';
        } else {
            driveLink.style.display = 'none';
        }

        this.renderClientDocs(email);
        this.renderMissingDocsPanel(email);

        document.getElementById('docsModal').classList.add('active');
        lucide.createIcons({ nodes: [document.getElementById('docsModal')] });
    },

    renderClientDocs(email, categoryFilter) {
        const tbody = document.getElementById('docsBody');
        const empty = document.getElementById('docsEmpty');
        const tableContainer = document.getElementById('docsTableContainer');
        const countEl = document.getElementById('docsCount');

        let docs = this.uploadLogs.filter(l => l.clientEmail === email);
        if (categoryFilter) {
            docs = docs.filter(l => l.category === categoryFilter);
        }

        docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (docs.length === 0) {
            empty.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            countEl.textContent = '';
            return;
        }

        empty.classList.add('hidden');
        tableContainer.classList.remove('hidden');

        const categoryLabels = {};
        CONFIG.CATEGORIES.forEach(c => { categoryLabels[c.id] = c.label; });

        tbody.innerHTML = docs.map(doc => `
            <tr>
                <td style="font-size:0.8rem;white-space:nowrap;">${formatDate(doc.timestamp)}</td>
                <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--color-text);" title="${this.escapeHtml(doc.originalName || doc.fileName)}">
                    ${this.escapeHtml(doc.originalName || doc.fileName)}
                </td>
                <td><span class="badge badge-neutral">${this.escapeHtml(categoryLabels[doc.category] || doc.category)}</span></td>
                <td>
                    ${doc.fileId ? `<a href="https://drive.google.com/file/d/${doc.fileId}/view" target="_blank" class="btn btn-icon btn-ghost btn-sm" title="Apri su Drive" style="color:var(--color-accent);"><i data-lucide="external-link" style="width:14px;height:14px;"></i></a>` : '-'}
                </td>
            </tr>
        `).join('');

        countEl.textContent = `${docs.length} documento${docs.length !== 1 ? 'i' : ''}`;
        lucide.createIcons({ nodes: [tbody] });
    },

    renderMissingDocsPanel(email) {
        const container = document.getElementById('missingDocsList');
        if (!container) return;

        const clientDocs = this.uploadLogs.filter(l => l.clientEmail === email);
        const categoriesWithDocs = new Set(clientDocs.map(d => d.category));

        container.innerHTML = CONFIG.CATEGORIES.map(cat => {
            const hasDocs = categoriesWithDocs.has(cat.id);
            return `
                <label>
                    <input type="checkbox" name="missingCat" value="${cat.id}" ${!hasDocs ? 'checked' : ''}>
                    ${cat.label} ${!hasDocs ? '<span style="color:var(--color-warning);font-size:0.75rem;">(mancante)</span>' : ''}
                </label>
            `;
        }).join('');
    },

    async sendMissingDocsEmail() {
        if (!this.docsClientEmail) return;

        const checkboxes = document.querySelectorAll('input[name="missingCat"]:checked');
        const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

        if (selectedCategories.length === 0) {
            Toast.warning('Seleziona almeno una categoria');
            return;
        }

        const client = this.clients.find(c => c.email === this.docsClientEmail);
        if (!client) return;

        const btn = document.getElementById('sendMissingDocsBtn');
        btn.disabled = true;
        btn.textContent = 'Invio in corso...';

        try {
            const categoryLabels = {};
            CONFIG.CATEGORIES.forEach(c => { categoryLabels[c.id] = c.label; });
            const missingLabels = selectedCategories.map(id => categoryLabels[id] || id);

            const result = await this.adminApiCall('sendMissingDocsEmail', {
                email: this.docsClientEmail,
                clientName: `${client.cognome} ${client.nome}`,
                missingCategories: missingLabels
            });

            if (result.success) {
                Toast.success(`Email inviata a ${this.docsClientEmail}`);
            } else {
                Toast.error(result.error || 'Errore nell\'invio email');
            }
        } catch (err) {
            Toast.error('Errore di connessione');
        }

        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="send" style="width:14px;height:14px;"></i> Invia richiesta via email';
        lucide.createIcons({ nodes: [btn] });
    },

    filterClientDocs() {
        const category = document.getElementById('docsCategoryFilter').value;
        this.renderClientDocs(this.docsClientEmail, category || null);
    },

    hideDocsModal() {
        document.getElementById('docsModal').classList.remove('active');
        this.docsClientEmail = null;
    },

    // ====== STATS ======

    updateStats() {
        document.getElementById('statClients').textContent = this.clients.length;
        document.getElementById('statActive').textContent =
            this.clients.filter(c => c.active === true || c.active === 'TRUE').length;
        document.getElementById('statUploads').textContent = this.uploadLogs.length;

        const pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
        const statTasksEl = document.getElementById('statTasks');
        if (statTasksEl) statTasksEl.textContent = pendingTasks;

        this.renderCategoryStats();
    },

    renderCategoryStats() {
        const container = document.getElementById('categoryBreakdown');
        const wrapper = document.getElementById('categoryStats');
        if (!container || !wrapper) return;

        if (this.uploadLogs.length === 0) {
            wrapper.style.display = 'none';
            return;
        }

        wrapper.style.display = '';

        const categoryLabels = {};
        CONFIG.CATEGORIES.forEach(c => { categoryLabels[c.id] = c.label; });

        const counts = {};
        this.uploadLogs.forEach(log => {
            const cat = log.category || 'altro';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        const total = this.uploadLogs.length;

        container.innerHTML = Object.keys(counts).map(cat => {
            const label = categoryLabels[cat] || cat;
            const count = counts[cat];
            const pct = Math.round((count / total) * 100);
            return `
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                            <span style="font-size:0.8rem;color:var(--color-text-secondary);">${label}</span>
                            <span style="font-size:0.8rem;font-weight:600;color:var(--color-text);">${count}</span>
                        </div>
                        <div style="height:4px;background:rgba(0,0,0,0.04);border-radius:2px;overflow:hidden;">
                            <div style="height:100%;width:${pct}%;background:var(--color-accent);border-radius:2px;transition:width 0.5s ease;"></div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    // ====== UTILITY ======

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ====== MOBILE ======

    toggleSidebar() {
        document.querySelector('.admin-sidebar').classList.toggle('open');
        document.getElementById('sidebarOverlay').classList.toggle('active');
    },

    closeSidebar() {
        document.querySelector('.admin-sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }
};

// Inizializza
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
