/* ===================================================================
   GDC - Gestore della Crisi — Autenticazione
   =================================================================== */

const Auth = {
    // Ottieni la sessione corrente
    getSession() {
        try {
            const raw = localStorage.getItem(CONFIG.SESSION_KEY);
            if (!raw) return null;

            const session = JSON.parse(raw);
            if (Date.now() > session.expires) {
                this.logout();
                return null;
            }
            return session;
        } catch {
            localStorage.removeItem(CONFIG.SESSION_KEY);
            return null;
        }
    },

    // Salva la sessione
    setSession(data) {
        const session = {
            token: data.token,
            email: data.email,
            nome: data.nome,
            cognome: data.cognome,
            folderId: data.folderId,
            mustChangePassword: data.mustChangePassword || false,
            expires: Date.now() + CONFIG.SESSION_DURATION
        };
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(session));
    },

    // Login
    async login(email, password) {
        const result = await apiCall('login', { email, password });

        if (result.success) {
            this.setSession(result);
            return { success: true, mustChangePassword: result.mustChangePassword || false };
        }

        return { success: false, error: result.error || 'Credenziali non valide' };
    },

    // Logout
    logout() {
        localStorage.removeItem(CONFIG.SESSION_KEY);
        window.location.href = 'index.html';
    },

    // Verifica autenticazione (redirect se non autenticato)
    requireAuth() {
        const session = this.getSession();
        if (!session) {
            window.location.href = 'index.html';
            return null;
        }
        return session;
    },

    // Cambio password
    async changePassword(currentPassword, newPassword) {
        const session = this.getSession();
        if (!session) return { success: false, error: 'Sessione scaduta' };

        const result = await apiCall('changePassword', {
            token: session.token,
            email: session.email,
            currentPassword,
            newPassword
        });

        // Se il cambio password ha successo, aggiorna il flag nella sessione
        if (result.success) {
            const updatedSession = this.getSession();
            if (updatedSession) {
                updatedSession.mustChangePassword = false;
                localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(updatedSession));
            }
        }

        return result;
    },

    // Ottieni nome completo
    getFullName() {
        const session = this.getSession();
        if (!session) return '';
        return `${session.nome} ${session.cognome}`;
    }
};
