// Función serverless de Vercel: recibe una sugerencia de canción y la envía por correo con Resend.
// Requiere la variable de entorno RESEND_API_KEY (solo en Vercel, nunca con prefijo VITE_).

const TO = 'valentinbertorello@gmail.com';
// Sin dominio verificado en Resend solo se puede enviar desde onboarding@resend.dev.
const FROM = process.env.RESEND_FROM || 'ETER Bar <onboarding@resend.dev>';

const LIMITS = { song: 150, artist: 150, name: 60 };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: 'El servicio de correo no está configurado' }, 500);

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Solicitud inválida' }, 400);
  }

  // Honeypot: los bots completan el campo oculto; respondemos OK sin enviar nada.
  if (typeof data.website === 'string' && data.website.trim()) return json({ ok: true });

  const field = (key: keyof typeof LIMITS) =>
    typeof data[key] === 'string' ? (data[key] as string).trim().slice(0, LIMITS[key]) : '';
  const song = field('song');
  const artist = field('artist');
  const name = field('name');

  if (!song) return json({ error: 'Falta el nombre de la canción' }, 400);

  const when = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' });
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #111">
      <h2 style="color: #dc2626; margin: 0 0 16px">🎵 Nueva sugerencia de canción</h2>
      <p style="margin: 4px 0"><strong>Canción:</strong> ${escapeHtml(song)}</p>
      ${artist ? `<p style="margin: 4px 0"><strong>Artista:</strong> ${escapeHtml(artist)}</p>` : ''}
      ${name ? `<p style="margin: 4px 0"><strong>Sugerida por:</strong> ${escapeHtml(name)}</p>` : ''}
      <p style="margin: 16px 0 0; color: #666; font-size: 13px">${when} · enviada desde la web de ETER</p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `🎵 ${song}${artist ? ` — ${artist}` : ''}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ error: 'No se pudo enviar la sugerencia' }, 502);
  }

  return json({ ok: true });
}
