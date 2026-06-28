# Condenser AI — Backend Build Guide

## Project Overview

Condenser AI is a web app that condenses long YouTube lectures into shorter videos by skipping filler content. It also generates notes, flashcards, and quizzes. The frontend (Next.js, App Router, Tailwind v4) is already built — **no frontend work is needed**. You are building the **standalone backend** service (expected at `localhost:5000`).

**Frontend repo**: `/data/PROJECTS/condenser-ai/frontend`

---

## Architecture

```
POST /api/lectures           — Submit a YouTube URL for processing
GET  /api/lectures/:id       — Get full lecture data (skip map + chapters)
GET  /api/lectures/:id/skip-map    — Get skip map only
GET  /api/lectures/:id/segments    — Get condensed content segments only
GET  /api/lectures/:id/chapters    — Get chapters
POST /api/lectures/:id/notes       — Generate notes
POST /api/lectures/:id/flashcards  — Generate flashcards
POST /api/lectures/:id/quiz        — Generate quiz
```

**Tech stack recommendations**: Python (FastAPI) + Celery/Redis + PostgreSQL. LLM calls via OpenAI/Anthropic API.

---

## Key Frontend Details You Must Match

### 1. Skip Section Data Format (used by YouTubeSkipper.tsx)
```ts
type SkipSection = { from: number; to: number }
// from and to are seconds (float)
```
The frontend polls every 300ms and seeks past any section where `currentTime >= section.from && currentTime < section.to`.

### 2. Condensation Modes (from condense/page.tsx)
| Value | Label | Behavior |
|-------|-------|----------|
| `none` | None | Return empty skip map, full video |
| `smart_highlights` | Smart Highlights | Keep only sections matching syllabus |
| `remove_filler` | Remove Filler | Cut pauses, repetition, silence, off-topic |
| `custom_flow` | Custom Flow | LLM interprets natural language rules |

### 3. Chapters Format
```ts
{ title: string; timestamp: string; duration: string }
// timestamp: "0:00" format, duration: "2m 30s" format
```

### 4. Notes Format (notes tab)
```ts
string[]  // Array of bullet points, e.g. ["Summary: ...", "Key point 1 — ..."]
```

### 5. Flashcards Format (flashcards tab)
```ts
{ front: string; back: string }[]
```

### 6. Quiz Format (quiz tab)
```ts
{ q: string; a: string }[]
```

### 7. Client-Side Request Flow (from lib/api.js)
The frontend calls:
- `POST /api/lectures` with body `{ videoUrl }` → returns `response.data`
- `GET /api/lectures/:id` → expects `data.skipMap` and `data.segments` arrays
- `GET /api/lectures/:id/skip-map` → expects `data.skipMap`
- `GET /api/lectures/:id/segments` → expects `data.segments`

### 8. Skip Map Timeline (UI expectation)
Each skip section displays `from → to` timestamps and a `-{duration}` badge. The frontend calculates duration as `to - from`.

---

## Database Models (recommended)

### Lecture
- `id`: UUID (primary key)
- `video_url`: string
- `video_id`: string (YouTube ID)
- `title`: string
- `duration`: float (total video seconds)
- `status`: enum(pending, processing, ready, error)
- `error_message`: text?
- `transcript`: text? (raw transcript)
- `syllabus`: text? (optional syllabus for smart_highlights)
- `custom_rules`: text? (optional for custom_flow)
- `created_at`: datetime
- `updated_at`: datetime

### SkipSection
- `id`: UUID
- `lecture_id`: FK → Lecture
- `start_seconds`: float
- `end_seconds`: float
- `reason`: enum(filler, silence, off_topic, repetition, custom, syllabus_mismatch)
- `mode`: string (which condensation mode generated this)
- `order`: int

### Chapter
- `id`: UUID
- `lecture_id`: FK → Lecture
- `title`: string
- `start_seconds`: float
- `duration_seconds`: float
- `order`: int

### Note
- `id`: UUID
- `lecture_id`: FK → Lecture
- `content`: jsonb (array of strings)
- `created_at`: datetime

### Flashcard
- `id`: UUID
- `lecture_id`: FK → Lecture
- `front`: string
- `back`: string
- `created_at`: datetime

### QuizQuestion
- `id`: UUID
- `lecture_id`: FK → Lecture
- `question`: string
- `answer`: string
- `created_at`: datetime

---

## Processing Pipeline (async via Celery/Redis)

1. **Validate & Extract**: Receive POST → extract YouTube videoId → create Lecture (status: pending) → enqueue process task → return `{ id, status: "pending" }`

2. **Fetch Metadata**: Get video title, duration, description from YouTube API

3. **Get Transcript**: Fetch captions via YouTube API or download audio → transcribe via Whisper → store raw transcript with timestamps

4. **Detect Chapters**: Use topic-segmentation (LLM or NLTK texttiling) on transcript → generate chapters

5. **Analyze for Skip Map** (based on mode):
   - `none`: empty skip map
   - `remove_filler`: Use LLM to mark filler words, silences, repetition, off-topic tangents as skippable. Return sections where content is low-value.
   - `smart_highlights`: Compare transcript against syllabus → keep only sections that match syllabus topics → invert to get skip sections
   - `custom_flow`: Pass user's natural language rules + transcript to LLM → parse returned skip sections

6. **Generate Skip Map**: Convert analysis into `{ startSeconds, endSeconds, reason }` array. Update Lecture status to `ready`.

7. **On-Demand Generation** (Notes/Flashcards/Quiz): Call LLM with transcript + prompt → structure response → save to DB → return to frontend.

---

## Notes / Preservation Rules

- The frontend uses `localhost:5000` (hardcoded in `lib/api.js`). Run the backend on this port.
- The frontend already handles all UI state (skip map polling, tab switching, stats). The backend just serves data.
- LLM cost optimization: cache generated content per lecture, only regenerate on explicit "Generate" button click.
- The `custom_flow` mode needs careful prompt engineering. Accept rules like: "Skip intro, keep only examples, remove Q&A."
- For `smart_highlights`, the syllabus can be passed as a text field. Store it on the Lecture model.
- No auth is implemented yet in the frontend — skip auth for MVP.
- The `SkipMapViewer.tsx` component (separate page) is a standalone view — not needed for the main condense flow.
