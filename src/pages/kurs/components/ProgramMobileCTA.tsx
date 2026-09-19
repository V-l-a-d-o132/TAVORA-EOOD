import { Link } from 'react-router-dom';
import { buildCheckoutUrl, formatPrice, getTierById } from '@/config/pricing';

interface ProgramMobileCTAProps {
  /** Вътрешен ID на програмата. */
  tierId: string;
  /** Конкретен CTA текст (напр. „Вземи Пътят на коприната“). */
  ctaLabel: string;
}

export default function ProgramMobileCTA({ tierId, ctaLabel }: ProgramMobileCTAProps) {
  const tier = getTierById(tierId);
  if (!tier) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[#1C1C1E]/10">
        <div>
          <p className="text-xs text-[#1C1C1E]/60">{tier.name}</p>
          <p className="text-base font-semibold text-[#1C1C1E]">{formatPrice(tier.price)}</p>
        </div>
        <Link
          to={buildCheckoutUrl(tier.id)}
          className="px-5 py-2.5 text-sm font-medium rounded-full bg-[#e53e3e] text-white transition-all cursor-pointer whitespace-nowrap"
        >
          {ctaLabel}
        </Link>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
}