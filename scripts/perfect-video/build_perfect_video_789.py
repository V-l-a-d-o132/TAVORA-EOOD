"""Build and statically validate the guarded modules 7–9 Academy release."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

from perfect_video_789_content import M7A, M7B, M8A, M8B, M9A, M9B


LESSONS = M7A + M7B + M8A + M8B + M9A + M9B
EXPECTED = {"s02-m07": 16, "s02-m08": 16, "s02-m09": 11}
COMPACT = {"pv07-03", "pv07-14", "pv08-08", "pv09-09", "pv09-10"}
DECISION_CLINIC = {
    "pv07-01", "pv07-02", "pv07-04", "pv07-05", "pv07-06", "pv07-07",
    "pv07-08", "pv07-09", "pv07-11", "pv07-12", "pv07-13", "pv07-16",
    "pv08-01", "pv08-02", "pv08-03", "pv08-04", "pv08-05", "pv08-06",
    "pv08-07", "pv08-09", "pv08-10", "pv08-11", "pv08-12", "pv08-13",
    "pv08-14", "pv08-15", "pv08-16", "pv09-01", "pv09-02", "pv09-04",
    "pv09-05", "pv09-06", "pv09-07", "pv09-08", "pv09-12",
}
HANDOFF_PRACTICE = {
    "pv07-01", "pv07-02", "pv07-04", "pv07-05", "pv07-07", "pv07-08",
    "pv07-11", "pv07-12", "pv07-13", "pv07-16", "pv08-01", "pv08-02",
    "pv08-04", "pv08-05", "pv08-06", "pv08-07", "pv08-09", "pv08-10",
    "pv08-11", "pv08-12", "pv08-13", "pv08-14", "pv08-15", "pv08-16",
    "pv09-01", "pv09-04", "pv09-05", "pv09-06", "pv09-08", "pv09-12",
}
DEEP_NOTES = {
    "pv07-03": (
        "Сними кратък кадър с движение пеша, после същия кадър от опора. "
        "Сравни хоризонта, трептенето на стъпките и края на движението, не "
        "само плавността на средната част. По-дълго фокусно разстояние прави "
        "малкото ъглово движение видимо; широк кадър прощава повече, но не "
        "премахва вертикалното подскачане. При гимбъл настрой баланса преди "
        "калибрация, отключи осите според ръководството и провери моторите с "
        "избрания обектив. На статив изключи стабилизацията, ако тестът показва "
        "плаване на заключен кадър. Избери ръчна опора, когато носенето, "
        "батерията или безопасният път са по-важни от сложна траектория."
    ),
    "pv07-10": (
        "Преди покупка назови кои платени задачи ще използват новата част, "
        "колко пъти месечно и коя загуба премахва: лош говор, повреден кадър, "
        "бавен трансфер или неудобен монтаж. Смятай целия комплект: съвместим "
        "адаптер, батерии, карта, калъф, кабели, резерв и време за настройка. "
        "Поискай тест и пробвай с точния телефон/камера и софтуер. Включи и "
        "поддръжката: батерията е консуматив, безжичният микрофон има ограничен "
        "обхват, а стативът трябва да държи тежестта. Ако покупката не отстранява "
        "измерим тесен участък, остави бюджета за наем, резерв или монтаж."
    ),
    "pv07-14": (
        "Използвай статив за заключен кадър, повторяемо интервю или демонстрация, "
        "когато стабилността е по-важна от пренасянето. Моноподът носи тежестта "
        "и позволява бързо преместване, но изисква оператор и внимание към "
        "основата. Гимбълът помага при движение по маршрут и проследяване, но "
        "иска балансиране, зареждане и място за безопасна траектория. Преди "
        "решение мини маршрута без запис: врати, стълби, тълпа, отражения и "
        "мястото за спиране. Запиши по един пример с всеки наличен вариант и "
        "гледай началото и спирането — клатенето при края често личи най-много. "
        "Ако няма повторяемо движение, не включвай гимбъл само защото го имаш; "
        "бавен пан е по-добър от плаващ кадър."
    ),
    "pv07-15": (
        "Подготви текста за говорене, не за четене: една мисъл на ред, кратки "
        "изречения и маркирани паузи. Разположи екрана близо до обектива; ако "
        "погледът прескача, намали скоростта и размера на текста. Изпробвай "
        "scroll с реалния говорител и неговото темпо, не само с таймер. Направи "
        "проба без запис и после със запис; провери дали очите следят думите или "
        "задържат контакт. Остави място за вдишване и повторение на трудна "
        "реплика. При прекъсване отбележи откъде продължавате. Не прикривай "
        "телепромптера изцяло с монтаж: неподвижните очи личат, а бързият текст "
        "кара говорителя да изпуска окончанията."
    ),
    "pv08-08": (
        "Договори реда на полетата с екипа преди да преименуваш десетки файлове. "
        "Полезната схема може да включва проект, дата, камера/карта, сцена, дубъл "
        "и версия; остави само полета, които някой реално търси. Пример: "
        "`Klinika_20260928_A_C03_T02` със запазено разширение. Серийните номера "
        "трябва да са уникални и подредими; не презаписвай дубъл с нова версия "
        "и не променяй името на camera original без план за relink. Запази "
        "таблица „оригинално име → ново име“ и тествай десет файла с дълги "
        "имена, сходни сцени и различни камери. Монтажистът трябва да различи "
        "дубъла без да отваря всеки файл, а relink да работи и на друга станция."
    ),
    "pv09-09": (
        "Отдели аудиото от картината и премести само единия край: при J-cut "
        "звукът на следващия план започва по-рано; при L-cut предишният звук "
        "остава под новото изображение. Остави чист handle преди съгласната и "
        "след думата; не режи вдишване, ударна съгласна или естествена пауза. "
        "Когато репликата принадлежи на конкретен човек, не приписвай думите на "
        "друг. Сравни синхронен срез, кратък J/L ход и чист cutaway. Слушай със "
        "слушалки, после гледай без звук: историята трябва да остане ясна, а "
        "преходът да не подвежда за реда на събитията. Ако няма покриващ кадър "
        "или чиста реплика, намери нов дубъл; не лепи несвързани срички по waveform-а."
    ),
    "pv09-10": (
        "Провери връзката между source frame rate, timeline и delivery frame "
        "rate. Забавянето използва само записаните кадри; optical flow изчислява "
        "междинни изображения и може да деформира пръсти, решетка, течност, "
        "коса и движещ се текст. Постави начална, средна и крайна скорост около "
        "действието; огледай контакт с предмета, формата и sync на звука. "
        "Сравни кратък render с версия при естествена скорост. Не прави ramp "
        "върху точна инструкция или действие, чиято поредност има значение. Ако "
        "source няма нужните кадри, уговори нов дубъл или остави умерено темпо. "
        "Интерполацията не възстановява липсваща информация."
    ),
    "pv09-11": (
        "Преди punch-in сметни пикселния запас между source и target: провери "
        "резолюция, aspect ratio, стабилизационния crop и safe area. Огледай "
        "текст, очи, коса и продукт на крайния размер; proxy preview не доказва "
        "рязкост. За маска избери проследима точка и провери ръба върху светъл и "
        "тъмен фон. Feather твърде широк прави ореол, твърде тесен изрязва "
        "контура. Ако ръката закрива tracking point, коригирай ключовите кадри "
        "на малки интервали или избери cutaway. При лице, документ или номер "
        "провери дали покритието остава пълно по време на движение."
    ),
}
ID_ADDENDUM = {
    "pv07-03": (
        "Провери и дали операторът може да повтори движението: отбележи "
        "начална и крайна позиция, посоката на погледа и къде се измества "
        "фокусът. Снимай пет секунди преди и след действието, за да има място "
        "за монтаж. Ако стъпките се люлеят, приближи маршрута, смени посоката "
        "или снижи темпото; не компенсирай всяко отклонение с агресивна "
        "стабилизация, която изкривява краищата на кадъра."
    ),
    "pv07-09": (
        "Сравни три реални кошници: комплект от наличното, наем на слабата "
        "част и покупка на цял пакет. Включи време за връщане, доставка, "
        "съвместимост, повреда и кой ще носи резерв. Ако проблемът е шумна "
        "стая, нов телефон няма да поправи акустиката; ако липсва звук, "
        "първата инвестиция вероятно е микрофон или оператор. Избери най-малката "
        "промяна, която минава повторяем тест."
    ),
    "pv07-10": (
        "Определи кой ще използва новата техника, къде се пази и кой отговаря "
        "за заряд, актуализация и връщане. Запиши дата на теста, купена версия, "
        "гаранция и резервна съвместима част. Провери и споделен сценарий: "
        "друг оператор получава комплекта с кратка карта и успява да го "
        "настрои без устна помощ. Това показва дали покупката вдига капацитета "
        "на екипа или само прави един човек по-бърз."
    ),
    "pv07-14": (
        "Запиши решението в малка карта: тип кадър, движение, продължителност, "
        "повърхност, тежест, шум от мотор, захранване и място за оператора. "
        "Изпробвай старт, движение и спиране с точната камера и аксесоар; "
        "балансът се променя при смяна на телефон, калъф или микрофон. Провери "
        "дали оборудването не влиза в кадър и не създава риск за участници. "
        "Екипът трябва да може да обясни избора си без фразата „така е по-кинематографично“."
    ),
    "pv07-15": (
        "Отбележи имена, числа и думи, които често се произнасят грешно; "
        "съгласувай правилното произношение с говорителя преди снимка. При "
        "грешка повтори цялата мисъл с пауза, за да остане монтажен handle. "
        "Провери и дали текстът на екрана не съдържа поверителни данни, които "
        "не трябва да се появят в кадъра. Ако говорителят не може да поддържа "
        "темпото, изключи scroll и снимай по изречения; естественият говор е "
        "по-ценен от безупречното четене."
    ),
    "pv08-03": (
        "Създай референтен кадър при началото на всяка сесия и запиши "
        "осветлението, баланса на бялото, дистанцията и настройките. При смяна "
        "на стая не разчитай паметта на оператора или auto режима да повтори "
        "вида. Следи и дребните непрекъснатости: посока на погледа, ръка, "
        "позиция на продукта, нивото на течност и гънки по дреха. Ако разликата "
        "не може да се поправи безопасно в монтажа, заснеми matching insert, "
        "докато сетът още е изграден."
    ),
    "pv08-08": (
        "Промяната на имената се прави върху копие или с инструмент, който "
        "пази съответствие старо/ново и отчита конфликтите преди запис. "
        "Сравни броя файлове, размерите и checksum за критичния материал; "
        "не приемай „готово“ от прозореца на rename. Отвори проекта на "
        "отделна работна станция и тествай relink, после остави непроменените "
        "оригинали до приключване на проверката. Ако схема за име се смени, "
        "версионирай инструкциите и извести целия екип в една точка."
    ),
    "pv09-02": (
        "Гледай сцената без музика и отбележи къде се сменя намерението: "
        "въпрос, отговор, реакция, действие или пауза. После гледай само "
        "аудиото, за да чуеш дали дъхът и краят на фразата остават естествени. "
        "Сравни две версии на ключовия срез и провери дали зрителят разбира "
        "кой говори и защо следващият кадър идва точно тогава. Таймерът дава "
        "сигнал за преглед; решението се взема по смисъла на сцената."
    ),
    "pv09-07": (
        "Организирай слоя и ефекта така, че друг монтажист да разбере "
        "приоритета им. Провери подредбата на color correction, graphic, "
        "blur и crop; различна последователност може да промени резултата. "
        "Именувай layers по функция, запиши кои клипове са изключени и запази "
        "изходен кадър без ефект за сравнение. Дублирай секцията преди "
        "глобална промяна; не прави една корекция върху цялата серия без "
        "проверка на тъмна, светла и смесена сцена."
    ),
    "pv09-09": (
        "Измери прехода на ухо и по waveform, но не използвай waveform вместо "
        "слушане. Остави room tone под паузата, ако тишината рязко се сменя, "
        "и провери, че преходът не събира различни дни така, че да променя "
        "значението. При двама говорители запази ясната смяна на репликата "
        "и синхрон на устните, когато лицето остава в кадър. Изгледай целия "
        "обмен в контекст — единичен срез може да звучи чисто, но да обърка "
        "кой задава въпроса."
    ),
    "pv09-10": (
        "Запиши скорост като число и посока: 50% прави отсечката два пъти "
        "по-дълга, а 200% я прави наполовина. Това променя тайминг и място "
        "за звук, надпис и следващ срез; не променя автоматично кадровата "
        "честота на финалния файл. Ако ramp мести важен момент, обнови "
        "музикалния hit и субтитъра, после прегледай цялата последователност. "
        "Запази нормалната версия като сравнение, за да докажеш, че ефектът "
        "помага на действието, а не само удължава кадъра."
    ),
    "pv09-11": (
        "Провери маската и за приватност и съгласие: замъгляване на адрес или "
        "лице трябва да покрива всеки кадър, включително появата и излизането "
        "от зоната. Проследи motion blur и пропуснати кадри около cut; някои "
        "ефекти изместват ръба за един frame. Ако не можеш да докажеш пълно "
        "покритие, смени кадъра или изрежи участъка. Запиши кой е проверил "
        "замаскирания export и на кой размер на екрана."
    ),
}
FINAL_NOTES = {
    "pv07-03": (
        "За предвидим кадър прецени и фокусното разстояние, височината и "
        "скоростта на оператора. Планирай къде започва/свършва движението, "
        "остави handle и следи дали автофокусът не прескача към фона. "
        "Заключен хоризонт не значи, че кадърът трябва да е неподвижен: "
        "мотивирай панорама или следване с действието и приключи в четима "
        "позиция. Преди дълъг дубъл направи кратка репетиция с актьор или "
        "водещ и махни препятствията от маршрута."
    ),
    "pv07-06": (
        "Не снимай отделен клип за всяка форма, ако действието може да се "
        "заснеме веднъж с безопасно място за вертикално и хоризонтално кадриране. "
        "Но не разчитай на auto-reframe за критични надписи, продукт или двама "
        "говорители: провери всеки crop на целевия размер. В shot list маркирай "
        "кадри, които изискват отделен дубъл, текстова версия, лицензирана "
        "музика или преведени субтитри. Именувай output по канал и версия и "
        "потвърди с клиента къде всяка форма ще се публикува."
    ),
    "pv07-07": (
        "Провери веднага след дубъла, не в края на деня: файлът се отваря, "
        "последният кадър е цял, фокусът не е избягал, звукът не е отрязан и "
        "всички нужни реплики са налични. Запиши номера на дубъла и кратка "
        "бележка какво е различно; използвай slate/voice note, когато в кадъра "
        "няма slate. На следваща локация тествай отново радио връзка, шум и "
        "светлина. Не форматирай носител, преди поне едно проверено копие да "
        "е видимо на друг носител."
    ),
    "pv07-09": (
        "Подреди бюджета според риска за клиента: разбираем говор обикновено "
        "струва повече от декоративен аксесоар, а резервното копие пази цялата "
        "смяна. Раздели задължително, резерв и подобрение; запиши данък, доставка, "
        "адаптери и заместваща част. Тествай най-слабата връзка с един реален "
        "дубъл и слушай суровия запис със слушалки. Ако парите не стигат за "
        "резервен микрофон, предвиди наем и задай ясно какво става при повреда; "
        "не обещавай безотказност на единична част."
    ),
    "pv07-10": (
        "Сравни цената за покупка с наем и цена на използваем клип за разумен "
        "период на ползване. Добави консумативи, сервиз, обучение, престой при "
        "повреда и стойността на старото оборудване. Провери кой подписва "
        "приемането, къде стои серийният номер и какво се случва при загуба. "
        "Направи изчисление при ниско и очаквано използване; ако сметката е "
        "положителна само при пълна заетост всяка седмица, планът няма резерв "
        "за реалната работа."
    ),
    "pv07-14": (
        "При снимане на хора провери нуждата от съгласие, прохода за публика и "
        "кой държи безопасния край на стойката. За пан следи начална и крайна "
        "композиция, скорост на мотора и достатъчен запас за монтаж. За locked "
        "shot провери дали подът или масата не вибрира. Сними тест от монтажната "
        "височина, не от позицията, в която си проверил оборудването. Съхрани "
        "едно референтно движение и настройка, за да не започва следващата "
        "смяна от нулата."
    ),
    "pv07-15": (
        "Репетирай първо без телепромптер: така ще чуеш дали текстът звучи като "
        "говорим език. Съкрати редовете, където човекът губи въздух, и постави "
        "маркер при думи за акцент; не добавяй на екрана инструктаж, който "
        "говорителят не е одобрил. Ако текстът се редактира по време на снимки, "
        "запиши версията и смени контролната дума в началото на дубъла. При "
        "грешна цифра или обещание спри и потвърди факта с отговорния човек, "
        "преди да направиш нов дубъл."
    ),
    "pv08-03": (
        "Използвай continuity снимка и бележка за камера, обектив, стойка, "
        "дистанция и относителна яркост; снимка без настройки не е достатъчна "
        "за повторение. Проверявай и осевата линия, посока на движение и "
        "положението на ръцете, за да не обърнеш действието между монтажни дни. "
        "Ако локацията е променила лампи или завеси, не фиксирай цвят само на "
        "една сцена: снимай сива карта/референция и провери кожата и продукта. "
        "Отбележи съзнателните промени, за да не ги „поправи“ монтажистът обратно."
    ),
    "pv08-08": (
        "Установи дали системата за ingest, облачната папка и монтажният софтуер "
        "приемат еднакви символи и максимална дължина на името. Избягвай "
        "наклонени черти, двусмислени дати и status-и като FINAL_FINAL; "
        "постави версиите в отделно поле или папка. Остави неизменен camera "
        "reel/clip ID в метаданните, когато името се обновява. Преди масова "
        "промяна направи журнал, dry run и план за откат; после провери, че "
        "proxy pairing и sidecar metadata също са запазени и именувани по "
        "договорената схема."
    ),
    "pv08-15": (
        "По време на batch деня следи плана спрямо реалния старт, пренареждането "
        "и липсващите дубъли. При отклонение запиши какво се мести, кой е "
        "уведомен и кои доставки са под риск; не мълчи, докато графикът се "
        "срути. Постави checkpoints за храна, вода, карта и backup; умореният "
        "оператор по-често пропуска фокус и именуване. В края на всеки блок "
        "съгласувай заснетите кадри със shot list и маркирай остатъка като "
        "заснето, отказано или за повторение."
    ),
    "pv09-02": (
        "Провери монтажния ритъм с три гледания: само картина, само звук и "
        "цялата версия с публика. Отбележи моментите, когато зрителят трябва "
        "да разбере детайл, да почувства пауза или да види реакция. Къси "
        "кадри не гарантират енергия, а дълъг кадър не е автоматично бавен. "
        "Премести среза по едно-две действия и виж дали фразата остава цяла. "
        "Ако промяната изисква контекст, покажи двете версии на редактор/клиент "
        "с конкретен въпрос, а не „харесва ли ти“."
    ),
    "pv09-07": (
        "На малка серия изключи слоя за отделни клипове, после го върни и "
        "провери изключенията един по един. Обърни внимание на adjustment layer "
        "над nested sequence, alpha/transparency, blend mode и transition: "
        "обхватът му може да е по-голям от видимия clip. Запиши стойности и "
        "планиран диапазон, направи screenshot на node/effect order и прегледай "
        "краищата на всеки clip. При различни камери приложи корекцията само "
        "след matching pass, иначе един глобален ефект ще уеднакви грешките."
    ),
    "pv09-09": (
        "Работи по фраза, не по целия waveform наведнъж: избери in/out, остави "
        "пред- и следзвуков запас и провери ритъма в пълната сцена. Fade трябва "
        "да скрие преход, не да отсече дума. Не премествай естествена реакция "
        "под звук от друг момент така, че да приписваш чуждо мнение. Ако "
        "тонът на стаята се сменя, подложи подходящ room tone и прослушай на "
        "малки говорители и слушалки. Запази отделна audio track версия, за да "
        "може друг монтажист да провери sync-а."
    ),
    "pv09-10": (
        "Ключовите кадри задават характер на ускорението: линейна крива звучи "
        "механично, а прекалено остра крива може да дръпне вниманието от "
        "продукта. Провери кадрите около speed point покадрово и прослушай "
        "нативния звук; pitch-shifted звук може да стане смешен или нечетим. "
        "Ако оригиналното действие съдържа доказателствен детайл, запази го "
        "при нормална скорост в друг план. Запиши точния source и стойностите "
        "на retime, за да може клиента да поиска промяна без да се гадае."
    ),
    "pv09-11": (
        "Провери ръба frame by frame при края на shot, motion blur и преход към "
        "следващ кадър; tracking може да е точен в средата и да излезе от зона "
        "за няколко кадъра. При privacy маска покрий и отражение в стъкло, "
        "огледало или екран, ако лицето/данните се виждат там. Ако маската "
        "въздейства върху логото или важен обект, избери друг crop вместо да "
        "оставиш странно петно. Предай и изходния кадър за одобрение, като "
        "проверяващият гледа именно зоната, която е трябвало да се скрие."
    ),
}
FORBIDDEN = {
    "practical_response", "reflection", "homework", "submission", "prompt_builder"
}
ROOT = Path(__file__).resolve().parent
MIGRATION_FILENAME = "20260928175443_perfect_video_modules_7_9_v6_release.sql"


def module_for(lesson_id: str) -> str:
    return "s02-m" + lesson_id[2:4]


def make_block(position, key, kind, title, content, points=2, required=True,
               answer_key=None, explanation=None, mode="single_choice"):
    block = {
        "position": position,
        "block_key": key,
        "block_type": kind,
        "title": title,
        "content": content,
        "points": points,
        "required": required,
    }
    if answer_key is not None:
        block["answer_key"] = answer_key
        block["feedback"] = {"explanation": explanation}
        block["scoring"] = {
            "mode": "exact_order" if kind == "sequence_sort" else mode
        }
    return block


def ordered_choices(correct, wrong, seed):
    labels = [correct, wrong[0], wrong[1]]
    shift = seed % 3
    arranged = labels[shift:] + labels[:shift]
    if seed % 2:
        arranged = [arranged[0], arranged[2], arranged[1]]
    options = [{"id": chr(97 + i), "label": label}
               for i, label in enumerate(arranged)]
    correct_id = next(option["id"] for option in options
                      if option["label"] == correct)
    return options, correct_id


def plain_text(value):
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return " ".join(plain_text(item) for item in value)
    if isinstance(value, dict):
        return " ".join(plain_text(item) for item in value.values())
    return ""


def build_lesson(spec, index):
    module_id = module_for(spec["id"])
    topic = {
        "s02-m07": "Мобилна продукция за платена задача",
        "s02-m08": "Пакетно производство и безопасна работа с медия",
        "s02-m09": "Монтаж, корекция и предаване на готов файл",
    }[module_id]
    blocks = []
    compact = spec["id"] in COMPACT

    def add(key, kind, title, content, points=2, required=True):
        blocks.append(make_block(
            len(blocks), key, kind, title, content, points=points,
            required=required
        ))

    add("objective", "objective", "Какво ще можеш",
        {"body": spec["goal"]}, points=1)
    add("hook", "hook", "Кога се чупи работата",
        {"body": spec["hook"]}, points=1)
    principle = spec["principle"]
    if spec["id"] in DEEP_NOTES:
        principle += "\n\nПолеви наръчник: " + DEEP_NOTES[spec["id"]]
    if spec["id"] in ID_ADDENDUM:
        principle += "\n\nРаботна проверка: " + ID_ADDENDUM[spec["id"]]
    if spec["id"] in FINAL_NOTES:
        principle += "\n\nДопълнителен ход от практиката: " + FINAL_NOTES[spec["id"]]
    if compact:
        principle += "\n\nПрактически разбор: " + spec["detail"]
    add("principle", "rich_text", "Решението зад кадъра",
        {"body": principle})
    if not compact:
        add("deep_dive", "rich_text", "Какво проверяваш на терен",
            {"body": spec["detail"]})
    add("work_order", "rich_text", "Работен ред",
        {"body": "Подреди задачата така:\n\n" +
                 "\n".join(f"{i}. {step}"
                           for i, step in enumerate(spec["workflow"], 1))})
    case = spec["case"]
    if compact:
        case += ("\n\nХод, който се проваля: " + spec["failure"] +
                 "\n\nКорекция: " + spec["fix"])
    add("worked_case", "example", "Решен случай от работа",
        {"body": case + "\n\nКритерий за добър ход: " + spec["acceptance"]})
    if not compact:
        add("before_after", "before_after", "Слабият ход и поправката", {
            "before": {"label": "Как се губи контрол", "text": spec["failure"]},
            "after": {"label": "Как го поправяш", "text": spec["fix"]},
        })
    add("field_task", "rich_text", "Направи го със свой материал",
        {"body": spec["practice"] +
         "\n\nЗапази резултата като кратък работен пример, не само като готов клип. "
         "Към него приложи брифа и ограниченията, използваните настройки/версия, "
         "една проба, конкретна проверка, поправката и крайния резултат. За "
         "доказателство използвай кадър преди/след, тестов export, manifest, "
         "restore log или измерено време според задачата. В портфолио ползвай "
         "собствен или разрешен материал; не качвай клиентски суров материал "
         "и лични данни без изрично право. Отбележи кое е чернова, кое е "
         "проверено и кое е одобрено."}, points=2)
    add("acceptance", "rich_text", "Преди да предадеш",
        {"body": spec["acceptance"] +
         "\n\nСамопровери файла/проекта от началото до края, после помоли друг "
         "човек да повтори критичната проверка по запазените бележки. Ако "
         "другият човек не може да намери входа, версията или резултата, "
         "предаването още не е готово. Ясно отбележи неизвестното и въпроса, "
         "който трябва да реши клиентът; не запълвай липсващ факт по догадка."}, points=1)

    if spec["id"] in DECISION_CLINIC:
        domain_check = {
            "s02-m07": (
                "Повтори един и същ тест със същото място и комплект. Промени "
                "само една настройка или една част от екипировката; запиши "
                "точния модел/версия и резултата. Провери оригиналния файл, "
                "не само прегледа в телефона. Така ще различиш проблем в "
                "камерата, аксесоара, навика на оператора и самата сцена."
            ),
            "s02-m08": (
                "Повтори процеса с един обичаен материал и един граничен случай: "
                "закъснял файл, сменен оператор или недостъпен носител. Запиши "
                "кой подхваща работата, къде намира последната версия и как "
                "разбира, че нищо не е презаписано. Ако процесът работи само "
                "когато авторът е на място, той още не е екипен процес."
            ),
            "s02-m09": (
                "Провери целия ход от source до target export: проекта, версиите "
                "на медията, preview, рендерирания файл и целевия екран. Тествай "
                "един участък с говор/движение и началото и края на файла. "
                "Настройка, която изглежда вярна в timeline, не е доказателство "
                "за готов master." 
            ),
        }[module_id]
        add("decision_clinic", "rich_text", "Когато първият опит не мине", {
            "body": (
                f"Проблемът, който трябва да разпознаеш: {spec['failure']}\n\n"
                "Не сменяй няколко неща наведнъж. Запази текущия резултат, "
                "назови видимия симптом и провери изходните условия. После "
                f"изпълни тези два контролни хода: {spec['workflow'][1]} "
                f"{spec['workflow'][3]}\n\n{domain_check}\n\n"
                f"Коригирай с този ход: {spec['fix']}\n\n"
                f"Тестът е минал едва когато: {spec['acceptance']} Ако пак не "
                "мине, спри предаването и опиши какво липсва, вместо да "
                "маскираш симптома с ефект, обещание или ръчна поправка без запис."
            )
        }, points=1)

    if spec["id"] in HANDOFF_PRACTICE:
        handoff = {
            "s02-m07": (
                "Покажи модела и режима на устройството, микрофона/опората, "
                "тестовия кадър или звук и резервния ход. Друг оператор трябва "
                "да разбере какво може да се повтори и при кои условия." 
            ),
            "s02-m08": (
                "Покажи името и местоположението на файла, собственика на "
                "следващото действие, версията, контролния запис и начина за "
                "възстановяване. Колега, който не е участвал, трябва да намери "
                "нужното без личен чат с автора." 
            ),
            "s02-m09": (
                "Покажи версията на проекта, източниците или proxy статуса, "
                "export настройките, проверения master и списъка с известни "
                "ограничения. Получателят трябва да може да отвори файла и да "
                "разбере дали е за преглед или е одобрен." 
            ),
        }[module_id]
        add("portfolio_handoff", "rich_text", "Предай го като работа за клиент", {
            "body": (
                f"Сглоби малък пример по този бриф: {spec['case']}\n\n"
                f"Доставката ти е: {spec['practice']}\n\n"
                "В бележката към нея напиши: цел; вход и ограничения; "
                "решение и причина; проверка; проблем и поправка; резултат; "
                "статус; следващ собственик и действие. " + handoff + "\n\n"
                f"Приемане: {spec['acceptance']} Не представяй тестовия материал "
                "като платена клиентска кампания и не заявявай резултат, който "
                "не си измерил. Това досие трябва да даде на работодател или "
                "клиент основание да повери следваща, по-голяма задача."
            )
        }, points=1, required=False)

    if spec.get("source"):
        add("reference", "rich_text", "Първоизточник за проверка",
            {"body": spec["source"]}, points=0, required=False)
    for extra_index, (title, body) in enumerate(spec.get("extras", []), 1):
        add(f"field_note_{extra_index}", "rich_text", title,
            {"body": body}, points=1, required=False)

    for check_index, check in enumerate(spec["questions"], 1):
        options, correct_id = ordered_choices(
            check["correct"], check["wrong"], index * 7 + check_index
        )
        content = (
            {"prompt": check["question"], "options": options}
            if check["type"] == "scenario"
            else {"question": check["question"], "options": options}
        )
        key = f"{check['type']}_{(check_index + 1) // 2}"
        blocks.append(make_block(
            len(blocks), key, check["type"], check["title"], content,
            points=3, required=True, answer_key={"correct": correct_id},
            explanation=(
                check["feedback"] + "\n\n"
                f"Вариантът „{check['wrong'][0]}“ не доказва: "
                f"{spec['acceptance']} Вариантът „{check['wrong'][1]}“ "
                f"оставя нерешено: {spec['failure']} Безопасната корекция е: "
                f"{spec['fix']} При реален клиент маркирай неизвестното и "
                "поискай решение преди да заключиш master или календара."
            )
        ))

    first_steps = spec["workflow"][:4]
    items = [{"id": f"s{i}", "text": step}
             for i, step in enumerate(first_steps, 1)]
    shift = (index + 1) % len(items)
    display_items = items[shift:] + items[:shift]
    if index % 2:
        display_items = list(reversed(display_items))
    blocks.append(make_block(
        len(blocks), "sequence_sort", "sequence_sort",
        "Подреди зависимостите",
        {
            "instruction": (
                "Подреди първите решения така, че проверката да дойде "
                "преди окончателното предаване."
            ),
            "items": display_items,
        },
        points=3, required=True,
        answer_key={"order": [f"s{i}" for i in range(1, len(items) + 1)]},
        explanation="Правилният ред:\n" + "\n".join(
            f"{i}. {step}" for i, step in enumerate(first_steps, 1)
        ),
        mode="exact_order",
    ))
    blocks.append(make_block(
        len(blocks), "summary", "Какво пренасяш в следващата задача",
        "summary",
        {
            "takeaways": [spec["goal"], spec["fix"], spec["acceptance"]],
            "nextStep": spec["practice"],
        },
        points=1,
    ))
    return {
        "module_id": module_id,
        "lesson_id": spec["id"],
        "title": spec["title"],
        "subtitle": f"{module_id.replace('s02-m', 'Модул ')} · {topic}",
        "objective": spec["goal"],
        "hook": spec["hook"],
        "estimated_minutes": spec["minutes"],
        "blocks": blocks,
    }


def make_migration(curriculum):
    payload = json.dumps(curriculum, ensure_ascii=False, separators=(",", ":"))
    return f"""-- Guarded, versioned release for Perfect Video modules 7–9.
