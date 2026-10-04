import { EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_URL } from '@/config/editorial-image';
import BlogArticleLayout, {
  ArticleSection,
  buildArticleSchema,
  type RelatedItem,
  type TocItem,
} from '@/pages/blog/components/BlogArticleLayout';

const HERO_IMAGE =
  EDITORIAL_IMAGE_URL;

const SCHEMA = buildArticleSchema({
  id: 'kak-da-namalim-neyavaniyata-no-shows-salon',
  name: 'Как да намалите неявяванията (no-shows) в салона — пълен наръчник',
  description:
    'Практични начини да намалите неявяванията в салон за красота: напомняния, депозити, потвърждение и онлайн резервации. С реални резултати и стъпки.',
  image: HERO_IMAGE,
  section: 'Управление на салон',
  keywords: 'no-shows салон, неявявания салон красота, намаляване на неявявания, резервации салон, напомняния за часове',
  datePublished: '2026-09-28',
  breadcrumbLabel: 'Намаляване на неявяванията',
});

const TOC: TocItem[] = [
  { id: 'kolko', label: 'Колко ви струват неявяванията' },
  { id: 'napomnyaniya', label: 'Автоматични напомняния' },
  { id: 'potvarjdenie', label: 'Потвърждение на часа' },
  { id: 'depozit', label: 'Депозит и политика' },
  { id: 'onlain', label: 'Онлайн резервации' },
  { id: 'sledene', label: 'Следене на тенденциите' },
  { id: 'plan', label: 'План в 7 стъпки' },
];

const RELATED: RelatedItem[] = [
  { title: 'Онлайн резервации срещу телефонни — какво показват данните', to: '/blog/online-rezervacii-vs-telefonni-rezervacii' },
  { title: 'Как онлайн графикът вдига приходите на салона', to: '/blog/kak-onlain-grafikat-vdiga-prihodite-na-salona' },
  { title: 'Какво научихме от маркетинг за уелнес услуги', to: '/blog/marketing-nablyudeniya-masazhni-uslugi' },
  { title: 'Защо локалният маркетинг е различен от масовия', to: '/blog/lokalen-vs-masov-marketing' },
];

