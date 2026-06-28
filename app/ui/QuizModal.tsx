"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface QuizQuestion {
  q: string
  options: string[]
  answer: string
}

interface QuizModalProps {
  questions: QuizQuestion[]
  results: Map<number, "correct" | "incorrect">
  onResult: (index: number, result: "correct" | "incorrect") => void
  onClose: () => void
}

export default function QuizModal({ questions, results, onResult, onClose }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const question = questions[currentIndex]
  const totalQs = questions.length
  const allReviewed = questions.every((_, i) => results.has(i))
  const correctCount = questions.filter((_, i) => results.get(i) === "correct").length
  const incorrectCount = questions.filter((_, i) => results.get(i) === "incorrect").length

  useEffect(() => {
    setSelectedOption(null)
    setShowFeedback(false)
  }, [currentIndex])

  if (!question) return null

  const handleOption = (option: string) => {
    if (showFeedback) return
    setSelectedOption(option)
    setShowFeedback(true)
    const correct = option === question.answer
    onResult(currentIndex, correct ? "correct" : "incorrect")
  }

  const goNext = () => {
    if (currentIndex < totalQs - 1) setCurrentIndex(i => i + 1)
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < totalQs - 1

  const arrowBtn = "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-20 disabled:cursor-not-allowed"

  const optionBtn = (opt: string) => {
    const isSelected = selectedOption === opt
    const isCorrect = opt === question.answer
    let cls = "w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all"

    if (!showFeedback) {
      cls += " bg-[var(--bg-card-alt)] border-[var(--border-light)] text-[var(--fg)] hover:border-[#0EA5E9]/40 hover:bg-[var(--bg-card)]"
    } else if (isCorrect) {
      cls += " bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
    } else if (isSelected) {
      cls += " bg-red-500/15 border-red-500/40 text-red-300"
    } else {
      cls += " bg-[var(--bg-card-alt)] border-[var(--border-lighter)] text-[var(--fg-muted)]"
    }

    return (
      <button
        key={opt}
        onClick={() => handleOption(opt)}
        disabled={showFeedback}
        className={cls}
      >
        <span className="flex items-center gap-3">
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
            !showFeedback
              ? "border-[var(--border-light)] text-[var(--fg-dim)]"
              : isCorrect
                ? "border-emerald-400 bg-emerald-400/20 text-emerald-400"
                : isSelected
                  ? "border-red-400 bg-red-400/20 text-red-400"
                  : "border-[var(--border-lighter)] text-[var(--fg-dim)]"
          }`}>
            {isCorrect && showFeedback ? "✓" : isSelected && showFeedback ? "✗" : ""}
          </span>
          <span>{opt}</span>
        </span>
      </button>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex flex-col items-center w-full max-w-lg px-4">
        <button
          onClick={onClose}
          className="self-end mb-3 text-white/40 hover:text-white transition-colors p-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {allReviewed && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-8 w-full max-w-md text-center"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                correctCount === totalQs
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                  : "bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4]"
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                  {correctCount === totalQs ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  )}
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[var(--fg)] mb-1">Quiz Complete</h2>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] my-3">
                {correctCount} / {totalQs}
              </div>
              <p className="text-sm text-[var(--fg-muted)] mb-6">
                {correctCount === totalQs
                  ? "Perfect score!"
                  : `${incorrectCount} question${incorrectCount !== 1 ? "s" : ""} to review`}
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#0EA5E9] text-black font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-[#38BDF8] transition-all"
              >
                Close
              </button>
            </motion.div>
          )}

          {!allReviewed && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="text-sm text-[var(--fg-muted)] mb-4 font-medium text-center">
                {currentIndex + 1} / {totalQs}
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
                <div className="flex items-center gap-2 text-[10px] text-[#0EA5E9]/50 font-semibold tracking-widest uppercase mb-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Question
                </div>
                <p className="text-base font-medium text-[var(--fg)] leading-relaxed mb-5">
                  {question.q}
                </p>
                <div className="space-y-2">
                  {question.options.map(optionBtn)}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className={`${arrowBtn} text-[var(--fg-muted)] hover:text-[var(--fg)]`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Prev
                </button>

                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className={`${arrowBtn} text-[var(--fg-muted)] hover:text-[var(--fg)]`}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