-- Existing lesson rows and versions remain intact; progress is snapshotted before rebasing.

CREATE OR REPLACE FUNCTION academy_private.lesson_validation(p_version uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v public.academy_lesson_versions;
  errors jsonb := '[]'::jsonb;
  warnings jsonb := '[]'::jsonb;
  n integer;
  kinds text[];
BEGIN
  SELECT * INTO v FROM public.academy_lesson_versions WHERE id=p_version;
  IF NOT FOUND THEN RAISE EXCEPTION 'Version not found'; END IF;

  SELECT count(*),coalesce(array_agg(DISTINCT block_type),'{{}}')
    INTO n,kinds
  FROM public.academy_lesson_blocks WHERE version_id=p_version;

  IF btrim(v.objective)='' THEN errors:=errors||jsonb_build_array('missing_objective'); END IF;
  IF btrim(v.hook)='' THEN errors:=errors||jsonb_build_array('missing_hook'); END IF;
  IF n<5 THEN errors:=errors||jsonb_build_array('too_few_blocks'); END IF;
  IF NOT (kinds && ARRAY[
    'sequence_sort','matching','image_hotspot','decision_tree','scenario',
    'client_simulation','calculator','prompt_builder','practical_response',
    'reflection','checklist','quiz','homework','submission','flip_cards'
  ]) THEN errors:=errors||jsonb_build_array('missing_interaction'); END IF;
  IF NOT ('quiz'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_knowledge_check'); END IF;
  IF NOT (
    kinds && ARRAY['prompt_builder','practical_response','homework','submission']
    OR (
      EXISTS (
        SELECT 1 FROM public.academy_lessons l
        WHERE l.id=v.academy_lesson_id
          AND l.module_id IN (
            's02-m01','s02-m02','s02-m03','s02-m04','s02-m05','s02-m06',
            's02-m07','s02-m08','s02-m09'
          )
      )
      AND kinds && ARRAY[
        'sequence_sort','matching','image_hotspot','decision_tree',
        'scenario','client_simulation','calculator'
      ]
    )
  ) THEN errors:=errors||jsonb_build_array('missing_practice'); END IF;
  IF NOT ('summary'=ANY(kinds)) THEN errors:=errors||jsonb_build_array('missing_summary'); END IF;
  IF EXISTS (
    SELECT 1 FROM public.academy_lesson_blocks b
    WHERE b.version_id=p_version AND b.required AND b.points=0
  ) THEN warnings:=warnings||jsonb_build_array('required_block_has_no_xp'); END IF;
  IF EXISTS (
    SELECT 1
    FROM public.academy_lesson_blocks b
    LEFT JOIN academy_private.lesson_block_keys k ON k.block_id=b.id
    WHERE b.version_id=p_version
      AND b.block_type IN (
        'sequence_sort','matching','image_hotspot','decision_tree','scenario',
        'client_simulation','calculator','quiz'
      )
      AND k.block_id IS NULL
  ) THEN errors:=errors||jsonb_build_array('missing_server_evaluation'); END IF;

  RETURN jsonb_build_object(
    'errors',errors,
    'warnings',warnings,
    'block_count',n,
    'interactive',kinds && ARRAY[
      'sequence_sort','matching','image_hotspot','decision_tree','scenario',
      'client_simulation','calculator','prompt_builder','practical_response',
      'reflection','checklist','quiz','homework','submission','flip_cards'
    ],
    'has_quiz','quiz'=ANY(kinds),
    'has_assignment',kinds && ARRAY['practical_response','homework','submission']
  );
END
$function$;

DO $release$
DECLARE
  payload jsonb := $curriculum${payload}$curriculum$::jsonb;
  expected_ids integer;
  catalog_count integer;
  v_module_counts integer[];
  lesson record;
  block jsonb;
  old_version public.academy_lesson_versions;
  new_version_id uuid;
  block_id uuid;
  validation_result jsonb;
  correct_id text;
  old_required integer;
  old_done integer;
  new_required integer;
  new_reading integer;
  mapped_done integer;
  mapped_keys text[];
  next_key text;
  progress_row record;
  progress_before integer;
  progress_after integer;
  progress_xp_before bigint;
  progress_xp_after bigint;
  history_after integer;
  release_started timestamptz := clock_timestamp();
  release_note text := 'Переработка модулей 7–9: практическо издание v6';
BEGIN
  IF jsonb_typeof(payload)<>'array' THEN
    RAISE EXCEPTION 'Curriculum payload must be a JSON array';
  END IF;
  SELECT count(*) INTO expected_ids FROM jsonb_to_recordset(payload)
    AS p(module_id text,lesson_id text);
  IF expected_ids<>43 THEN
    RAISE EXCEPTION 'Expected 43 lesson records, received %', expected_ids;
  END IF;

  SELECT count(*) INTO catalog_count
  FROM public.academy_lessons
  WHERE module_id IN ('s02-m07','s02-m08','s02-m09');
  IF catalog_count=0 THEN
    RETURN;
  END IF;
  IF catalog_count<>43 THEN
    RAISE EXCEPTION 'Expected all 43 published lessons; found %', catalog_count;
  END IF;

  SELECT ARRAY[
    count(*) FILTER (WHERE module_id='s02-m07')::integer,
    count(*) FILTER (WHERE module_id='s02-m08')::integer,
    count(*) FILTER (WHERE module_id='s02-m09')::integer
  ] INTO v_module_counts
  FROM public.academy_lessons
  WHERE module_id IN ('s02-m07','s02-m08','s02-m09');
  IF v_module_counts<>ARRAY[16,16,11] THEN
    RAISE EXCEPTION 'Unexpected module distribution: %',v_module_counts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM jsonb_to_recordset(payload)
      AS p(module_id text,lesson_id text)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.academy_lessons l
      WHERE l.module_id=p.module_id AND l.lesson_id=p.lesson_id
    )
  ) OR EXISTS (
    SELECT 1 FROM public.academy_lessons l
    WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_to_recordset(payload)
          AS p(module_id text,lesson_id text)
        WHERE p.module_id=l.module_id AND p.lesson_id=l.lesson_id
      )
  ) THEN
    RAISE EXCEPTION 'Production lesson IDs do not match the authored release';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.academy_lessons l
    JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
    WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
      AND v.change_note=release_note
  ) THEN
    RAISE EXCEPTION 'Release marker already exists; refusing a duplicate publication';
  END IF;

  LOCK TABLE public.academy_lessons IN SHARE ROW EXCLUSIVE MODE;
  LOCK TABLE public.academy_lesson_progress IN SHARE ROW EXCLUSIVE MODE;

  IF EXISTS (
    SELECT 1 FROM public.academy_lessons
    WHERE module_id IN ('s02-m07','s02-m08','s02-m09')
      AND (
        status<>'published'
        OR published_version_id IS NULL
        OR (draft_version_id IS NOT NULL
            AND draft_version_id IS DISTINCT FROM published_version_id)
      )
  ) THEN
    RAISE EXCEPTION 'A lesson is unpublished or has an unreviewed draft';
  END IF;

  IF EXISTS (
    SELECT 1 FROM jsonb_to_recordset(payload) AS p(blocks jsonb)
    WHERE jsonb_typeof(p.blocks)<>'array'
      OR jsonb_array_length(p.blocks)<13
      OR jsonb_array_length(p.blocks)>20
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(p.blocks) b
        WHERE b->>'block_type' IN (
          'practical_response','reflection','homework','submission','prompt_builder'
        )
      )
      OR (
        SELECT count(*) FROM jsonb_array_elements(p.blocks) b
        WHERE b->>'block_type' IN ('quiz','scenario','sequence_sort')
      )<>5
  ) THEN
    RAISE EXCEPTION 'Invalid lesson length, open response, or assessment count';
  END IF;

  SELECT count(*),coalesce(sum(xp),0) INTO progress_before,progress_xp_before
  FROM public.academy_lesson_progress p
  JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
  WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09');

  FOR lesson IN
    SELECT * FROM jsonb_to_recordset(payload) AS p(
      module_id text,
      lesson_id text,
      title text,
      subtitle text,
      objective text,
      hook text,
      estimated_minutes integer,
      blocks jsonb
    )
    ORDER BY module_id,lesson_id
  LOOP
    SELECT v.* INTO old_version
    FROM public.academy_lessons l
    JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
    WHERE l.module_id=lesson.module_id AND l.lesson_id=lesson.lesson_id
    FOR UPDATE OF l;

    INSERT INTO public.academy_lesson_versions(
      academy_lesson_id,version_number,origin_version_id,title,subtitle,duration,
      objective,hook,estimated_minutes,source_kind,validation,change_note,created_by
    )
    SELECT
      l.id,
      coalesce((SELECT max(v.version_number)+1
                FROM public.academy_lesson_versions v
                WHERE v.academy_lesson_id=l.id),1),
      l.published_version_id,
      lesson.title,
      lesson.subtitle,
      lesson.estimated_minutes::text || ' минути',
      lesson.objective,
      lesson.hook,
      lesson.estimated_minutes,
      'editor',
      jsonb_build_object('errors','[]'::jsonb,'warnings','[]'::jsonb),
      release_note,
      old_version.created_by
    FROM public.academy_lessons l
    WHERE l.module_id=lesson.module_id AND l.lesson_id=lesson.lesson_id
    RETURNING id INTO new_version_id;

    FOR block IN SELECT value FROM jsonb_array_elements(lesson.blocks)
    LOOP
      INSERT INTO public.academy_lesson_blocks(
        version_id,block_key,"position",block_type,title,content,required,points
      )
      VALUES(
        new_version_id,
        block->>'block_key',
        (block->>'position')::integer,
        block->>'block_type',
        block->>'title',
        block->'content',
        coalesce((block->>'required')::boolean,true),
        coalesce((block->>'points')::integer,1)
      )
      RETURNING id INTO block_id;

      IF block ? 'answer_key' THEN
        INSERT INTO academy_private.lesson_block_keys(
          block_id,answer_key,feedback,scoring
        )
        VALUES(block_id,block->'answer_key',block->'feedback',block->'scoring');

        IF block->>'block_type' IN ('quiz','scenario') THEN
          correct_id:=block->'answer_key'->>'correct';
          IF NOT EXISTS(
            SELECT 1 FROM jsonb_array_elements(block->'content'->'options') opt
            WHERE opt->>'id'=correct_id
          ) THEN
            RAISE EXCEPTION 'Answer key points to a missing option in % / %',
              lesson.lesson_id,block->>'block_key';
          END IF;
        END IF;

        IF block->>'block_type'='sequence_sort'
          AND jsonb_array_length(block->'answer_key'->'order')
              <> jsonb_array_length(block->'content'->'items') THEN
          RAISE EXCEPTION 'Sequence key length mismatch in %',lesson.lesson_id;
        END IF;
      END IF;
    END LOOP;

    validation_result:=academy_private.lesson_validation(new_version_id);
    IF jsonb_array_length(validation_result->'errors')<>0
      OR jsonb_array_length(validation_result->'warnings')<>0 THEN
      RAISE EXCEPTION 'Validation failed for %: %',
        lesson.lesson_id,validation_result;
    END IF;
    UPDATE public.academy_lesson_versions
      SET validation=validation_result
      WHERE id=new_version_id;

    UPDATE public.academy_lessons
      SET published_version_id=new_version_id,
          draft_version_id=new_version_id,
          status='published',
          updated_at=clock_timestamp()
      WHERE module_id=lesson.module_id AND lesson_id=lesson.lesson_id;
  END LOOP;

  -- Archive the exact prior row via the existing BEFORE UPDATE trigger. Map only
  -- the same fraction of completed reading blocks; new graded answers must be
  -- answered again against the new curriculum. XP and start time remain intact.
  FOR progress_row IN
    SELECT p.*,l.module_id,l.lesson_id,l.published_version_id AS new_version_id
    FROM public.academy_lesson_progress p
    JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
    WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
      AND p.version_id IS DISTINCT FROM l.published_version_id
    ORDER BY l.module_id,l.lesson_id
    FOR UPDATE OF p
  LOOP
    SELECT count(*) INTO old_required
    FROM public.academy_lesson_blocks
    WHERE version_id=progress_row.version_id AND required;

    SELECT count(*) INTO old_done
    FROM unnest(coalesce(progress_row.completed_block_keys,ARRAY[]::text[]))
      AS done(block_key)
    JOIN public.academy_lesson_blocks b
      ON b.version_id=progress_row.version_id
     AND b.block_key=done.block_key
     AND b.required;

    SELECT count(*) INTO new_required
    FROM public.academy_lesson_blocks
    WHERE version_id=progress_row.new_version_id AND required;

    SELECT count(*) INTO new_reading
    FROM public.academy_lesson_blocks
    WHERE version_id=progress_row.new_version_id
      AND required
      AND block_type NOT IN ('quiz','scenario','sequence_sort');

    mapped_done:=least(
      new_reading,
      CASE WHEN old_required=0 THEN 0
           ELSE round((old_done::numeric/old_required)*new_required)::integer
      END
    );

    SELECT coalesce(array_agg(x.block_key ORDER BY x.position),ARRAY[]::text[])
      INTO mapped_keys
    FROM (
      SELECT block_key,"position"
      FROM public.academy_lesson_blocks
      WHERE version_id=progress_row.new_version_id
        AND required
        AND block_type NOT IN ('quiz','scenario','sequence_sort')
      ORDER BY "position"
      LIMIT mapped_done
    ) x;

    SELECT block_key INTO next_key
    FROM public.academy_lesson_blocks
    WHERE version_id=progress_row.new_version_id
      AND required
      AND NOT (block_key=ANY(mapped_keys))
    ORDER BY "position"
    LIMIT 1;

    UPDATE public.academy_lesson_progress
      SET version_id=progress_row.new_version_id,
          current_block_key=next_key,
          block_state='{{}}'::jsonb,
          completed_block_keys=mapped_keys,
          score_percent=NULL,
          mastery_status='learning',
          completed_at=NULL,
          last_activity_at=clock_timestamp()
    WHERE user_id=progress_row.user_id
      AND academy_lesson_id=progress_row.academy_lesson_id
      AND version_id=progress_row.version_id;

    IF NOT EXISTS(
      SELECT 1 FROM academy_private.lesson_progress_history h
      WHERE h.user_id=progress_row.user_id
        AND h.academy_lesson_id=progress_row.academy_lesson_id
        AND h.version_id=progress_row.version_id
        AND h.reason='version_change'
        AND h.snapshot->>'xp'=progress_row.xp::text
        AND coalesce(h.snapshot->>'current_block_key','')
            =coalesce(progress_row.current_block_key,'')
    ) THEN
      RAISE EXCEPTION 'Prior progress snapshot missing for % / %',
        progress_row.module_id,progress_row.lesson_id;
    END IF;
  END LOOP;

  SELECT count(*) INTO progress_after
  FROM public.academy_lesson_progress p
  JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
  WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09');
  SELECT coalesce(sum(xp),0) INTO progress_xp_after
  FROM public.academy_lesson_progress p
  JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
  WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09');

  IF progress_before<>progress_after OR progress_xp_before<>progress_xp_after THEN
    RAISE EXCEPTION 'Progress rows or earned XP changed during release';
  END IF;
  IF EXISTS(
    SELECT 1 FROM public.academy_lesson_progress p
    JOIN public.academy_lessons l ON l.id=p.academy_lesson_id
    WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
      AND p.version_id IS DISTINCT FROM l.published_version_id
  ) THEN
    RAISE EXCEPTION 'A progress row did not move to the current lesson version';
  END IF;

  SELECT count(*) INTO history_after
  FROM academy_private.lesson_progress_history h
  JOIN public.academy_lessons l ON l.id=h.academy_lesson_id
  WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
    AND h.reason='version_change'
    AND h.archived_at>=release_started;
  IF history_after<progress_before THEN
    RAISE EXCEPTION 'Expected % archived snapshots, found %',
      progress_before,history_after;
  END IF;

  IF EXISTS(
    SELECT 1
    FROM public.academy_lessons l
    JOIN public.academy_lesson_versions v ON v.id=l.published_version_id
    WHERE l.module_id IN ('s02-m07','s02-m08','s02-m09')
      AND (
        v.change_note<>release_note
        OR jsonb_array_length(v.validation->'errors')<>0
        OR jsonb_array_length(v.validation->'warnings')<>0
      )
  ) THEN
    RAISE EXCEPTION 'Final release verification failed';
  END IF;
