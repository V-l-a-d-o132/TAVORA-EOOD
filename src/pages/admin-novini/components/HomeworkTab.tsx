import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface HomeworkItem {
  id: string;
  user_id: string;
  module_id: string;
  content: string;
  submitted_at: string;
  status: string;
  full_name: string | null;
  avatar_url: string | null;
}

const STATUS_OPTIONS = ['нова', 'прегледана', 'одобрена', 'върната за корекции'];
const MODULE_LABELS: Record<string, string> = {
  's01-m01': 'Пътят на коприната – AI Advantage',
  's01-m02': 'Пътят на коприната – The Readdy Blueprint',
  's01-m03': 'Пътят на коприната – Invisible Marketing',
  's01-m04': 'Пътят на коприната – Content That Sells',
  's01-m05': 'Пътят на коприната – Audience Engine',
  's01-m06': 'Пътят на коприната – The Conversion System',
  's01-m07': 'Пътят на коприната – Professional Stack',
  's01-m08': 'Пътят на коприната – Digital Protection',
  's01-m09': 'Пътят на коприната – Growth Analytics',
  's01-m10': 'Пътят на коприната – Scale with AI',
  's01-m11': 'Пътят на коприната – The Revenue Blueprint',
  's01-m12': 'Пътят на коприната – Модул 12',
  's01-m13': 'Пътят на коприната – Модул 13',
  's01-m14': 'Пътят на коприната – Модул 14',
  's01-m15': 'Пътят на коприната – Модул 15',
  's01-m16': 'Пътят на коприната – Модул 16',
  's01-m17': 'Пътят на коприната – Модул 17',
  's01-m18': 'Пътят на коприната – Модул 18',
  's02-m00': 'Перфектното Видео – Модул 01 (Диагностика)',
  's02-m01': 'Перфектното Видео – Модул 01',
  's02-m02': 'Перфектното Видео – Модул 02',
  's02-m03': 'Перфектното Видео – Модул 03',
  's02-m04': 'Перфектното Видео – Модул 04',
  's02-m05': 'Перфектното Видео – Модул 05',
  's02-m06': 'Перфектното Видео – Модул 06',
  's02-m07': 'Перфектното Видео – Модул 07',
  's02-m08': 'Перфектното Видео – Модул 08',
  's02-m09': 'Перфектното Видео – Модул 09',
  's02-m10': 'Перфектното Видео – Модул 10',
  's02-m11': 'Перфектното Видео – Модул 11',
  's02-m12': 'Перфектното Видео – Модул 12',
  's02-m13': 'Перфектното Видео – Модул 13',
  's03-m01': 'Marketing Basics – Модул 01',
  's03-m02': 'Marketing Basics – Модул 02',
  's03-m03': 'Marketing Basics – Модул 03',
  's03-m04': 'Marketing Basics – Модул 04',
  's03-m05': 'Marketing Basics – Модул 05',
  's03-m06': 'Marketing Basics – Модул 06',
  's03-m07': 'Marketing Basics – Модул 07',
  's03-m08': 'Marketing Basics – Модул 08',
  's03-m09': 'Marketing Basics – Модул 09',
  's03-m10': 'Marketing Basics – Модул 10',
};

