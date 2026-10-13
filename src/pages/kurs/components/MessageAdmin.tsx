import { ACADEMY_COLORS as C } from '@/lib/academy-theme';
import { useAcademyTheme } from '@/contexts/academy-theme-state';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';

interface MessageAdminProps {
  userId: string;
}

export default function MessageAdmin({ userId }: MessageAdminProps) {
  const { theme } = useAcademyTheme();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return;
    setSending(true);
    setError('');

    const { error: err } = await supabase.from('messages').insert({
      user_id: userId,
      subject: subject.trim(),
      content: content.trim(),
    });

    if (err) {
      setError('Грешка при изпращане. Опитай отново.');
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setSubject('');
      setContent('');
    }, 3000);
  };

  const handleClose = () => {
    if (sending) return;
    setOpen(false);
    if (!sent) {
      setSubject('');
      setContent('');
      setError('');
    }
  };

  const canSend = subject.trim().length > 0 && content.trim().length > 0 && !sending;

  const modal = (
    <div
      data-academy-theme={theme}
      className="academy-themed fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg animate-[msgPopIn_0.3s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '14px',
          boxShadow: '0 25px 80px -12px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          /* ─── Success State ─── */
          <div className="px-8 py-12 md:py-14 text-center">
            <div
              className="w-16 h-16 flex items-center justify-center mx-auto mb-5 rounded-full"
              style={{ background: C.successDim, border: `2px solid ${C.success}` }}
            >
              <i className="ri-check-line text-2xl" style={{ color: C.successText }} />
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: C.text }}>
              Съобщението е изпратено!
            </h3>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: C.textMuted }}>
              Ще получиш отговор в рамките на{' '}
              <strong style={{ color: C.text }}>1 до 5 работни дни</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* ─── Header ─── */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <div>
                <h2 className="text-base font-bold tracking-tight" style={{ color: C.text }}>
                  Пиши на ментор
                </h2>
                <p className="text-sm mt-1" style={{ color: C.textMuted }}>
                  Имаш въпрос? Изпрати съобщение директно.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ color: C.textDim }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.surfaceElevated; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.background = 'transparent'; }}
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* ─── Body ─── */}
            <div className="px-6 py-6 space-y-5">
              {/* Error */}
              {error && (
                <div
                  className="p-3 rounded-lg text-sm leading-relaxed flex items-start gap-2.5"
                  style={{ background: 'var(--academy-error-bg)', border: `1px solid ${C.accent}`, color: C.accentText }}
                >
                  <i className="ri-error-warning-line text-base mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Info */}
              <div
                className="p-3.5 rounded-lg text-sm leading-relaxed flex items-start gap-2.5"
                style={{ background: C.surfaceElevated, border: `1px solid ${C.border}`, color: C.textMuted }}
              >
                <i className="ri-information-line text-base mt-0.5 shrink-0" style={{ color: C.textDim }} />
                <span>
                  Отговорът може да отнеме от{' '}
                  <strong style={{ color: C.text }}>1 до 5 работни дни</strong>.
                  Благодарим за търпението!
                </span>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: C.text }}>
                  Тема
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Напр. Въпрос за Модул 3..."
                  className="w-full px-4 py-3 text-sm outline-none transition-colors placeholder:text-sm"
                  style={{
                    background: C.surfaceElevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: '10px',
                    color: C.text,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: C.text }}>
                  Съобщение
                </label>
                <textarea
                  value={content}
                  onChange={(e) => { if (e.target.value.length <= 500) setContent(e.target.value); }}
                  placeholder="Опиши въпроса или проблема си..."
                  rows={4}
                  className="w-full px-4 py-3 text-sm outline-none transition-colors resize-none placeholder:text-sm"
                  style={{
                    background: C.surfaceElevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: '10px',
                    color: C.text,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: C.textDim }}>
                    До 500 символа
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: content.length >= 500 ? C.accent : C.textDim }}
                  >
                    {content.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Footer / Submit ─── */}
            <div
              className="px-6 py-4 flex gap-3"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.textDim; e.currentTarget.style.color = C.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                Отказ
              </button>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="flex-[2] py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: C.accent, color: '#ffffff' }}
                onMouseEnter={(e) => { if (canSend) e.currentTarget.style.background = C.accentHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
              >
                {sending ? (
                  <>
                    <span
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }}
                    />
                    Изпращане...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line text-sm" />
                    Изпрати
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes msgPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* ─── Trigger Button ─── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm"
        style={{ background: C.accent, color: '#ffffff' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
      >
        <i className="ri-message-3-line text-sm" />
        Пиши на ментор
      </button>

      {/* ─── Modal via Portal ─── */}
      {open && createPortal(modal, document.body)}
    </>
  );
}