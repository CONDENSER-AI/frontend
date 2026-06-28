# Condenser AI — Backend Implementation Plan

## Overview

Build a standalone backend service (Python/FastAPI) at `localhost:5000` that the existing Next.js frontend talks to. The backend accepts YouTube URLs, processes them asynchronously to generate skip maps (sections of filler/low-value content to auto-skip), chapters, notes, flashcards, and quizzes.

---

## Phase 1 — Project Setup & Scaffolding

### Step 1.1 — Initialize Python project
```bash
mkdir backend && cd backend
python -m venv venv
pip install fastapi uvicorn sqlalchemy asyncpg alembic celery redis httpx youtube-transcript-api openai
pip install python-dotenv pydantic uuid-utils
```

### Step 1.2 — Project structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── config.py            # Settings from env vars
│   ├── database.py          # SQLAlchemy engine, session factory
│   ├── models.py            # All ORM models
│   ├── schemas.py           # Pydantic request/response models
│   ├── dependencies.py      # DB session dependency
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── lectures.py      # POST /api/lectures, GET /api/lectures/:id
│   │   ├── chapters.py      # GET /api/lectures/:id/chapters
│   │   ├── skips.py         # GET /api/lectures/:id/skip-map, /segments
│   │   └── content.py       # POST notes/flashcards/quiz
│   ├── services/
│   │   ├── __init__.py
│   │   ├── youtube.py       # YouTube metadata, captions extraction
│   │   ├── transcript.py    # Whisper fallback processing
│   │   ├── analyzer.py      # LLM-based content analysis
│   │   └── generator.py     # Notes/flashcards/quiz generation
│   └── tasks.py             # Celery async tasks
├── alembic/                 # DB migrations
├── alembic.ini
├── requirements.txt
├── .env
└── Dockerfile
```

### Step 1.3 — Configuration (.env)
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/condenser
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-...
YOUTUBE_API_KEY=...
```

### Step 1.4 — FastAPI app scaffold (`main.py`)
- Add CORS middleware (allow `http://localhost:3000`)
- Mount all routers under `/api/lectures`
- Health check endpoint `GET /api/health`

---

## Phase 2 — Database Layer

### Step 2.1 — Define ORM models (`models.py`)
- **Lecture**: id (UUID, PK), video_url, video_id, title, duration (float), status (enum: pending|processing|ready|error), error_message, transcript (JSONB), syllabus, custom_rules, created_at, updated_at
- **SkipSection**: id (UUID, PK), lecture_id (FK), start_seconds (float), end_seconds (float), reason (string), mode (string), order (int)
- **Chapter**: id (UUID, PK), lecture_id (FK), title, start_seconds (float), duration_seconds (float), order (int)
- **Note**: id (UUID, PK), lecture_id (FK), content (JSONB array), created_at
- **Flashcard**: id (UUID, PK), lecture_id (FK), front, back, created_at
- **QuizQuestion**: id (UUID, PK), lecture_id (FK), question, answer, created_at

### Step 2.2 — Pydantic schemas (`schemas.py`)
- `LectureCreate`: videoUrl (str), mode (str), syllabus (optional), customRules (optional)
- `LectureResponse`: id, videoId, title, duration, status, skipMap[], chapters[], createdAt
- `SkipSectionOut`: startSeconds, endSeconds, reason
- `ChapterOut`: title, timestamp ("0:00"), duration ("2m 30s")
- `NoteOut`: content (list of strings)
- `FlashcardOut`: front, back
- `QuizOut`: q, a

### Step 2.3 — Alembic migrations
```bash
alembic init alembic
alembic revision --autogenerate -m "initial models"
alembic upgrade head
```

---

## Phase 3 — Core API Endpoints

### Step 3.1 — `POST /api/lectures` (`routers/lectures.py`)
1. Validate the YouTube URL, extract videoId
2. Create Lecture record (status: pending)
3. Enqueue Celery task `process_lecture.delay(lecture_id)`
4. Return `{ id: lecture_id, status: "pending" }` with 202

### Step 3.2 — `GET /api/lectures/:id` (`routers/lectures.py`)
1. Fetch lecture by ID
2. Fetch associated SkipSections, Chapters
3. Compute segments (inverse of skip sections — the parts to keep)
4. Return `{ lecture fields, skipMap: [...], segments: [...], chapters: [...] }`

### Step 3.3 — `GET /api/lectures/:id/skip-map` (`routers/skips.py`)
- Return `{ skipMap: [{ startSeconds, endSeconds, reason }] }`

### Step 3.4 — `GET /api/lectures/:id/segments` (`routers/skips.py`)
- Compute the "keep" segments from the skip map
- Return `{ segments: [{ startSeconds, endSeconds, label? }] }`

### Step 3.5 — `GET /api/lectures/:id/chapters` (`routers/chapters.py`)
- Return `{ chapters: [{ title, timestamp, duration }] }`

