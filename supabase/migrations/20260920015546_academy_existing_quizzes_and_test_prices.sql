-- Preserve the authored quizzes previously shipped in the public client bundle.
-- Never replace administrator edits or generate placeholder questions.
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l01-01-1')::uuid,'s01-m01','l01-01','Какво е prompt engineering?','["Процесът на създаване и оптимизиране на инструкции за AI модели","Програмиране на нов AI модел от нулата","Инсталиране на AI софтуер на компютър","Превод на текст между различни езици"]'::jsonb,0,'Prompt engineering е изкуството да формулираш точни и ефективни инструкции, които AI моделът да разбере и изпълни правилно.',0),
(md5('academy-existing-quiz:q-l01-01-2')::uuid,'s01-m01','l01-01','Кое НЕ е част от добрия prompt?','["Ясен контекст за задачата","Конкретен желан изход","Колкото се може повече произволни думи","Примери за желания резултат"]'::jsonb,2,'Добрият prompt е конкретен и целенасочен, а не пълен с произволни думи. Излишната информация обърква модела.',1),
(md5('academy-existing-quiz:q-l01-01-3')::uuid,'s01-m01','l01-01','Кой е най-важният елемент в един prompt?','["Дължината на текста","Ясната и конкретна инструкция","Броят на използваните чуждици","Сложните технически термини"]'::jsonb,1,'Ясната и конкретна инструкция е ключът. Моделът не чете мисли — трябва да му кажеш точно какво искаш.',2),
(md5('academy-existing-quiz:q-l01-01-4')::uuid,'s01-m01','l01-01','Какво означава "zero-shot prompting"?','["Даваш prompt без никакви примери","Използваш нула думи в prompt-а","Пускаш prompt без интернет връзка","Тренираш модела от нулата"]'::jsonb,0,'Zero-shot prompting е когато даваш инструкция без примери и очакваш моделът да се справи само с описанието.',3),
(md5('academy-existing-quiz:q-l01-01-5')::uuid,'s01-m01','l01-01','Защо е важно да тестваш prompt-ите си?','["Защото първият опит рядко дава перфектен резултат","Защото AI-то се уморява","Защото така пишем в правилата","Не е важно, винаги работи от първия път"]'::jsonb,0,'Prompt engineering е итеративен процес. Тестваш, анализираш резултата, подобряваш и пак тестваш.',4)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m01' AND lesson_id='l01-01');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l01-02-1')::uuid,'s01-m01','l01-02','Кои са 4-те ключови елемента на перфектния prompt?','["Контекст, инструкция, формат, ограничения","Въведение, среда, заключение, подпис","Скорост, памет, процесор, диск","Цена, време, качество, количество"]'::jsonb,0,'Перфектният prompt има: контекст (за какво става дума), инструкция (какво да направи), формат (как да изглежда резултатът) и ограничения (какво НЕ трябва).',0),
(md5('academy-existing-quiz:q-l01-02-2')::uuid,'s01-m01','l01-02','Как форматът на изхода влияе на резултата?','["Моделът дава по-структуриран и полезен отговор","Няма значение, моделът сам решава","Само забавя отговора","Работи само на английски език"]'::jsonb,0,'Когато посочиш желан формат (таблица, списък, JSON), моделът структурира отговора точно както ти трябва.',1)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m01' AND lesson_id='l01-02');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l02-01-1')::uuid,'s01-m02','l02-01','Какво представлява Readdy платформата?','["AI-powered платформа за генериране на уебсайтове и продукти","Текстови редактор за програмисти","Социална мрежа за дизайнери","Хостинг за големи корпорации"]'::jsonb,0,'Readdy е AI платформа, която генерира пълноценни уебсайтове и дигитални продукти чрез естествен език.',0),
(md5('academy-existing-quiz:q-l02-01-2')::uuid,'s01-m02','l02-01','Основното предимство на Readdy е:','["Генериране на код и дизайн от текстово описание с AI","Безплатен хостинг завинаги","Вградена счетоводна система","Видео редактор с AI"]'::jsonb,0,'Readdy превръща твоето текстово описание в работещ код и красив дизайн, без да пишеш ред код.',1),
(md5('academy-existing-quiz:q-l02-01-3')::uuid,'s01-m02','l02-01','Трябва ли да знаеш програмиране за да ползваш Readdy?','["Не, Readdy генерира кода вместо теб","Да, задължително Python","Да, поне JavaScript основи","Само ако искаш custom функции"]'::jsonb,0,'Readdy е създаден за хора без технически познания. Описваш какво искаш и AI генерира всичко.',2)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m02' AND lesson_id='l02-01');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l02-02-1')::uuid,'s01-m02','l02-02','Как Readdy помага за по-добър AI дизайн?','["Чрез итеративно подобряване и прецизни prompt-и за желания резултат","Като копира дизайна на конкурентите","Чрез случаен избор на цветове","Като наема дизайнери вместо теб"]'::jsonb,0,'Readdy работи най-добре когато му даваш ясни, конкретни инструкции и итерираш върху резултата.',0),
(md5('academy-existing-quiz:q-l02-02-2')::uuid,'s01-m02','l02-02','Кой е най-важният елемент при описание на дизайн в Readdy?','["Целевата аудитория и усещането, което търсиш","Точният HEX код на цветовете","Броят на пикселите","Името на шрифта"]'::jsonb,0,'Readdy разбира описания като "минималистичен", "луксозен", "игрив" — описвай усещането, не техническите детайли.',1)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m02' AND lesson_id='l02-02');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l03-01-1')::uuid,'s01-m03','l03-01','Какво означава SEO?','["Search Engine Optimization — оптимизация за търсачки","Social Engine Operations","System Engineering Overview","Site Enhancement Online"]'::jsonb,0,'SEO е процесът на оптимизиране на уебсайт, за да се класира по-високо в резултатите на търсачки като Google.',0),
(md5('academy-existing-quiz:q-l03-01-2')::uuid,'s01-m03','l03-01','Кой е най-важният SEO фактор през 2026?','["Качествено и полезно съдържание","Брой ключови думи в заглавието","Цвят на фона на сайта","Колко бързо цъкаш с мишката"]'::jsonb,0,'Google все повече набляга на качественото, полезно съдържание, което наистина помага на потребителите.',1),
(md5('academy-existing-quiz:q-l03-01-3')::uuid,'s01-m03','l03-01','Какво е "keyword stuffing"?','["Прекалено натъпкване на ключови думи в текста","Пълнене на ключови думи в код","Създаване на отделна страница за всяка дума","Купуване на ключови думи от конкуренти"]'::jsonb,0,'Keyword stuffing е стара и вече наказвана практика на прекомерно повтаряне на ключови думи в опит да се манипулира ранкингът.',2)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m03' AND lesson_id='l03-01');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-l03-02-1')::uuid,'s01-m03','l03-02','Какво е GEO (Generative Engine Optimization)?','["Оптимизация на съдържание за AI търсачки като ChatGPT, Gemini и Perplexity","Същото като SEO, само с ново име","Оптимизация за географски карти","Genetic Engine Operations"]'::jsonb,0,'GEO е новата дисциплина за оптимизиране на съдържание така, че AI моделите да го цитират и препоръчват в отговорите си.',0),
(md5('academy-existing-quiz:q-l03-02-2')::uuid,'s01-m03','l03-02','Кое от изброените помага за GEO?','["Ясна структура, авторитетни източници и цитируеми факти","Колкото се може повече реклами","Криене на ключови данни от конкурентите","Само видеа, без текст"]'::jsonb,0,'AI моделите предпочитат добре структурирано съдържание с ясни факти и цитати от авторитетни източници.',1)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s01-m03' AND lesson_id='l03-02');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-lv00-01-1')::uuid,'s02-m01','lv00-01','Какъв е основният проблем на повечето бизнес видеа?','["Липсват ясна цел и стратегия — снима се \"ей така\"","Камерата е твърде евтина","Твърде къси са","Няма достатъчно ефекти"]'::jsonb,0,'Повечето бизнес видеа се правят без стратегия. Първо трябва да знаеш ЗАЩО снимаш и КАКВО искаш да постигнеш.',0),
(md5('academy-existing-quiz:q-lv00-01-2')::uuid,'s02-m01','lv00-01','Кой е симптом №1 на слабото видео?','["Зрителят не знае какво да направи след като го изгледа","Видеото е под 30 секунди","Няма музика на заден фон","Снимано е с телефон, не с професионална камера"]'::jsonb,0,'Ако видеото няма ясен Call-to-Action, зрителят просто го гледа и забравя. Всяко видео трябва да води към действие.',1)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s02-m01' AND lesson_id='lv00-01');
INSERT INTO public.lesson_quizzes(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
SELECT * FROM (VALUES
(md5('academy-existing-quiz:q-lm01-01-1')::uuid,'s03-m01','lm01-01','Какво представлява "AI тестът за препоръка"?','["Питаш ChatGPT/Gemini \"кой е най-добрият в твоята ниша\" и проверяваш дали си в резултатите","Караш AI да напише реклама за теб","Тестваш колко бързо работи AI моделът","Сравняваш цени на AI инструменти"]'::jsonb,0,'AI тестът за препоръка е прост начин да разбереш дали AI моделите те познават и препоръчват — питаш ги кой е най-добрият в твоята ниша и виждаш дали изобщо се появяваш.',0),
(md5('academy-existing-quiz:q-lm01-01-2')::uuid,'s03-m01','lm01-01','Кое е най-важното за автентичното позициониране?','["Да си истински и да не се преструваш на нещо, което не си","Да копираш най-успешния конкурент","Да предлагаш най-ниската цена","Да си активен във всички социални мрежи"]'::jsonb,0,'Автентичността е ключова. Клиентите усещат кога се преструваш. Бъди себе си и намери хората, които ценят точно това.',1),
(md5('academy-existing-quiz:q-lm01-01-3')::uuid,'s03-m01','lm01-01','Какво е "категория на един"?','["Създаваш своя собствена категория, вместо да се сравняваш с конкурентите по цена","Регистрираш бизнеса си само в една категория в Google Business Profile","Избираш един продукт и продаваш само него","Работиш само с един тип клиенти"]'::jsonb,0,'Категория на един означава да излезеш от сравнението "кой е по-евтин" като създадеш своя уникална ниша, в която си единственият играч.',2)
) AS authored(id,module_id,lesson_id,question,options,correct_index,explanation,order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.lesson_quizzes WHERE module_id='s03-m01' AND lesson_id='lm01-01');

-- Verified Stripe test mode IDs, disabled for production checkout by environment matching.
INSERT INTO public.academy_prices(price_id,tier_id,livemode,amount_cents,checkout_enabled) VALUES
('price_1UHZrLBAV4zTG6a352iWRFlt','systems-10',false,4900,true),
('price_1UHZrvBAV4zTG6a3cfD3zHVi','koprinena-pateka',false,9900,true),
('price_1UHZs3BAV4zTG6a3OxkfoYJo','perfektno-video',false,9900,true),
('price_1UHZsABAV4zTG6a3uTG7Rzlq','marketing-basics',false,12900,true),
('price_1UHZsIBAV4zTG6a3Z2tfy28j','premium-all',false,24900,true),
('price_1UHZsQBAV4zTG6a3xhOVDjXR','strategic_access',false,49700,true);
