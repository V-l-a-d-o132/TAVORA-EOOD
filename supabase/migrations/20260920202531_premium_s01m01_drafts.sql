-- Premium editorial pass for s01-m01.
--
-- Safety:
--   * The currently published version is never changed.
--   * The original interactive_lessons row and immutable legacy version remain intact.
--   * The new version is attached only as draft_version_id for admin review/preview.
-- Rollback:
--   update public.academy_lessons
--      set draft_version_id = published_version_id, status = 'published'
--    where module_id = 's01-m01'
--      and draft_version_id in (
--        select id from public.academy_lesson_versions
--        where change_note = 'Premium editorial restoration from the preserved legacy lesson'
--      );

CREATE TEMP TABLE premium_s01m01_specs (
  lesson_id text PRIMARY KEY,
  objective text NOT NULL,
  hook text NOT NULL,
  artifact_prompt text NOT NULL,
  artifact_placeholder text NOT NULL,
  next_step text NOT NULL
) ON COMMIT DROP;

INSERT INTO premium_s01m01_specs VALUES
('l01-01',
 'След този урок ще можеш да разпознаваш кои бизнес задачи са подходящи за AI, да оценяваш риска им и да задаваш ясна граница за човешка проверка.',
 'AI може да ти спести часове, но убедително грешен отговор може да струва клиент, пари или репутация. Затова първото умение не е писането на prompt, а правилният избор какво да делегираш и какво никога да не приемаш без проверка.',
 'Създай своята „Карта за AI делегиране“. Опиши една повтаряема задача от бизнеса си: 1) какъв вход получава AI; 2) какъв резултат трябва да върне; 3) кои факти човек проверява; 4) какви данни не се споделят; 5) как изглежда приемливият краен резултат. Завърши с едно изречение: „AI предлага…, човекът решава…“.',
 'Пример: Всяка седмица отговарям на 15 сходни запитвания. AI получава обезличен текст и актуален ценоразпис, предлага чернова до 120 думи, а аз проверявам цена, срок и обещания преди изпращане…',
 'В следващия урок ще превърнеш тази карта в професионален prompt, който дава повторяем и проверим резултат.'),
('l01-02',
 'След този урок ще можеш да създаваш професионален prompt като бизнес бриф: с контекст, задача, ограничения, формат, примери и критерий за качество.',
 'Когато AI дава общ, „пластмасов“ текст, проблемът рядко е липса на магическа команда. Обикновено липсват решенията, които добрият бриф трябва да съдържа: за кого е резултатът, какво трябва да постигне и по какво ще бъде приет или отхвърлен.',
 'Напиши готов за използване prompt за реалната задача от предишния урок. Включи: роля, бизнес контекст, аудитория, конкретна задача, налични факти, ограничения, забранени клишета, изходен формат, добър пример и контролен списък за самопроверка. Добави как AI да реагира, когато информацията не е достатъчна.',
 'Не пиши „Напиши ми добър пост“. Опиши бизнеса, клиента, целта, доказателството, тона, дължината, CTA, забранените твърдения и критериите, по които ще провериш черновата…',
 'В следващия урок ще тестваш един и същ бриф в различни модели и ще избираш инструмент по резултат, риск и цена.'),
('l01-03',
 'След този урок ще можеш да сравняваш ChatGPT, Claude, Gemini и други модели чрез еднакъв тест, ясна рубрика и правила за работа с чувствителни данни.',
 'Любимият инструмент лесно се превръща в навик. Но различните задачи изискват различен контекст, работа с източници, визуално разбиране, скорост и ниво на поверителност. Изборът „по усещане“ прави качеството случайно.',
 'Създай мини бенчмарк. Избери една реална задача, един и същ обезличен вход и два модела. Оцени всеки от 1 до 5 по: точност, следване на инструкции, приложимост, нужда от редакция, проверимост на фактите, време и цена. Запиши победителя и условието, при което би избрал другия модел.',
 'Таблица: критерий | тежест | модел A | модел B | доказателство. Не давай оценка без конкретен цитат, пропуск или измерима редакция, която я оправдава…',
 'В следващия урок ще превърнеш отделните добри резултати в ежедневен AI процес с измерима възвръщаемост и човешки контрол.'),
