// ─────────────────────────────────────────────────────────────
// Единен източник на цени за Академия TAVORA.
// Всички React компоненти, които показват цени, четат оттук.
// Не изписвай цени ръчно в компоненти — използвай formatPrice().
// ─────────────────────────────────────────────────────────────

export type Currency = 'EUR';

/** Тип на продукта — определя ролята му в ценовата стълба. */
export type PricingTierType = 'starter' | 'program' | 'full' | 'strategic';

export interface PricingTier {
  /** Стабилен вътрешен идентификатор — не го променяй без нужда. */
  id: string;
  /** Публично име, което се показва на потребителя. */
  name: string;
  /** Числова цена без валутен символ. */
  price: number;
  /** Код на валутата. */
  currency: Currency;
  /** Кратко описание за какво е пакетът. */
  description: string;
  /** Маршрут към съответния продукт (ако съществува). */
  route?: string;
  /**
   * Tier ID, който checkout-ът и Stripe backend-ът приемат в момента.
   * Не променяй тези стойности без синхронизация с academy-stripe-checkout.
   */
  checkoutTier: string;
  /** Брой модули в пакета. */
  moduleCount: number;
  /** Брой уроци в пакета. */
  lessonCount: number;
  /** Тип на продукта. */
  type: PricingTierType;
  /** Дали е препоръчаният пакет (показва се като „Препоръчан“). */
  recommended?: boolean;
  /** Дали включва сертификат за завършване. */
  includesCertificate?: boolean;
  /** Дали включва стратегически сесии. */
  includesStrategicSessions?: boolean;
  /** Какво включва пакетът. */
  includes: string[];
}

/** Имейл за контакт на Академията — единен навсякъде. */
export const CONTACT_EMAIL = 'hello@imashnujnoto.com';

/** Цените на самостоятелните програми (за справка и валидация). */
export const PROGRAM_PRICES = {
  silkRoad: 99,
  perfectVideo: 99,
  marketingBasics: 129,
} as const;

/** Сумата при отделна покупка на трите програми. */
export const INDIVIDUAL_TOTAL = PROGRAM_PRICES.silkRoad + PROGRAM_PRICES.perfectVideo + PROGRAM_PRICES.marketingBasics;

/** Шестте продуктови нива на Академия TAVORA. */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Стартов пакет',
    price: 49,
    currency: 'EUR',
    description: 'Първите 10 модула от „Пътят на коприната“ — за изграждане на основите, преди да инвестираш в цялата програма.',
    route: '/kurs/ai-business-blueprint',
    checkoutTier: 'systems-10',
    moduleCount: 10,
    lessonCount: 70,
    type: 'starter',
    includes: [
      'Първите 10 модула от „Пътят на коприната“',
      'Без Revenue Blueprint (последния, 11-и модул)',
      'Доживотен достъп до избраните модули',
      'Подходящ за човек, който първо иска да изгради основите',
    ],
  },
  {
    id: 'silkRoad',
    name: 'Пътят на коприната',
    price: 99,
    currency: 'EUR',
    description: '11 модула за изграждане и продажба на дигитална услуга с AI — от оферта и сайт до привличане на клиенти.',
    route: '/kurs/ai-business-blueprint',
    checkoutTier: 'koprinena-pateka',
    moduleCount: 11,
    lessonCount: 74,
    type: 'program',
    includes: [
      '11 модула',
      '74+ урока',
      'Revenue Blueprint — оферти, ценообразуване, намиране на клиенти и устойчиво развитие',
      'Доживотен достъп',
      'Бъдещи обновления',
    ],
  },
  {
    id: 'perfectVideo',
    name: 'Перфектното Видео',
    price: 99,
    currency: 'EUR',
    description: '15 модула за създаване на бизнес видео — от стратегия и сценарий до снимачен ден и монтаж.',
    route: '/kurs/perfektnoto-video',
    checkoutTier: 'perfektno-video',
    moduleCount: 15,
    lessonCount: 241,
    type: 'program',
    includes: [
      '15 модула',
      '241+ урока',
      'От идея до готово бизнес видео',
      'Доживотен достъп',
      'Бъдещи обновления',
    ],
  },
  {
    id: 'marketingBasics',
    name: 'Marketing Basics',
    price: 129,
    currency: 'EUR',
    description: '20 модула за изграждане на цялостна маркетинг система — позициониране, присъствие, трафик и превръщане.',
    route: '/kurs/marketing-basics',
    checkoutTier: 'marketing-basics',
    moduleCount: 20,
    lessonCount: 177,
    type: 'program',
    includes: [
      '20 модула',
      '177+ урока',
      'От позициониране до превръщане на посетители в клиенти',
      'Доживотен достъп',
      'Бъдещи обновления',
    ],
  },
  {
    id: 'fullAccess',
    name: 'Пълен достъп',
    price: 249,
    currency: 'EUR',
    description: 'Всички 46 модула и 492+ урока — трите пълни програми, тестове, практически материали и сертификат за завършване.',
    route: '/kurs',
    checkoutTier: 'premium-all',
    moduleCount: 46,
    lessonCount: 492,
    type: 'full',
    recommended: true,
    includesCertificate: true,
    includes: [
      'Всички 46 модула',
      '492+ урока',
      'Трите пълни програми',
      'Тестове и практически материали',
      'Доживотен достъп',
      'Бъдещи обновления',
      'Сертификат за завършване',
    ],
  },
  {
    id: 'strategicAccess',
    name: 'Пълен достъп + стратегически сесии',
    price: 497,
    currency: 'EUR',
    description: 'Всичко от пълния достъп плюс две индивидуални онлайн стратегически срещи с Владимир Атанасов и „Системата зад Академия TAVORA“.',
    route: '/kurs',
    checkoutTier: 'strategic_access',
    moduleCount: 46,
    lessonCount: 492,
    type: 'strategic',
    includesCertificate: true,
    includesStrategicSessions: true,
    includes: [
      'Всичко от пълния достъп',
      '2 индивидуални онлайн стратегически срещи по 60 минути',
      'Първа среща: анализ на идеята, офертата, позиционирането и плана',
      'Втора среща: преглед на изпълнението, корекции и следващи действия',
      '„Системата зад Академия TAVORA“ — практически ресурс',
    ],
  },
];

