const fs = require('fs');
const path = require('path');
const ORIGIN = 'https://dgctv.online';
const ADS = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4838599685482497" crossorigin="anonymous"></script>';
const AD_UNIT = '<ins class="adsbygoogle" style="display:block;text-align:center;margin:24px 0" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-4838599685482497" data-ad-slot="3825883336"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>';
const CATS = ['News', 'Entertainment', 'Sports', 'Jobs', 'Education', 'Lifestyle'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SOCIAL = [['Facebook','https://www.facebook.com/share/1MStnrYas5/'],['X (Twitter)','https://x.com/DGCTV247'],['TikTok','https://www.tiktok.com/@dgctv001'],['Instagram','https://instagram.com/daniyungtv'],['WhatsApp Channel','https://whatsapp.com/channel/0029VbE63GI3wtb1VweZSE1g']];
let cfg;

async function config() {
  if (cfg) return cfg;
  let txt = '';
  try { txt = fs.readFileSync(path.join(process.cwd(), 'config.js'), 'utf8'); } catch (e) {}
  if (!/SUPABASE_URL/.test(txt)) { try { txt = await (await fetch(ORIGIN + '/config.js')).text(); } catch (e) {} }
  const url = (txt.match(/SUPABASE_URL["']?\s*:\s*["']([^"']+)["']/) || [])[1];
  const key = (txt.match(/SUPABASE_ANON_KEY["']?\s*:\s*["']([^"']+)["']/) || [])[1];
  if (!url || !key) throw new Error('config');
  cfg = { url: url.replace(/\/$/, ''), key };
  return cfg;
}
async function db(q) {
  const c = await config();
  const r = await fetch(`${c.url}/rest/v1/${q}`, { headers: { apikey: c.key } });
  if (!r.ok) throw new Error('db ' + r.status);
  return r.json();
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[x]));
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const fmt = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const now = () => encodeURIComponent(new Date().toISOString());

function blocks(body) {
  const lines = String(body || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean);
  const out = []; let list = null;
  const flush = () => { if (list) { out.push(`<${list.t}>${list.i.map(x => `<li>${inline(x)}</li>`).join('')}</${list.t}>`); list = null; } };
  for (const l of lines) {
    let m;
    if ((m = l.match(/^[-•*]\s+(.*)$/))) { if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', i: [] }; } list.i.push(m[1]); continue; }
    if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', i: [] }; } list.i.push(m[1]); continue; }
    flush();
    if ((m = l.match(/^\*\*([^*]+)\*\*:?$/)) || (m = l.match(/^#{1,3}\s+(.*)$/))) out.push(`<h2>${esc(m[1])}</h2>`);
    else out.push(`<p>${inline(l)}</p>`);
  }
  flush();
  return out;
}

const STYLE = `<style>nav a{background:#fff;color:#526075;white-space:nowrap;padding:12px 15px;font:600 14px 'DM Sans',sans-serif;border-bottom:3px solid transparent}nav a.active,nav a:hover{color:#d82836;border-bottom-color:#d82836}.card a.open{display:block}.card .copy h2 a{color:inherit}.social{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px}.social a{border:1px solid #2a3a52;color:#e6ecf5;padding:8px 14px;border-radius:999px;font-weight:600;font-size:13px}.social a:hover{background:#d82836;border-color:#d82836;color:#fff}.pager{display:flex;justify-content:space-between;margin:30px 0}.pager a{background:#07111f;color:#fff;padding:10px 16px;border-radius:6px;font-weight:600}.article{max-width:780px;margin:0 auto;background:#fff;border:1px solid #e1e6ee;border-radius:10px;padding:28px}.article h1{font-size:clamp(28px,5vw,40px);line-height:1.2}.article .lead{font-size:19px;color:#687589}.article .body{font:18px/1.8 Georgia,serif}.article .body h2{font:700 24px 'Playfair Display',Georgia,serif;margin:30px 0 8px}.article img.hero{width:100%;height:auto;border-radius:8px;margin:10px 0 20px}.share{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0}.share a{background:#07111f;color:#fff;padding:9px 14px;border-radius:6px;font-weight:600;font-size:14px}.related{max-width:780px;margin:30px auto 0}.intro p.about{color:#687589;max-width:720px}</style>`;

function layout({ title, desc, canonical, head = '', body, active = '', cats = CATS }) {
  const nav = `<nav><a href="/"${active === '' ? ' class="active"' : ''}>Top Stories</a>${cats.map(c => `<a href="/category/${encodeURIComponent(c)}"${active === c ? ' class="active"' : ''}>${esc(c)}</a>`).join('')}</nav>`;
  const social = `<div class="social">${SOCIAL.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${n}</a>`).join('')}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:site_name" content="DGC TV News"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(canonical)}"><link rel="stylesheet" href="/style.css">${STYLE}${head}${ADS}</head><body><header><a class="logo" href="/">DGC <span>TV NEWS</span></a><a href="/admin.html">Admin</a></header>${nav}<main>${body}</main><footer>${social}<a href="/about.html">About</a> · <a href="/contact.html">Contact</a> · <a href="/privacy.html">Privacy</a><p>© ${new Date().getFullYear()} DGC TV. Verify information with original sources.</p></footer></body></html>`;
}
const card = s => `<article class="card"><a class="open" href="/news/${encodeURIComponent(s.slug)}">${s.image_url ? `<img class="thumb" src="${esc(s.image_url)}" alt="${esc(s.image_alt || s.title)}" loading="lazy">` : '<div class="thumb">DGC TV</div>'}</a><div class="copy"><span class="tag">${esc(s.category)}</span><h2><a href="/news/${encodeURIComponent(s.slug)}">${esc(s.title)}</a></h2><p>${esc(s.summary)}</p><div class="meta">${esc(s.author)} · ${fmt(s.published_at)}</div></div></article>`;

async function categories() {
  try {
    const rows = await db(`articles?select=category&status=eq.published&published_at=lte.${now()}&limit=1000`);
    const have = [...new Set(rows.map(r => r.category).filter(Boolean))];
    return CATS.filter(c => have.includes(c)).concat(have.filter(c => !CATS.includes(c)).sort());
  } catch (e) { return CATS; }
}

async function home(url, res) {
  const p = url.searchParams;
  const old = p.get('article');
  if (old) { res.statusCode = 301; res.setHeader('Location', '/news/' + encodeURIComponent(old)); return res.end(); }
  const cat = (p.get('category') || '').trim();
  const q = (p.get('q') || '').replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 60);
  const page = Math.max(1, parseInt(p.get('page') || '1', 10) || 1);
  const size = 24;
  let f = `status=eq.published&published_at=lte.${now()}`;
  if (cat) f += `&category=eq.${encodeURIComponent(cat)}`;
  if (q) f += `&or=(title.ilike.*${encodeURIComponent(q)}*,summary.ilike.*${encodeURIComponent(q)}*)`;
  const [rows, cats] = await Promise.all([db(`articles?select=title,slug,summary,category,author,image_url,image_alt,published_at&${f}&order=published_at.desc&limit=${size + 1}&offset=${(page - 1) * size}`), categories()]);
  const more = rows.length > size, list = rows.slice(0, size);
  const base = cat ? `/category/${encodeURIComponent(cat)}` : '/';
  const qs = n => { const a = []; if (q) a.push('q=' + encodeURIComponent(q)); if (n > 1) a.push('page=' + n); return base + (a.length ? '?' + a.join('&') : ''); };
  const heading = q ? `Search: ${q}` : cat || 'Top Stories';
  const body = `<div class="intro"><small>YOUR DAILY DOSE OF TRUSTED NEWS &amp; STORIES</small><h1>${esc(heading)}</h1><p class="about">DGC TV is a Nigerian digital media platform covering news, entertainment, sports, jobs, education and lifestyle, with original explainers and clearly sourced reporting.</p><form method="get" action="${esc(base)}"><input name="q" value="${esc(q)}" placeholder="Search stories…" aria-label="Search stories"></form></div>${list.length ? `<section class="grid">${list.map(card).join('')}</section>` : '<div class="message">No stories found.</div>'}<div class="pager"><span>${page > 1 ? `<a href="${qs(page - 1)}">← Newer</a>` : ''}</span><span>${more ? `<a href="${qs(page + 1)}">Older →</a>` : ''}</span></div>`;
  const title = cat ? `${cat} News | DGC TV News` : 'DGC TV News — Nigerian News, Sports, Jobs, Education & Lifestyle';
  const desc = cat ? `Latest ${cat.toLowerCase()} stories from DGC TV News.` : 'DGC TV — your daily dose of trusted Nigerian news, sports, entertainment, jobs, education and lifestyle stories.';
  const canonical = ORIGIN + (q || page > 1 ? qs(page) : base);
  const robots = q ? '<meta name="robots" content="noindex,follow">' : '';
  return send(res, 200, layout({ title, desc, canonical, head: robots, body, active: cat, cats }));
}

async function article(url, res) {
  const slug = (url.searchParams.get('slug') || '').trim();
  const rows = /^[a-z0-9-]+$/.test(slug) ? await db(`articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&published_at=lte.${now()}&limit=1`) : [];
  const a = rows[0];
  if (!a) return send(res, 404, layout({ title: 'Story not found | DGC TV News', desc: 'This story could not be found.', canonical: ORIGIN + '/', head: '<meta name="robots" content="noindex">', body: '<div class="panel"><h1>Story not found</h1><p>It may have been moved or removed. <a href="/"><strong>Go to the homepage</strong></a>.</p></div>' }), true);
  const [cats, rel] = await Promise.all([categories(), db(`articles?select=title,slug,summary,category,author,image_url,image_alt,published_at&status=eq.published&published_at=lte.${now()}&slug=neq.${encodeURIComponent(slug)}&category=eq.${encodeURIComponent(a.category)}&order=published_at.desc&limit=3`).catch(() => [])]);
  const url2 = `${ORIGIN}/news/${encodeURIComponent(a.slug)}`;
  const bl = blocks(a.body);
  const at = bl.length > 5 ? 3 : bl.length;
  const bodyHtml = bl.slice(0, at).join('') + AD_UNIT + bl.slice(at).join('');
  const t = encodeURIComponent(a.title), u = encodeURIComponent(url2);
  const ld = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: a.title, description: a.summary, datePublished: a.published_at, dateModified: a.updated_at || a.published_at, mainEntityOfPage: url2, author: { '@type': 'Organization', name: a.author || 'DGC TV Editorial Desk' }, publisher: { '@type': 'Organization', name: 'DGC TV', url: ORIGIN } };
  if (a.image_url) ld.image = [a.image_url];
  const head = `<meta property="og:type" content="article">${a.image_url ? `<meta property="og:image" content="${esc(a.image_url)}"><meta name="twitter:card" content="summary_large_image">` : ''}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  const body = `<article class="article"><span class="tag"><a href="/category/${encodeURIComponent(a.category)}">${esc(a.category)}</a></span><h1>${esc(a.title)}</h1><p class="lead">${esc(a.summary)}</p><p class="meta">By ${esc(a.author)} · ${fmt(a.published_at)}</p>${a.image_url ? `<img class="hero" src="${esc(a.image_url)}" alt="${esc(a.image_alt || a.title)}">` : ''}<div class="body">${bodyHtml}</div><div class="share"><a href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener noreferrer">Share on WhatsApp</a><a href="https://x.com/intent/post?text=${t}&url=${u}" target="_blank" rel="noopener noreferrer">Share on X</a><a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener noreferrer">Share on Facebook</a></div></article>${rel.length ? `<section class="related"><h2>More in ${esc(a.category)}</h2><div class="grid">${rel.map(card).join('')}</div></section>` : ''}`;
  return send(res, 200, layout({ title: `${a.title} | DGC TV News`, desc: a.summary, canonical: url2, head, body, active: a.category, cats }));
}

async function sitemap(res) {
  const pages = ['/', '/about.html', '/contact.html', '/privacy.html'].map(p => ({ loc: ORIGIN + p }));
  let items = pages;
  try {
    const rows = await db(`articles?select=slug,category,updated_at,published_at&status=eq.published&published_at=lte.${now()}&order=published_at.desc&limit=1000`);
    const cats = [...new Set(rows.map(r => r.category).filter(Boolean))].map(c => ({ loc: `${ORIGIN}/category/${encodeURIComponent(c)}` }));
    const arts = rows.map(a => ({ loc: `${ORIGIN}/news/${encodeURIComponent(a.slug)}`, lastmod: String(a.updated_at || a.published_at || '').slice(0, 10) }));
    items = pages.concat(cats, arts);
  } catch (e) {}
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items.map(u => `<url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode = 200;
  return res.end(xml);
}
function send(res, code, html, nocache) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', nocache ? 'public, s-maxage=60' : 'public, s-maxage=60, stale-while-revalidate=600');
  return res.end(html);
}

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, ORIGIN);
    const route = url.searchParams.get('route');
    if (route === 'sitemap') return await sitemap(res);
    if (route === 'article') return await article(url, res);
    return await home(url, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<!doctype html><meta charset="utf-8"><title>DGC TV News</title><p style="font:16px sans-serif;padding:24px">Stories are temporarily unavailable. Please refresh in a moment. <a href="/">Home</a></p>');
  }
};
