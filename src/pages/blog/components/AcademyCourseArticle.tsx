import { Link } from 'react-router-dom';
import { ACADEMY_CATALOG_VERIFIED_ON } from '@/config/academy-catalog';
import { EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_URL } from '@/config/editorial-image';
import { ACADEMY_LEARNING_FORMAT, ACADEMY_PROGRAM_DETAILS } from '@/data/academy-program-details';
import { MARKETING_BASICS_FAQ, PERFECT_VIDEO_FAQ } from '@/data/academy-public-faq';
import { MARKETING_BASICS_PUBLIC_GROUPS, PERFECT_VIDEO_PUBLIC_MODULES } from '@/data/academy-public-programs';
import { getTierById, formatPrice } from '@/config/pricing';
import BlogArticleLayout, { ArticleSection, buildArticleSchema } from './BlogArticleLayout';

const ARTICLES = {
  perfectVideo: {
    id: 'perfektnoto-video-biznes-sistema',
    title: 'Перфектното Видео: история, телефон, камера и осмислен монтаж',
    category: 'Видео продукция',
    authorName: 'Владимир Атанасов & Натан Петков',
    opening: 'Преди настройките идва въпросът какво трябва да разбере зрителят. Историята определя кои кадри са нужни, какво трябва да се чуе и кое може да отпадне. Телефонът и камерата са средства за тази задача.',
    example: 'Ако трябва да покажеш как се извършва действие, красивият близък план може да скрие важната стъпка. Ако целта се промени към видим детайл, същият кадър може да е подходящ. В демонстрациите сравняваш избора с целта, а не търсиш настройка, която винаги е „най-добра“.',
    transfer: 'След упражненията можеш да повториш подхода със собствената си техника: заснеми кратко действие, провери дали е разбираемо без обяснение и го преработи. Това е лична практика извън задължителните задачи. Не качваш клип в платформата и не чакаш преподавател да го оцени.',
    faq: PERFECT_VIDEO_FAQ,
  },
  marketingBasics: {
    id: 'marketing-basics-palna-sistema',
    title: 'Marketing Basics: как хората избират и какво искат да препоръчат',
    category: 'Маркетинг',
    authorName: 'Владимир Атанасов',
    opening: 'Маркетингът включва разбирането на нуждата, полезното предложение, достъпа до него и изпълненото обещание. Семейство, колеги и онлайн общности могат да участват в решението. Търсещият, ползвателят, платецът и съветникът понякога са различни хора.',
    example: 'В учебна ситуация близък препраща предложение за сервиз. Цената е посочена, но свободен час не е потвърден. Полезното послание запазва цената и обхвата и насочва към проверка на часа. Ако преразказът добави „приемат веднага“, препоръката вече обещава нещо, което източникът не доказва.',
    transfer: 'След урока можеш да приложиш същите въпроси към собствена идея: кой решава, кой влияе, какво е обещано и какво още трябва да се уточни. Това не е задължително предаване на собствен бизнес план. В курса решаваш по предоставените факти. Българските ситуации дават контекст, без да превръщат наблюденията за пазара в статистика.',
    faq: MARKETING_BASICS_FAQ,
  },
} as const;

