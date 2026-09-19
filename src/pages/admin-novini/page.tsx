import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import MessagesTab from './components/MessagesTab';
import HomeworkTab from './components/HomeworkTab';
import PdfTab from './components/PdfTab';
import QuizTab from './components/QuizTab';
import LessonsTab from './components/LessonsTab';
import ContactMessagesTab from './components/ContactMessagesTab';
import LeadCapturesTab from './components/LeadCapturesTab';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  published: boolean;
  image_url: string;
  created_at?: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  email?: string;
}

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  interest: string;
  status: string;
  created_at: string;
}

const CATEGORIES = ['Агенция', 'SEO', 'Реклами', 'Видео', 'Клиенти', 'Обяви'];
const APP_STATUSES = ['нова', 'прегледана', 'одобрена', 'отказана'];

type Tab = 'news' | 'users' | 'applications' | 'messages' | 'homework' | 'pdfs' | 'quizzes' | 'lessons' | 'contacts' | 'leads';
type View = 'list' | 'create' | 'edit';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<Partial<NewsItem>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });
    if (!err && data) setNews(data as NewsItem[]);
  }, []);

  const fetchProfiles = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!err && data) setProfiles(data as Profile[]);
  }, []);

  const fetchApplications = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('course_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!err && data) setApplications(data as Application[]);
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchNews(), fetchProfiles(), fetchApplications()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchNews, fetchProfiles, fetchApplications]);

  const openCreate = () => {
    setForm({
      title: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      published: false,
      image_url: '',
    });
    setEditItem(null);
    setView('create');
    setError(null);
  };

  const openEdit = (item: NewsItem) => {
    setForm({ ...item });
    setEditItem(item);
    setView('edit');
    setError(null);
  };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.summary?.trim()) return;
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      category: form.category || CATEGORIES[0],
      date: form.date || new Date().toISOString().split('T')[0],
      summary: form.summary,
      content: form.content || '',
      published: form.published ?? false,
      image_url: form.image_url || '',
      updated_at: new Date().toISOString(),
    };

    if (view === 'create') {
      const { error: err } = await supabase.from('news').insert([payload]);
      if (err) { setError('Грешка при запазване: ' + err.message); setSaving(false); return; }
    } else if (editItem) {
      const { error: err } = await supabase.from('news').update(payload).eq('id', editItem.id);
      if (err) { setError('Грешка при обновяване: ' + err.message); setSaving(false); return; }
    }

    await fetchNews();
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView('list'); }, 1200);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('news').delete().eq('id', id);
    await fetchNews();
    setDeleteConfirm(null);
  };

  const togglePublish = async (item: NewsItem) => {
    await supabase.from('news').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    await fetchNews();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from('course_applications').update({ status }).eq('id', id);
    await fetchApplications();
  };

  const filteredNews = news.filter((n) => {
    const matchQ = n.title.toLowerCase().includes(searchQ.toLowerCase()) || n.summary.toLowerCase().includes(searchQ.toLowerCase());
    const matchCat = filterCat ? n.category === filterCat : true;
    return matchQ && matchCat;
  });

  const publishedCount = news.filter((n) => n.published).length;
  const newAppsCount = applications.filter((a) => a.status === 'нова').length;

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'news', label: 'Новини', icon: 'ri-newspaper-line', badge: news.length },
    { id: 'users', label: 'Потребители', icon: 'ri-user-line', badge: profiles.length },
    { id: 'applications', label: 'Кандидати', icon: 'ri-file-list-3-line', badge: newAppsCount || undefined },
    { id: 'messages', label: 'Съобщения', icon: 'ri-message-3-line' },
    { id: 'homework', label: 'Домашни', icon: 'ri-file-text-line' },
    { id: 'pdfs', label: 'PDF Уроци', icon: 'ri-file-pdf-2-line' },
    { id: 'quizzes', label: 'Куизове', icon: 'ri-question-line' },
    { id: 'lessons', label: 'Уроци', icon: 'ri-slideshow-line' },
    { id: 'contacts', label: 'Контакти', icon: 'ri-mail-line' },
    { id: 'leads', label: 'Лийдове', icon: 'ri-user-add-line' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top nav */}
      <nav className="bg-white border-b border-[#1C1C1E]/8 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-8 h-8 flex items-center justify-center text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors">
            <i className="ri-arrow-left-line text-sm" />
          </Link>
          <img src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862" alt="ТАВОРА" className="h-6 w-auto object-contain" />
          <div className="h-4 w-px bg-[#1C1C1E]/15" />
          <span className="text-sm font-medium text-[#1C1C1E]">Админ панел</span>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'news' && view === 'list' && (
            <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 bg-[#0A2540] text-white text-xs rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line text-sm" />
              Нова новина
            </button>
          )}
          {(view === 'create' || view === 'edit') && (
            <button onClick={() => setView('list')} className="text-xs text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors cursor-pointer px-3 py-2">
              ← Назад
            </button>
          )}
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login'); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#1C1C1E]/65 hover:text-red-500 border border-[#1C1C1E]/10 hover:border-red-200 rounded-lg transition-all cursor-pointer whitespace-nowrap"
            title="Излез"
          >
            <i className="ri-logout-box-line text-sm" />
            <span className="hidden sm:inline">Излез</span>
          </button>
        </div>
      </nav>

      {/* Tab bar */}
      <div className="bg-white border-b border-[#1C1C1E]/8 px-4 md:px-8">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setView('list'); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${tab === t.id ? 'border-[#0A2540] text-[#0A2540]' : 'border-transparent text-[#1C1C1E]/65 hover:text-[#1C1C1E]'}`}
            >
              <i className={`${t.icon} text-sm`} />
              <span className="hidden sm:inline">{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-[#0A2540]/10 text-[#0A2540]' : 'bg-[#1C1C1E]/8 text-[#1C1C1E]/65'}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ===== NEWS TAB ===== */}
            {tab === 'news' && view === 'list' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Общо', value: news.length, icon: 'ri-newspaper-line' },
                    { label: 'Публикувани', value: publishedCount, icon: 'ri-eye-line' },
                    { label: 'Чернови', value: news.length - publishedCount, icon: 'ri-draft-line' },
                    { label: 'Категории', value: [...new Set(news.map((n) => n.category))].length, icon: 'ri-price-tag-3-line' },
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

                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#1C1C1E]/70 text-sm pointer-events-none" />
                    <input type="text" placeholder="Търси новина..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
                  </div>
                  <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer">
                    <option value="">Всички категории</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {filteredNews.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
                    <i className="ri-newspaper-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
                    <p className="text-sm text-[#1C1C1E]/65">Няма новини. Добавете първата!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNews.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 flex flex-col sm:flex-row gap-4">
                        {item.image_url && (
                          <div className="w-full sm:w-24 h-16 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover object-top" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#0A2540]/15 text-[#0A2540]/60">{item.category}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.published ? 'bg-[#1B4332]/10 text-[#1B4332]' : 'bg-[#1C1C1E]/8 text-[#1C1C1E]/65'}`}>
                              {item.published ? 'Публикувана' : 'Чернова'}
                            </span>
                            <span className="text-[10px] text-[#1C1C1E]/70">{item.date}</span>
                          </div>
                          <h3 className="text-sm font-medium text-[#1C1C1E] mb-0.5 truncate">{item.title}</h3>
                          <p className="text-xs text-[#1C1C1E]/65 line-clamp-1">{item.summary}</p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer" title="Редактирай">
                            <i className="ri-edit-line text-sm" />
                          </button>
                          <button onClick={() => togglePublish(item)} className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${item.published ? 'border-[#1B4332]/20 text-[#1B4332]' : 'border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:text-[#1B4332]'}`} title={item.published ? 'Скрий' : 'Публикувай'}>
                            <i className={`${item.published ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
                          </button>
                          <button onClick={() => setDeleteConfirm(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/70 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer" title="Изтрий">
                            <i className="ri-delete-bin-line text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ===== NEWS CREATE/EDIT ===== */}
            {tab === 'news' && (view === 'create' || view === 'edit') && (
              <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-6 md:p-8">
                <h2 className="text-lg font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {view === 'create' ? 'Нова новина' : 'Редактирай новина'}
                </h2>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>
                )}
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Заглавие *</label>
                    <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Заглавие на новината..." className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Категория</label>
                      <select value={form.category || CATEGORIES[0]} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer">
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Дата</label>
                      <input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">URL на изображение</label>
                    <input type="text" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
                    {form.image_url && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-[#1C1C1E]/8">
                        <img src={form.image_url} alt="preview" className="w-full h-full object-cover object-top" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Кратко описание * <span className="normal-case text-[#1C1C1E]/25">(показва се в списъка)</span></label>
                    <textarea value={form.summary || ''} onChange={(e) => { if (e.target.value.length <= 300) setForm({ ...form, summary: e.target.value }); }} placeholder="Кратко описание..." rows={3} className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
                    <div className="text-[10px] text-[#1C1C1E]/70 mt-1 text-right">{(form.summary || '').length}/300</div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Пълен текст <span className="normal-case text-[#1C1C1E]/25">(по желание)</span></label>
                    <textarea value={form.content || ''} onChange={(e) => { if (e.target.value.length <= 500) setForm({ ...form, content: e.target.value }); }} placeholder="Пълен текст..." rows={6} className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
                    <div className="text-[10px] text-[#1C1C1E]/70 mt-1 text-right">{(form.content || '').length}/500</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setForm({ ...form, published: !form.published })} className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${form.published ? 'bg-[#1B4332]' : 'bg-[#1C1C1E]/15'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${form.published ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm text-[#1C1C1E]/60">{form.published ? 'Публикувана' : 'Чернова'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button onClick={handleSave} disabled={!form.title?.trim() || !form.summary?.trim() || saving} className="flex-1 sm:flex-none px-6 py-3 bg-[#0A2540] text-white text-sm rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                      {saving ? 'Запазване...' : saved ? '✓ Запазено!' : 'Запази'}
                    </button>
                    <button onClick={() => setView('list')} className="flex-1 sm:flex-none px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap">
                      Откажи
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== USERS TAB ===== */}
            {tab === 'users' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Регистрирани', value: profiles.length, icon: 'ri-user-line' },
                    { label: 'Тази седмица', value: profiles.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 86400000)).length, icon: 'ri-user-add-line' },
                    { label: 'С профил', value: profiles.filter(p => p.full_name).length, icon: 'ri-user-settings-line' },
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

                {profiles.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
                    <i className="ri-user-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
                    <p className="text-sm text-[#1C1C1E]/65">Все още няма регистрирани потребители.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#1C1C1E]/8 overflow-hidden">
                    <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 border-b border-[#1C1C1E]/6 bg-[#F7F6F3]">
                      <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Потребител</span>
                      <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">ID</span>
                      <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Регистриран</span>
                      <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">Статус</span>
                    </div>
                    {profiles.map((p, i) => (
                      <div key={p.id} className={`flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-4 ${i < profiles.length - 1 ? 'border-b border-[#1C1C1E]/6' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
                            {p.avatar_url ? (
                              <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <i className="ri-user-line text-[#0A2540]/65 text-sm" />
                            )}
                          </div>
                          <span className="text-sm text-[#1C1C1E] font-medium">{p.full_name || 'Без име'}</span>
                        </div>
                        <span className="text-xs text-[#1C1C1E]/65 font-mono truncate self-center">{p.id.slice(0, 12)}...</span>
                        <span className="text-xs text-[#1C1C1E]/65 self-center">{new Date(p.created_at).toLocaleDateString('bg-BG')}</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] self-center w-fit">Активен</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ===== APPLICATIONS TAB ===== */}
            {tab === 'applications' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Общо', value: applications.length, icon: 'ri-file-list-3-line' },
                    { label: 'Нови', value: applications.filter(a => a.status === 'нова').length, icon: 'ri-mail-unread-line' },
                    { label: 'Одобрени', value: applications.filter(a => a.status === 'одобрена').length, icon: 'ri-check-line' },
                    { label: 'Отказани', value: applications.filter(a => a.status === 'отказана').length, icon: 'ri-close-line' },
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

                {applications.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
                    <i className="ri-file-list-3-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
                    <p className="text-sm text-[#1C1C1E]/65">Все още няма кандидати за курса.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-[#1C1C1E]">{app.first_name} {app.last_name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                                app.status === 'нова' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                app.status === 'одобрена' ? 'bg-[#1B4332]/10 text-[#1B4332]' :
                                app.status === 'отказана' ? 'bg-red-50 text-red-500' :
                                'bg-[#1C1C1E]/8 text-[#1C1C1E]/65'
                              }`}>{app.status}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                              <a href={`mailto:${app.email}`} className="text-xs text-[#0A2540]/60 hover:text-[#0A2540] transition-colors flex items-center gap-1">
                                <i className="ri-mail-line text-xs" />{app.email}
                              </a>
                              {app.phone && (
                                <a href={`tel:${app.phone}`} className="text-xs text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors flex items-center gap-1">
                                  <i className="ri-phone-line text-xs" />{app.phone}
                                </a>
                              )}
                            </div>
                            {app.interest && <div className="text-[10px] text-[#1C1C1E]/65 mb-1">Интерес: <span className="text-[#0A2540]/65">{app.interest}</span></div>}
                            {app.message && <p className="text-xs text-[#1C1C1E]/65 leading-relaxed line-clamp-2">{app.message}</p>}
                            <div className="text-[10px] text-[#1C1C1E]/25 mt-2">{new Date(app.created_at).toLocaleString('bg-BG')}</div>
                          </div>
                          <div className="shrink-0">
                            <select
                              value={app.status}
                              onChange={(e) => updateAppStatus(app.id, e.target.value)}
                              className="text-xs px-3 py-2 bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
                            >
                              {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ===== MESSAGES TAB ===== */}
            {tab === 'messages' && <MessagesTab />}

            {/* ===== HOMEWORK TAB ===== */}
            {tab === 'homework' && <HomeworkTab />}

            {/* ===== PDF TAB ===== */}
            {tab === 'pdfs' && <PdfTab />}
            {tab === 'quizzes' && <QuizTab />}
            {tab === 'lessons' && <LessonsTab />}

            {/* ===== CONTACTS TAB ===== */}
            {tab === 'contacts' && <ContactMessagesTab />}

            {/* ===== LEADS TAB ===== */}
            {tab === 'leads' && <LeadCapturesTab />}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-6 max-w-sm w-full">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-lg" />
            </div>
            <h3 className="text-base font-medium text-[#1C1C1E] text-center mb-2">Изтрий новина?</h3>
            <p className="text-xs text-[#1C1C1E]/65 text-center mb-5">Това действие не може да бъде отменено.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer">Откажи</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors cursor-pointer">Изтрий</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
