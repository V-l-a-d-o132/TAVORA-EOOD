import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ContactMessage {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
}

export default function ContactMessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setMessages((data as ContactMessage[]) || []);
    } catch (err: any) {
      setError('Грешка при зареждане: ' + (err?.message || 'неуспешно'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    await fetchMessages();
    setDeleteConfirm(null);
  };

  const filtered = messages.filter((m) => {
    const q = searchQ.toLowerCase();
    return (
      (m.first_name || '').toLowerCase().includes(q) ||
      (m.last_name || '').toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.service || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
        <i className="ri-error-warning-line text-red-400 text-2xl mb-3 block" />
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <button onClick={fetchMessages} className="px-4 py-2 bg-[#0A2540] text-white text-xs rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer">
          Опитай отново
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Общо', value: messages.length, icon: 'ri-message-3-line' },
          { label: 'Тази седмица', value: messages.filter(m => new Date(m.created_at) > new Date(Date.now() - 7 * 86400000)).length, icon: 'ri-calendar-event-line' },
          { label: 'Услуги', value: [...new Set(messages.map(m => m.service).filter(Boolean))].length, icon: 'ri-price-tag-3-line' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <i className={`${s.icon} text-[#0A2540]/65 text-sm`} />
              <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="text-2xl font-light text-[#0A2540]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/70 text-sm pointer-events-none" />
          <input type="text" placeholder="Търси съобщение..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
          <i className="ri-message-3-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
          <p className="text-sm text-[#1C1C1E]/65">Няма контактни съобщения.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[#1C1C1E]">
                      {msg.first_name || ''} {msg.last_name || ''}
                    </span>
                    {msg.service && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/10 text-[#0A2540]/60 whitespace-nowrap">
                        {msg.service}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                    <a href={`mailto:${msg.email}`} className="text-xs text-[#0A2540]/60 hover:text-[#0A2540] transition-colors flex items-center gap-1">
                      <i className="ri-mail-line text-xs" />{msg.email}
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="text-xs text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors flex items-center gap-1">
                        <i className="ri-phone-line text-xs" />{msg.phone}
                      </a>
                    )}
                  </div>
                  {msg.message && <p className="text-xs text-[#1C1C1E]/65 leading-relaxed line-clamp-2">{msg.message}</p>}
                  <div className="text-[10px] text-[#1C1C1E]/25 mt-2">{new Date(msg.created_at).toLocaleString('bg-BG')}</div>
                </div>
                <div className="shrink-0">
                  <button onClick={() => setDeleteConfirm(msg.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/70 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer" title="Изтрий">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-6 max-w-sm w-full">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-lg" />
            </div>
            <h3 className="text-base font-medium text-[#1C1C1E] text-center mb-2">Изтрий съобщение?</h3>
            <p className="text-xs text-[#1C1C1E]/65 text-center mb-5">Това действие не може да бъде отменено.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer">Откажи</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors cursor-pointer">Изтрий</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}