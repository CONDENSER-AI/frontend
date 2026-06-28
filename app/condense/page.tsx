"use client"
import { useState } from "react"
import YouTubeSkipper from "../ui/YoutubeSkipper"
import Image from "next/image"
import FlashcardModal from "../ui/FlashcardModal"
import QuizModal from "../ui/QuizModal"
import NotesModal from "../ui/NotesModal"
const CONDENSE_MODES = [
  { value: "none", label: "None", desc: "Watch the full video as-is", icon: "play" },
  { value: "smart_highlights", label: "Smart Highlights", desc: "Keep only the key moments", icon: "highlight" },
  { value: "remove_filler", label: "Remove Filler", desc: "Cut pauses, repetition & silence", icon: "scissors" },
  { value: "custom_flow", label: "Custom Flow", desc: "Define your own skip rules", icon: "sliders" },
] as const

const DEMO_CHAPTERS = [
  { title: "Course Overview & Logistics", timestamp: "0:00", duration: "2m 30s" },
  { title: "Binary & Data Representation", timestamp: "2:30", duration: "8m 15s" },
  { title: "Algorithms & Pseudocode", timestamp: "10:45", duration: "5m 20s" },
  { title: "C Programming Fundamentals", timestamp: "16:05", duration: "6m 40s" },
  { title: "Memory & Pointers", timestamp: "22:45", duration: "3m 10s" },
]

const icons = {
  play: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  highlight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  scissors: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88"/><path d="M14.47 14.48L20 20"/><path d="M8.12 8.12L12 12"/></svg>,
  sliders: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  list: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  fileText: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  helpCircle: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  barChart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  messageSquare: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
}

const DEMO_VIDEO_ID = "gmuTjeQUbTM"

const DEMO_SKIP_MAP = [
  { startSeconds: 1, endSeconds: 74},
  { startSeconds: 150, endSeconds: 182 },
  { startSeconds: 205, endSeconds: 265 },
]

const DEMO_QUIZ = [
  { q: 'In CS50, what is the primary purpose of a compiler?', options: ['Translate source code to machine code', 'Run the program directly', 'Edit the source code', 'Manage memory allocation'], answer: 'Translate source code to machine code' },
  { q: 'What data structure uses LIFO (Last In, First Out) ordering?', options: ['Queue', 'Stack', 'Array', 'Hash table'], answer: 'Stack' },
  { q: 'What does a pointer store in C?', options: ['The value of a variable', 'The memory address of a variable', 'The type of a variable', 'The size of a variable'], answer: 'The memory address of a variable' },
  { q: 'Which sorting algorithm has O(n log n) average-case time complexity?', options: ['Bubble sort', 'Selection sort', 'Merge sort', 'Linear sort'], answer: 'Merge sort' },
]

