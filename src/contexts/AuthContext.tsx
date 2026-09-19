import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hasFullAccess: boolean;
  unlockedModules: string[];
  accessLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  hasFullAccess: false,
  unlockedModules: [],
  accessLoading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

// ── localStorage keys — session-scoped guards ──
const LS_WELCOME_KEY = 'tavora_welcome_done';
const LS_ABANDONED_KEY = 'tavora_abandoned_done';
const LS_DOWNSELL_KEY = 'tavora_downsell_done';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [accessLoading, setAccessLoading] = useState(true);

  // Track which user ID we've already processed to prevent duplicate checks
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);
  const checkingRef = useRef(false);

  // ── Fetch profile access data (reusable) ──
  const fetchProfileAccess = useCallback(async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('has_full_access, unlocked_modules')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[auth] refreshProfile fetch error:', error.message);
      return;
    }

    setHasFullAccess(!!profile?.has_full_access);
    setUnlockedModules(
      Array.isArray(profile?.unlocked_modules) ? profile.unlocked_modules : [],
    );
  }, []);

  // ── Public refresh function ──
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    setAccessLoading(true);
    await fetchProfileAccess(user.id);
    setAccessLoading(false);
  }, [user?.id, fetchProfileAccess]);

  // ── Profile init + email triggers + last_login update ──
  // Fires ONCE per user.id. Uses user.id as dep, not user object ref.
  useEffect(() => {
    if (!user?.id) return;
    if (checkedUserId === user.id) return;
    if (checkingRef.current) return;

    checkingRef.current = true;
    setCheckedUserId(user.id);

    const run = async () => {
      try {
        // Step 1: Fetch profile — capture the OLD last_login_at
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('welcome_email_sent, abandoned_checkout_at, abandoned_cart_email_sent, downsell_email_sent, downsell_email_sent_at, last_login_at, has_full_access, unlocked_modules')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('[auth] Profile fetch error:', profileError.message);
        }

        // If profile is null, create one immediately
        if (!profile) {
          console.warn('[auth] No profile found for user, creating one...');
          const { error: insertError } = await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email || 'Student',
            role: 'student',
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
          });
          if (insertError) {
            console.error('[auth] Profile insert error:', insertError.message);
          }
          setHasFullAccess(false);
          setUnlockedModules([]);
          setAccessLoading(false);
          checkingRef.current = false;
          return;
        }

        const oldLastLoginAt = profile.last_login_at;
        const hasAccess = !!profile.has_full_access ||
          (Array.isArray(profile.unlocked_modules) && profile.unlocked_modules.length > 0);

        setHasFullAccess(!!profile.has_full_access);
        setUnlockedModules(
          Array.isArray(profile.unlocked_modules) ? profile.unlocked_modules : [],
        );
        setAccessLoading(false);

        const baseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
        const { data: { session: edgeSession } } = await supabase.auth.getSession();
        const edgeToken = edgeSession?.access_token;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (edgeToken) headers.Authorization = `Bearer ${edgeToken}`;

        // ── WELCOME EMAIL ──
        const welcomeDone = localStorage.getItem(LS_WELCOME_KEY) === user.id;
        if (!welcomeDone && !profile.welcome_email_sent) {
          localStorage.setItem(LS_WELCOME_KEY, user.id);
          try {
            await fetch(`${baseUrl}/functions/v1/send-welcome-email`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ user_id: user.id }),
            });
          } catch (e) { console.error('[auth] Welcome fetch failed:', e); }
        }

        // ── ABANDONED CART EMAIL ──
        const abandonedDone = localStorage.getItem(LS_ABANDONED_KEY) === user.id;
        if (!abandonedDone && !hasAccess) {
          if (profile.abandoned_checkout_at && !profile.abandoned_cart_email_sent) {
            try {
              const res = await fetch(`${baseUrl}/functions/v1/send-abandoned-cart-email`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ user_id: user.id }),
              });
              const data = await res.json();
              if (data?.sent) {
                localStorage.setItem(LS_ABANDONED_KEY, user.id);
              }
            } catch (e) { console.error('[auth] Abandoned cart fetch failed:', e); }
          }
        }

        // ── DOWNSELL EMAIL ──
        // Only send if: user has no access, hasn't received downsell before,
        // AND it's been >= 2 hours since their FIRST ever login (oldLastLoginAt).
        // oldLastLoginAt is read from DB BEFORE we update it below.
        const downsellDone = localStorage.getItem(LS_DOWNSELL_KEY) === user.id;
        if (!downsellDone && !hasAccess && !profile.downsell_email_sent) {
          if (oldLastLoginAt) {
            const loginTime = new Date(oldLastLoginAt).getTime();
            const twoHours = 2 * 60 * 60 * 1000;
            if (Date.now() - loginTime >= twoHours) {
              try {
                const res = await fetch(`${baseUrl}/functions/v1/send-downsell-email`, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({
                    user_id: user.id,
                    old_last_login_at: oldLastLoginAt,
                  }),
                });
                const data = await res.json();
                if (data?.sent) {
                  localStorage.setItem(LS_DOWNSELL_KEY, user.id);
                }
              } catch (e) { console.error('[auth] Downsell fetch failed:', e); }
            }
          }
        }

        // Mark localStorage guards for users who already have access
        if (hasAccess) {
          if (!abandonedDone) localStorage.setItem(LS_ABANDONED_KEY, user.id);
          if (!downsellDone) localStorage.setItem(LS_DOWNSELL_KEY, user.id);
        }

        // Step 3: Update last_login_at AFTER all checks — use UPDATE not UPSERT
        // to avoid race conditions with NOT NULL columns on INSERT path.
        const now = Date.now();
        const oneHourMs = 60 * 60 * 1000;
        if (!oldLastLoginAt || (now - new Date(oldLastLoginAt).getTime() > oneHourMs)) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', user.id);
          if (updateError) {
            console.error('[auth] last_login_at update failed:', updateError.message);
          }
        }
      } catch (e) {
        console.error('[auth] Profile initialisation failed:', e);
        setAccessLoading(false);
      } finally {
        checkingRef.current = false;
      }
    };

    run();
  }, [user?.id]); // Only re-run when user.id changes (login/logout/switch)

  // ── Auth state listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (!s?.user) setAccessLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    setCheckedUserId(null);
    checkingRef.current = false;
    localStorage.removeItem(LS_DOWNSELL_KEY);
    localStorage.removeItem(LS_ABANDONED_KEY);
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, hasFullAccess, unlockedModules, accessLoading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}