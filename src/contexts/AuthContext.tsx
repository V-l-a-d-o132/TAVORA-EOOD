import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [accessLoading, setAccessLoading] = useState(true);
  const identity = useRef<string | null>(null);
  const user = session?.user ?? null;
  const refreshProfile = useCallback(async () => {
    const id = identity.current;
    if (!id) return;
    setAccessLoading(true);
    try {
      const { data, error } = await supabase.from("profiles")
        .select("has_full_access,unlocked_modules").eq("id", id).maybeSingle();
      if (identity.current !== id) return;
      setHasFullAccess(!error && !!data?.has_full_access);
      setUnlockedModules(
        !error && Array.isArray(data?.unlocked_modules)
          ? data.unlocked_modules
          : [],
      );
    } finally {
      if (identity.current === id) setAccessLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let observed = false;
    const accept = (s: Session | null) => {
      if (!active) return;
      const id = s?.user.id ?? null;
      if (identity.current !== id) {
        identity.current = id;
        setHasFullAccess(false);
        setUnlockedModules([]);
        setAccessLoading(!!id);
      }
      setSession(s);
      setLoading(false);
      if (!id) setAccessLoading(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        observed = true;
        // No awaited Supabase calls inside the auth lock.
        accept(s);
      },
    );
    void supabase.auth.getSession().then(({ data }) => {
      if (!observed) accept(data.session);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const id = user?.id;
    if (!id) return;
    let active = true;
    void refreshProfile();
    // Server verifies ownership, eligibility and deduplicates each email.
    void (async () => {
      for (
        const name of [
          "send-welcome-email",
          "send-abandoned-cart-email",
          "send-downsell-email",
        ]
      ) {
        if (!active || identity.current !== id) return;
        await supabase.functions.invoke(name, { body: { user_id: id } });
      }
      if (active && identity.current === id) {
        await supabase.from("profiles").update({
          last_login_at: new Date().toISOString(),
        }).eq("id", id);
      }
    })().catch(() => {/* An email failure must not block login. */});
    return () => {
      active = false;
    };
  }, [user?.id, refreshProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    identity.current = null;
    setSession(null);
    setHasFullAccess(false);
    setUnlockedModules([]);
    setAccessLoading(false);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        hasFullAccess,
        unlockedModules,
        accessLoading,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