('l01-04',
 'След този урок ще можеш да превръщаш AI от еднократен чат в надежден работен процес с собственик, вход, контрол, метрика и правило за спиране.',
 'Една успешна чернова не е система. Стойността идва, когато екипът може да повтори резултата, да забележи грешката навреме и да докаже, че спестеното време е по-голямо от цената и риска.',
 'Проектираj едностранично AI SOP за една задача. Опиши тригера, нужния вход, одобрения prompt, забранените данни, стъпките на AI, човешката проверка, отговорника, мястото за запис, метриката преди/след и условието, при което процесът се спира. Изчисли месечната стойност: (спестени часове × часова ставка) − разходи за инструменти − очаквана цена на корекции.',
 'SOP: Кога стартира → кой подготвя данните → какво генерира AI → кой проверява факти/цени/тон → кой одобрява → къде се пази версията → как измерваме време, качество и грешки…',
 'След урока избери един процес за 14-дневен пилот. Не автоматизирай следващ процес, преди да имаш измерен резултат и записана корекция на първия.');

DO $$
DECLARE
  spec record;
  lesson_row public.academy_lessons;
  old_row public.interactive_lessons;
  source_version public.academy_lesson_versions;
  new_version_id uuid;
  next_version integer;
  slide record;
  block_id uuid;
  block_type text;
  block_title text;
  block_content jsonb;
  validation_result jsonb;
  position_number integer;
  option_rows jsonb;
  correct_option text;
