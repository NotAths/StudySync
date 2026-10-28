# StudySync

> **"Your Notes. Your Learning. In Sync."**

StudySync is an AI-powered study assistant designed to transform your notes, streamline your learning process, and keep your study routine seamlessly in sync.

---

## Foundation Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Icons:** `lucide-react`
- **Validation:** `zod`
- **Backend / Database Client:** `@supabase/supabase-js`, `@supabase/ssr` (foundation dependencies installed)
- **Code Quality:** ESLint

---

## Project Structure

```
src/
  app/
    analytics/page.tsx
    flashcards/page.tsx
    notes/page.tsx
    quiz/page.tsx
    revision/page.tsx
    settings/page.tsx
    study-kits/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
    layout/
    Footer.tsx
    Hero.tsx
    Navbar.tsx
  lib/constants.ts
  types/index.ts
public/
eslint.config.mjs
next.config.ts
package.json
tsconfig.json
```

---

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev`: Starts the Next.js development server
- `npm run build`: Compiles the production build
- `npm run lint`: Runs ESLint checks
- `npm run start`: Runs the built production application
