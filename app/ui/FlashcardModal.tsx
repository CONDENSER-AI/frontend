"use client"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"

interface FlashcardModalProps {
  flashcards: { front: string; back: string }[]
  results: Map<number, "correct" | "incorrect">
  onResult: (index: number, result: "correct" | "incorrect") => void
  onClose: () => void
}

export default function FlashcardModal({ flashcards, results, onResult, onClose }: FlashcardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [reviewIndices, setReviewIndices] = useState<number[] | null>(null)

  const activeIndices = reviewIndices ?? flashcards.map((_, i) => i)
  const totalCards = activeIndices.length
  const originalIndex = activeIndices[currentIndex]
  const card = flashcards[originalIndex]

  const allReviewed = activeIndices.every(i => results.has(i))
  const correctCount = activeIndices.filter(i => results.get(i) === "correct").length
  const incorrectCount = activeIndices.filter(i => results.get(i) === "incorrect").length
  const hasIncorrect = flashcards.some((_, i) => results.get(i) === "incorrect")

  const startReview = () => {
    const incorrect = flashcards.map((_, i) => i).filter(i => results.get(i) === "incorrect")
    setReviewIndices(incorrect)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const closeReview = () => {
    setReviewIndices(null)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const goNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(i => i + 1)
      setIsFlipped(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setIsFlipped(false)
    }
  }

  const handleCorrect = () => onResult(originalIndex, "correct")
  const handleIncorrect = () => onResult(originalIndex, "incorrect")

  if (!card) return null

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < totalCards - 1

  const arrowBtn = "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex flex-col items-center w-full max-w-lg px-4">
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {reviewIndices && (
            <button
              onClick={closeReview}
              className="text-xs text-[#0EA5E9] hover:text-[#38BDF8] transition-colors font-medium"
            >
              Back to all cards
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {allReviewed && !reviewIndices && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-8 w-full max-w-md text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[var(--fg)] mb-1">Review Complete</h2>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] my-3">
                {correctCount} / {totalCards}
              </div>
              <p className="text-sm text-[var(--fg-muted)] mb-6">
                {correctCount === totalCards
                  ? "Perfect score!"
                  : `${incorrectCount} card${incorrectCount !== 1 ? "s" : ""} to review`}
              </p>
              <div className="flex flex-col gap-2">
                {hasIncorrect && (
                  <button
                    onClick={startReview}
                    className="w-full bg-[#0EA5E9] text-black font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-[#38BDF8] transition-all flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                    Review Incorrect ({incorrectCount})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full border border-[var(--border-light)] text-[var(--fg-muted)] hover:text-[var(--fg)] font-medium px-4 py-2.5 rounded-lg text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}

          {(!allReviewed || reviewIndices) && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center w-full"
            >
              <div className="text-sm text-[var(--fg-muted)] mb-3 font-medium">
                {currentIndex + 1} / {totalCards}
              </div>

              <div
                className="relative w-full max-w-md cursor-pointer select-none"
                style={{ perspective: 1000, aspectRatio: "3 / 2" }}
                onClick={() => setIsFlipped(v => !v)}
              >
                <motion.div
                  className="w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] p-7 flex flex-col"
                    style={{ backfaceVisibility: "hidden" as any }}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-[#0EA5E9]/50 font-semibold tracking-widest uppercase mb-3">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Question
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-base font-medium text-[var(--fg)] leading-relaxed text-center">
                        {card.front}
                      </p>
                    </div>
                    <div className="text-[10px] text-[var(--fg-dim)] text-center mt-2">
                      Tap to reveal answer
                    </div>
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl bg-[var(--bg-card-alt)] border border-[#0EA5E9]/20 p-7 flex flex-col"
                    style={{ backfaceVisibility: "hidden" as any, transform: "rotateY(180deg)" }}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-[#0EA5E9]/50 font-semibold tracking-widest uppercase mb-3">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      Answer
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-sm text-[var(--fg-muted)] leading-relaxed text-center">
                        {card.back}
                      </p>
                    </div>
                    <div className="text-[10px] text-[var(--fg-dim)] text-center mt-2">
                      Tap to see question
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  disabled={!hasPrev}
                  className={`${arrowBtn} text-[var(--fg-muted)] hover:text-[var(--fg)]`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Prev
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleIncorrect() }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-red-500/15 text-red-400 hover:bg-red-500/25"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Incorrect
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleCorrect() }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Correct
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  disabled={!hasNext}
                  className={`${arrowBtn} text-[var(--fg-muted)] hover:text-[var(--fg)]`}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {results.has(originalIndex) && (
                <div className="mt-2 text-xs text-[var(--fg-dim)]">
                  {results.get(originalIndex) === "correct" ? "Marked correct" : "Marked incorrect"}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
