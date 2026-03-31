# Aqbobek Lyceum Portal MVP

Многоролевой MVP школьного портала под кейс Aqbobek Lyceum:
- ученик: оценки, AI tutor, портфолио, геймификация;
- учитель: early warning system и AI-отчёт;
- родитель: режим наблюдателя + weekly digest;
- администрация: лента уведомлений + Smart Schedule + kiosk mode.

## Стек
- Next.js App Router
- TypeScript
- Supabase (Postgres + Auth-ready SSR setup)
- OpenAI Responses API (опционально, с graceful fallback)
- Собственные эвристики и алгоритмы для риска и расписания

## Что уже реализовано
- Demo auth по ролям через cookie
- Mock BilimClass API: `/api/bilimclass/grades?studentId=stu-001`
- AI API:
  - `POST /api/ai/student-insights`
  - `POST /api/ai/class-report`
  - `POST /api/ai/parent-summary`
- Smart Schedule API:
  - `POST /api/schedule/generate`
- Kiosk Mode: `/kiosk`
- SQL-схема и `seed.sql` для Supabase

## Быстрый старт
```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте `http://localhost:3000`.

## Подключение Supabase
1. Создайте проект в Supabase.
2. Запустите `supabase/schema.sql` в SQL Editor.
3. По желанию выполните `supabase/seed.sql`.
4. Вставьте ключи в `.env.local`.

> Приложение работает и без Supabase: тогда используются локальные mock-данные.

## Подключение OpenAI
1. Добавьте `OPENAI_API_KEY` в `.env.local`.
2. При наличии ключа AI-роуты дополнительно переформулируют отчёты через модель.
3. Без ключа всё равно работают локальные алгоритмы оценки риска и summary.

## Логика расписания
Алгоритм в `lib/schedule.ts` делает следующее:
- учитывает доступность учителей и кабинетов;
- поддерживает фиксированные события;
- умеет ставить `bundleKey`-сессии в один слот (ленты / профильные потоки);
- при болезни учителя ищет substitute из `allowedSubstituteTeacherIds`;
- формирует список уведомлений об изменениях.

Проверить замену можно в панели администратора кнопкой `Отметить болезнь учителя`.

## Что усилить дальше
- реальный Supabase Auth вместо demo auth;
- Realtime-уведомления через Supabase Realtime;
- загрузка сертификатов в Supabase Storage;
- полноценный адаптер к BilimClass;
- экспорт PDF-отчётов и печатных форм;
- более сильный CSP/ILP-решатель для расписания на больших объёмах.
