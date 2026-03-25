# AI Usage Log

Документация по использованию AI при разработке тестового задания.

**Модель:** Claude Sonnet 4.6 (claude-sonnet-4-6)
**Период:** март 2026

---

## Сессия 0 — Первый промпт: полный план

```
Plan: Admin Products Dashboard (Test Assignment)

Context
React 18 + TypeScript admin panel: auth screen + products table.
Data source: DummyJSON API.

---

Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-AUTH-001 | Login form: username + password, required validation |
| FR-AUTH-002 | "Remember me": checked → localStorage, unchecked → sessionStorage |
| FR-AUTH-003 | API auth error: message under fields |
| FR-AUTH-004 | "Создать" link: stub (no navigation) |
| FR-PROD-001 | Products table: columns per Figma — image, name, price, rating, stock, brand, category, SKU |
| FR-PROD-002 | Skeleton screens during loading; ErrorState with retry on failure |
| FR-PROD-003 | Client-side sorting by price and rating (asc/desc) |
| FR-PROD-004 | Sort state in URL search params |
| FR-PROD-005 | Search via DummyJSON API (/products/search?q=), debounced 300ms |
| FR-PROD-006 | "Добавить" → modal form (name, price, vendor, SKU) → Toast on submit |
| FR-PROD-007 | Rating < 3.5 → red text |
| FR-PROD-008 | Three-dot icon: stub |
| FR-PROD-009 | Refresh button: re-fetches current query |

### Non-functional
- TypeScript strict mode, no `any`
- Chrome (latest)
- Interfaces: `Product`, `User`, `AuthRequest`, `AuthResponse`, `ProductsResponse`
- `/` → redirect to `/login` or `/products` depending on auth state

### Edge Cases
- No token on `/products` → redirect to `/login`
- Add product: local state only, not added to table (per spec)
- API down: `ErrorState` with "Не удалось загрузить данные" + retry button (no crash)

---

## Architecture

### Library Choices

| Library | Choice | Why |
|---------|--------|-----|
| Server state | **TanStack Query v5** | Loading/error/cache/refetch out of the box |
| HTTP | **Axios** | Typed instance, auth interceptor in one place |
| Forms | **React Hook Form + Zod** | Zod schema is the single source: runtime validation + TS type via `z.infer` |
| Routing | **React Router v6** | Protected routes, `useSearchParams` for sort state |
| Styling | **Tailwind CSS** | Utility-first, fast, no extra CSS files |
| Toast | **Sonner** | Minimal API, works well with Tailwind |
| Testing | **Vitest + React Testing Library** | Native Vite integration, no separate config, faster than Jest |
| Build | **Vite** | Per spec |

> **No global state manager (no Zustand/RTK):** All server state lives in TanStack Query. Sort/search state lives in URL params. Auth token — simple read/write to localStorage or sessionStorage. For this scope, a global store would only add indirection without benefit.

> **Sorting — client-side by default:** DummyJSON supports `sortBy`/`order` params, so switching to server-side is a one-line change in the query hook. But for a test assignment, client-side is more reliable (no dependency on external API behaviour), easier to test, and keeps the data-fetching logic simple.

> **Sort state in URL:** When a user reloads the page or shares a link, the sort order is preserved. This is a standard UX pattern for admin tables — the URL is the source of truth for view state, not component memory.

> **Vitest vs Jest:** Same transform pipeline as Vite, no duplicate config, ~2× faster, ESM-native.

### Folder Structure
```

src/
features/
auth/
components/ # LoginForm
hooks/ # useLogin (RHF + mutation)
types/ # AuthRequest, AuthResponse, User
validators/ # loginSchema.ts (Zod)
utils/ # tokenStorage.ts (read/write token)
products/
components/ # ProductsTable, ProductRow, SortHeader, # AddProductModal, SearchInput, SkeletonRow, ErrorState
hooks/ # useProducts
types/ # Product, ProductsResponse
shared/
api/ # axios instance (auth interceptor)
components/ # ProtectedRoute
app/
router.tsx
providers.tsx # QueryClientProvider + Toaster
pages/
LoginPage.tsx
ProductsPage.tsx
main.tsx

````