### Step 3.6 — `POST /api/lectures/:id/notes` (`routers/content.py`)
1. Check if notes already exist in DB for this lecture → return cached
2. Enqueue Celery task `generate_notes.delay(lecture_id)`
3. Return async response or poll for status
4. (Simpler approach: generate synchronously with a timeout since frontend shows spinner)

### Step 3.7 — `POST /api/lectures/:id/flashcards` (`routers/content.py`)
- Same pattern as notes

### Step 3.8 — `POST /api/lectures/:id/quiz` (`routers/content.py`)
- Same pattern as notes

---

## Phase 4 — YouTube & Transcript Service

### Step 4.1 — YouTube service (`services/youtube.py`)
- `extract_video_id(url)` — regex to get YouTube ID from various URL formats
- `fetch_metadata(video_id)` — use `yt_dlp` or YouTube Data API to get title, duration, description, thumbnails
- `fetch_captions(video_id)` — use `youtube-transcript-api` (Python) to get captions with timestamps. Handle auto-generated vs manual captions.
- Fallback: if captions unavailable, download audio with `yt-dlp` and transcribe with Whisper

### Step 4.2 — Caption formatting
- Convert raw captions to `[{ text, start, duration }]` segments
- Store as JSON in `lecture.transcript`

---

## Phase 5 — Skip Map Analysis (LLM-powered)

### Step 5.1 — Mode: `none`
- Return empty `[]` skip map

### Step 5.2 — Mode: `remove_filler` (`services/analyzer.py`)
- Build a chunked version of the transcript (group every ~30 seconds of speech)
- Send to LLM with this prompt structure:
  ```
  You are analyzing a lecture transcript. For each chunk, decide if it is:
  - KEEP: contains substantive lecture content
  - SKIP: filler/off-topic/repetition/pause/silence
  
  Transcript chunks (with timestamps):
  [{start: 0, end: 30, text: "..."}, ...]
  
  Return JSON array of skip segments: [{startSeconds, endSeconds, reason}]
  ```
- Parse LLM response → store SkipSection records

### Step 5.3 — Mode: `smart_highlights`
- Accept optional `syllabus` field from Lecture
- Send transcript + syllabus to LLM:
  ```
  Given this syllabus: {syllabus}
  And this transcript: {chunks}
  
  Mark each chunk as MATCH (discusses a syllabus topic) or NO_MATCH.
  Return JSON array of NO_MATCH segments to skip.
  ```
- Invert: keep MATCH sections → skip everything else

### Step 5.4 — Mode: `custom_flow`
- Accept `custom_rules` field from Lecture
- Send transcript + rules to LLM:
  ```
  User rules: {customRules}
  Transcript: {chunks}
  
  Follow the user's rules to determine which sections to skip.
  Return JSON array of skip segments.
  ```

### Step 5.5 — LLM Response Parsing
- Use `response_models` or Pydantic to enforce structured output
- Validate timestamps are within video bounds
- Merge overlapping/adjacent skip sections
- Skip sections shorter than 1 second (edge case)

---

## Phase 6 — Chapter Detection

### Step 6.1 — LLM-based chapter detection (`services/analyzer.py`)
- Send full transcript to LLM:
  ```
  From this lecture transcript, identify natural chapter breaks.
  Return JSON: [{title, startSeconds}]
  Chapters should be descriptive (e.g. "Introduction to Neural Networks").
  ```
- For each chapter, compute `duration = next_chapter_start - current_start`
- Format `timestamp` as "M:SS" string
- Format `duration` as "Xm Ys" string
- Store Chapter records in DB

### Step 6.2 — Alternative: heuristic chapter detection
- If LLM is unavailable, use text-tiling (NLTK) or detect repeated phrases / topic shifts based on keyword frequency
- Less accurate but fast fallback

---

## Phase 7 — Content Generation (Notes/Flashcards/Quiz)

### Step 7.1 — Notes generation (`services/generator.py`)
```python
prompt = f"""
Generate comprehensive lecture notes from this transcript.
Return a JSON array of bullet points (strings).
Each bullet should cover one key concept, definition, or takeaway.

Transcript: {transcript_text}
"""
```

### Step 7.2 — Flashcards generation
```python
prompt = f"""
Generate flashcards from this lecture transcript.
Return JSON array of {{"front": "question", "back": "answer"}}.

Front should be a specific question. Back should be the concise answer.

Transcript: {transcript_text}
"""
```

### Step 7.3 — Quiz generation
```python
prompt = f"""
Generate quiz questions from this lecture transcript.
Return JSON array of {{"q": "question", "a": "answer"}}.

Questions should test understanding, not just recall.

Transcript: {transcript_text}
"""
```

### Step 7.4 — Caching logic
- Before generating, check if content already exists for lecture_id
- If yes, return cached version immediately
- If re-generation requested (explicit button click), delete old records and regenerate

