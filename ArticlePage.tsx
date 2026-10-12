import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const title = params.get('title') || 'Article';
  const link = params.get('link') || '#';
  const source = params.get('source') || 'DGC TV';

  const [count, setCount] = useState(7);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(t);
          window.location.href = link;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [link]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${title} — DGC TV`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: '#c00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#fff', margin: '0 auto 12px' }}>DGC</div>
        <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>DGC TV</div>
        <div style={{ fontSize: 11, color: '#aaa', letterSpacing: 2 }}>YOUR WORLD · YOUR NEWS</div>
      </div>

      {/* Card */}
      <div style={{ background: '#161616', borderRadius: 12, padding: 28, maxWidth: 520, width: '100%', border: '1px solid #222', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#c00', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, marginBottom: 16, letterSpacing: 1 }}>
          {source}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, marginBottom: 24, color: '#f0f0f0' }}>{title}</h1>

        {/* Progress bar */}
        <div style={{ background: '#2a2a2a', borderRadius: 4, height: 6, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ background: '#c00', height: '100%', width: `${(count / 7) * 100}%`, transition: 'width 1s linear' }} />
        </div>
        <p style={{ color: '#aaa', fontSize: 13, marginBottom: 24 }}>
          Redirecting to full story in <strong style={{ color: '#fff' }}>{count}s</strong>...
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={link} style={{ background: '#c00', color: '#fff', padding: '10px 22px', borderRadius: 6, fontWeight: 700, fontSize: 14 }}>
            Read Full Story Now
          </a>
          <button onClick={handleShare} style={{ background: '#222', color: '#fff', padding: '10px 22px', borderRadius: 6, fontWeight: 700, fontSize: 14, border: '1px solid #333', cursor: 'pointer' }}>
            Share
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: '#555' }}>dgctv.online</div>
    </div>
  );
}