/** Връща тир по вътрешен идентификатор. */
export function getTierById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.id === id);
}

/** Връща тир по checkout tier ID (идващ от checkout/backend). */
export function getTierByCheckoutTier(checkoutTier: string): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.checkoutTier === checkoutTier);
}

/** Трите основни избора за секцията с цените. */
export const MAIN_PRICING_TIERS = PRICING_TIERS.filter((t) =>
  ['starter', 'fullAccess', 'strategicAccess'].includes(t.id),
);

/** Трите самостоятелни програми (99 / 99 / 129). */
export const STANDALONE_PROGRAMS = PRICING_TIERS.filter((t) =>
  ['silkRoad', 'perfectVideo', 'marketingBasics'].includes(t.id),
);

/**
 * Генерира checkout URL за даден тир.
 * Не изписвай checkout URL адреси ръчно в компоненти — използвай този helper.
 */
export function buildCheckoutUrl(tierId: string): string {
  const tier = getTierById(tierId);
  const checkoutTier = tier?.checkoutTier || tierId;
  return `/kurs/checkout?tier=${checkoutTier}`;
}

/**
 * Форматира цена във валута EUR с Intl.NumberFormat.
 * Пример: formatPrice(249) → "249 €"
 */
export function formatPrice(amount: number, currency: Currency = 'EUR'): string {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────
// Upgrade логика — ПОДГОТОВКА за Промпт 3 (backend).
//
// ВАЖНО: Frontend НЕ решава колко да таксува клиента. Реалната
// upgrade цена ще се изчислява от backend (academy-stripe-checkout)
// чрез проверени, невъзстановени покупки. Тези helper-и са само
// концептуална подготовка на правилата — не ги ползвай за директно
// таксуване и НЕ показвай „Плати само разликата“ преди Промпт 3.
// ─────────────────────────────────────────────────────────────

/** Стойността на стратегическата услуга (не се премахва чрез кредит). */
export const STRATEGIC_SESSION_PRICE = 248;

/** Таванът на образователния кредит. */
export const FULL_ACCESS_PRICE = 249;

export interface UpgradeBreakdown {
  /** Реално платени допустими, невъзстановени покупки (по-късно от backend). */
  eligiblePaid: number;
  /** Кредит за образователно съдържание — максимум 249 EUR. */
  eligibleAccessCredit: number;
  /** Доплащане до Пълен достъп. */
  fullAccessUpgrade: number;
  /** Доплащане до Стратегическия пакет. */
  strategicUpgrade: number;
}

/**
 * Концептуално изчисление на upgrade (за Промпт 3).
 * `eligiblePaid` идва от backend проверени покупки; тук се подава за справка.
 */
export function computeUpgradeBreakdown(eligiblePaid: number): UpgradeBreakdown {
  const eligibleAccessCredit = Math.min(Math.max(eligiblePaid, 0), FULL_ACCESS_PRICE);
  const fullAccessUpgrade = Math.max(FULL_ACCESS_PRICE - eligibleAccessCredit, 0);
  const strategicUpgrade = fullAccessUpgrade + STRATEGIC_SESSION_PRICE;
  return {
    eligiblePaid,
    eligibleAccessCredit,
    fullAccessUpgrade,
    strategicUpgrade,
  };
}