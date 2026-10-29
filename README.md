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

### Generate a study kit from notes or a PDF

Study-kit generation uses the Gemini API. Create a `.env.local` file in the
project root (the same folder as `package.json`) and add your Gemini API key:

```env
GEMINI_API_KEY=your-gemini-api-key
```

Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey).
If you currently have an `api.env.local` file, Next.js will not load it
automatically: rename it to `.env.local` and change the variable name to
`GEMINI_API_KEY`. Use a Gemini API key as the value, not an OpenAI key.

Restart the development server after adding the key. Notes and PDF files are
sent to Gemini for processing; generated study kits are saved in the current
browser only.

The AI Quiz page uses the same `GEMINI_API_KEY` to generate quizzes from saved
study kits or topics. Saved kits are read from the current browser.

The Revision Plan page lets you set an exam date, choose saved study kits, and
build three review sessions per kit: key ideas, flashcards, and quiz practice.
Generated schedules and completion progress are saved in the current browser.

### Available Scripts

- `npm run dev`: Starts the Next.js development server
- `npm run build`: Compiles the production build
- `npm run lint`: Runs ESLint checks
- `npm run start`: Runs the built production application
