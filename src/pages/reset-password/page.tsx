import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false);
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (active && event === "PASSWORD_RECOVERY" && session) {
          setReady(true);
          setLoading(false);
        }
      },
    );
    // getSession waits for the SDK to consume a recovery URL (including expired links).
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setReady(!!data.session && !error);
      setLoading(false);
      if (error) setError("Линкът е невалиден или е изтекъл. Поискай нов.");
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 12) {
      setError("Използвай поне 12 символа.");
      return;
    }
    if (password !== confirm) {
      setError("Паролите не съвпадат.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError("Паролата не беше сменена. Провери линка и опитай отново.");
        return;
      }
      setDone(true);
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      setError("Проблем с връзката. Опитай отново.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-5">
      <section className="w-full max-w-md bg-white rounded-2xl border p-8">
        <h1 className="text-2xl mb-5">Нова парола</h1>
        {loading ? <p role="status">Проверяваме линка…</p> : done
          ? (
            <>
              <p role="status">Паролата е сменена успешно.</p>
              <Link to="/login">Влез с новата парола</Link>
            </>
          )
          : !ready
          ? (
            <>
              <p role="alert">Линкът е невалиден или е изтекъл.</p>
              <Link to="/forgot-password">Поискай нов линк</Link>
            </>
          )
          : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                Нова парола<input
                  aria-label="Нова парола"
                  className="block w-full border rounded p-3"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="block">
                Повтори паролата<input
                  aria-label="Повтори паролата"
                  className="block w-full border rounded p-3"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              {error && <p role="alert" className="text-red-700">{error}</p>}
              <button
                disabled={saving}
                className="w-full bg-black text-white p-3 rounded"
              >
                {saving ? "Запазваме…" : "Запази паролата"}
              </button>
            </form>
          )}
      </section>
    </main>
  );
}
