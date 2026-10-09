import { Link } from 'react-router-dom';
import { EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_URL } from '@/config/editorial-image';
import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
import { SILK_ROAD_PUBLIC_MODULES } from '@/data/academy-public-programs';
import { SILK_ROAD_ARTICLES } from '../silk-road-articles';
import BlogArticleLayout, { ArticleSection, buildArticleSchema } from '../components/BlogArticleLayout';

const TITLE = 'Пътят на коприната: AI, сайт и устойчива дигитална услуга';
const DESCRIPTION = `11 модула и ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} публикувани урока. Виж за кого е програмата, как се учи, какво включват пакетите и откъде да започнеш безплатно.`;
const SCHEMA = buildArticleSchema({
  id: 'ai-business-blueprint-putyat-na-koprinata', name: TITLE, description: DESCRIPTION,
  image: EDITORIAL_IMAGE_URL, section: 'AI & Бизнес', keywords: 'Пътят на коприната, AI Business Blueprint, AI бизнес обучение',
  datePublished: '2026-07-07', dateModified: '2026-10-08', breadcrumbLabel: 'Пътят на коприната',
});

export default function AiBusinessBlueprintPage() {
  return <BlogArticleLayout
    schemaId="schema-ai-business-blueprint" schema={SCHEMA}
    seoTitle={`${TITLE} | TAVORA`} seoDescription={DESCRIPTION}
    canonical="https://imashnujnoto.com/blog/ai-business-blueprint-putyat-na-koprinata"
    category="AI & Бизнес" date="Обновено на 8 октомври 2026" readTime="5 мин. четене"
    heroImage={EDITORIAL_IMAGE_URL} heroAlt={EDITORIAL_IMAGE_ALT}
    breadcrumbLabel="Пътят на коприната" title={TITLE} intro={DESCRIPTION}
    tocItems={[
      { id: 'for-whom', label: 'За кого е обучението' },
      { id: 'practice', label: 'Какво изработваш и проверяваш' },
      { id: 'modules', label: '11 модула, 74 урока' },
      { id: 'start', label: 'Безплатно начало и пакети' },
      { id: 'articles', label: 'Започни от своя въпрос' },
      { id: 'questions', label: 'Практични въпроси' },
    ]}
    related={SILK_ROAD_ARTICLES.slice(0, 4).map(article => ({ title: article.title, to: `/blog/${article.id}` }))}
    ctaEyebrow="Пътят на коприната" ctaTitle="Опитай една полезна задача"
    ctaText="Публичният учебен прототип работи без покупка. Пълният първи модул е безплатен през акаунт. След пробата можеш да прецениш подходящия пакет."
    ctaPrimaryTo="/academy-labs/silk-road/start" ctaPrimaryLabel="Опитай учебния прототип"
    ctaSecondaryTo="/kurs/ai-business-blueprint" ctaSecondaryLabel="Виж програмата и пакетите"
  >
    <div className="text-base leading-7 text-[#1C1C1E]/80 [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:text-[#0A2540] [&_a]:underline [&_a]:underline-offset-4">
      <ArticleSection id="for-whom" title="За хора, които искат да свържат инструментите с изпълнима работа">
        <p>„Пътят на коприната“, познат и като AI Business Blueprint, е последователно обучение за изграждане и проверка на малка дигитална услуга. Започва от конкретен човешки проблем и използването на AI, после свързва страница, съдържание, канал, заявка, измерване и изпълнение.</p>
        <p>Подходящо начало е, ако можеш да работиш с браузър и файлове и искаш да разбереш какво стои зад готовата страница. Можеш да си собственик на малък бизнес, начинаещ изпълнител или човек, който подготвя свой проект. За първата проба не е нужен програмистки опит.</p>
        <p>Важна е готовността да четеш източници, да пробваш действие и да поправяш резултата. Задължителните упражнения използват предоставени материали и затворени избори. Не е нужен външен акаунт, качване на файлове или свободен писмен отговор.</p>
      </ArticleSection>
      <ArticleSection id="practice" title="Какво изработваш и как разбираш дали работи">
        <p>Основният подход е малка задача с показан резултат и ясна проверка. Например подготвяш текст за услуга по верни условия, подреждаш страница и проследяваш дали запитването се приема. По-късно свързваш това с канал, измерване, цена и предаване на работа.</p>
        <p>Различаваш убедителния текст от проверения факт, натиснатия бутон от приетата заявка и учебния прототип от външна работеща система. При проверките разглеждаш и отказ, липсващ вход и повторение, а не само удобния успешен случай.</p>
        <p>Тестовете проверяват решенията и знанията. Всеки урок има задължителни проверки с обратна връзка. Финалният изпит има 33 въпроса: минимум 27 верни, поне два от три във всяка тема и всички критични решения. Завършен тест не удостоверява автоматично професионално качество, реален клиент или доход.</p>
        <p>Публичният учебен прототип използва измислени случаи и записи в браузъра. Изборите променят поведението на прототипа, а журналът показва какво действително е изпълнено в учебната среда. За действително изпращане на имейл, външна база, плащане и клиентско предаване остават отделни проверки на съответната система.</p>
      </ArticleSection>
      <ArticleSection id="modules" title={`Пълната програма: ${ACADEMY_PROGRAM_STATS.silkRoad.moduleCount} модула и ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} публикувани урока`}>
        <p>Темите следват работата по един проект. Публичните описания по-долу са ориентир за обхвата; упражненията и проверките се изпълняват в учебната среда.</p>
        <ol className="space-y-4 mb-6 list-none p-0">
          {SILK_ROAD_PUBLIC_MODULES.map(module => <li key={module.num} className="rounded-xl border border-[#1C1C1E]/10 p-4">
            <h3 className="mb-2 text-lg font-medium">{module.num}. {module.title}</h3>
            <p className="mb-2">{module.subtitle}</p>
            <span className="text-sm text-[#1C1C1E]/65">{module.lessons} урока{module.tag === 'FREE' ? ' · Безплатен първи модул' : module.tag === 'PREMIUM' ? ' · В пълната програма' : ''}</span>
          </li>)}
        </ol>
      </ArticleSection>
      <ArticleSection id="start" title="Кратък публичен опит, безплатен модул и избор на пакет">
        <ul>
          <li><Link to="/academy-labs/silk-road/start">Публичен учебен прототип</Link>: ограничена проба без покупка и без учебен акаунт. Работи с предоставени измислени случаи.</li>
          <li><Link to="/module/s01-m01?lesson=0">Безплатен модул 01 — „AI според задачата“</Link>: четири пълни урока и проверки през акаунт. Учебният прогрес се свързва с акаунта.</li>
          <li><strong>Стартов пакет:</strong> първите десет модула, общо 70 публикувани урока.</li>
          <li><strong>Пълна програма:</strong> единадесетте модула, общо 74 публикувани урока, включително модул 11 за услуга, цена и устойчиво изпълнение.</li>
        </ul>
        <p>Актуалните пакети, цени и условия са на <Link to="/kurs/ai-business-blueprint">страницата на програмата</Link>. Разгледай обхвата след пробата и избери според задачата, която искаш да развиваш.</p>
      </ArticleSection>
      <ArticleSection id="articles" title="Започни от въпроса, който имаш сега">
        <p>Тези осем публични материала дават завършена малка помощ. Курсът добавя последователната практика, задачите и работата по свой проект.</p>
        <ul>{SILK_ROAD_ARTICLES.map(article => <li key={article.id}><Link to={`/blog/${article.id}`}>{article.title}</Link></li>)}</ul>
      </ArticleSection>
      <ArticleSection id="questions" title="Как да прецениш дали обучението ти е подходящо">
        <p><strong>Колко време ще ми отнеме?</strong> Четенето и практиката са различни. Отдели време за първия модул и опита с прототипа, вместо да приемаш общ срок за всички хора. Темпото зависи от предишния опит и проекта.</p>
        <p><strong>Какво купувам след безплатното начало?</strong> Достъп до съдържанието и проверките в избрания пакет. При покупка прегледай точно включените модули и условията; модул 11 е част от пълната програма.</p>
        <p><strong>Ще имам ли готов бизнес?</strong> Обучението помага да разработиш и провериш решения. Реалната услуга изисква подходяща аудитория, изпълнение, отговорници и проверка на използваните външни системи. Няма обещание за първа позиция, клиент или печалба само от завършването.</p>
        <p><strong>Откъде да започна?</strong> Ако още преценяваш подхода, отвори публичния прототип. Ако искаш първите пълни уроци и запазен учебен прогрес, започни безплатния модул през акаунт.</p>
      </ArticleSection>
    </div>
  </BlogArticleLayout>;
}
