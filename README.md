## Todo Calendar

A calendar‑driven todo application built with Next.js App Router, FullCalendar, and Prisma/PostgreSQL. Users can browse a monthly calendar, create todos for specific days, and manage them (view, edit, delete) via a simple UI backed by a REST API.

---

### Project Structure

- **`app/`**: Next.js App Router entrypoints and pages.
  - **`app/layout.tsx`**: Root layout, global fonts and `globals.css`.
  - **`app/page.tsx`**: Home page showing the calendar and the selected date’s todo list. Defaults to today’s date.
  - **`app/todos/create/page.tsx`**: Page for creating a new todo, wraps `TodoForm`.
  - **`app/todos/[id]/edit/page.tsx`**: Page for editing an existing todo, fetches `params` and passes `id` to `TodoForm`.
  - **`app/api/todos/route.ts`**: Collection API for listing and creating todos.
  - **`app/api/todos/[id]/route.ts`**: Item API for reading, updating, and deleting a single todo.
- **`components/`**: Reusable UI components.
  - **`calendar-view.tsx`**: FullCalendar month view, calls `onDateClick(dateStr)` when a day is clicked.
  - **`todo-list.tsx`**: Fetches todos for a given date with SWR and renders a list of `TodoItem`.
  - **`todo-item.tsx`**: Single todo row with status text, Edit link, and Delete button.
  - **`todo-form.tsx`**: Create/edit form. In edit mode it loads todo details from the API and fills the fields.
- **`hooks/useTodos.ts`**: Custom hook wrapping SWR to load todos (optionally filtered by `date`).
- **`lib/prisma.ts`**: Singleton Prisma client for server‑side API routes.
- **`prisma/schema.prisma`**: Prisma data model (PostgreSQL) for the `Todo` entity.
- **`next.config.ts`, `tsconfig.json`, `package.json`**: Next.js, TypeScript, and dependency configuration.

---

### Business Objectives

- **Daily planning**: Allow users to quickly see what needs to be done today, directly from a calendar view.
- **Date‑centric organization**: Todos are attached to specific dates, making it easy to review past and future tasks.
- **Simple CRUD workflow**: Minimal friction to create, edit, and delete tasks without complex project or tag systems.
- **Backend‑ready**: Use a real database (PostgreSQL via Prisma) so the app can be deployed and scaled beyond a toy demo.

---

### Usage & Key Features

- **Calendar‑driven navigation**
  - Click any date in the calendar to immediately show that day’s todos.
  - When the app loads and no date is manually selected, it defaults to **today’s date** and shows today’s todo list.

- **Todo list for a selected day**
  - The list below the calendar always reflects the currently selected date.
  - Uses SWR for automatic revalidation after creates/updates/deletes.

- **Create todo**
  - Navigate to `/todos/create` or use the **Create Todo** button on the home page.
  - Form fields: **content** (text) and **date** (`YYYY-MM-DD`).
  - Submits a `POST /api/todos` request to persist into PostgreSQL.

- **Edit todo**
  - From the list, click **Edit** to go to `/todos/[id]/edit`.
  - `TodoForm` fetches `GET /api/todos/[id]` and pre‑fills content and date.
  - Submitting sends a `PUT /api/todos/[id]` with updated fields.

- **Delete todo**
  - Click **Delete** in a todo row to call `DELETE /api/todos/[id]`.
  - On success, the SWR cache is invalidated and the list refreshes.

- **Status & metadata**
  - The `Todo` model includes `status`, `createdAt`, and `updatedAt` fields to support richer workflows later (e.g., completed vs pending).

---

### API Endpoints

- **`GET /api/todos`**
  - **Query params**:
    - **`date` (optional)**: `YYYY-MM-DD`. If provided, returns todos whose `date` is within that day (inclusive start, exclusive next‑day end). If omitted, returns all todos.
  - **Response**: JSON array of todo objects.

- **`POST /api/todos`**
  - **Body** (JSON):
    - **`content`**: string
    - **`date`**: string date, converted to `Date` on the server
  - **Response**: JSON representation of the created todo.

- **`GET /api/todos/[id]`**
  - **Path param**: `id` (string, Prisma `cuid()`).
  - **Response**:
    - 200: todo JSON.
    - 400/404: error JSON if `id` is missing or not found.

