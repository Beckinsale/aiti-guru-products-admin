# AI Usage Log

Документация по использованию AI при разработке тестового задания.

**Модель:** Claude Sonnet 4.6 (claude-sonnet-4-6) через Claude Code CLI
**Период:** март 2026

---

## Сессия 1 — Архитектура и планирование

**Промпт:** Спроектируй архитектуру React 18 + TypeScript admin panel с авторизацией и таблицей товаров по ТЗ. Выбери библиотеки и объясни решения.

**Результат:**
- Выбор стека: TanStack Query v5, React Hook Form + Zod, React Router v6, Tailwind CSS, Sonner, Vitest
- Структура папок `src/features/`, `src/shared/`, `src/pages/`
- Обоснование: клиентская сортировка вместо серверной, URL как источник истины для sort state, Suspense вместо ручного `isLoading`

---

## Сессия 2 — Auth модуль

**Промпт:** Реализуй LoginForm с React Hook Form + Zod. Валидация обязательных полей, remember me через localStorage/sessionStorage, отображение ошибки API под полями.

**Результат:**
- `loginSchema.ts` — Zod схема с `rememberMe: z.boolean().default(false)`
- `tokenStorage.ts` — `saveToken`, `getToken`, `clearToken`
- `LoginForm.tsx` — RHF + Zod resolver, контролируемые инпуты, поле пароля с eye-toggle
- `useLogin.ts` — TanStack Query mutation, обработка 400/401

---

## Сессия 3 — Products таблица

**Промпт:** Реализуй таблицу товаров по Figma: колонки image/name/vendor/sku/rating/price/actions. Skeleton при загрузке, красный рейтинг < 3.5, цена с разделением целой и дробной части.

**Результат:**
- `ProductsTable.tsx` — Suspense boundary, select-all checkbox, управляемые строки
- `ProductRow.tsx` — `React.memo`, `formatPrice` (Intl.NumberFormat + split по запятой), красный рейтинг
- `SkeletonRow.tsx` — `SkeletonTable` с N рядами плейсхолдеров
- `ErrorState.tsx` — сообщение + кнопка "Повторить"

---

## Сессия 4 — Сортировка, поиск, модал

**Промпт:** Добавь сортировку по price/rating с состоянием в URL params, debounced поиск 300ms, кнопку Обновить через invalidateQueries, модал добавления товара с toast.

**Результат:**
- `SortHeader.tsx` — кликабельный заголовок с иконками asc/desc
- `SearchInput.tsx` — `useDebounce` + controlled input, синхронизация с URL
- `useProducts.ts` — `useSuspenseQuery`, client-side sort через `useMemo`
- `AddProductModal.tsx` — Radix Dialog + RHF + Zod, `toast.success('Товар добавлен')`

---

## Сессия 5 — Тесты

**Промпт:** Напиши unit-тесты для LoginForm: валидация обязательных полей, отображение API ошибки. Напиши E2E тесты Playwright для auth flow и products page (поиск, сортировка, select-all, модал).

**Результат:**
- `LoginForm.test.tsx` — 4 unit-теста (RTL + Vitest)
- `e2e/auth.spec.ts` — 8 тестов: redirect, validation, toggle password, API error, login, remember me
- `e2e/products.spec.ts` — 15 тестов: columns, search, sort, select-all, modal, toast, refresh, logout redirect

---

## Сессия 6 — Визуальная проверка

**Промпт:** Проверь через Playwright MCP соответствие страниц макету Figma. Сделай скриншоты login page, products page, ErrorState, модала добавления.

**Результат:**
- Скриншоты всех экранов через Playwright MCP
- Исправления после сравнения: `justify-between` в деталях строки, ширина колонки Actions `w-[133px]`
- Подтверждено: все экраны соответствуют Figma макету

---

## Что не генерировалось AI

- Бизнес-логика (решение хранить sort state в URL, клиентская сортировка вместо серверной)
- Конфигурация Tailwind, ESLint, tsconfig
- Структура и порядок `@import` в `index.css`
- Исправление багов (ResizeObserver в тестах, порядок CSS импортов, Zod v4 API)