function CondensePage() {
  const [skipMap] = useState<{ startSeconds: number, endSeconds: number }[]>(DEMO_SKIP_MAP)
  const [videoId] = useState(DEMO_VIDEO_ID)
  const [notes, setNotes] = useState<any>(null)
  const [quiz, setQuiz] = useState<any[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [generatingNotes, setGeneratingNotes] = useState(false)
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false)
  const [bottomTab, setBottomTab] = useState<"notes" | "flashcards" | "quiz">("notes")
  const [sidebarTab, setSidebarTab] = useState<"editor" | "chapters">("editor")
  const [condenseMode, setCondenseMode] = useState<string>("none")
  const [customCuts, setCustomCuts] = useState("")
  const [showStats, setShowStats] = useState(false)
  const [chapters] = useState(DEMO_CHAPTERS)
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [flashcardResults, setFlashcardResults] = useState<Map<number, "correct" | "incorrect">>(new Map())
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizResults, setQuizResults] = useState<Map<number, "correct" | "incorrect">>(new Map())
  const [showNotesModal, setShowNotesModal] = useState(false)

  return (
    <div className="min-h-screen w-full bg-[var(--bg-elevated)] text-[var(--fg)]">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* ── Video + Bottom Panel ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-[var(--inverse)]/3 border border-[var(--border-lighter)] rounded-xl p-4">
              <YouTubeSkipper
                videoId={videoId}
                skipMap={skipMap.map(s => ({ from: s.startSeconds, to: s.endSeconds }))}
                showStats={showStats}
              />
            </div>

            {/* ── Bottom panel: Notes / Flashcards / Quiz ── */}
            <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg overflow-hidden">
              {/* Stats row */}
              <div className="flex items-center gap-4 px-4 py-1.5 border-b border-[var(--border-lighter)] bg-[var(--inverse)]/2">
                <span className="text-[10px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] flex items-center gap-1.5 mr-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0EA5E9]">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Condenser AI
                </span>
                <span className="w-px h-2.5 bg-[var(--border-light)]" />
                <span className="text-[10px] text-[var(--fg-muted)] flex items-center gap-1">
                  {icons.barChart}
                  Skip sections
                  <span className="text-[var(--fg)] font-semibold ml-0.5">{skipMap.length}</span>
                </span>
                <span className="w-px h-2.5 bg-[var(--border-light)]" />
                <span className="text-[10px] text-[var(--fg-muted)] flex items-center gap-1">
                  {icons.zap}
                  Mode
                  <span className="text-[var(--fg)] font-semibold ml-0.5 capitalize">{condenseMode.replace(/_/g, ' ')}</span>
                </span>
                <span className="w-px h-2.5 bg-[var(--border-light)]" />
                <span className="text-[10px] text-[var(--fg-muted)] flex items-center gap-1">
                  {icons.scissors}
                  Skip map
                  <span className="text-[var(--fg)] font-semibold ml-0.5">{skipMap.length} sections</span>
                </span>
                <button
                  onClick={() => setShowStats(v => !v)}
                  className="ml-auto text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors border rounded-full p-1 hover:bg-cyan-600 "
                >
                  <svg
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    className={`transition-transform duration-200 ${showStats ? "" : "rotate-180"}`}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>
              <div className="flex border-b border-[var(--border-light)]">
                <button
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative ${
                    bottomTab === "notes" ? "text-[#0EA5E9]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                  onClick={() => {
                    setBottomTab("notes")
                    if (!notes) {
                      setNotes([
                        'Summary: CS50 introduces computer science and programming, starting with binary representation and building up to C programming with memory management.',
                        'Key point 1 — Binary represents all data using only 0s and 1s; each digit is a bit, and 8 bits make a byte capable of storing 256 values.',
                        'Key point 2 — Algorithms like binary search (O(log n)) are exponentially faster than linear search (O(n)) on sorted data.',
                        'Key point 3 — Pointers in C store memory addresses, enabling direct memory manipulation but requiring careful management to avoid leaks and segmentation faults.',
                        'Key point 4 — Data structures like arrays, linked lists, and hash tables each have trade-offs between speed of insertion, deletion, and search.',
                      ])
                    }
                    setShowNotesModal(true)
                  }}
                >
                  {icons.fileText}
                  Notes
                  {bottomTab === "notes" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9]" />}
                </button>
                <button
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative ${
                    bottomTab === "flashcards" ? "text-[#0EA5E9]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                  onClick={() => {
                    setBottomTab("flashcards")
                    if (flashcards.length === 0) {
                      setFlashcards([
                        { front: 'What is the difference between a compiler and an interpreter?', back: 'A compiler translates the entire source code into machine code before execution, while an interpreter translates and executes code line by line.' },
                        { front: 'Explain how a hash table works.', back: 'A hash table uses a hash function to map keys to array indices, enabling O(1) average-case lookup. Collisions are handled via chaining (linked lists) or open addressing.' },
                        { front: 'What is a segmentation fault and what causes it?', back: 'A segmentation fault occurs when a program tries to access memory it does not have permission to access, such as dereferencing a NULL pointer or writing past the end of an array.' },
                        { front: 'What is the difference between malloc and calloc?', back: 'malloc allocates a block of uninitialized memory, while calloc allocates memory and initializes all bytes to zero. calloc also takes two arguments (count and size) instead of one.' },
                      ])
                    }
                    setShowFlashcardModal(true)
                  }}
                >
                  {icons.layers}
                  Flashcards
                  {bottomTab === "flashcards" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9]" />}
                </button>
                <button
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative ${
                    bottomTab === "quiz" ? "text-[#0EA5E9]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                  onClick={() => {
                    setBottomTab("quiz")
                    if (quiz.length === 0) setQuiz(DEMO_QUIZ)
                    setShowQuizModal(true)
                  }}
                >
                  {icons.helpCircle}
                  Quiz
                  {bottomTab === "quiz" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9]" />}
                </button>
              </div>

              <div className="p-5 max-h-72 overflow-y-auto">
                {bottomTab === "notes" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[var(--fg-muted)]">AI-generated lecture notes</span>
                      <button
                        className="text-xs bg-[#0EA5E9] text-black font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                        onClick={() => {
                          if (generatingNotes) return
                          setGeneratingNotes(true)
                          setNotes('Generating notes…')
                          setTimeout(() => {
                            setNotes([
                              'Summary: CS50 covers binary, algorithms, C programming, pointers, and data structures.',
                              'Key point 1 — Binary represents data as sequences of 0s and 1s; 8 bits = 1 byte = 256 possible values.',
                              'Key point 2 — Time complexity (Big O) measures algorithm efficiency; binary search is O(log n), merge sort is O(n log n).',
                              'Key point 3 — C gives direct memory access via pointers; functions like malloc/free must be paired to prevent memory leaks.',
                            ])
                            setGeneratingNotes(false)
                          }, 1000)
                        }}
                      >
                        {generatingNotes ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Generating…</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate</>
                        )}
                      </button>
                    </div>
                    {notes ? (
                      Array.isArray(notes) ? (
                        <div className="space-y-2">
                          {notes.map((n, i) => (
                            <div key={i} className="flex gap-2 text-sm text-[var(--fg-muted)]">
                              <span className="text-[#0EA5E9] shrink-0 mt-1">●</span>
                              <span>{n}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-[var(--fg-muted)]">{notes}</div>
                      )
                    ) : (
                      <div className="text-[var(--fg-dim)] text-sm text-center py-6 flex flex-col items-center gap-2">
                        {icons.fileText}
                        No notes yet.
                      </div>
                    )}
                  </div>
                )}

                {bottomTab === "flashcards" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[var(--fg-muted)]">AI-generated flashcards</span>
                      <button
                        className="text-xs bg-[#0EA5E9] text-black font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                        onClick={() => {
                          if (generatingFlashcards) return
                          setGeneratingFlashcards(true)
                          setTimeout(() => {
                            setFlashcards([
                              { front: 'What is a pointer in C?', back: 'A pointer is a variable that stores the memory address of another variable, enabling direct memory access and manipulation.' },
                              { front: 'Explain the difference between a stack and a queue.', back: 'A stack is LIFO (Last In, First Out) — like a pile of plates. A queue is FIFO (First In, First Out) — like a line of people.' },
                              { front: 'What is a hash collision and how is it resolved?', back: 'A hash collision occurs when two keys hash to the same index. It is resolved via chaining (linked list at each bucket) or open addressing (probing for next empty slot).' },
                              { front: 'What is the Big O notation of binary search?', back: 'Binary search has O(log n) time complexity — it halves the search space with each comparison, making it exponentially faster than linear search O(n) on sorted data.' },
                            ])
                            setGeneratingFlashcards(false)
                          }, 1000)
                        }}
                      >
                        {generatingFlashcards ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Generating…</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate</>
                        )}
                      </button>
                    </div>
                    {flashcards.length ? (
                      <>
                        {flashcardResults.size > 0 && (
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="text-xs text-[var(--fg-muted)] flex items-center gap-1.5">
                              <span className="text-emerald-400">●</span>
                              {flashcards.filter((_, i) => flashcardResults.get(i) === "correct").length} correct
                            </span>
                            <span className="text-xs text-[var(--fg-muted)] flex items-center gap-1.5">
                              <span className="text-red-400">●</span>
                              {flashcards.filter((_, i) => flashcardResults.get(i) === "incorrect").length} incorrect
                            </span>
                            <button
                              onClick={() => setShowFlashcardModal(true)}
                              className="text-xs text-[#0EA5E9] hover:text-[#38BDF8] font-medium transition-colors ml-auto"
                            >
                              Study again
                            </button>
                            {flashcards.some((_, i) => flashcardResults.get(i) === "incorrect") && (
                              <button
                                onClick={() => setShowFlashcardModal(true)}
                                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                              >
                                Review incorrect
                              </button>
                            )}
                          </div>
                        )}
                        <div className="grid gap-3">
                          {flashcards.map((fc, i) => {
                            const result = flashcardResults.get(i)
                            return (
                              <div
                                key={i}
                                className="bg-[var(--bg-card-alt)] border border-[var(--border-light)] rounded-lg p-4 group transition-colors relative"
                              >
                                {result && (
                                  <span className={`absolute top-3 right-3 text-xs font-bold ${result === "correct" ? "text-emerald-400" : "text-red-400"}`}>
                                    {result === "correct" ? "✓" : "✗"}
                                  </span>
                                )}
                                <div className="flex items-center gap-2 text-xs text-[#0EA5E9]/60 font-semibold tracking-wider uppercase mb-1">
                                  {icons.zap}
                                  Front
                                </div>
                                <div className="text-sm font-medium text-[var(--fg)]">{fc.front}</div>
                                <div className="mt-2 pt-2 border-t border-[var(--border-lighter)]">
                                  <div className="flex items-center gap-2 text-xs text-[#0EA5E9]/60 font-semibold tracking-wider uppercase mb-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                    Back
                                  </div>
                                  <div className="text-sm text-[var(--fg-muted)]">{fc.back}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-[var(--fg-dim)] text-sm text-center py-6 flex flex-col items-center gap-2">
                        {icons.layers}
                        No flashcards yet.
                      </div>
                    )}
                  </div>
                )}

                {bottomTab === "quiz" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[var(--fg-muted)]">AI-generated quiz questions</span>
                      <button
                        className="text-xs bg-[#0EA5E9] text-black font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                        onClick={() => {
                          if (generatingQuiz) return
                          setGeneratingQuiz(true)
                          setQuiz(DEMO_QUIZ)
                          setTimeout(() => setGeneratingQuiz(false), 500)
                        }}
                      >
                        {generatingQuiz ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-black/30 border-t-black animate-spin" /> Regenerating…</>
                        ) : (
                          <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Generate</>
                        )}
                      </button>
                    </div>
                    {quiz.length ? (
                      <>
                        {quizResults.size > 0 && (
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="text-xs text-[var(--fg-muted)] flex items-center gap-1.5">
                              <span className="text-emerald-400">●</span>
                              {quiz.filter((_, i) => quizResults.get(i) === "correct").length} correct
                            </span>
                            <span className="text-xs text-[var(--fg-muted)] flex items-center gap-1.5">
                              <span className="text-red-400">●</span>
                              {quiz.filter((_, i) => quizResults.get(i) === "incorrect").length} incorrect
                            </span>
                            <button
                              onClick={() => setShowQuizModal(true)}
                              className="text-xs text-[#0EA5E9] hover:text-[#38BDF8] font-medium transition-colors ml-auto"
                            >
                              Take again
                            </button>
                          </div>
                        )}
                        <div className="space-y-3">
                          {quiz.map((q, i) => {
                            const result = quizResults.get(i)
                            return (
                              <div key={i} className="bg-[var(--bg-card-alt)] border border-[var(--border-light)] rounded-lg p-4 relative">
                                {result && (
                                  <span className={`absolute top-3 right-3 text-xs font-bold ${result === "correct" ? "text-emerald-400" : "text-red-400"}`}>
                                    {result === "correct" ? "✓" : "✗"}
                                  </span>
                                )}
                                <div className="flex items-start gap-2">
                                  <span className="text-[#0EA5E9] text-sm font-bold shrink-0">Q{i + 1}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-[var(--fg)] mb-2">{q.q}</div>
                                    <div className="space-y-1">
                                      {q.options.map((opt: string) => (
                                        <div key={opt} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
                                          opt === q.answer
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                            : result === 'incorrect' && opt === quizResults.get(i) + ''
                                              ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                              : 'bg-[var(--bg-card)] border-[var(--border-lighter)] text-[var(--fg-muted)]'
                                        }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                            opt === q.answer ? 'bg-emerald-400' : 'bg-[var(--fg-dim)]'
                                          }`} />
                                          {opt}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-[var(--fg-dim)] text-sm text-center py-6 flex flex-col items-center gap-2">
                        {icons.helpCircle}
                        No quiz generated.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-[300px] shrink-0 flex flex-col gap-4">
            {/* Brand header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center text-black text-xs font-bold">
            <Image src="/logo.png" alt="Condenser AI"  width={24} height={24} />
              </div>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] uppercase flex items-center gap-1 tracking-widest">
                Condenser AI
              </span>
            </div>
            {/* Editor / Chapters toggle */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-2)] rounded-lg overflow-hidden">
              <div className="flex">
                <button
                  className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    sidebarTab === "editor"
                      ? "text-[var(--fg)] bg-[var(--bg-card-alt)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                  onClick={() => setSidebarTab("editor")}
                >
                  {icons.edit}
                  Editor
                </button>
                <button
                  className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    sidebarTab === "chapters"
                      ? "text-[var(--fg)] bg-[var(--bg-card-alt)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                  onClick={() => setSidebarTab("chapters")}
                >
                  {icons.list}
                  Chapters
                </button>
              </div>
            </div>

            {sidebarTab === "editor" ? (
              <>
                {/* Condensation Modes */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[var(--fg)] mb-3 flex items-center gap-2">
                    {icons.zap}
                    Condensation Mode
                  </h3>
                  <div className="space-y-2">
                    {CONDENSE_MODES.map((mode) => {
                      const selected = condenseMode === mode.value
                      const btn = (
                        <button
                          className={`w-full text-left px-3.5 py-3 rounded-lg border text-sm transition-all flex items-start gap-3 ${
                            selected
                              ? "bg-[var(--bg-featured)] border-transparent text-[var(--fg)]"
                              : "bg-[var(--bg-card-alt)] border-[var(--border-lighter)] text-[var(--fg-muted)] hover:bg-[var(--inverse)]/5 hover:text-[var(--fg)]"
                          }`}
                          onClick={() => setCondenseMode(mode.value)}
                        >
                          <span className={`shrink-0 mt-0.5 ${selected ? "text-[#0EA5E9]" : "text-[var(--fg-dim)]"}`}>
                            {icons[mode.icon as keyof typeof icons]}
                          </span>
                          <div>
                            <div className="font-medium">{mode.label}</div>
                            <div className="text-[11px] text-[var(--fg-muted)] mt-0.5">{mode.desc}</div>
                          </div>
                        </button>
                      )
                      if (selected) {
                        return (
                          <div key={mode.value} className="relative p-[1px] rounded-lg bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#06B6D4] shadow-[0_0_14px_rgba(14,165,233,0.25)]">
                            {btn}
                          </div>
                        )
                      }
                      return btn
                    })}
                  </div>
                </div>

                {/* Suggest Custom Cuts */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[var(--fg)] mb-2 flex items-center gap-2">
                    {icons.messageSquare}
                    Suggest Custom Cuts
                  </h3>
                  <p className="text-[11px] text-[var(--fg-muted)] mb-3">
                    Describe which parts you want to skip or keep
                  </p>
                  <textarea
                    className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-light)] rounded-lg px-3.5 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] resize-none focus:outline-none focus:border-[#0EA5E9]/40 transition-colors"
                    rows={3}
                    placeholder='e.g. "Skip the first 2 minutes of intro" or "Only keep examples"'
                    value={customCuts}
                    onChange={(e) => setCustomCuts(e.target.value)}
                  />
                  <button
                    className="w-full mt-3 bg-[#0EA5E9] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#1EAED9] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    disabled={!customCuts.trim()}
                  >
                    {icons.scissors}
                    Apply Cuts
                  </button>
                </div>
              </>
            ) : (
              /* Chapters tab */
              <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[var(--fg)] mb-3 flex items-center gap-2">
                  {icons.list}
                  Chapters
                </h3>
                <div className="space-y-1">
                  {chapters.map((ch, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-card-alt)] transition-colors text-left group"
                    >
                      <span className="text-xs font-mono text-[var(--fg-muted)] w-12 shrink-0">{ch.timestamp}</span>
                      <span className="flex-1 text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">{ch.title}</span>
                      <span className="text-[10px] text-[var(--fg-dim)]">{ch.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {showFlashcardModal && (
        <FlashcardModal
          flashcards={flashcards}
          results={flashcardResults}
          onResult={(index, result) => {
            setFlashcardResults(prev => {
              const next = new Map(prev)
              next.set(index, result)
              return next
            })
          }}
          onClose={() => setShowFlashcardModal(false)}
        />
      )}

      {showQuizModal && (
        <QuizModal
          questions={quiz}
          results={quizResults}
          onResult={(index, result) => {
            setQuizResults(prev => {
              const next = new Map(prev)
              next.set(index, result)
              return next
            })
          }}
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {showNotesModal && Array.isArray(notes) && (
        <NotesModal
          notes={notes}
          onClose={() => setShowNotesModal(false)}
        />
      )}
    </div>
  )
}

export default CondensePage
