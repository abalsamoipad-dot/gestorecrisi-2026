import { type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { Button } from '@/components/ui/Button';
import {
  FORMSPREE_URL,
  ROLE_OPTIONS,
  OBJECTIVE_OPTIONS,
  URGENCY_OPTIONS,
  CRITICALITIES,
} from '@/constants';

// ── Shared Styles ────────────────────────────────────────────────────────────

const inputBaseStyle: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: '#fff',
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  fontSize: '15px',
  lineHeight: 1.5,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle: CSSProperties = {
  display: 'block',
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  fontSize: '13px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.8)',
  marginBottom: '8px',
};

const groupStyle: CSSProperties = {
  marginBottom: '20px',
};

/**
 * Contact section with a two-column layout on dark background.
 * Left column: info text with expectations list.
 * Right column: glassmorphism contact form posting to Formspree.
 */
export function Contact() {
  const responsiveId = 'contact-layout';
  const emailPhoneId = 'contact-email-phone';
  const criticalitiesId = 'contact-criticalities';

  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    position: 'relative',
    overflow: 'hidden',
    background: [
      'radial-gradient(ellipse at 70% 30%, rgba(0,95,115,0.35) 0%, transparent 50%)',
      'radial-gradient(ellipse at 20% 80%, rgba(72,202,228,0.1) 0%, transparent 40%)',
      'var(--neutral-950, #0a0f14)',
    ].join(', '),
  };

  const headingStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: 'clamp(2rem, 5vw, 2.6rem)',
    fontWeight: 700,
    color: '#fff',
    textAlign: 'left',
    marginBottom: '20px',
    lineHeight: 1.2,
  };

  const descStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '30px',
  };

  const subheadStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  };

  const listStyle: CSSProperties = {
    margin: '15px 0 30px 20px',
    listStyleType: 'disc',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '15px',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.7)',
  };

  const footnoteStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.5)',
  };

  const glassStyle: CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '48px',
  };

  const selectStyle: CSSProperties = {
    ...inputBaseStyle,
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '40px',
    cursor: 'pointer',
  };

  const checkboxLabelStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
  };

  const checkboxStyle: CSSProperties = {
    width: '16px',
    height: '16px',
    accentColor: 'var(--accent-400, #48cae4)',
    flexShrink: 0,
  };

  const privacyWrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '24px',
  };

  const privacyTextStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '12px',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.5)',
  };

  const privacyLinkStyle: CSSProperties = {
    color: 'var(--accent-400, #48cae4)',
    textDecoration: 'underline',
  };

  // Focus handler for inputs - applied via inline onFocus/onBlur
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent-400, #48cae4)';
    e.target.style.boxShadow = '0 0 0 3px rgba(72,202,228,0.15)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section id="contact" style={sectionStyle}>
      {/* Responsive layout styles */}
      <style>{`
        #${responsiveId} {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          #${responsiveId} {
            grid-template-columns: 1fr;
            gap: 50px;
          }
        }
        #${emailPhoneId} {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          #${emailPhoneId} {
            grid-template-columns: 1fr;
          }
        }
        #${criticalitiesId} {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (max-width: 480px) {
          #${criticalitiesId} {
            grid-template-columns: 1fr;
          }
        }
        /* Style select option dropdowns with dark bg */
        #contact option {
          background: #1f2937;
          color: #fff;
        }
        /* Placeholder color for inputs */
        #contact input::placeholder,
        #contact textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }
        #contact select {
          color: #fff;
        }
      `}</style>

      <Container>
        <div id={responsiveId}>
          {/* LEFT COLUMN - Info */}
          <RevealOnScroll direction="left">
            <div>
              <h2 style={headingStyle}>Inizia la tua valutazione riservata</h2>
              <p style={descStyle}>
                Il primo passo verso il risanamento &egrave; una diagnosi onesta.
                Compila il modulo per qualificare la tua richiesta.
              </p>
              <p style={subheadStyle}>Cosa aspettarsi:</p>
              <ul style={listStyle}>
                <li>Contatto iniziale confidenziale entro 48h</li>
                <li>Mappatura preliminare delle criticit&agrave;</li>
                <li>Analisi delle opzioni CCII applicabili</li>
              </ul>
              <p style={footnoteStyle}>
                Le sedi operative (FI, CL, AG) ricevono esclusivamente su appuntamento.
              </p>
            </div>
          </RevealOnScroll>

          {/* RIGHT COLUMN - Form */}
          <RevealOnScroll direction="right">
            <div style={glassStyle}>
              <form
                action={FORMSPREE_URL}
                method="POST"
              >
                {/* Hidden fields */}
                <input type="hidden" name="_subject" value="Nuova richiesta dal sito GestoreCrisi" />
                <input type="hidden" name="_next" value="/grazie.html" />
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                {/* Nome */}
                <div style={groupStyle}>
                  <label htmlFor="contact-name" style={labelStyle}>Nome e Cognome *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="nome"
                    required
                    placeholder="es. Mario Rossi"
                    style={inputBaseStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Azienda */}
                <div style={groupStyle}>
                  <label htmlFor="contact-company" style={labelStyle}>Azienda *</label>
                  <input
                    id="contact-company"
                    type="text"
                    name="azienda"
                    required
                    placeholder="es. Rossi S.r.l."
                    style={inputBaseStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Email + Telefono */}
                <div id={emailPhoneId}>
                  <div style={groupStyle}>
                    <label htmlFor="contact-email" style={labelStyle}>Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      placeholder="email@azienda.it"
                      style={inputBaseStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div style={groupStyle}>
                    <label htmlFor="contact-phone" style={labelStyle}>Telefono</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="telefono"
                      placeholder="+39 ..."
                      style={inputBaseStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                {/* Ruolo */}
                <div style={groupStyle}>
                  <label htmlFor="contact-role" style={labelStyle}>Il tuo ruolo</label>
                  <select
                    id="contact-role"
                    name="ruolo"
                    style={selectStyle}
                    onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                    onBlur={handleBlur as React.FocusEventHandler<HTMLSelectElement>}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Criticità */}
                <div style={groupStyle}>
                  <span style={labelStyle}>Aree di criticit&agrave;</span>
                  <div id={criticalitiesId}>
                    {CRITICALITIES.map((crit) => (
                      <label key={crit.name} style={checkboxLabelStyle}>
                        <input
                          type="checkbox"
                          name={crit.name}
                          value="Sì"
                          style={checkboxStyle}
                        />
                        {crit.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Obiettivo */}
                <div style={groupStyle}>
                  <label htmlFor="contact-objective" style={labelStyle}>Obiettivo principale</label>
                  <select
                    id="contact-objective"
                    name="obiettivo"
                    style={selectStyle}
                    onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                    onBlur={handleBlur as React.FocusEventHandler<HTMLSelectElement>}
                  >
                    {OBJECTIVE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Urgenza */}
                <div style={groupStyle}>
                  <label htmlFor="contact-urgency" style={labelStyle}>Urgenza</label>
                  <select
                    id="contact-urgency"
                    name="urgenza"
                    style={selectStyle}
                    onFocus={handleFocus as React.FocusEventHandler<HTMLSelectElement>}
                    onBlur={handleBlur as React.FocusEventHandler<HTMLSelectElement>}
                  >
                    {URGENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messaggio */}
                <div style={groupStyle}>
                  <label htmlFor="contact-message" style={labelStyle}>Messaggio</label>
                  <textarea
                    id="contact-message"
                    name="messaggio"
                    placeholder="Descrivi brevemente la situazione della tua azienda..."
                    rows={4}
                    style={{
                      ...inputBaseStyle,
                      minHeight: '100px',
                      resize: 'vertical',
                    }}
                    onFocus={handleFocus as React.FocusEventHandler<HTMLTextAreaElement>}
                    onBlur={handleBlur as React.FocusEventHandler<HTMLTextAreaElement>}
                  />
                </div>

                {/* Privacy */}
                <div style={privacyWrapperStyle}>
                  <input
                    type="checkbox"
                    id="contact-privacy"
                    name="privacy"
                    required
                    style={{
                      ...checkboxStyle,
                      marginTop: '2px',
                    }}
                  />
                  <label htmlFor="contact-privacy" style={privacyTextStyle}>
                    Acconsento al trattamento dei dati personali secondo la{' '}
                    <a href="privacy.html" style={privacyLinkStyle}>
                      Privacy Policy
                    </a>
                    . I dati saranno trattati esclusivamente per rispondere alla richiesta.
                  </label>
                </div>

                {/* Submit */}
                <Button variant="primary" fullWidth type="submit">
                  Invia Richiesta Riservata
                </Button>
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}

export default Contact;
