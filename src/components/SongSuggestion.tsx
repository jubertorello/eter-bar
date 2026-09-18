import React, { useState } from 'react';
import { Music, Send, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const emptyForm = { song: '', artist: '', name: '', website: '' };

interface SongSuggestionProps {
  open: boolean;
  onClose: () => void;
}

const SongSuggestion: React.FC<SongSuggestionProps> = ({ open, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    // Si ya se envió, la próxima vez que se abra vuelve a mostrar el formulario
    if (status === 'sent' || status === 'error') setStatus('idle');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/suggest-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar la sugerencia');
      setForm(emptyForm);
      setStatus('sent');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo enviar la sugerencia');
      setStatus('error');
    }
  };

  const inputClass = 'w-full bg-black/60 border border-white/15 p-4 rounded-sm focus:border-red-600 outline-none transition-colors placeholder:text-gray-600 text-left';

  return (
    <Modal open={open} onClose={handleClose} label="Sugerir una canción" className="max-w-md">
      {status === 'sent' ? (
        <div className="py-4">
          <CheckCircle2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="font-syncopate font-bold uppercase tracking-widest mb-2">¡Sugerencia enviada!</p>
          <p className="text-gray-400 text-sm mb-8">Gracias, se la pasamos al DJ.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('idle')}
              className="flex-1 py-3 border border-red-600/50 hover:border-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors"
            >
              Sugerir otra
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-red-600 hover:bg-white text-black font-bold uppercase tracking-widest text-xs rounded-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <>
          <Music className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="font-syncopate text-xl font-bold uppercase tracking-tighter mb-2">
            ¿Qué querés <span className="text-red-600">escuchar?</span>
          </h2>
          <p className="text-gray-400 font-light tracking-widest uppercase text-xs mb-8">Sugerile un tema al DJ</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              autoFocus
              maxLength={150}
              value={form.song}
              onChange={e => setForm({ ...form, song: e.target.value })}
              placeholder="Canción *"
              aria-label="Canción"
              className={inputClass}
            />
            <input
              maxLength={150}
              value={form.artist}
              onChange={e => setForm({ ...form, artist: e.target.value })}
              placeholder="Artista"
              aria-label="Artista"
              className={inputClass}
            />
            <input
              maxLength={60}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Tu nombre (opcional)"
              aria-label="Tu nombre"
              className={inputClass}
            />
            {/* Honeypot anti-spam: oculto para personas, los bots lo completan */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              className="hidden"
              aria-hidden="true"
            />

            {status === 'error' && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-500/10 py-2">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center gap-3 mt-2 py-4 bg-red-600 hover:bg-white text-black font-black uppercase tracking-widest text-sm rounded-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {status === 'sending' ? 'Enviando...' : 'Enviar sugerencia'}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
};

export default SongSuggestion;