### Key Types
```ts
// features/auth/types/index.ts
interface AuthRequest { username: string; password: string; }
interface AuthResponse { accessToken: string; id: number; username: string; /* ...rest */ }
interface User { id: number; username: string; email: string; firstName: string; lastName: string; }

// features/products/types/index.ts
interface Product {
  id: number; title: string; price: number; rating: number;
  stock: number; brand: string; category: string; sku?: string;
  thumbnail: string;
}
interface ProductsResponse { products: Product[]; total: number; skip: number; limit: number; }
````

### Zod Schema

```ts
// features/auth/validators/loginSchema.ts
export const loginSchema = z.object({
  username: z.string().min(1, 'Обязательное поле'),
  password: z.string().min(1, 'Обязательное поле'),
  rememberMe: z.boolean().default(false),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Token Storage

```ts
// features/auth/utils/tokenStorage.ts
export const saveToken = (token: string, remember: boolean) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('token', token);
};
export const getToken = (): string | null =>
  localStorage.getItem('token') ?? sessionStorage.getItem('token');
export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
```

### Client-side Sorting

```ts
// In useProducts hook — sort happens after fetch, before render
const sorted = useMemo(() => {
  if (!sortBy) return data;
  return [...data].sort((a, b) =>
    order === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy],
  );
}, [data, sortBy, order]);
```

### Error State

```tsx
if (isError) {
  return <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />;
}
```

### UI States for Table

- **Loading**: SkeletonRow repeated N times (grey placeholder blocks)
- **Error**: ErrorState with message + retry button
- **Empty (no products)**: "Товары не найдены"
- **Empty (search)**: "По запросу «...» ничего не найдено"
- **Hover**: row highlight via Tailwind hover:bg-gray-50
- **Low rating**: rating < 3.5 && 'text-red-500'

---

## Roadmap

### Stage 1 — Project Setup

- npm create vite@latest → React + TypeScript
- Configure: tsconfig.json (strict), ESLint, Prettier, Tailwind
- Install all libraries
- Create folder structure

### Stage 2 — Auth [FR-AUTH-001..004]

- loginSchema.ts (Zod) + LoginFormValues type
- tokenStorage.ts — save/get/clear
- Axios instance with auth interceptor
- LoginForm — RHF + Zod resolver, error under fields
- LoginPage — layout per Figma
- ProtectedRoute — read token, redirect if missing
- Tests: LoginForm.test.tsx

### Stage 3 — Products Table [FR-PROD-001, FR-PROD-002, FR-PROD-007, FR-PROD-008]

- Product, ProductsResponse types
- useProducts hook — TanStack Query fetch
- ProductsTable — columns per Figma
- SkeletonRow — placeholder during load
- ErrorState — message + retry
- ProductRow — rating < 3.5 → text-red-500
- ProductsPage layout

### Stage 4 — Sorting + Search [FR-PROD-003..005, FR-PROD-009]

- SortHeader — clickable column headers with asc/desc icons
- useSearchParams for sort state (URL-persisted)
- useMemo sort in useProducts
- SearchInput with 300ms debounce → re-fetches via API
- Refresh button → refetch()

### Stage 5 — Add Product Modal [FR-PROD-006]

- AddProductModal — RHF form (name, price, vendor, SKU)
- Submit → toast.success('Товар добавлен')
- No API call, no table update

### Stage 6 — UI Polish + AI Log

- Pixel-accurate Figma match: colors, spacing, fonts, borders
- Hover states, focus rings, transitions
- AI_USAGE.md — prompt history for submission

### Stage 7 — README.md

Разделы: о проекте, стек, как запустить, что реализовано, особенности реализации.

---

## Code Quality Notes

- All components have explicit typed props
- ProductRow in React.memo — table won't re-render unchanged rows
- Axios interceptor injects token once
- Zod schema is the only place field names are defined
- tokenStorage.ts is pure functions — easy to unit test
- Commit messages reference requirement IDs

---

## Verification Checklist

1. `/` → redirect to `/login`
2. Submit empty form → errors under both fields
3. Wrong credentials → API error under fields
4. Login emilys / emilyspass → /products, table loads with skeleton first
5. Close tab (no remember me) → reopen → /login
6. Login with remember me → close + reopen → /products
7. Sort by price asc/desc → URL updates, table re-sorts
8. Search "laptop" → filtered results via API
9. Refresh → table re-fetches
10. Kill network → table shows ErrorState with retry
11. "Добавить" → fill form → submit → Toast
12. Product with rating < 3.5 → red value
13. npm run test → passes
14. npm run build → no TS errors
15. README.md содержит рабочие команды

```

---

## Сессия 1 — Auth модуль

**Промпт:** Реализуй LoginForm с React Hook Form + Zod. Валидация обязательных полей, remember me через localStorage/sessionStorage, отображение ошибки API под полями.

**Результат:**
- `loginSchema.ts` — Zod схема с `rememberMe: z.boolean().default(false)`
- `tokenStorage.ts` — `saveToken`, `getToken`, `clearToken`
- `LoginForm.tsx` — RHF + Zod resolver, контролируемые инпуты, поле пароля с eye-toggle
- `useLogin.ts` — TanStack Query mutation, обработка 400/401

---

## Сессия 2 — Products таблица

**Промпт:** Реализуй таблицу товаров по Figma: колонки image/name/vendor/sku/rating/price/actions. Skeleton при загрузке, красный рейтинг < 3.5, цена с разделением целой и дробной части.

**Результат:**
- `ProductsTable.tsx` — Suspense boundary, select-all checkbox, управляемые строки
- `ProductRow.tsx` — `React.memo`, `formatPrice` (Intl.NumberFormat + split по запятой), красный рейтинг
- `SkeletonRow.tsx` — `SkeletonTable` с N рядами плейсхолдеров
- `ErrorState.tsx` — сообщение + кнопка "Повторить"

---

## Сессия 3 — Сортировка, поиск, модал

**Промпт:** Добавь сортировку по price/rating с состоянием в URL params, debounced поиск 300ms, кнопку Обновить через invalidateQueries, модал добавления товара с toast.

**Результат:**
- `SortHeader.tsx` — кликабельный заголовок с иконками asc/desc
- `SearchInput.tsx` — `useDebounce` + controlled input, синхронизация с URL
- `useProducts.ts` — `useSuspenseQuery`, client-side sort через `useMemo`
- `AddProductModal.tsx` — Radix Dialog + RHF + Zod, `toast.success('Товар добавлен')`

---

## Сессия 4 — Тесты

**Промпт:** Напиши unit-тесты для LoginForm: валидация обязательных полей, отображение API ошибки. Напиши E2E тесты Playwright для auth flow и products page (поиск, сортировка, select-all, модал).

**Результат:**
- `LoginForm.test.tsx` — 4 unit-теста (RTL + Vitest)
- `e2e/auth.spec.ts` — 8 тестов: redirect, validation, toggle password, API error, login, remember me
- `e2e/products.spec.ts` — 15 тестов: columns, search, sort, select-all, modal, toast, refresh, logout redirect

---

## Сессия 5 — Визуальная проверка

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
```
