import { supabase } from '@/lib/supabase';
import { C } from '@/pages/module/constants';

interface ModuleLoginGateProps {
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
}

export default function ModuleLoginGate({ errorMsg: _errorMsg, setErrorMsg }: ModuleLoginGateProps) {
  return (
    <div className="relative">
      {/* Backdrop blur on the content behind */}
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(6px)' }} />

      {/* Login CTA */}
      <div className="relative z-20 p-8 md:p-12 text-center" style={{ background: C.successDim, border: `2px solid ${C.success}` }}>
        <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6" style={{ border: `2px solid ${C.success}` }}>
          <i className="ri-trophy-line text-2xl" style={{ color: C.success }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
          Браво! Завърши{' '}
          <span style={{ color: C.success }}>Модул 1.</span>
        </h2>
        <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-3" style={{ color: C.textMuted }}>
          Вече имаш реални AI умения. За да продължиш със следващите модули, влез с твоя Google акаунт.
        </p>
        <p className="text-xs max-w-md mx-auto leading-relaxed mb-8" style={{ color: C.textDim }}>
          След като влезеш, можеш да разгледаш програмите и цените или да продължиш с безплатните уроци.
        </p>

        <button
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.href },
            });
            if (error) setErrorMsg('Грешка при вход: ' + error.message);
          }}
          className="px-10 py-4 text-sm font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
          style={{ background: C.success, color: '#0a0a0a' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Влез с Google и продължи
        </button>

        <p className="text-xs mt-4" style={{ color: C.textDim }}>
          Без кредитна карта. Отнема 30 секунди.
        </p>
      </div>
    </div>
  );
}