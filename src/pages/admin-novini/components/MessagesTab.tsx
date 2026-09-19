import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  user_id: string;
  subject: string;
  content: string;
  reply: string | null;
  is_read: boolean;
  created_at: string;
  replied_at: string | null;
}

interface MessageWithProfile extends Message {
  full_name: string | null;
  avatar_url: string | null;
}

export default function MessagesTab() {
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [expandId, setExpandId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data: msgs, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !msgs) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set((msgs as Message[]).map((m) => m.user_id))];
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

    const merged = (msgs as Message[]).map((m) => ({
      ...m,
      full_name: profileMap[m.user_id]?.full_name || null,
      avatar_url: profileMap[m.user_id]?.avatar_url || null,
    }));

    setMessages(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendReply = async (msgId: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    await supabase
      .from('messages')
      .update({
        reply: replyText.trim(),
        is_read: true,
        replied_at: new Date().toISOString(),
      })
      .eq('id', msgId);
    setSending(false);
    setReplyText('');
    setReplyOpen(null);
    fetchMessages();
  };

  const markAsRead = async (msgId: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', msgId);
    fetchMessages();
  };

  const markAsUnread = async (msgId: string) => {
    await supabase.from('messages').update({ is_read: false }).eq('id', msgId);
    fetchMessages();
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read && !m.reply;
    if (filter === 'replied') return !!m.reply;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read && !m.reply).length;
  const repliedCount = messages.filter((m) => !!m.reply).length;

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
        {[
          { label: 'Общо', value: messages.length, icon: 'ri-message-3-line' },
          { label: 'Непрочетени', value: unreadCount, icon: 'ri-mail-unread-line' },
          { label: 'Отговорени', value: repliedCount, icon: 'ri-mail-check-line' },
          { label: 'Чакащи', value: messages.filter((m) => !m.reply).length, icon: 'ri-timer-line' },
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

      <div className="flex items-center gap-1 mb-4">
        {([
          { id: 'all', label: 'Всички', icon: 'ri-inbox-line' },
          { id: 'unread', label: 'Непрочетени', icon: 'ri-mail-unread-line' },
          { id: 'replied', label: 'Отговорени', icon: 'ri-mail-check-line' },
        ] as const).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === f.id
                ? 'bg-[#0A2540] text-white'
                : 'bg-white border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:text-[#1C1C1E]'
            }`}
          >
            <i className={`${f.icon} text-xs`} />
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
          <i className="ri-message-3-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
          <p className="text-sm text-[#1C1C1E]/65">Няма съобщения в тази категория.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl border p-4 md:p-5 transition-all ${
                !msg.is_read && !msg.reply ? 'border-amber-200 bg-amber-50/30' : 'border-[#1C1C1E]/8'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="shrink-0 flex items-start gap-3 sm:w-48">
                  <div className="w-9 h-9 rounded-full bg-[#0A2540]/8 flex items-center justify-center shrink-0">
                    {msg.avatar_url ? (
                      <img src={msg.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <i className="ri-user-line text-[#0A2540]/65 text-sm" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#1C1C1E] truncate">{msg.full_name || 'Потребител'}</div>
                    <div className="text-[10px] text-[#1C1C1E]/65">{new Date(msg.created_at).toLocaleString('bg-BG')}</div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-medium text-[#1C1C1E]">{msg.subject}</h3>
                    {!msg.is_read && !msg.reply && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                    )}
                    {msg.reply && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] whitespace-nowrap">Отговорено</span>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandId(expandId === msg.id ? null : msg.id)}
                    className="text-left w-full cursor-pointer"
                  >
                    <p className={`text-xs text-[#1C1C1E]/65 leading-relaxed ${expandId === msg.id ? '' : 'line-clamp-2'}`}>
                      {msg.content}
                    </p>
                    {msg.content.length > 150 && (
                      <span className="text-[10px] text-[#0A2540]/60 mt-1 inline-block">
                        {expandId === msg.id ? 'Скрий' : 'Виж цялото'}
                      </span>
                    )}
                  </button>

                  {msg.reply && (
                    <div className="mt-3 p-3 bg-[#F7F6F3] rounded-lg border border-[#1C1C1E]/6">
                      <div className="flex items-center gap-1.5 mb-1">
                        <i className="ri-reply-line text-[10px] text-[#1B4332]" />
                        <span className="text-[10px] text-[#1B4332] font-medium">Вашият отговор</span>
                        <span className="text-[10px] text-[#1C1C1E]/25">
                          {msg.replied_at ? new Date(msg.replied_at).toLocaleString('bg-BG') : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{msg.reply}</p>
                    </div>
                  )}

                  {replyOpen === msg.id && (
                    <div className="mt-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => { if (e.target.value.length <= 500) setReplyText(e.target.value); }}
                        placeholder="Напишете отговор..."
                        rows={3}
                        className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#1C1C1E]/65">{replyText.length}/500</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setReplyOpen(null); setReplyText(''); }}
                            className="px-3 py-1.5 text-xs border border-[#1C1C1E]/12 text-[#1C1C1E]/65 rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Откажи
                          </button>
                          <button
                            onClick={() => handleSendReply(msg.id)}
                            disabled={!replyText.trim() || sending}
                            className="px-4 py-1.5 text-xs bg-[#0A2540] text-white rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            {sending ? 'Изпращане...' : 'Изпрати отговор'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                  {!msg.reply && (
                    <button
                      onClick={() => {
                        setReplyOpen(replyOpen === msg.id ? null : msg.id);
                        setReplyText('');
                        if (!msg.is_read) markAsRead(msg.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 transition-colors cursor-pointer"
                      title="Отговори"
                    >
                      <i className="ri-reply-line text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => (msg.is_read ? markAsUnread(msg.id) : markAsRead(msg.id))}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                      msg.is_read
                        ? 'border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:text-[#0A2540]'
                        : 'border-amber-200 text-amber-500 hover:text-amber-600'
                    }`}
                    title={msg.is_read ? 'Маркирай като непрочетено' : 'Маркирай като прочетено'}
                  >
                    <i className={`${msg.is_read ? 'ri-mail-open-line' : 'ri-mail-line'} text-sm`} />
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