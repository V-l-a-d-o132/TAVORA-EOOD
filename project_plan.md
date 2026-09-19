# Академия TAVORA — Образователна Платформа

## 1. Project Description
Премиум B2B образователна платформа за AI бизнес изграждане и монетизация. Целева аудитория: предприемачи, фрийлансъри и бизнес собственици, търсещи практически умения за дигитален бизнес. Дизайн стил: бруталистки тъмен минимализъм — #0a0a0a + #e53e3e.

## 2. Page Structure
- `/` - Начална страница (Hero, Case Study, Curriculum, Mentor, Application, Footer)
- `/login` - Вход в платформата
- `/register` - Регистрация
- `/dashboard` - Табло за колеги (защитена страница)
- `/kurs` - Академия TAVORA лендинг (гости) / Learning Platform (влезли)
- `/module/:moduleId` - Страница с интерактивен урок (защитена страница)

## 3. Core Features
- [x] Hero секция с headline и CTA
- [x] Case Study секция (Sunrise Food, K-Food, NP Massage Studio)
- [x] Пътят на коприната: AI Business Blueprint секция (11 модула)
- [x] Mentor профил секция
- [x] Application/Enrollment форма
- [x] Footer с навигация
- [x] Логин / Регистрация (Supabase Auth)
- [x] Табло с прогрес
- [x] Интерактивни уроци с проследяване на прогреса
- [x] Домашни задания (качване и преглед)
- [x] Постижения и статистика
- [x] Welcome email automation (10 мин забавяне, 72ч таймер)
- [x] Downsell email (2 часа след логин без покупка)
- [x] Abandoned cart email (24 часа след влизане в checkout без плащане)
- [x] Stripe плащания за отключване на модули

## 4. Data Model Design

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key (= auth.users.id) |
| full_name | text | Пълно име |
| avatar_url | text | Снимка |
| created_at | timestamptz | Дата на регистрация |
| has_full_access | boolean | Пълен достъп до всички модули |
| unlocked_modules | text[] | Списък с отключени модули |
| welcome_email_sent | boolean | Изпратен ли е welcome email |
| welcome_email_sent_at | timestamptz | Кога е изпратен |
| offer_expires_at | timestamptz | Кога изтича офертата (72ч) |
| abandoned_checkout_at | timestamptz | Кога е влязъл в checkout (за abandoned cart) |
| abandoned_checkout_tier | text | Кой tier е разглеждал |
| abandoned_cart_email_sent | boolean | Изпратен ли е abandoned cart email |
| abandoned_cart_email_sent_at | timestamptz | Кога е изпратен |

### Table: pdf_progress
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → profiles.id |
| module_id | text | ID на модула |
| lesson_id | text | ID на урока |
| page_number | integer | Текуща страница |
| total_pages | integer | Общо страници |
| completed | boolean | Завършен ли е |
| quiz_score | integer | Резултат от тест |
| quiz_total | integer | Общо въпроси в тест |
| updated_at | timestamptz | Последна актуализация |

### Table: homework
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK → profiles.id |
| module_id | text | За кой модул е |
| content | text | Текст на домашното |
| submitted_at | timestamptz | Дата на предаване |
| status | text | pending / reviewed |

## 5. Backend / Third-party Integration Plan
- Supabase: Свързан — Auth, Database, RLS политики
- Stripe: Свързан — плащания за отключване на модули
- Resend: Свързан — welcome email automation
- Shopify: Не е необходим
- Form: Readdy форма за записване

## 6. Development Phase Plan

### Phase 1: Начална страница (Завършена)
- Goal: Изграждане на пълна landing page с всички секции
- Deliverable: Функционален уебсайт с Hero, Case Study, Curriculum, Mentor, Application, Footer

### Phase 2: Автентикация (Завършена)
- Goal: Логин и регистрация с Supabase Auth
- Deliverable: /login и /register страници, auth context, защитени routes

### Phase 3: Академия TAVORA лендинг (Завършена)
- Goal: Маркетингова фуния за Академия TAVORA
- Deliverable: /kurs с Hero, Modules, Results, Trust, FAQ, Enrollment

### Phase 4: Learning Platform (Завършена)
- Goal: Интерактивна learning платформа за влезли колеги
- Deliverable: /kurs (влезли) с прогрес, модули, уроци

### Phase 5: Интерактивни уроци с прогрес (Завършена)
- Goal: Страница за интерактивни уроци с проследяване
- Deliverable: /module/:moduleId с PDF viewer, quiz, бележки

### Phase 6: Домашни задания (Завършена)
- Goal: Колегите могат да предават домашни
- Deliverable: Форма за предаване на домашно към всеки модул

### Phase 7: SEO Доминация за Велико Търново (В прогрес)
- Goal: #1 позиции в Google за ключови думи
- Deliverable: Dedicated landing pages, schema.org markup, geo tags, internal linking
- Клиентски успехи: Sunrise Food #1 Google, K-Food #1 Google+ChatGPT, NP Massage Studio #1 Google+ChatGPT

## 7. Module Structure: Пътят на коприната: AI Business Blueprint

| # | Модул | Статус |
|---|-------|--------|
| 01 | AI Advantage | FREE |
| 02 | The Readdy Blueprint | Locked |
| 03 | Invisible Marketing | Locked |
| 04 | Content That Sells | Locked |
| 05 | Audience Engine | Locked |
| 06 | The Conversion System | Locked |
| 07 | Professional Stack | Locked |
| 08 | Digital Protection | Locked |
| 09 | Growth Analytics | Locked |
| 10 | Scale with AI | Locked |
| 11 | The Revenue Blueprint | Locked (Premium) |