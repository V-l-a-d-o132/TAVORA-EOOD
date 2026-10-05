export const CONSUMER_RIGHTS_ARTICLES = [
  {
    id: 'buton-za-otkaz-ot-dogovor-zzp-2026',
    title: 'Бутон за отказ от договор: новите изисквания за онлайн магазини през 2026 г.',
    seoTitle: 'Бутон за отказ от договор: чл. 52а ЗЗП (2026) | TAVORA',
    description: 'За кои онлайн продажби важи чл. 52а ЗЗП? Виж датата 24.09.2026 г., сроковете, данните във формата и санкциите за липсваща функция за отказ.',
    category: 'Онлайн търговия',
    categoryColor: 'bg-cyan-50 text-cyan-700',
    readTime: '7 мин.',
    keywords: ['бутон за отказ от договор', 'чл. 52а ЗЗП', 'онлайн магазин закон 2026'],
    related: ['pravo-na-otkaz-online-kurs', 'buton-za-otkaz-formulyar-proverki'],
    ctaPrimaryTo: '/kontakt',
    ctaPrimaryLabel: 'Обсъдете сайта си',
  },
  {
    id: 'pravo-na-otkaz-online-kurs',
    title: 'Право на отказ от онлайн курс: 14 дни, цифрово съдържание и изключения',
    seoTitle: 'Право на отказ от онлайн курс: 14 дни и изключения | TAVORA',
    description: 'Кога се губи правото на отказ от онлайн курс? Вижте разликата между записи и услуга, трите условия за цифрово съдържание и функцията за отказ.',
    category: 'Онлайн търговия',
    categoryColor: 'bg-cyan-50 text-cyan-700',
    readTime: '7 мин.',
    keywords: ['право на отказ от онлайн курс', 'цифрово съдържание отказ', '14 дни онлайн курс'],
    related: ['buton-za-otkaz-ot-dogovor-zzp-2026', 'buton-za-otkaz-formulyar-proverki'],
    ctaPrimaryTo: '/kontakt',
    ctaPrimaryLabel: 'Обсъдете сайта си',
  },
  {
    id: 'buton-za-otkaz-formulyar-proverki',
    title: 'Как да добавите бутон за отказ: формуляр, имейл и 10 проверки',
    seoTitle: 'Бутон за отказ: формуляр, имейл и 10 проверки | TAVORA',
    description: 'Проследете отказа от видимата връзка до записа и имейла. План за WooCommerce, Shopify и собствен сайт, с 10 проверки за грешки, срокове и гости.',
    category: 'Онлайн търговия',
    categoryColor: 'bg-cyan-50 text-cyan-700',
    readTime: '8 мин.',
    keywords: ['добавяне бутон за отказ', 'формуляр за отказ', 'WooCommerce Shopify отказ'],
    related: ['buton-za-otkaz-ot-dogovor-zzp-2026', 'pravo-na-otkaz-online-kurs'],
    ctaPrimaryTo: '/kontakt',
    ctaPrimaryLabel: 'Обсъдете сайта си',
  },
] as const;

export type ConsumerRightsArticleId = typeof CONSUMER_RIGHTS_ARTICLES[number]['id'];

export function getConsumerRightsArticle(id: ConsumerRightsArticleId) {
  return CONSUMER_RIGHTS_ARTICLES.find(article => article.id === id)!;
}
