interface Props { moduleId: string }

export default function VideoPracticeBridge({ moduleId }: Props) {
  if (moduleId === 's02-m15') return <p className="mb-5 rounded-2xl border academy-border p-4 text-sm leading-6 academy-body">Финалният проект е учебен казус с готови материали и избор на решения. Изпитите проверяват знания и преценка по зададените условия; не оценяват собствен заснет клип. Всичко необходимо за отговорите е в курса.</p>;
  if (/^s02-m0[4-9]$/.test(moduleId)) return <details className="mb-5 rounded-2xl border academy-border p-4 text-sm leading-6 academy-body">
    <summary className="cursor-pointer font-semibold academy-text">Как тези решения се прилагат в редактор</summary>
    <p className="mt-3">Работният ред е: оригинали → проект → подредени кадри и звук → изнесен файл → преглед на файла. Проектът пази решенията за монтаж; крайният файл е това, което зрителят ще възпроизвежда.</p>
    <p className="mt-3">Имената на бутоните зависят от програмата. Уроците показват какво трябва да постигне всяка стъпка, а проверките използват готови случаи. Демонстрациите за кадър, темпо и звук са достъпни <a href="/academy-labs/perfect-video/start" className="academy-accent underline underline-offset-4">в учебната работна маса</a>.</p>
  </details>;
  return null;
}
