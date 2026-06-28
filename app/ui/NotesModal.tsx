"use client"
import { motion, AnimatePresence } from "motion/react"

interface NotesModalProps {
  notes: string[]
  onClose: () => void
}

const icons = {
  fileText: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
}

export default function NotesModal({ notes, onClose }: NotesModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        key="notes"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-lighter)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center">
              {icons.fileText}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--fg)]">Lecture Notes</h2>
              <p className="text-[10px] text-[var(--fg-muted)]">{notes.length} key points</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-3">
          {notes.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 text-sm leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center text-[10px] font-bold text-[#0EA5E9] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[var(--fg-muted)]">{n}</span>
            </motion.div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-[var(--border-lighter)] bg-[var(--bg-card-alt)] flex items-center gap-2">
          <span className="text-[10px] text-[var(--fg-dim)] flex items-center gap-1">
            {icons.zap}
            AI-generated summary
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
