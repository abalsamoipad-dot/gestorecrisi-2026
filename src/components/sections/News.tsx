import { useState, useEffect, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import type { NewsItem } from '@/types';

// Google News RSS for "crisi d'impresa" via a CORS proxy
const RSS_URL =
  'https://api.allorigins.win/raw?url=' +
  encodeURIComponent(
    'https://news.google.com/rss/search?q=%22crisi+d%27impresa%22+OR+%22composizione+negoziata%22+OR+%22CCII%22&hl=it&gl=IT&ceid=IT:it'
  );

/**
 * Parse RSS XML and extract news items
 */
function parseRSS(xmlText: string): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');
  const results: NewsItem[] = [];

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent ?? '';
    const link = item.querySelector('link')?.textContent ?? '#';
    const pubDate = item.querySelector('pubDate')?.textContent ?? '';

    // Skip items without title
    if (!title.trim()) return;

    // Clean title: remove " - Source Name" suffix from Google News
    const cleanTitle = title.replace(/\s*-\s*[^-]+$/, '');

    results.push({
      title: cleanTitle,
      date: pubDate ? new Date(pubDate).toISOString().split('T')[0] : '',
      excerpt: `Fonte: ${title.includes(' - ') ? title.split(' - ').pop()?.trim() ?? '' : 'Google News'}`,
      url: link,
    });
  });

  return results;
}

/**
 * Format a relative time string in Italian
 */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays === 1) return 'ieri';
  if (diffDays < 7) return `${diffDays} giorni fa`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sett. fa`;
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * News section: fetches live RSS feed from Google News, falls back to local JSON.
 * Displays a "LIVE" badge when showing real-time feed data.
 */
export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchLiveNews(): Promise<NewsItem[] | null> {
      try {
        const response = await fetch(RSS_URL, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) return null;
        const text = await response.text();
        const items = parseRSS(text);
        return items.length > 0 ? items : null;
      } catch {
        return null;
      }
    }

    async function fetchLocalNews(): Promise<NewsItem[]> {
      const response = await fetch(`${import.meta.env.BASE_URL}news.json`);
      if (!response.ok) throw new Error('Failed to fetch local news');
      return response.json();
    }

    async function loadNews() {
      try {
        // Try live RSS first
        const liveItems = await fetchLiveNews();
        if (cancelled) return;

        if (liveItems && liveItems.length >= 3) {
          // Always show multiples of 3 for balanced grid
          const count = liveItems.length >= 6 ? 6 : 3;
          setNews(liveItems.slice(0, count));
          setIsLive(true);
        } else {
          // Fallback to local JSON
          const localItems = await fetchLocalNews();
          if (cancelled) return;
          const sorted = [...localItems].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setNews(sorted.slice(0, 3));
          setIsLive(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNews();
    return () => { cancelled = true; };
  }, []);

  const sectionStyle: CSSProperties = {
    padding: '100px 0',
    background: 'var(--white, #ffffff)',
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  };

  const liveBadgeContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
  };

  const liveDotStyle: CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  };

  const liveBadgeStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '12px',
    fontWeight: 600,
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const bottomCtaStyle: CSSProperties = {
    textAlign: 'center',
    marginTop: '40px',
  };

  const ctaLinkStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--primary-700, #005f73)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const errorStyle: CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '1rem',
    color: 'var(--text-secondary, #6b7280)',
  };

  return (
    <section id="news" style={sectionStyle}>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      <Container>
        <SectionHeader
          kicker="Notizie & Approfondimenti"
          title="Ultime notizie sulla Crisi d'Impresa"
          subtitle="Feed aggiornato in tempo reale dalle principali fonti giuridiche e finanziarie italiane."
        />

        {/* Live indicator */}
        {isLive && !loading && (
          <div style={liveBadgeContainerStyle}>
            <div style={liveDotStyle} />
            <span style={liveBadgeStyle}>Feed live &mdash; aggiornamento automatico</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <p style={errorStyle}>Impossibile caricare le notizie.</p>
        )}

        {/* Loading Skeleton */}
        {loading && !error && (
          <div style={gridStyle}>
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* News Cards */}
        {!loading && !error && (
          <>
            <div style={gridStyle}>
              {news.map((item, i) => (
                <RevealOnScroll key={i} delay={i * 0.1}>
                  <NewsCard item={item} isLive={isLive} />
                </RevealOnScroll>
              ))}
            </div>
            {!isLive && (
              <div style={bottomCtaStyle}>
                <RevealOnScroll delay={0.3}>
                  <a href="news.html" style={ctaLinkStyle}>
                    Vedi tutti gli aggiornamenti &rarr;
                  </a>
                </RevealOnScroll>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

// ── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  const cardStyle: CSSProperties = {
    background: 'var(--white, #ffffff)',
    border: '1px solid rgba(0,95,115,0.06)',
    borderRadius: '16px',
    padding: '32px',
  };

  const barStyle = (width: string, height: string, mb: string): CSSProperties => ({
    width,
    height,
    borderRadius: '8px',
    background: 'var(--neutral-200, #e5e7eb)',
    marginBottom: mb,
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  });

  return (
    <div style={cardStyle}>
      <div style={barStyle('80px', '24px', '16px')} />
      <div style={barStyle('100%', '20px', '10px')} />
      <div style={barStyle('85%', '20px', '16px')} />
      <div style={barStyle('100%', '14px', '8px')} />
      <div style={barStyle('70%', '14px', '0')} />
    </div>
  );
}

// ── News Card ────────────────────────────────────────────────────────────────

interface NewsCardProps {
  item: NewsItem;
  isLive: boolean;
}

function NewsCard({ item, isLive }: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayDate = isLive && item.date
    ? timeAgo(item.date)
    : new Date(item.date).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const cardStyle: CSSProperties = {
    background: 'var(--white, #ffffff)',
    border: isHovered
      ? '1px solid rgba(72,202,228,0.25)'
      : '1px solid rgba(0,95,115,0.06)',
    borderRadius: '16px',
    padding: '28px 32px',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 24px 48px rgba(0,95,115,0.1)'
      : 'var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    color: 'inherit',
  };

  const topRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  };

  const dateBadgeStyle: CSSProperties = {
    display: 'inline-block',
    background: isHovered
      ? 'rgba(72,202,228,0.12)'
      : 'rgba(0,95,115,0.06)',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    color: 'var(--primary-700, #005f73)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    transition: 'background 0.3s ease',
  };

  const sourceStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '11px',
    color: 'var(--text-secondary, #6b7280)',
    fontStyle: 'italic',
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif, 'Lora', serif)",
    fontSize: '1.1rem',
    fontWeight: 700,
    lineHeight: 1.35,
    color: 'var(--text-primary, #111827)',
    margin: '0 0 10px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const excerptStyle: CSSProperties = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--text-secondary, #6b7280)',
  };

  const hasRealUrl = isLive && item.url && item.url !== '#';

  const handleClick = (e: React.MouseEvent) => {
    if (!hasRealUrl) {
      e.preventDefault();
    }
  };

  return (
    <a
      href={hasRealUrl ? item.url : undefined}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      target={hasRealUrl ? '_blank' : undefined}
      rel={hasRealUrl ? 'noopener noreferrer' : undefined}
    >
      <div style={topRowStyle}>
        <span style={dateBadgeStyle}>{displayDate}</span>
        {isLive && <span style={sourceStyle}>{item.excerpt}</span>}
      </div>
      <h3 style={titleStyle}>{item.title}</h3>
      {!isLive && <p style={excerptStyle}>{item.excerpt}</p>}
    </a>
  );
}

export default News;
