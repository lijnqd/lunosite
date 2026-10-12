// Cloudflare Worker: receives the contact form and forwards it to Telegram.
// Secrets (set in Cloudflare, never in this file): BOT_TOKEN
// Variables: CHAT_ID (falls back to the one below)
const CHAT_ID_DEFAULT = '576670282';
const ALLOWED = ['https://designluno.com', 'https://www.designluno.com', 'https://lijnqd.github.io'];

const esc = s => String(s || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).slice(0, 1500);

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Vary': 'Origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST' || !ALLOWED.includes(origin)) return new Response('forbidden', { status: 403, headers: cors });

    const f = await req.formData();
    if (f.get('website')) return new Response('ok', { headers: cors }); // honeypot: bots fill this

    const text =
      '<b>New request from designluno.com</b>\n\n' +
      '<b>Name:</b> ' + esc(f.get('name')) + '\n' +
      '<b>Phone:</b> ' + esc(f.get('phone')) + '\n' +
      '<b>Email:</b> ' + esc(f.get('email')) + '\n' +
      '<b>Message:</b> ' + esc(f.get('message'));

    const r = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID || CHAT_ID_DEFAULT, text, parse_mode: 'HTML' })
    });
    return new Response(r.ok ? 'ok' : 'error', { status: r.ok ? 200 : 502, headers: cors });
  }
};