---

## Phase 8 — Async Processing with Celery

### Step 8.1 — Celery config (`tasks.py`)
- Configure Celery app with Redis broker
- Define tasks:
  - `process_lecture(lecture_id)`: full pipeline — metadata → transcript → chapters → skip map
  - `generate_notes(lecture_id)`
  - `generate_flashcards(lecture_id)`
  - `generate_quiz(lecture_id)`

### Step 8.2 — Task: `process_lecture`
```
1. Fetch lecture from DB, set status=processing
2. Extract videoId from video_url
3. Fetch YouTube metadata → update lecture title, duration
4. Fetch captions/transcript → store in lecture.transcript
5. If transcript empty, download audio → Whisper → store
6. Detect chapters → store Chapter records
7. Analyze by condensation mode → store SkipSection records
8. Set lecture status=ready
9. On any error: set status=error, store error_message
```

### Step 8.3 — Worker startup
```bash
celery -A app.tasks worker --loglevel=info
```

---

## Phase 9 — Error Handling & Edge Cases

### Step 9.1 — YouTube URL validation
Handle formats:
- `https://youtube.com/watch?v=XXXX`
- `https://youtu.be/XXXX`
- `https://youtube.com/embed/XXXX`
- `https://youtube.com/shorts/XXXX`
- With or without timestamp parameters
- Invalid URLs → return 400 with descriptive message

### Step 9.2 — Transcript not available
- Try YouTube captions first (manual, then auto-generated)
- Fallback: download audio via `yt-dlp`, transcribe with Whisper
- If all fail → return 400 "No captions available for this video"

### Step 9.3 — Video too short
- If duration < 2 minutes → skip analysis, return empty skip map

### Step 9.4 — Video too long
- If duration > 6 hours → cap analysis to first 6 hours

### Step 9.5 — Processing timeout
- Celery task timeout of 10 minutes per video
- On timeout → set status=error

---

## Phase 10 — Testing & Validation

### Step 10.1 — Unit tests
- `tests/test_youtube.py` — URL parsing, caption fetching
- `tests/test_analyzer.py` — Each condensation mode logic
- `tests/test_generator.py` — Notes/flashcards/quiz generation
- `tests/test_api.py` — All endpoint responses, status codes

### Step 10.2 — Integration tests
- Mock YouTube API responses
- Mock LLM responses
- Test full processing pipeline end-to-end

### Step 10.3 — Manual testing checklist
- [ ] Start backend, verify health endpoint
- [ ] Submit YouTube URL → get lecture ID, status changes to processing → ready
- [ ] Verify skip map is generated for `remove_filler` mode
- [ ] Verify skip map is empty for `none` mode
- [ ] Verify `smart_highlights` with syllabus text
- [ ] Verify `custom_flow` with natural language rules
- [ ] Verify chapters are detected and formatted correctly
- [ ] Generate notes → verify format matches frontend expectation
- [ ] Generate flashcards → verify front/back pairs
- [ ] Generate quiz → verify Q&A pairs
- [ ] Verify `GET /api/lectures/:id` returns all data
- [ ] Verify CORS allows requests from localhost:3000
- [ ] Test with non-existent lecture ID → return 404

---

## Phase 11 — Deployment

### Step 11.1 — Docker setup
- `Dockerfile`: Python 3.12, install deps, copy app, run uvicorn
- `docker-compose.yml`: backend + postgres + redis + celery worker

### Step 11.2 — Environment variables for production
- Database, Redis, OpenAI API key, YouTube API key
- Logging level, worker concurrency

---

## API Contract Summary

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| POST | `/api/lectures` | `{ videoUrl }` | `{ id, status }` (202) |
| GET | `/api/lectures/:id` | — | `{ lecture, skipMap[], segments[], chapters[] }` |
| GET | `/api/lectures/:id/skip-map` | — | `{ skipMap[] }` |
| GET | `/api/lectures/:id/segments` | — | `{ segments[] }` |
| GET | `/api/lectures/:id/chapters` | — | `{ chapters[] }` |
| POST | `/api/lectures/:id/notes` | — | `{ notes[] }` |
| POST | `/api/lectures/:id/flashcards` | — | `{ flashcards[] }` |
| POST | `/api/lectures/:id/quiz` | — | `{ quiz[] }` |

## Data Flow Diagram

```
User → [Landing Page] → submits YouTube URL
         → navigates to /condense?videoUrl=...
           → frontend calls POST /api/lectures
             → backend creates Lecture (pending)
               → enqueues Celery task
                 → worker processes (transcript → chapters → skip map)
                 → sets status=ready
           → frontend polls GET /api/lectures/:id
             → gets skipMap, renders YouTubeSkipper
             → auto-skips filler sections in real-time
           → User clicks "Generate Notes"
             → POST /api/lectures/:id/notes
               → LLM generates → saved in DB → returned to frontend
```
