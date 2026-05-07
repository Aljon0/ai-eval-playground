# EvalPlayground — Documentation

> AI Systems Evaluation Playground · v1.0.0

---

## 1. Project Overview

EvalPlayground is a **frontend-only** developer tool for testing, comparing,
and benchmarking AI language models. It provides a clean SaaS-style dashboard
where users can:

- Submit prompts to multiple AI models simultaneously
- View responses with latency and token usage metrics
- Compare outputs side-by-side
- Rate individual responses with a star system
- Save evaluation runs as named experiments
- Browse and manage past experiments

The frontend is fully built and functional with **mock data**. Connecting a
real backend requires only replacing the mock implementations inside
`services/api.ts`.

---

## 2. Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 15 (App Router)           |
| Language    | TypeScript 5                      |
| Styling     | Tailwind CSS 3                    |
| Icons       | Lucide React                      |
| Utilities   | clsx + tailwind-merge             |
| Fonts       | Geist Sans + Geist Mono (Google)  |

---

## 3. How to Run the Project

### Prerequisites

- Node.js 18.17 or later
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ai-eval-playground.git
cd ai-eval-playground

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

---

## 4. Project File Structure

```
ai-eval-playground/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with AppShell
│   ├── page.tsx                # Dashboard page
│   ├── globals.css             # Global styles
│   ├── playground/page.tsx     # Playground (main feature)
│   ├── experiments/page.tsx    # Experiments browser
│   └── settings/page.tsx       # Settings page
│
├── components/
│   ├── layout/                 # Shell, Sidebar, Navbar
│   ├── playground/             # Core evaluation UI components
│   ├── experiments/            # Experiment save/list components
│   ├── dashboard/              # Dashboard widgets
│   └── ui/                     # Reusable primitives
│
├── hooks/                      # Custom React hooks
├── services/                   # API layer (api.ts)
├── types/                      # Shared TypeScript types
└── lib/                        # Utilities and constants
```

---

## 5. UI Structure

### Layout

```
┌─────────────────────────────────────────────┐
│  Sidebar (fixed, collapsible on mobile)      │
│  ├── Logo / Brand                            │
│  ├── Nav: Dashboard                          │
│  ├── Nav: Playground  ◄── main feature       │
│  ├── Nav: Experiments                        │
│  └── Nav: Settings                           │
├─────────────────────────────────────────────┤
│  Navbar (sticky top)                         │
│  ├── Hamburger (mobile)                      │
│  ├── Page title + description                │
│  └── GitHub · Notifications · Avatar         │
├─────────────────────────────────────────────┤
│  Main content area (scrollable)              │
│  └── <Page />                                │
└─────────────────────────────────────────────┘
```

### Playground Layout

```
┌──────────────────┬──────────────────────────┐
│  Control Panel   │  Results Panel            │
│  ─────────────   │  ──────────────────────  │
│  PromptInput     │  [Cards] [Compare] toggle │
│  ModelSelector   │                           │
│  RunButton       │  ResultCard × N           │
│  Tips            │  — or —                   │
│                  │  ComparisonView           │
└──────────────────┴──────────────────────────┘
```

---

## 6. Component Reference

### Layout Components

| Component    | Path                          | Purpose                                      |
|--------------|-------------------------------|----------------------------------------------|
| `AppShell`   | `components/layout/AppShell`  | Root wrapper composing Sidebar + Navbar       |
| `Sidebar`    | `components/layout/Sidebar`   | Collapsible navigation with mobile overlay   |
| `Navbar`     | `components/layout/Navbar`    | Sticky top bar with page title + actions     |

### Playground Components

| Component         | Purpose                                             |
|-------------------|-----------------------------------------------------|
| `PromptInput`     | Auto-resizing textarea with char count + examples   |
| `ModelSelector`   | Multi-select grid of model cards                    |
| `RunButton`       | Primary CTA with loading state + reset              |
| `ResultCard`      | Per-model result with metrics, copy, and rating     |
| `ResultsGrid`     | Responsive grid of ResultCards with summary bar     |
| `ComparisonView`  | Side-by-side columns; carousel on mobile            |
| `RatingComponent` | 5-star interactive rating with hover labels         |

### Experiment Components

| Component               | Purpose                                      |
|-------------------------|----------------------------------------------|
| `SaveExperimentModal`   | Modal to name, tag, and save a run           |
| `ExperimentList`        | Expandable list of saved experiments          |

### Dashboard Components

| Component             | Purpose                                        |
|-----------------------|------------------------------------------------|
| `StatsCard`           | Metric tile with icon, value, trend badge      |
| `RecentExperiments`   | Latest 5 experiments widget with skeleton      |
| `ModelUsageChart`     | Horizontal bar chart of model usage counts     |

### UI Primitives

