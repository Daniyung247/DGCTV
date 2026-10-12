export default function Contact() {
  const contacts = [
    { icon: '📞', label: 'WhatsApp', value: '+2348139030872', href: 'https://wa.me/2348139030872' },
    { icon: '📞', label: 'WhatsApp', value: '+2348058405251', href: 'https://wa.me/2348058405251' },
    { icon: '📸', label: 'Instagram', value: '@daniyungtv', href: 'https://instagram.com/daniyungtv' },
    { icon: '🐦', label: 'Twitter / X', value: '@DGC Tv_', href: 'https://twitter.com/DGCTv_' },
    { icon: '🎵', label: 'TikTok', value: '@DGC TV', href: 'https://tiktok.com/@dgctv' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20, borderLeft: '4px solid #c00', paddingLeft: 12 }}>
        Contact Us
      </h1>
      <p style={{ color: '#aaa', marginBottom: 24, fontSize: 14 }}>Reach out to DGC TV on any of our platforms.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        {contacts.map((c, i) => (
          <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{ background: '#161616', border: '1px solid #222', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#c00')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}
          >
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>{c.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
