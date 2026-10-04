import AgencyAboutSection from './AgencyAboutSection';
import AgencyNPOSection from './AgencyNPOSection';
import AgencyLocalSection from './AgencyLocalSection';
import ChatGPTProofSection from '@/components/feature/ChatGPTProofSection';
import CaseStudySection from '@/pages/home/components/CaseStudySection';
import ClientReviewsSection from '@/components/feature/ClientReviewsSection';
import SharedFooter from '@/components/feature/SharedFooter';
import { Link } from 'react-router-dom';

export default function AgencyDetails() {
  return (
    <>
      {/* About + Local hidden on mobile — only show on desktop */}
      <div className="hidden md:block">
        <AgencyAboutSection />
      </div>
      <AgencyNPOSection />
      <div className="hidden md:block">
        <AgencyLocalSection />
      </div>
      <ChatGPTProofSection />
      <div id="results">
        <CaseStudySection />
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <ClientReviewsSection />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-16 py-5 md:py-20 border-t border-[#1C1C1E]/6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
          <div>
            <div
              className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Искате да сте #1 в Google?
            </div>
            <p className="text-sm text-[#1C1C1E]/65">
              Консултация 50 € — анализ, стратегия и план. Сумата се приспада
              при договор.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Поискайте оферта →
            </Link>
            <Link
              to="/blog"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap text-center hidden sm:block"
            >
              SEO Блог
            </Link>
            <Link
              to="/uslugi"
              className="px-7 py-3.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap text-center hidden sm:block"
            >
              Всички услуги
            </Link>
          </div>
        </div>
      </div>
      <SharedFooter />
    </>
  );
}