| Component     | Purpose                                             |
|---------------|-----------------------------------------------------|
| `Spinner`     | Animated loading ring (sm / md / lg)                |
| `PageLoader`  | Centered full-area loading state                    |
| `Skeleton`    | Shimmer placeholder block                           |
| `StatusBadge` | Colored pill for idle / loading / success / error   |
| `Badge`       | Generic label chip (default / outline / muted)      |
| `ModelDot`    | Colored circle representing a model                 |
| `Modal`       | Accessible overlay dialog with backdrop             |
| `EmptyState`  | Icon + title + description + optional CTA           |

---

## 7. Custom Hooks

### `useSidebar`

Manages sidebar open/close state, auto-closes on mobile resize, closes on
Escape key.

```ts
const { isOpen, toggle, open, close } = useSidebar();
```

### `usePlayground`

Core state machine for the Playground feature.

```ts
const {
  prompt, setPrompt,
  selectedModels, toggleModel,
  results, isRunning, hasRun,
  viewMode, setViewMode,
  handleRun, updateRating, reset,
  error,
} = usePlayground();
```

### `useExperiments`

Fetches, saves, and deletes experiments. Auto-fetches on mount.

```ts
const {
  experiments, isLoading, isSaving,
  error, saveError,
  fetchExperiments,
  handleSave,
  handleDelete,
} = useExperiments();
```

---

## 8. Type Reference (`types/index.ts`)

```ts
// Core model identifier
type ModelId = "mistral" | "groq-llama3" | "groq-mixtral" | "gemma2";

// Status of a single model evaluation
type EvalStatus = "idle" | "loading" | "success" | "error";

// Result for one model
interface ModelResult {
  modelId: ModelId;
  modelName: string;
  response: string;
  latencyMs: number;
  tokenUsage: { prompt: number; completion: number; total: number };
  status: EvalStatus;
  error?: string;
  rating?: number;
}

// A saved evaluation run
interface Experiment {
  id: string;
  name: string;
  prompt: string;
  selectedModels: ModelId[];
  results: ModelResult[];
  createdAt: string;
  tags?: string[];
}
```

---

## 9. API Layer (`services/api.ts`)

All backend communication is centralized in `services/api.ts`.
Currently returns **mock data** — replace the mock blocks with real
`fetch()` calls when your backend is ready.

### Functions

```ts
// Run evaluation across selected models
runEvaluation(payload: RunEvaluationPayload): Promise<ApiResponse<ModelResult[]>>

// Save a completed experiment
saveExperiment(payload: SaveExperimentPayload): Promise<ApiResponse<Experiment>>

// Fetch all saved experiments
getExperiments(): Promise<ApiResponse<Experiment[]>>

// Delete an experiment by ID
deleteExperiment(id: string): Promise<ApiResponse<{ id: string }>>
```

### Switching to a Real Backend

Each function contains a commented-out real implementation block:

```ts
// ── REAL IMPLEMENTATION (uncomment when backend is ready) ──
const res = await fetch(`${API_BASE_URL}/api/evaluate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (!res.ok) throw new Error(await res.text());
const data = await res.json();
return { success: true, data };
```

Set your backend URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

### Expected Backend Endpoints

| Method   | Endpoint              | Description                      |
|----------|-----------------------|----------------------------------|
| `POST`   | `/api/evaluate`       | Run evaluation, return results   |
| `GET`    | `/api/experiments`    | List all saved experiments       |
| `POST`   | `/api/experiments`    | Save a new experiment            |
| `DELETE` | `/api/experiments/:id`| Delete experiment by ID          |

---

## 10. Responsiveness

The UI is **mobile-first** using Tailwind breakpoints:

| Breakpoint | Width   | Behavior                                      |
|------------|---------|-----------------------------------------------|
| default    | < 640px | Single column, sidebar hidden, full-width UI  |
| `sm`       | 640px+  | Two-column stats, wider inputs                |
| `md`       | 768px+  | Side-by-side comparison columns               |
| `lg`       | 1024px+ | Sidebar always visible, two-panel playground  |
| `xl`       | 1280px+ | Wider control panel, max-width content        |

Key responsive behaviors:
- **Sidebar** slides in as an overlay on mobile, static on `lg+`
- **Playground** stacks controls above results on mobile; side-by-side on `lg+`
- **ComparisonView** shows a carousel on mobile, columns on `md+`
- **StatsCards** are 2-column on mobile, 4-column on `lg+`
- All inputs and buttons are full-width on small screens

---

## 11. Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (optional — defaults to localhost:8000)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 12. Adding a New Model

1. Add the model ID to `types/index.ts` → `ModelId` union
2. Add the model config to `AVAILABLE_MODELS` in `lib/utils.ts`
3. Add mock responses to `MOCK_RESPONSES` in `services/api.ts`
4. The UI picks up the new model automatically everywhere

---

## 13. Roadmap (Frontend)

- [ ] Persistent experiment storage (localStorage)
- [ ] Export experiments as JSON / CSV
- [ ] Prompt history and templates
- [ ] Keyboard shortcuts (⌘ + Enter to run)
- [ ] Dark mode support
- [ ] Diff highlighting between model responses
- [ ] Token usage visualization chart
- [ ] Shareable experiment links

---

*Built with Next.js · TypeScript · Tailwind CSS*