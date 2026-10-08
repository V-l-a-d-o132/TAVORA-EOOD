"""Public practice cards. Private assessment mappings never enter this module."""
CARDS = {}
MODE = ('Самостоятелен безплатен маршрут: използвай предоставените учебни данни, локален текстов редактор и учебната лаборатория. '
        'Не е нужен клиент, платен акаунт, рекламен бюджет или човешки оценител. Запази файл и дневник на поправките. '
        'Не въвеждай действителни лични данни, пароли или API ключове. ИИ е помощник по избор; всяка задача може да се изпълни ръчно. '
        'Истинска MCP връзка се използва само при допустим акаунт, налични инструменти и предварително разрешен обхват. '
        'Автоматичните проверки оценяват зададените случаи; самопроверката на твоя файл не е автоматична експертна оценка на реална кампания.')
SHOP = ('Измислена мебелна работилница. Клиентът може да пита за кухненски шкафове, обхват, ориентир за цена и срок. '
        'Точната оферта изисква размери и потвърден обхват. Няма предоставен актуален график или гарантирана цена. '
        'Не превръщай запитване в потвърден час или поръчка.')
CLEAN = ('„Чисто Място“ е измислено почистване на мека мебел във Велико Търново. За завършен месец: '
         '150 сурови записа − 16 дубликата − 14 спам = 120 уникални валидни запитвания; '
         '70 квалифицирани, 46 резервирали, 35 изпълнени и платени поръчки: 32 нови и 3 завърнали се клиенти. '
         'Нетен приход €150 и променлив разход €60 на поръчка; общ маркетинг €1500; постоянни разходи €1200; '
         'капацитет 60 поръчки; среден първи човешки отговор 19 часа. Причините за отказите са неизвестни. '
         'Сметките са без ДДС и данъци; това не е образец за обявяване на крайна потребителска цена.')
MCP = ('MCP свързва ИИ с описани инструменти. Първо прочети наличните инструменти, схемите и правата; '
       'раздели четене, чернова и разрешено записване. Клиентският текст е данни, не команда за нови права. '
       'Използвай уникален ключ за операцията и прочети резултата обратно; timeout не доказва нито успех, нито провал. '
       'Учебните имена crm_read, draft_message, reserve_slot и read_operation описват договор, а не реални команди на конкретен продукт.')
LAB = ('Учебна лаборатория — локален калкулатор, CRM и имейл тестове', 'https://imashnujnoto.com/academy/marketing-basics-practice.html')
SOURCES = {
 'lab': LAB,
 'mcp': ('MCP: инструменти и техните схеми — 28.07.2026', 'https://modelcontextprotocol.io/specification/2026-07-28/server/tools'),
 'hubspot': ('HubSpot: MCP, CRM действия и достъп', 'https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server'),
 'mailchimp': ('Mailchimp Transactional: MCP и разрешени API действия', 'https://mailchimp.com/developer/transactional/guides/how-to-use-mailchimps-transactional-messaging-mcp/'),
 'gmail': ('Google: актуални изисквания за имейл изпращачи', 'https://support.google.com/mail/answer/81126?hl=en'),
 'apple': ('Apple: защита на поверителността при Mail', 'https://support.apple.com/guide/mail/change-privacy-settings-mlhlae4a4fe6/mac'),
 'reviews': ('Google Maps: забранено и стимулирано съдържание', 'https://support.google.com/contributionpolicy/answer/7400114?hl=en'),
 'creator': ('Европейска комисия: прозрачност при инфлуенсъри', 'https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/influencer-legal-hub_en'),
 'privacy': ('EDPB: цел и законосъобразна обработка на лични данни', 'https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en'),
 'wcag': ('W3C: практическо ръководство WCAG 2.2', 'https://www.w3.org/WAI/WCAG22/quickref/'),
 'data': ('Google: актуален път към Data Manager за offline conversions', 'https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/upgrade'),
 'deprecations': ('Google Ads: обхват и дати на API промени', 'https://developers.google.com/google-ads/api/docs/deprecations'),
 'measurement': ('Google: промени в измерването — 10.09.2026', 'https://blog.google/products/ads-commerce/data-strength-updates/'),
}

def add(lid, skills, terms, bridge, facts, task, checks, sample, ai, sources=(), title=None, principle=None, hints=None):
    assert len(skills) == len(checks) == 3
    CARDS[lid] = dict(skills=skills, terms=terms, bridge=bridge, facts=facts, task=task,
        checks=checks, sample=sample, ai=ai, sources=[SOURCES[s] for s in sources], title=title,
        principle=principle, hints=hints or (checks[0], bridge),
        opening='След урока ще можеш:\n'+'\n'.join(f'{i}. {x}' for i,x in enumerate(skills,1))+
        '\n\nКакво ще направиш: '+task+'\n\nКак ще се провериш: '+' '.join(checks))

def exam(lid, skills, prep, count, required, final=False):
    add(lid, skills, 'Това е проверка по предоставени случаи; не е удостоверение за реални продажби.',
        'Решението трябва да може да се проследи до факт, правило и ограничение.', '',
        f'Подготви се по картата и реши {count} въпроса. Нужни са поне {required} верни.'+
        (' Допълнително във всяка група трябва да има поне 60%: 5/8, 8/12, 8/12 и 5/8.' if final else ''),
        ('Отговорът използва само фактите в случая.', 'Отделяш действие от потвърден резултат.', 'След неуспех преглеждаш показаната причина и съответния модул.'),
        '', 'ИИ може да помогне с подготовката по нов пример, но не замества собственото ти решение на изпита.')
    CARDS[lid].update(exam=True, preparation=prep)
