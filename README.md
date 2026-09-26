# gestoredellacrisi.it

Sito del network Gestore della Crisi: professionisti specializzati nella crisi d'impresa e nella ristrutturazione del debito (Codice della Crisi, D.Lgs. 14/2019).

## Struttura

- `index.html`: la pagina del sito, statica, con stili e script inline. Librerie di movimento (GSAP, ScrollTrigger, Lenis) e font (Google Fonts) caricati da CDN.
- `public/img/`: i quattro sfondi fotografici in bianco e nero.
- `public/area-clienti/`: Area Clienti (login, dashboard, admin) con backend Google Apps Script in `backend/`. Non è linkata dal sito, resta raggiungibile per URL.
- `public/modulo_Ross_group/`: questionario OAC con relativo Apps Script.
- `public/privacy.html`, `public/cookie-policy.html`, `robots.txt`, `sitemap.xml`, `CNAME`.

## Build e deploy

La build è Vite (`npm run build`, output in `dist/`): copia `index.html` e il contenuto di `public/`. Il percorso base è `/gestorecrisi-2026/`, cioè l'indirizzo del progetto su GitHub Pages.

Ogni push su `main` esegue il workflow `.github/workflows/deploy.yml`, che costruisce e pubblica su GitHub Pages: https://abalsamoipad-dot.github.io/gestorecrisi-2026/

Il dominio www.gestoredellacrisi.it è gestito da Aruba e oggi incornicia in un iframe l'indirizzo GitHub Pages.

## Sviluppo locale

```bash
npm ci
npm run dev
```

Nota: `npm ci` non funziona dentro pCloud Drive, che non supporta i link simbolici. Lavorare su una copia in una cartella locale.

Il modulo contatti invia le richieste tramite Formspree.