BEGIN
  FOR spec IN SELECT * FROM premium_s01m01_specs ORDER BY lesson_id LOOP
    SELECT * INTO lesson_row
    FROM public.academy_lessons
    WHERE module_id='s01-m01' AND lesson_id=spec.lesson_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Expected lesson s01-m01/% was not found', spec.lesson_id;
    END IF;

    IF EXISTS (
      SELECT 1 FROM public.academy_lesson_versions
      WHERE academy_lesson_id=lesson_row.id
        AND change_note='Premium editorial restoration from the preserved legacy lesson'
    ) THEN
      CONTINUE;
    END IF;

    SELECT * INTO old_row
    FROM public.interactive_lessons
    WHERE id=lesson_row.source_legacy_id;

    IF NOT FOUND OR jsonb_typeof(old_row.slides) IS DISTINCT FROM 'array'
       OR jsonb_array_length(old_row.slides) < 5 THEN
      RAISE EXCEPTION 'Preserved source content is missing for s01-m01/%', spec.lesson_id;
    END IF;

    SELECT * INTO source_version
    FROM public.academy_lesson_versions
    WHERE academy_lesson_id=lesson_row.id AND source_kind='legacy'
    ORDER BY version_number
    LIMIT 1;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Legacy audit version is missing for s01-m01/%', spec.lesson_id;
    END IF;

    SELECT coalesce(max(version_number),0)+1 INTO next_version
    FROM public.academy_lesson_versions
    WHERE academy_lesson_id=lesson_row.id;

    INSERT INTO public.academy_lesson_versions(
      academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,
      objective,hook,estimated_minutes,source_kind,change_note
    ) VALUES (
      lesson_row.id,next_version,source_version.id,old_row.title,coalesce(old_row.subtitle,''),old_row.duration,
      spec.objective,spec.hook,
      greatest(20,coalesce((regexp_match(old_row.duration,'[0-9]+'))[1]::integer,25)),
      'editor','Premium editorial restoration from the preserved legacy lesson'
    ) RETURNING id INTO new_version_id;

    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES
      (new_version_id,'objective',0,'objective','Какво ще можеш',jsonb_build_object('body',spec.objective),true,3),
      (new_version_id,'hook',1,'hook','Защо това има значение',jsonb_build_object('body',spec.hook),true,3);

    position_number:=2;
    FOR slide IN
      SELECT value, ordinality
      FROM jsonb_array_elements(old_row.slides) WITH ORDINALITY
      WHERE value->>'type' <> 'title'
      ORDER BY ordinality
    LOOP
      block_title:=coalesce(nullif(slide.value->>'title',''),'Практическа стъпка');
      block_type:=CASE slide.value->>'type'
        WHEN 'content' THEN 'rich_text'
        WHEN 'comparison' THEN 'before_after'
        WHEN 'framework' THEN 'step_reveal'
        WHEN 'interactive' THEN 'practical_response'
        WHEN 'example' THEN 'example'
        WHEN 'checkpoint' THEN 'quiz'
        WHEN 'summary' THEN 'summary'
        WHEN 'checklist' THEN 'checklist'
        ELSE 'rich_text'
      END;

      IF slide.value->>'type'='content' THEN
        block_content:=jsonb_build_object(
          'body',coalesce(slide.value->>'body',''),
          'points',coalesce((SELECT jsonb_agg(jsonb_build_object('id','point-'||n,'text',text_value) ORDER BY n)
             FROM jsonb_array_elements_text(coalesce(slide.value->'highlights','[]'::jsonb)) WITH ORDINALITY h(text_value,n)),'[]'::jsonb)
        );
      ELSIF slide.value->>'type'='comparison' THEN
        block_content:=jsonb_build_object(
          'before',jsonb_build_object('label',coalesce(slide.value->'leftSide'->>'label','Слаб подход'),'text',coalesce(slide.value->'leftSide'->>'content','')),
          'after',jsonb_build_object('label',coalesce(slide.value->'rightSide'->>'label','Работещ подход'),'text',coalesce(slide.value->'rightSide'->>'content',''))
        );
      ELSIF slide.value->>'type'='framework' THEN
        block_content:=jsonb_build_object('steps',coalesce((
          SELECT jsonb_agg(jsonb_build_object(
            'id','step-'||n,
            'title',coalesce(step->>'title','Стъпка '||n),
            'text',concat_ws(E'\n\n',nullif(step->>'description',''),CASE WHEN coalesce(step->>'example','')<>'' THEN 'Пример: '||(step->>'example') END)
          ) ORDER BY n)
          FROM jsonb_array_elements(coalesce(slide.value->'frameworkSteps','[]'::jsonb)) WITH ORDINALITY f(step,n)
        ),'[]'::jsonb));
      ELSIF slide.value->>'type'='interactive' THEN
        block_content:=jsonb_build_object(
          'prompt',concat_ws(E'\n\n',
            nullif(slide.value->'interactivePrompt'->>'scenario',''),
            nullif(slide.value->'interactivePrompt'->>'task',''),
            CASE WHEN coalesce(slide.value->'interactivePrompt'->>'hint','')<>'' THEN 'Насока: '||(slide.value->'interactivePrompt'->>'hint') END),
          'placeholder','Напиши своето решение с конкретни допускания, критерий за успех и стъпка за човешка проверка.',
          'minLength',80
        );
      ELSIF slide.value->>'type'='checkpoint' THEN
        SELECT coalesce(jsonb_agg(jsonb_build_object('id',chr(96+n::integer),'label',option_text) ORDER BY n),'[]'::jsonb)
        INTO option_rows
        FROM jsonb_array_elements_text(coalesce(slide.value->'checkpoint'->'options','[]'::jsonb)) WITH ORDINALITY o(option_text,n);
        block_content:=jsonb_build_object('question',coalesce(slide.value->'checkpoint'->>'question','Провери разбирането си'),'options',option_rows);
      ELSIF slide.value->>'type'='summary' THEN
        block_content:=jsonb_build_object(
          'takeaways',coalesce(slide.value->'keyTakeaways','[]'::jsonb),
          'nextStep',coalesce(nullif(slide.value->>'cta',''),spec.next_step)
        );
      ELSIF slide.value->>'type'='checklist' THEN
        block_content:=jsonb_build_object('items',coalesce((
          SELECT jsonb_agg(jsonb_build_object(
            'id','item-'||n,
            'text',CASE WHEN jsonb_typeof(item)='string' THEN item#>>'{}' ELSE coalesce(item->>'text',item->>'title') END,
            'required',true
          ) ORDER BY n)
          FROM jsonb_array_elements(coalesce(slide.value->'items',slide.value->'checklistItems','[]'::jsonb)) WITH ORDINALITY c(item,n)
        ),'[]'::jsonb));
      ELSE
        block_content:=jsonb_build_object(
          'body',coalesce(slide.value->>'body',slide.value->>'description',''),
          'solution',coalesce(slide.value->>'solution','')
        );
      END IF;

      INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
      VALUES(new_version_id,'source-'||slide.ordinality,position_number,block_type,block_title,block_content,true,
        CASE WHEN block_type IN ('quiz','practical_response','step_reveal','checklist') THEN 8 ELSE 3 END)
      RETURNING id INTO block_id;

      IF slide.value->>'type'='checkpoint' THEN
        correct_option:=chr(97+coalesce((slide.value->'checkpoint'->>'correctIndex')::integer,0));
        INSERT INTO academy_private.lesson_block_keys(block_id,answer_key,feedback,scoring)
        VALUES(
          block_id,
          jsonb_build_object('correct',correct_option),
          jsonb_build_object(
            'explanation',coalesce(slide.value->'checkpoint'->>'explanation','Върни се към принципа и сравни всяка възможност с риска и критерия за проверка.'),
            'incorrect','Прегледай примера и опитай отново. Търси отговора, който може да бъде проверен, а не този, който само звучи убедително.'
          ),
          '{"mode":"single_choice"}'::jsonb
        );
      END IF;

      position_number:=position_number+1;
    END LOOP;

    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(
      new_version_id,'business-artifact',position_number,'practical_response','Създай реален работен актив',
      jsonb_build_object('prompt',spec.artifact_prompt,'placeholder',spec.artifact_placeholder,'minLength',180),true,20
    );
    position_number:=position_number+1;

    INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
    VALUES(
      new_version_id,'quality-check',position_number,'checklist','Провери дали резултатът е готов за реална употреба',
      jsonb_build_object('items',jsonb_build_array(
        jsonb_build_object('id','specific','text','Използвах конкретни данни и ограничения от моя бизнес, а не общи фрази.','required',true),
        jsonb_build_object('id','evidence','text','Определих как ще проверя фактите, числата и обещанията преди реална употреба.','required',true),
        jsonb_build_object('id','privacy','text','Премахнах лични, договорни, финансови и други чувствителни данни, които не трябва да споделям.','required',true),
        jsonb_build_object('id','owner','text','Ясно е кой човек носи отговорност за крайното решение и одобрение.','required',true)
      )),true,8
    );

    -- The restored source summary must remain the final learner step.
    UPDATE public.academy_lesson_blocks
    SET position=position_number+2,
        content=jsonb_set(content,'{nextStep}',to_jsonb(spec.next_step),true)
    WHERE academy_lesson_blocks.version_id=new_version_id
      AND academy_lesson_blocks.block_type='summary';

    -- Ensure a useful next step even if the source summary is missing or incomplete.
    IF NOT EXISTS(SELECT 1 FROM public.academy_lesson_blocks b WHERE b.version_id=new_version_id AND b.block_type='summary') THEN
      position_number:=position_number+1;
      INSERT INTO public.academy_lesson_blocks(version_id,block_key,position,block_type,title,content,required,points)
      VALUES(new_version_id,'summary',position_number,'summary','Какво вече умееш',
        jsonb_build_object('takeaways',jsonb_build_array(spec.objective,'Имаш завършен бизнес актив, който можеш да използваш и подобряваш.'),'nextStep',spec.next_step),true,5);
    END IF;

    validation_result:=academy_private.lesson_validation(new_version_id);
    IF jsonb_array_length(validation_result->'errors')>0 THEN
      RAISE EXCEPTION 'Premium draft s01-m01/% failed validation: %',spec.lesson_id,validation_result;
    END IF;

    UPDATE public.academy_lesson_versions
    SET validation=validation_result
    WHERE id=new_version_id;

    UPDATE public.academy_lessons
    SET draft_version_id=new_version_id,updated_at=now()
    WHERE id=lesson_row.id;

    INSERT INTO public.academy_lesson_audit(academy_lesson_id,version_id,action,details)
    VALUES(lesson_row.id,new_version_id,'saved',jsonb_build_object(
      'source','premium_editorial_restoration',
      'preserved_published_version_id',lesson_row.published_version_id,
      'preserved_legacy_version_id',source_version.id,
      'review_required',true
    ));
  END LOOP;
END $$;