export default function HomeworkTab() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandId, setExpandId] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchHomeworks = useCallback(async () => {
    setLoading(true);
    const { data: hws, error } = await supabase
      .from('homework')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !hws) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set((hws as HomeworkItem[]).map((h) => h.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    const profileMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
    if (profiles) {
      profiles.forEach((p: { id: string; full_name: string | null; avatar_url: string | null }) => {
        profileMap[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
      });
    }

    const merged = (hws as HomeworkItem[]).map((h) => ({
      ...h,
      full_name: profileMap[h.user_id]?.full_name || null,
      avatar_url: profileMap[h.user_id]?.avatar_url || null,
    }));

    setHomeworks(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('homework').update({ status }).eq('id', id);
    fetchHomeworks();
  };

  const addNote = async (hwId: string) => {
    const hw = homeworks.find((h) => h.id === hwId);
    if (!hw || !noteText.trim()) return;
    setSaving(true);
    const updatedContent = hw.content + '\n\n---\n📝 Бележка от ментор (' + new Date().toLocaleString('bg-BG') + '):\n' + noteText.trim();
    await supabase.from('homework').update({ content: updatedContent, status: 'прегледана' }).eq('id', hwId);
    setSaving(false);
    setNoteText('');
    setNoteOpen(null);
    fetchHomeworks();
  };

  const filtered = filterStatus
    ? homeworks.filter((h) => h.status === filterStatus)
    : homeworks;

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = homeworks.filter((h) => h.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {STATUS_OPTIONS.map((s) => (
          <div key={s} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                s === 'нова' ? 'bg-amber-500' :
                s === 'одобрена' ? 'bg-[#1B4332]' :
                s === 'върната за корекции' ? 'bg-red-500' :
                'bg-[#0A2540]/65'
              }`} />
              <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">{s}</span>
            </div>
            <div className="text-2xl font-light text-[#0A2540]">{statusCounts[s] || 0}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1 mb-4">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-2 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            !filterStatus ? 'bg-[#0A2540] text-white' : 'bg-white border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:text-[#1C1C1E]'
          }`}
        >
          Всички
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-2 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === s ? 'bg-[#0A2540] text-white' : 'bg-white border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:text-[#1C1C1E]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
          <i className="ri-file-text-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
          <p className="text-sm text-[#1C1C1E]/65">Няма домашни в тази категория.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((hw) => (
            <div
              key={hw.id}
              className={`bg-white rounded-xl border p-4 md:p-5 ${
                hw.status === 'нова' ? 'border-amber-200 bg-amber-50/30' :
                hw.status === 'одобрена' ? 'border-[#1B4332]/20' :
                hw.status === 'върната за корекции' ? 'border-red-200 bg-red-50/30' :
                'border-[#1C1C1E]/8'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="shrink-0 flex items-start gap-3 sm:w-48">
                  <div className="w-9 h-9 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
                    {hw.avatar_url ? (
                      <img src={hw.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <i className="ri-user-line text-[#0A2540]/65 text-sm" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#1C1C1E] truncate">{hw.full_name || 'Потребител'}</div>
                    <div className="text-[10px] text-[#1C1C1E]/65">{new Date(hw.submitted_at).toLocaleString('bg-BG')}</div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]/65 whitespace-nowrap">
                      {MODULE_LABELS[hw.module_id] || hw.module_id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                      hw.status === 'нова' ? 'bg-amber-100 text-amber-700' :
                      hw.status === 'одобрена' ? 'bg-[#1B4332]/10 text-[#1B4332]' :
                      hw.status === 'върната за корекции' ? 'bg-red-100 text-red-600' :
                      'bg-[#1C1C1E]/8 text-[#1C1C1E]/65'
                    }`}>
                      {hw.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandId(expandId === hw.id ? null : hw.id)}
                    className="text-left w-full cursor-pointer"
                  >
                    <p className={`text-xs text-[#1C1C1E]/65 leading-relaxed whitespace-pre-wrap ${expandId === hw.id ? '' : 'line-clamp-3'}`}>
                      {hw.content}
                    </p>
                    {hw.content.length > 200 && (
                      <span className="text-[10px] text-[#0A2540]/60 mt-1 inline-block">
                        {expandId === hw.id ? 'Скрий' : 'Виж цялото'}
                      </span>
                    )}
                  </button>

                  {noteOpen === hw.id && (
                    <div className="mt-3">
                      <textarea
                        value={noteText}
                        onChange={(e) => { if (e.target.value.length <= 500) setNoteText(e.target.value); }}
                        placeholder="Добавете бележка/коментар към домашното..."
                        rows={2}
                        className="w-full px-4 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#1C1C1E]/65">{noteText.length}/500</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setNoteOpen(null); setNoteText(''); }}
                            className="px-3 py-1.5 text-xs border border-[#1C1C1E]/12 text-[#1C1C1E]/65 rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Откажи
                          </button>
                          <button
                            onClick={() => addNote(hw.id)}
                            disabled={!noteText.trim() || saving}
                            className="px-4 py-1.5 text-xs bg-[#0A2540] text-white rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {saving ? 'Запазване...' : 'Добави бележка'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                  <select
                    value={hw.status}
                    onChange={(e) => updateStatus(hw.id, e.target.value)}
                    className="text-xs px-3 py-2 bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => {
                      setNoteOpen(noteOpen === hw.id ? null : hw.id);
                      setNoteText('');
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer"
                    title="Добави бележка"
                  >
                    <i className="ri-sticky-note-line text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}