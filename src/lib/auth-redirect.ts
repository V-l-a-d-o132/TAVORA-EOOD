export function safeRedirect(value: string | null, fallback = "/kurs"): string {
  if (
    !value || !value.startsWith("/") || value.startsWith("//") ||
    value.includes("\\") || [...value].some((c) => c.charCodeAt(0) <= 32)
  ) return fallback;
  try {
    const target = new URL(value, "https://academy.invalid");
    return target.origin === "https://academy.invalid"
      ? target.pathname + target.search + target.hash
      : fallback;
  } catch {
    return fallback;
  }
}