export default function KakDaNamalimNeyavaniyataNoShowsSalonPage() {
  return (
    <BlogArticleLayout
      schemaId="schema-blog-no-shows-salon"
      schema={SCHEMA}
      seoTitle="Как да намалите неявяванията (no-shows) в салона | ТАВОРА ЕООД"
      seoDescription="Практични начини да намалите неявяванията в салон за красота: напомняния, депозити, потвърждение и онлайн резервации. Стъпка по стъпка с реални резултати."
      canonical="https://imashnujnoto.com/blog/kak-da-namalim-neyavaniyata-no-shows-salon"
      category="Управление на салон"
      date="28 Сеп 2026"
      readTime="11 мин. четене"
      heroImage={HERO_IMAGE}
      heroAlt={EDITORIAL_IMAGE_ALT}
      breadcrumbLabel="Намаляване на неявяванията"
      title={
        <>
          Как да намалите неявяванията (no-shows) в салона —{' '}
          <span className="italic text-[#0A2540]">пълен наръчник.</span>
        </>
      }
      intro={
        <>
          Празният стол в салона не е просто загубен час — той е <strong className="text-[#1C1C1E]">загубен приход, платена заплата и разочарован клиент на опашката</strong>. Добрата новина: неявяванията почти винаги се дължат на забравяне, а не на безотговорност. А забравянето се решава.
        </>
      }
      tocItems={TOC}
      related={RELATED}
      ctaEyebrow="Салонът губи часове от неявявания?"
      ctaTitle={
        <>
          По-малко празни столове,
          <br />
          <span className="italic text-white/60">повече спокойствие.</span>
        </>
      }
      ctaText="Онлайн график с автоматични напомняния и потвърждения — неявяванията падат, без да звъни никой."
      ctaPrimaryTo="https://www.zapazisega.com/"
      ctaPrimaryLabel="Вижте Запази Сега →"
      ctaSecondaryTo=""
      ctaSecondaryLabel=""
    >
      <ArticleSection
        id="kolko"
        title={
          <>
            Колко ви струват{' '}
            <span className="italic text-[#0A2540]">неявяванията.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          В малките салони неявяванията често са между 5% и 15% от всички часове. Звучи малко, докато не го обърнете в пари: при 10 процента и среден чек от 40 лв., загубата за месец може да е няколкостотин лева — всеки месец, без изключение.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
            <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>5–15%</div>
            <div className="text-xs text-[#1C1C1E]/65">типични неявявания</div>
          </div>
          <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
            <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>до 40%</div>
            <div className="text-xs text-[#1C1C1E]/65">спад само от напомняния</div>
          </div>
          <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
            <div className="text-2xl font-light text-[#0A2540] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>0 лв.</div>
            <div className="text-xs text-[#1C1C1E]/65">цена на автоматично напомняне</div>
          </div>
        </div>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          Тоест — преди да въвеждате наказания, първо опитайте най-лесното: да напомните на клиента. Повечето „неявявания" са просто забравени часове.
        </p>
      </ArticleSection>

      <ArticleSection
        id="napomnyaniya"
        title={
          <>
            Автоматични{' '}
            <span className="italic text-[#0A2540]">напомняния.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          Това е най-бързата печалба. Когато клиентът получи съобщение 24 часа преди часа си, вероятността да забрави пада драстично. Работи вече и SMS, и Viber, и имейл.
        </p>
        <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
          <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Схема, която работи</div>
          <ul className="space-y-2">
            {[
              'Потвърждение веднага след резервацията',
              'Напомняне 24 часа преди часа',
              'Второ кратко напомняне 2–3 часа преди',
              'Един бутон „Потвърждавам" или „Отменям" в съобщението',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          <strong>Ключът:</strong> напомнянето трябва да идва автоматично, без никой да помни да го прати. Ръчните напомняния се забравят точно толкова, колкото и часовете.
        </p>
      </ArticleSection>

      <ArticleSection
        id="potvarjdenie"
        title={
          <>
            Потвърждение на{' '}
            <span className="italic text-[#0A2540]">часа.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          Разликата между „записан час" и „потвърден час" е огромна. Когато клиентът активно потвърди с едно натискане, той вече е поел ангажимент — и в съзнанието си, и формално.
        </p>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          Затова е важно системата да позволява на клиента да потвърди или отмени <strong className="text-[#1C1C1E]">сам, с едно действие</strong>. Ако трябва да звъни, за да отмени, той просто няма да дойде. Улеснената отмяна води до по-малко празни столове — защото часът се освобождава и може да бъде зает от друг.
        </p>
      </ArticleSection>

      <ArticleSection
        id="depozit"
        title={
          <>
            Депозит и{' '}
            <span className="italic text-[#0A2540]">политика.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          Когато проблемът е системен — например по-дълги процедури или час, който блокира цял слот — депозитът е разумен инструмент. Не за да наказва, а за да филтрира несериозните резервации.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
            <div className="text-sm font-medium text-[#1C1C1E] mb-2">Кога помага</div>
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
              При скъпи, дълги процедури и при клиенти с история на неявявания. Малък депозит, приспаднат от сметката.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
            <div className="text-sm font-medium text-[#1C1C1E] mb-2">Кога пречи</div>
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
              При кратки, чести процедури. Тук бюрокрацията отблъсква повече, отколкото предпазва.
            </p>
          </div>
        </div>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          <strong>Съвет:</strong> Политиката трябва да е ясна и показана <em>още при резервацията</em>, не след като клиентът не дойде. Яснотата от самото начало предпазва и вас, и клиента.
        </p>
      </ArticleSection>

      <ArticleSection
        id="onlain"
        title={
          <>
            Онлайн резервации{' '}
            <span className="italic text-[#0A2540]">вместо телефон.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          Когато резервациите минават през онлайн система, напомнянията, потвържденията и графика се управляват на едно място. Няма „записах го на листче", няма забравени часове, няма двойни резервации.
        </p>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          Платформи като{' '}
          <a href="https://www.zapazisega.com/" target="_blank" rel="noopener dofollow" className="text-[#0A2540] font-medium underline underline-offset-2 hover:text-[#1B4332]">
            Запази Сега
          </a>{' '}
          са изградени точно около това — клиентът резервира сам, получава напомняния и потвърждава или отменя сам, а салонът вижда целия график на едно място. Резултатът е по-малко неявявания без почти никакви усилия от ваша страна.
        </p>
      </ArticleSection>

      <ArticleSection
        id="sledene"
        title={
          <>
            Следене на{' '}
            <span className="italic text-[#0A2540]">тенденциите.</span>
          </>
        }
      >
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
          Не можете да подобрите това, което не измервате. Веднъж щом започнете да следите кой ден и кой час има най-много неявявания, ще видите модел.
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Кой ден от седмицата е най-проблемен',
            'Има ли клиенти, които редовно не идват',
            'Коя процедура събира най-много неявявания',
            'Ефектът от въведените напомняния',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
              <i className="ri-line-chart-line text-[#0A2540] text-xs mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          С данни можете да коригирате — например да не давате най-търсените слотове на клиенти с история на неявявания.
        </p>
      </ArticleSection>

      <ArticleSection
        id="plan"
        title={
          <>
            План в{' '}
            <span className="italic text-[#0A2540]">7 стъпки.</span>
          </>
        }
      >
        <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
          <ul className="space-y-2">
            {[
              'Измерете текущия процент неявявания',
              'Включете автоматично потвърждение при резервация',
              'Добавете напомняне 24 часа преди часа',
              'Добавете кратко напомняне 2–3 часа преди',
              'Дайте на клиента лесен начин да отмени сам',
              'Въведете ясна политика и я покажете при резервация',
              'Следете резултата всеки месец и коригирайте',
            ].map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#1C1C1E]/65">
                <span className="text-[10px] text-[#0A2540] w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
          <strong>Изводът:</strong> Най-голямата печалба идва от най-простото — напомняния и лесно потвърждение. Онлайн система като{' '}
          <a href="https://www.zapazisega.com/" target="_blank" rel="noopener dofollow" className="text-[#0A2540] font-medium underline underline-offset-2 hover:text-[#1B4332] inline-flex items-center gap-1">
            Запази Сега <i className="ri-external-link-line" />
          </a>{' '}
          върши това вместо вас, така че никой в салона да не трябва да помни да звъни.
        </p>
      </ArticleSection>
    </BlogArticleLayout>
  );
}