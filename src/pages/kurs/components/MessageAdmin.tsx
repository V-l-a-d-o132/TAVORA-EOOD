import { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';

interface MessageAdminProps {
  userId: string;
}

export default function MessageAdmin({ userId }: MessageAdminProps) {
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg animate-[msgPopIn_0.3s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        style={{
          background: '#e8e8e8',
          border: '1px solid #d0d0d0',
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
              style={{ background: '#dcfce7', border: '2px solid #22c55e' }}
            >
              <i className="ri-check-line text-2xl" style={{ color: '#22c55e' }} />
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: '#1a1a1a' }}>
              Съобщението е изпратено!
            </h3>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#555555' }}>
              Ще получиш отговор в рамките на{' '}
              <strong style={{ color: '#1a1a1a' }}>1 до 5 работни дни</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* ─── Header ─── */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid #d0d0d0' }}
            >
              <div>
                <h2 className="text-base font-bold tracking-tight" style={{ color: '#1a1a1a' }}>
                  Пиши на ментор
                </h2>
                <p className="text-sm mt-1" style={{ color: '#555555' }}>
                  Имаш въпрос? Изпрати съобщение директно.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ color: '#888888' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.background = '#d8d8d8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.background = 'transparent'; }}
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
                  style={{ background: '#fee2e2', border: '1px solid #e53e3e', color: '#e53e3e' }}
                >
                  <i className="ri-error-warning-line text-base mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Info */}
              <div
                className="p-3.5 rounded-lg text-sm leading-relaxed flex items-start gap-2.5"
                style={{ background: '#f0f0f0', border: '1px solid #d8d8d8', color: '#555555' }}
              >
                <i className="ri-information-line text-base mt-0.5 shrink-0" style={{ color: '#888888' }} />
                <span>
                  Отговорът може да отнеме от{' '}
                  <strong style={{ color: '#1a1a1a' }}>1 до 5 работни дни</strong>.
                  Благодарим за търпението!
                </span>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                  Тема
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Напр. Въпрос за Модул 3..."
                  className="w-full px-4 py-3 text-sm outline-none transition-colors placeholder:text-sm"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cccccc',
                    borderRadius: '10px',
                    color: '#1a1a1a',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#e53e3e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#cccccc'; }}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                  Съобщение
                </label>
                <textarea
                  value={content}
                  onChange={(e) => { if (e.target.value.length <= 500) setContent(e.target.value); }}
                  placeholder="Опиши въпроса или проблема си..."
                  rows={4}
                  className="w-full px-4 py-3 text-sm outline-none transition-colors resize-none placeholder:text-sm"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cccccc',
                    borderRadius: '10px',
                    color: '#1a1a1a',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#e53e3e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#cccccc'; }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: '#888888' }}>
                    До 500 символа
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: content.length >= 500 ? '#e53e3e' : '#888888' }}
                  >
                    {content.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Footer / Submit ─── */}
            <div
              className="px-6 py-4 flex gap-3"
              style={{ borderTop: '1px solid #d0d0d0' }}
            >
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  background: 'transparent',
                  border: '1px solid #cccccc',
                  color: '#555555',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#888888'; e.currentTarget.style.color = '#1a1a1a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cccccc'; e.currentTarget.style.color = '#555555'; }}
              >
                Отказ
              </button>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className="flex-[2] py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#e53e3e', color: '#ffffff' }}
                onMouseEnter={(e) => { if (canSend) e.currentTarget.style.background = '#ff5555'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#e53e3e'; }}
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
        style={{ background: '#e53e3e', color: '#ffffff' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#ff5555'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#e53e3e'; }}
      >
        <i className="ri-message-3-line text-sm" />
        Пиши на ментор
      </button>

      {/* ─── Modal via Portal ─── */}
      {open && createPortal(modal, document.body)}
    </>
  );
}