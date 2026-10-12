import { useState } from 'react';

export default function Subscribe() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const handleSubmit = async () => {
    if (!name || !email) return;
    setStatus('loading');
    // Store in localStorage as simple fallback (no backend on Vercel static)
    try {
      const existing = JSON.parse(localStorage.getItem('dgctv_subscribers') || '[]');
      if (existing.find((s: any) => s.email === email)) {
        setStatus('error');
        return;
      }
      existing.push({ name, email, date: new Date().toISOString() });
      localStorage.setItem('dgctv_subscribers', JSON.stringify(existing));
      setStatus('success');
      setName(''); setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, borderLeft: '4px solid #c00', paddingLeft: 12 }}>
        Subscribe
      </h1>
      <p style={{ color: '#aaa', marginBottom: 24, fontSize: 14 }}>Stay updated with the latest DGC TV news.</p>

      {status === 'success' ? (
        <div style={{ background: '#0d2b0d', border: '1px solid #1a5c1a', borderRadius: 10, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
          <div style={{ fontWeight: 700, color: '#4caf50', marginBottom: 6 }}>Subscribed!</div>
          <div style={{ color: '#aaa', fontSize: 14 }}>Welcome to DGC TV, {name}.</div>
          <button onClick={() => setStatus('idle')} style={{ marginTop: 16, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 600 }}>Subscribe Another</button>
        </div>
      ) : (
        <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 10, padding: 24, maxWidth: 400 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#aaa', marginBottom: 6 }}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: 6, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#aaa', marginBottom: 6 }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              placeholder="your@email.com"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: 6, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }} />
          </div>
          {status === 'error' && (
            <div style={{ color: '#f44', fontSize: 13, marginBottom: 12 }}>Already subscribed or error occurred. Try again.</div>
          )}
          <button onClick={handleSubmit} disabled={status === 'loading' || !name || !email}
            style={{ width: '100%', background: status === 'loading' ? '#800' : '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </div>
      )}
    </div>
  );
}
