import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Article {
  title: string;
  link: string;
  pubDate?: string;
}

interface Source {
  name: string;
  color: string;
  rss: string;
  site: string;
}

const SOURCES: Source[] = [
  { name: 'Punch News', color: '#e63946', rss: 'https://punchng.com/feed/', site: 'https://punchng.com' },
  { name: 'BBC News', color: '#bb1919', rss: 'https://feeds.bbci.co.uk/news/rss.xml', site: 'https://bbc.com/news' },
  { name: 'Channel News Asia', color: '#0077b6', rss: 'https://www.channelnewsasia.com/rssfeeds/8395986', site: 'https://channelnewsasia.com' },
  { name: 'Al Jazeera', color: '#f4a300', rss: 'https://www.aljazeera.com/xml/rss/all.xml', site: 'https://aljazeera.com' },
];

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

function parseRSS(xml: string): Article[] {
  const items: Article[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) || [];
  for (const item of itemMatches.slice(0, 6)) {
    const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ||
                 item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)?.[1]?.trim() || '';
    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    if (title && link) items.push({ title: title.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#\d+;/g,''), link, pubDate });
  }
  return items;
}

async function fetchNews(source: Source): Promise<Article[]> {
  try {
    const res = await fetch(`${CORS_PROXY}${encodeURIComponent(source.rss)}`);
    const data = await res.json();
    const articles = parseRSS(data.contents || '');
    if (articles.length > 0) return articles;
  } catch {}
  // Fallback: return placeholder
  return [
    { title: `Latest from ${source.name} — click to visit`, link: source.site },
    { title: `Breaking news updates from ${source.name}`, link: source.site },
    { title: `Top stories on ${source.name} today`, link: source.site },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [newsMap, setNewsMap] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const results = await Promise.all(SOURCES.map(s => fetchNews(s).then(articles => ({ name: s.name, articles }))));
      const map: Record<string, Article[]> = {};
      for (const r of results) map[r.name] = r.articles;
      setNewsMap(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleArticle = (title: string, link: string, source: string) => {
    navigate(`/article?title=${encodeURIComponent(title)}&link=${encodeURIComponent(link)}&source=${encodeURIComponent(source)}`);
  };

  const handleShare = (e: React.MouseEvent, title: string, link: string, source: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#/article?title=${encodeURIComponent(title)}&link=${encodeURIComponent(link)}&source=${encodeURIComponent(source)}`;
    if (navigator.share) {
      navigator.share({ title: `${title} — DGC TV`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, borderLeft: '4px solid #c00', paddingLeft: 12 }}>
        Latest Headlines
      </h1>
      {loading && (
        <div style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>Loading news...</div>
      )}
      <div style={{ display: 'grid', gap: 20 }}>
        {SOURCES.map(source => (
          <div key={source.name} style={{ background: '#161616', borderRadius: 10, overflow: 'hidden', border: '1px solid #222' }}>
            <div style={{ background: source.color, padding: '8px 14px', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
              {source.name}
            </div>
            <div>
              {(newsMap[source.name] || []).map((article, i) => (
                <div key={i}
                  onClick={() => handleArticle(article.title, article.link, source.name)}
                  style={{ padding: '10px 14px', borderBottom: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1f1f1f')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 14, color: '#e0e0e0', lineHeight: 1.4, flex: 1 }}>{article.title}</span>
                  <button
                    onClick={e => handleShare(e, article.title, article.link, source.name)}
                    style={{ background: 'none', border: '1px solid #333', borderRadius: 4, color: '#aaa', fontSize: 11, padding: '2px 8px', cursor: 'pointer', flexShrink: 0 }}
                  >Share</button>
                </div>
              ))}
              {!loading && !newsMap[source.name] && (
                <div style={{ padding: '10px 14px', color: '#666', fontSize: 13 }}>Loading {source.name}...</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
