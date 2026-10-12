import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Layout() {
  const [now, setNow] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const navLinks = [
    { to: '/', label: 'News' },
    { to: '/contact', label: 'Contact' },
    { to: '/subscribe', label: 'Subscribe' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      {/* Top bar */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#aaa' }}>
        <span>dgctv.online</span>
        <span>{dateStr} &nbsp;|&nbsp; {timeStr}</span>
      </div>

      {/* Breaking news ticker */}
      <div style={{ background: '#c00', padding: '6px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span style={{ display: 'inline-block', animation: 'ticker 30s linear infinite', paddingLeft: '100%', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
          🔴 BREAKING NEWS &nbsp;·&nbsp; Stay updated with DGC TV — Your World, Your News &nbsp;·&nbsp; Follow us @daniyungtv on Instagram &nbsp;·&nbsp; Latest headlines from Nigeria and beyond &nbsp;·&nbsp; 🔴 BREAKING NEWS
        </span>
      </div>

      {/* Header */}
      <header style={{ background: '#111', borderBottom: '2px solid #c00', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, background: '#c00', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff', flexShrink: 0 }}>
          DGC
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: 1 }}>DGC TV</div>
          <div style={{ fontSize: 11, color: '#aaa', letterSpacing: 2 }}>YOUR WORLD · YOUR NEWS</div>
        </div>
        <div style={{ marginLeft: 'auto', background: '#c00', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>
          LIVE
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', display: 'flex', gap: 0 }}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} style={{
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 600,
            color: location.pathname === to ? '#fff' : '#aaa',
            borderBottom: location.pathname === to ? '2px solid #c00' : '2px solid transparent',
            transition: 'all 0.2s',
          }}>{label}</Link>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, padding: '20px 16px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#111', borderTop: '2px solid #c00', padding: '20px 16px', textAlign: 'center', color: '#666', fontSize: 12 }}>
        <div style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>DGC TV</div>
        <div style={{ marginBottom: 6 }}>📞 +2348139030872 &nbsp;|&nbsp; +2348058405251</div>
        <div style={{ marginBottom: 8 }}>📸 @daniyungtv &nbsp;·&nbsp; 🐦 @DGC Tv_ &nbsp;·&nbsp; 🎵 @DGC TV</div>
        <div>© {now.getFullYear()} DGC TV · dgctv.online · Your World, Your News</div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
