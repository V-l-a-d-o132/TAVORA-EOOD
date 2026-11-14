import { useState } from 'react';

export default function ProjectPrompt({ text, buttonLabel }: { text: string; buttonLabel: string }) {
  const [result, setResult] = useState<{ text: string; message: string } | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, message: 'Копирано.' });
    } catch {
      setResult({ text, message: 'Маркирай текста над бутона и избери „Копирай“.' });
    }
  }

  return <div className="space-y-2">
    <p className="select-text whitespace-pre-line break-words rounded-lg border academy-border academy-surface p-3">{text}</p>
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="min-h-11 rounded-lg border academy-border px-3 py-2 text-sm font-semibold academy-body hover:academy-tint focus-visible:outline focus-visible:outline-2">{buttonLabel}</button>
      <span role="status">{result?.text === text && result.message}</span>
    </div>
  </div>;
}