- **`PUT /api/todos/[id]`**
  - **Body** (JSON):
    - Optional `content` and/or `date` fields. `date` is converted to a `Date` before updating.
  - **Response**: JSON of the updated todo.

- **`DELETE /api/todos/[id]`**
  - **Response**: `{ success: true }` on success, with error JSON on failure.

---

### Technologies & Libraries

- **Framework & runtime**
  - **Next.js 16 App Router** (`app/` directory, route handlers, server and client components).
  - **React 19** for UI components.

- **UI & calendar**
  - **FullCalendar** (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`) for interactive month calendar view.
  - **Tailwind CSS v4** (via `@tailwindcss/postcss` and `globals.css`) for modern styling.
  - **next/font / Geist** for performant, good‑looking typography.

- **Data & backend**
  - **Prisma ORM 5.22** with **PostgreSQL** datasource.
  - **`@prisma/client`** for typed database access.
  - **Next.js Route Handlers** under `app/api/...` for REST endpoints.

- **Client‑side data fetching**
  - **SWR** for caching, revalidation, and optimistic updates of todo lists.
  - **Custom hook** `useTodos` to encapsulate the SWR logic.

- **Tooling**
  - **TypeScript** for static typing.
  - **ESLint + `eslint-config-next`** for linting and best practices.

---

### Database (PostgreSQL & Prisma)

- **Datasource configuration**
  - Defined in `prisma/schema.prisma` with `provider = "postgresql"`.
  - Connection string is read from the **`POSTGRES_PRISMA_URL`** environment variable.
  - All API routes share a single Prisma client instance from `lib/prisma.ts` to avoid exhausting database connections.

- **Core table: `Todo`**
  - Backed by the Prisma `model Todo`:
    - **`id: String @id @default(cuid())`** – primary key, globally unique ID.
    - **`content: String`** – human‑readable description of the task.
    - **`date: DateTime`** – the logical day the todo belongs to. The APIs convert simple `YYYY-MM-DD` strings from the UI into `Date` objects before persisting.
    - **`status: String @default("not_completed")`** – current state of the todo (e.g., `"not_completed"`, `"completed"`; currently stored as a free‑form string, easy to refactor to an enum later).
    - **`createdAt: DateTime @default(now())`** – server‑side creation timestamp.
    - **`updatedAt: DateTime @updatedAt`** – automatically bumped on every update.

- **How dates are queried**
  - `GET /api/todos?date=YYYY-MM-DD`:
    - Builds a **start** and **end** `Date` for that day.
    - Filters by `date >= start AND date < end` so todos are correctly grouped per calendar day regardless of time components.
  - This design makes it easy to add different time zones or time‑of‑day scheduling later without changing the basic data model.

- **Migrations & schema evolution**
  - The current schema is small and focused, but Prisma’s migration system (`prisma migrate`) can be used to add columns, indexes, and relations as the app grows.
  - Example evolutions: add `userId` for multi‑user support, `priority` for sorting, or `projectId` for grouping tasks.

---

### Scalability & Future Development Potential

- **Data model extensions**
  - Add fields such as priority, tags, recurrence rules, or user ownership to support multi‑user, multi‑tenant setups.
  - Introduce relationships (e.g., projects, categories) in `schema.prisma`.

- **Performance & scale**
  - Prisma + PostgreSQL can be scaled with read replicas and connection pooling.
  - SWR’s caching layer reduces redundant API calls on frequently visited dates.
  - API routes can be migrated to dedicated microservices if needed while keeping the same REST contract.

- **Features roadmap**
  - **Authentication & multi‑user support** (e.g., NextAuth, Clerk).
  - **Recurring tasks** and templated days.
  - **Reminders and notifications** (email, push, calendar sync).
  - **Advanced calendar views** (week/day view, time grid) via more FullCalendar plugins.

---

### Project Philosophy

- **Date‑first thinking**: The calendar is the primary navigation surface; todos are organized around time rather than arbitrary lists.
- **Simple, explicit flows**: CRUD operations are implemented via clear, typed REST endpoints and small, focused components.
- **Realistic stack**: Uses production‑ready tools (Next.js App Router, Prisma, PostgreSQL, SWR) to stay close to how a real‑world SaaS would be built.
- **Extensibility over complexity**: The current feature set is intentionally small but implemented in a way that makes it easy to grow into more complex planning and scheduling features without rewriting the core.
