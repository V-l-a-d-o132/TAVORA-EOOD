import { Link } from 'react-router-dom';

export default function ProgramGuarantee() {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-16 py-10 md:py-14">
      <div className="p-6 md:p-8 rounded-2xl bg-[#f0fdf4] border border-[#22c55e]/20 flex flex-col sm:flex-row items-start gap-5">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#22c55e]/15 shrink-0">
          <i className="ri-shield-check-line text-xl text-[#16a34a]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1C1C1E] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            30-дневна доброволна гаранция за възстановяване на сумата.
          </h3>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3 max-w-xl">
            Ако решиш, че програмата не е за теб, върни се в рамките на 30 дни и ще ти възстановим сумата.
            Тази доброволна гаранция е отделна от нормативното 14-дневно право на отказ.
          </p>
          <Link
            to="/withdrawal"
            className="text-sm text-[#1C1C1E]/60 underline underline-offset-2 hover:text-[#1C1C1E] transition-colors"
          >
            Виж условията за отказ
          </Link>
        </div>
      </div>
    </section>
  );
}