export default function AcademyCourseArticle({ programId }: { programId: keyof typeof ARTICLES }) {
  const article = ARTICLES[programId];
  const program = ACADEMY_PROGRAM_DETAILS[programId];
  const tier = getTierById(programId)!;
  const description = `${tier.moduleCount} модула и ${tier.lessonCount} публикувани урока. ${program.description} Предоставени материали, лаборатории и проверки без качване на файлове.`;
  const baseSchema = buildArticleSchema({
    id: article.id, name: article.title, description, image: EDITORIAL_IMAGE_URL,
    section: article.category, keywords: `${tier.name}, практическо обучение, Академия TAVORA`,
    datePublished: '2026-07-07', dateModified: ACADEMY_CATALOG_VERIFIED_ON, breadcrumbLabel: tier.name,
  });
  const schema = { ...baseSchema, '@graph': [
    ...baseSchema['@graph'].map(item => item['@type'] === 'Article' && programId === 'perfectVideo' ? {
      ...item, author: [
        { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
        { '@type': 'Person', name: 'Натан Петков', url: 'https://imashnujnoto.com/ekip' },
      ],
    } : item),
    { '@type': 'FAQPage', mainEntity: article.faq.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) },
  ] };
  const groups = programId === 'marketingBasics' ? MARKETING_BASICS_PUBLIC_GROUPS : [{ id: 'video', title: 'Петнадесет модула от историята до следващата версия', description: 'Сценарий, техника, организация, монтаж, разпространение, измерване и клиентска работа.', modules: PERFECT_VIDEO_PUBLIC_MODULES }];

  return <BlogArticleLayout
    schemaId={`schema-${article.id}`} schema={schema}
    seoTitle={`${article.title} | TAVORA`} seoDescription={description}
    canonical={`https://imashnujnoto.com/blog/${article.id}`}
    category={article.category} date="Обновено на 16 октомври 2026" readTime="Преглед на програмата"
    heroImage={EDITORIAL_IMAGE_URL} heroAlt={EDITORIAL_IMAGE_ALT}
    breadcrumbLabel={tier.name} title={article.title} intro={article.opening} authorName={article.authorName}
    tocItems={[
      { id: 'outcome', label: 'Какво упражняваш' },
      { id: 'practice', label: 'Материали и лаборатории' },
      { id: 'modules', label: 'Текущата учебна подредба' },
      { id: 'check', label: 'Проверки и самостоятелно прилагане' },
      { id: 'access', label: 'Цена и достъп' },
      { id: 'questions', label: 'Практични въпроси' },
    ]}
    related={[
      { title: 'Пътят на коприната: ИИ и дигитална услуга', to: '/blog/ai-business-blueprint-putyat-na-koprinata' },
      { title: 'Всички програми и пакети', to: '/kurs' },
    ]}
    ctaEyebrow="Академия TAVORA" ctaTitle="Виж материалите, преди да решиш"
    ctaText="Публичните лаборатории са отделни безплатни проби. Само първият модул на „Пътят на коприната“ е безплатен; другите модули се отключват с покупка или предоставен достъп."
    ctaPrimaryTo={tier.route} ctaPrimaryLabel="Виж програмата и цената"
    ctaSecondaryTo="/module/s01-m01?lesson=0" ctaSecondaryLabel="Опитай безплатния модул"
  >
    <div className="text-base leading-7 text-[#1C1C1E]/80 [&_p]:mb-5 [&_a]:text-[#0A2540] [&_a]:underline [&_a]:underline-offset-4">
      <ArticleSection id="outcome" title="Какво упражняваш и защо е полезно">
        <p>{program.outcome}</p>
        <p>{article.example}</p>
        <p>{ACADEMY_LEARNING_FORMAT}</p>
      </ArticleSection>
      <ArticleSection id="practice" title="Първо виждаш, после избираш и сравняваш">
        <p>{program.practice}</p>
        <p>{program.comparison}</p>
        <p>Показаното решение служи за пример. Следващият случай и промененото условие изискват нов избор. В практическите студиа можеш да запазиш вариант за сравнение, да промениш решенията и да върнеш запазения вариант в отвореното упражнение.</p>
        <p>Сравнението и свалянето на файл не са оценка и не дават XP. Публичната лаборатория е проба без учебен прогрес; задължителната проверка е в урока.</p>
        <p><a href={program.labUrl}>{program.labLabel} →</a></p>
      </ArticleSection>
      <ArticleSection id="modules" title={`${tier.moduleCount} модула и ${tier.lessonCount} публикувани урока`}>
        <p>Това е текущата подредба, която виждаш в програмата. Броят включва отделните уроци с казуси и изпити; въпросите в изпита не са допълнителни уроци.</p>
        {groups.map(group => <section key={group.id} className="mb-8">
          <h3 className="text-xl font-medium mb-3">{group.title}</h3>
          <p>{group.description}</p>
          <ol className="space-y-4 list-none p-0">{group.modules.map(module => <li key={module.num} className="rounded-xl border border-[#1C1C1E]/10 p-4">
            <h4 className="font-semibold mb-2">{module.num}. {module.title}</h4>
            <p>{module.desc}</p>
            <span className="text-sm text-[#1C1C1E]/70">{module.lessons} урока · {module.time.split(' · ')[0]}</span>
          </li>)}</ol>
        </section>)}
      </ArticleSection>
      <ArticleSection id="check" title="Какво показва проверката и как продължаваш">
        <p>{article.faq.find(item => item.q.includes('финал'))?.a}</p>
        <p>{program.boundary}</p>
        <p>{article.transfer}</p>
        <p>Четенето, решаването и собствената работа отнемат различно време. Ориентирите до уроците не са обещание за срок на усвояване или за бъдещ доход.</p>
      </ArticleSection>
      <ArticleSection id="access" title="Какво купуваш и какво можеш да пробваш">
        <p>Самостоятелната програма „{tier.name}“ струва {formatPrice(tier.price)} еднократно и включва {tier.moduleCount} модула с {tier.lessonCount} публикувани урока. Не е абонамент. Включени са достъпът до уроците, практическите материали и бъдещите обновления според условията на пакета.</p>
        <p>Стартовият пакет е за първите десет модула на „Пътят на коприната“ и не включва тази програма. Пълният достъп включва и трите програми. Индивидуалните стратегически срещи са отделна част само от стратегическия пакет; обичайните задачи дават автоматична обратна връзка по предоставените избори.</p>
        <p>Само модул 01 на „Пътят на коприната“ е безплатен. Публичните лаборатории позволяват проба без покупка и не отключват платени уроци. За запазен учебен прогрес използваш акаунт.</p>
        <p>Преди плащане прегледай <Link to={tier.route!}>текущата оферта</Link>, <Link to="/terms">условията</Link> и <Link to="/withdrawal">правото на отказ</Link>. Доброволната 30-дневна гаранция е отделна от нормативните права. Сертификатът е за завършено обучение, а не държавно призната професионална квалификация.</p>
      </ArticleSection>
      <ArticleSection id="questions" title="Практични въпроси">
        <div className="space-y-3">{article.faq.map(item => <details key={item.q} className="rounded-xl border border-[#1C1C1E]/10 p-4">
          <summary className="font-medium cursor-pointer">{item.q}</summary><p className="mt-3">{item.a}</p>
        </details>)}</div>
      </ArticleSection>
    </div>
  </BlogArticleLayout>;
}