END
$release$;
"""


def main():
    ids = [item["id"] for item in LESSONS]
    if len(LESSONS) != sum(EXPECTED.values()) or len(set(ids)) != len(ids):
        raise SystemExit("Lesson count or ID uniqueness check failed")
    module_counts = Counter(module_for(lesson_id) for lesson_id in ids)
    if dict(module_counts) != EXPECTED:
        raise SystemExit(f"Unexpected module counts: {dict(module_counts)}")

    curriculum = [build_lesson(spec, i) for i, spec in enumerate(LESSONS)]
    block_counts = []
    visible_chars = []
    correct_positions = Counter()
    for spec, lesson in zip(LESSONS, curriculum):
        blocks = lesson["blocks"]
        if not 13 <= len(blocks) <= 20:
            raise SystemExit(f"Block count out of range for {spec['id']}: {len(blocks)}")
        if any(block["block_type"] in FORBIDDEN for block in blocks):
            raise SystemExit(f"Open-response block in {spec['id']}")
        checks = [block for block in blocks if block.get("answer_key")]
        if len(checks) != 5:
            raise SystemExit(f"Expected 5 auto-graded checks in {spec['id']}")
        for block in checks:
            if block["block_type"] in {"quiz", "scenario"}:
                options = block["content"]["options"]
                answer_id = block["answer_key"]["correct"]
                if answer_id not in {option["id"] for option in options}:
                    raise SystemExit(f"Invalid answer key in {spec['id']}")
                correct_positions[answer_id] += 1
        if any(not block["title"].strip() or not block["content"]
               for block in blocks):
            raise SystemExit(f"Empty visible block in {spec['id']}")
        block_counts.append(len(blocks))
        visible_chars.append(sum(len(plain_text(block["content"]))
                                 + len(block["title"]) for block in blocks))

    if len(set(block_counts)) < 5 or min(visible_chars) < 6000:
        raise SystemExit("Lesson depth or step-count variety fell below release gates")
    median_chars = sorted(visible_chars)[len(visible_chars) // 2]
    if median_chars < 7300:
        raise SystemExit(f"Visible lesson text median is too short: {median_chars}")

    migration = make_migration(curriculum)
    repository_root = next(
        (parent for parent in (ROOT, *ROOT.parents)
         if (parent / "supabase" / "migrations").is_dir()),
        None,
    )
    output = (
        repository_root / "supabase" / "migrations" / MIGRATION_FILENAME
        if repository_root else ROOT / MIGRATION_FILENAME
    )
    output.write_text(migration, encoding="utf-8")
    (ROOT / "perfect_video_modules_7_9_v6.json").write_text(
        json.dumps(curriculum, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "lessons": len(curriculum),
        "modules": dict(module_counts),
        "blocks": sum(block_counts),
        "block_range": [min(block_counts), max(block_counts)],
        "block_counts": block_counts,
        "private_answer_keys": len(curriculum) * 5,
        "open_answer_blocks": 0,
        "visible_chars_per_lesson": {
            "min": min(visible_chars),
            "median": median_chars,
            "max": max(visible_chars),
        },
        "correct_option_positions": dict(correct_positions),
        "sql_bytes": output.stat().st_size,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
