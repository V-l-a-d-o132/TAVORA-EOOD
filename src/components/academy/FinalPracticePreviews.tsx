import { studioBudget, studioCalculation, studioPlaylist, type ClosedStudio, type StudioBoard, type StudioChoice } from '@/lib/closed-practice-studio';

const number = (value: number) => value.toLocaleString('bg-BG', { maximumFractionDigits: 2 });

export function MetricsPreview({ studio, matches }: { studio: ClosedStudio; matches: Record<string, string> }) {
  const selected = studioPlaylist(studio, matches), report = studio.report;
  const focus = [...selected].reverse().find(choice => choice.focus)?.focus;
  const maxTime = Math.max(1, ...(report?.points.map(p => p.at) || []));
  const maxValue = Math.max(100, ...(report?.points.map(p => p.value) || []));
  const x = (at: number) => 45 + at / maxTime * 400, y = (value: number) => 175 - value / maxValue * 140;
  return <div className="space-y-4 text-sm leading-6 academy-body">
    {report && <figure>
      <figcaption className="mb-2 font-medium academy-text">{report.title}</figcaption>
      <svg viewBox="0 0 480 215" role="img" aria-label="Учебна крива на задържане; точните стойности са дадени под графиката" className="w-full rounded-lg academy-raised">
        {focus && <rect x={x(Math.min(focus[0], maxTime))} y="25" width={Math.max(0, x(Math.min(focus[1], maxTime)) - x(Math.min(focus[0], maxTime)))} height="150" fill="currentColor" opacity=".12" />}
        <path d="M45 25V175H450" fill="none" stroke="currentColor" opacity=".5" />
        <polyline points={report.points.map(p => `${x(p.at)},${y(p.value)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="3" />
        {report.points.map(p => <circle key={p.at} cx={x(p.at)} cy={y(p.value)} r="3" fill="currentColor" />)}
        <text x="5" y="25" fill="currentColor" fontSize="12">{maxValue}%</text><text x="18" y="179" fill="currentColor" fontSize="12">0</text>
        <text x="45" y="202" fill="currentColor" fontSize="12">0 сек.</text><text x="405" y="202" fill="currentColor" fontSize="12">{maxTime} сек.</text>
      </svg>
      <p className="mt-2 text-xs academy-muted">{report.points.map(p => `${p.at} сек.: ${p.value}%`).join(' · ')}</p>
      {focus && <p className="mt-2">Избран за преглед интервал: {focus[0]}–{focus[1]} сек. Маркирането показва къде да погледнеш; не установява причината за поведението.</p>}
    </figure>}
    <ol aria-label="Избрани сметки" className="space-y-3">{selected.filter(c => c.calculation).map(choice => {
      const calculation = choice.calculation!, result = studioCalculation(calculation);
      return <li key={choice.id} className="rounded-lg border academy-border academy-raised p-3">
        <p className="font-semibold academy-text">{calculation.label}</p>
        <p>{number(calculation.a)} ({calculation.aLabel}) {calculation.operation === 'multiply' ? '×' : '÷'} {number(calculation.b)} ({calculation.bLabel}){calculation.operation === 'percent' ? ' × 100' : ''}</p>
        <p className="mt-1 font-medium academy-text">{result === null ? 'Липсва валиден знаменател.' : `${number(result)} ${calculation.unit}`}</p>
      </li>;
    })}</ol>
    {!selected.length && <p>Избери сметка или интервал. Прегледът ще покаже какво точно си сравнил.</p>}
    <p className="text-xs academy-muted">Данните са измислени за упражнението. Сметката не проверява сама дали периодът, аудиторията и мерните единици съвпадат.</p>
  </div>;
}

export function BudgetPreview({ choice }: { choice?: StudioChoice }) {
  if (!choice?.budget) return <p className="text-sm academy-muted">Избери разчет, за да сравниш труда, разходите и цената.</p>;
  const b = choice.budget, result = studioBudget(b);
  const rows = [['Труд', `${number(b.hours)} ч. × ${number(b.hourly)} = ${number(result.labour)}`], ['Други дадени разходи', number(b.external)], ['Резерв върху сбора', `${number(b.reservePercent)}% = ${number(result.reserve)}`], ['Обща учебна основа', number(result.cost)],
    ...(b.price === undefined ? [] : [['Избрана цена', number(b.price)], ['Разлика цена − основа', number(result.difference!)], ['Надценка върху основата', result.markup === null ? 'Не се изчислява при нулева основа.' : `${number(result.markup)}%`], ['Марж спрямо цената', result.margin === null ? 'Не се изчислява при нулева цена.' : `${number(result.margin)}%`]])];
  return <div className="space-y-3 text-sm leading-6 academy-body">
    <dl aria-label="Учебен разчет" className="space-y-2">{rows.map(([label, value]) => <div key={label} className="rounded-lg border academy-border academy-raised p-3"><dt>{label}</dt><dd className="font-semibold academy-text">{value}</dd></div>)}</dl>
    <p>Паричните стойности са в условни учебни единици. Основата включва само разходите, дадени в случая. Разликата не е удостоверена нетна печалба.</p>
  </div>;
}

/** Native drawings are deliberately schematic: they do not impersonate footage. */
function BreadScene({ board }: { board: StudioBoard }) {
  const loaf = (cx: number, cy: number) => <g><ellipse cx={cx} cy={cy} rx="36" ry="19" fill="#d99a42" stroke="#633b19" strokeWidth="2" /><path d={`M${cx - 16} ${cy - 12}l-5 12m20-14l-5 15m20-11l-5 12`} stroke="#fff0c9" strokeWidth="3" /></g>;
  return <svg viewBox="0 0 240 150" role="img" aria-label={`Учебна схема: ${board.caption}`} className="w-full rounded-lg bg-[#f7eee1]">
    <rect x="0" y="112" width="240" height="38" fill="#947454" />
    {board.scene === 'choice' && <>{loaf(65, 90)}{loaf(170, 90)}<path d="M65 30h105m-8-7l8 7-8 7" stroke="#35586a" strokeWidth="4" fill="none" /></>}
    {board.scene === 'order' && <><rect x="80" y="15" width="80" height="110" rx="8" fill="#fff" stroke="#35586a" strokeWidth="4" /><path d="M94 40h50m-50 20h50m-50 20h35" stroke="#35586a" strokeWidth="5" /><rect x="95" y="98" width="50" height="13" rx="5" fill="#477751" /></>}
    {board.scene === 'packing' && <><path d="M65 48h110l-12 84H77z" fill="#cda676" stroke="#633b19" strokeWidth="3" />{loaf(120, 50)}<path d="M90 17l30 18 30-18" stroke="#35586a" strokeWidth="4" fill="none" /></>}
    {(board.scene === 'handover' || board.scene === 'crop') && <><rect x="91" y="50" width="58" height="65" fill="#cda676" stroke="#633b19" strokeWidth="3" /><path d="M103 50V32h34v18" fill="none" stroke="#633b19" strokeWidth="3" /><path d="M0 90h91m58 0h91" stroke="#35586a" strokeWidth="18" /><path d="M70 22h100m-12-8l12 8-12 8" fill="none" stroke="#477751" strokeWidth="4" />{board.scene === 'crop' && <rect x="158" y="0" width="82" height="150" fill="#f7eee1" opacity=".95" />}</>}
    {board.scene === 'pickup' && <><path d="M40 110V40h160v70M32 40l88-25 88 25" fill="#fff" stroke="#35586a" strokeWidth="4" /><rect x="102" y="60" width="36" height="50" fill="#cda676" /><path d="M155 72h65m-12-8l12 8-12 8" fill="none" stroke="#477751" strokeWidth="4" /></>}
    {board.scene === 'missing' && <><rect x="35" y="20" width="170" height="95" fill="none" stroke="#35586a" strokeWidth="3" strokeDasharray="8 5" /><path d="M100 52a20 20 0 1 1 23 20v12m0 8v6" fill="none" stroke="#35586a" strokeWidth="5" /></>}
  </svg>;
}

export function StoryboardPreview({ studio, matches }: { studio: ClosedStudio; matches: Record<string, string> }) {
  const shots = studioPlaylist(studio, matches).filter(c => c.board);
  return <div className="space-y-3 text-sm leading-6 academy-body">
    <ol aria-label="Избран разкадровъчен план" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{shots.map((choice, index) => <li key={choice.id} className="min-w-0 rounded-lg border academy-border academy-raised p-2">
      <BreadScene board={choice.board!} /><p className="mt-2 font-semibold academy-text">{index + 1}. {choice.board!.caption}</p><p>{choice.board!.seconds} сек. в учебния план</p>
    </li>)}</ol>
    {!shots.length && <p>Избери кадри. Тук ще видиш каква история образуват заедно.</p>}
    <p className="text-xs academy-muted">Авторски учебни схеми. Това не са заснети хора, истинска пекарна или извършена поръчка. Времената са условия на задачата.</p>
  </div>;
}
