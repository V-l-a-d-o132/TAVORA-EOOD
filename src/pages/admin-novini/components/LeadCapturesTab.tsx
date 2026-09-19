import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface LeadCapture {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export default function LeadCapturesTab() {
  const [leads, setLeads] = useState<LeadCapture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('lead_captures')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setLeads((data as LeadCapture[]) || []);
    } catch (err: any) {
      setError('Грешка при зареждане: ' + (err?.message || 'неуспешно'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    await supabase.from('lead_captures').delete().eq('id', id);
    await fetchLeads();
    setDeleteConfirm(null);
  };

  const filtered = leads.filter((l) => {
    const q = searchQ.toLowerCase();
    return (
      l.email.toLowerCase().includes(q) ||
      (l.full_name || '').toLowerCase().includes(q)
    );
  });

  const todayCount = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;
  const weekCount = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 86400000)).length;

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
        <button onClick={fetchLeads} className="px-4 py-2 bg-[#0A2540] text-white text-xs rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer">
          Опитай отново
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Общо', value: leads.length, icon: 'ri-user-add-line' },
          { label: 'Днес', value: todayCount, icon: 'ri-calendar-line' },
          { label: 'Тази седмица', value: weekCount, icon: 'ri-calendar-event-line' },
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
          <input type="text" placeholder="Търси имейл или име..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
          <i className="ri-user-add-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
          <p className="text-sm text-[#1C1C1E]/65">Няма лийдове от академията.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 overflow-hidden">
          <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 border-b border-[#1C1C1E]/6 bg-[#F7F6F3]">
            <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Имейл</span>
            <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Име</span>
            <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Дата</span>
            <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest"></span>
          </div>
          {filtered.map((lead, i) => (
            <div key={lead.id} className={`flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-3.5 ${i < filtered.length - 1 ? 'border-b border-[#1C1C1E]/6' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full bg-[#0A2540]/8">
                  <i className="ri-mail-line text-[#0A2540]/60 text-xs" />
                </div>
                <a href={`mailto:${lead.email}`} className="text-sm text-[#0A2540] hover:underline truncate">{lead.email}</a>
              </div>
              <span className="text-sm text-[#1C1C1E] self-center">{lead.full_name || '—'}</span>
              <span className="text-xs text-[#1C1C1E]/65 self-center">{new Date(lead.created_at).toLocaleString('bg-BG')}</span>
              <div className="self-center">
                <button onClick={() => setDeleteConfirm(lead.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/70 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer" title="Изтрий">
                  <i className="ri-delete-bin-line text-xs" />
                </button>
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
            <h3 className="text-base font-medium text-[#1C1C1E] text-center mb-2">Изтрий лийд?</h3>
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