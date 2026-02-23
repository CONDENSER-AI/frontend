"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type SkipSection = {
  from: number
  to: number
}

type Props = {
  videoId: string
  skipMap: SkipSection[]
}

// ── Grain overlay (same as landing) ──────────────────────────────────────────
const GrainOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] rounded-2xl overflow-hidden"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px",
    }}
  />
)

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function YouTubeSkipper({ videoId, skipMap }: Props) {
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [skipCount, setSkipCount] = useState(0)
  const [lastSkipToast, setLastSkipToast] = useState<string | null>(null)
  const [timeSaved, setTimeSaved] = useState(0)
  const toastTimeoutRef = useRef<any>(null)

  // Calculate total skippable seconds
  const totalSkippable = skipMap.reduce((acc, s) => acc + (s.to - s.from), 0)

  useEffect(() => {
    // @ts-expect-error - YT types
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(tag)
    }

    // @ts-expect-error - YT types
    window.onYouTubeIframeAPIReady = () => {
      // @ts-expect-error - YT types
      playerRef.current = new YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
        },
      })
    }

    return () => {
      clearInterval(intervalRef.current)
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  const onPlayerReady = () => {
    setIsReady(true)
    intervalRef.current = setInterval(() => {
      const player = playerRef.current
      if (!player || typeof player.getCurrentTime !== "function") return

      const currentTime = player.getCurrentTime()

      for (const section of skipMap) {
        if (currentTime >= section.from && currentTime < section.to) {
          const saved = section.to - section.from
          player.seekTo(section.to, true)

          // Update state
          setSkipCount((c) => c + 1)
          setTimeSaved((t) => t + saved)

          // Toast
          const msg = `Skipped ${formatTime(saved)} of filler`
          setLastSkipToast(msg)
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
          toastTimeoutRef.current = setTimeout(() => setLastSkipToast(null), 2800)
          break
        }
      }
    }, 300)
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-4 my-20 pt-60">

      {/* ── Video frame ─────────────────────────────────────────────────────── */}
      <div className="relative group">
        {/* outer glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 via-transparent to-[#06B6D4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px]" />

        {/* player wrapper */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.07] bg-black shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
          <GrainOverlay />

          {/* Loading shimmer */}
          <AnimatePresence>
            {!isReady && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-20 bg-[#080808] flex flex-col items-center justify-center gap-4"
              >
                {/* spinner ring */}
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-t border-[#0EA5E9]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-white/30 text-xs tracking-widest uppercase font-medium">
                  Initialising player
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* YouTube iframe */}
          <div id="yt-player" className="w-full h-full" />

          {/* ── Skip toast ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {lastSkipToast && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-[#0A1628]/90 border border-[#0EA5E9]/25 backdrop-blur-xl rounded-full px-4 py-2 shadow-xl"
              >
                {/* pulse dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5E9] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EA5E9]" />
                </span>
                {/* lightning icon */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#0EA5E9" opacity="0.8">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span className="text-white/80 text-xs font-medium whitespace-nowrap">
                  {lastSkipToast}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* top-left badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/50 border border-white/[0.08] backdrop-blur-md rounded-full px-3 py-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#0EA5E9">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span className="text-[10px] font-semibold text-white/60 tracking-wide uppercase">
              AI Skip Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          {
            label: "Skips fired",
            value: skipCount,
            suffix: "",
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
          },
          {
            label: "Time saved",
            value: formatTime(timeSaved),
            suffix: "",
            raw: true,
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinecap="round"/>
              </svg>
            ),
          },
          {
            label: "Skippable",
            value: formatTime(totalSkippable),
            suffix: " total",
            raw: true,
            icon: (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 3v18" strokeLinecap="round"/>
              </svg>
            ),
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 8 }}
            transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
            className="relative group bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3.5 hover:border-[#0EA5E9]/20 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden"
          >
            {/* hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/0 to-transparent group-hover:from-[#0EA5E9]/[0.04] transition-all duration-500" />
            <div className="relative flex items-center gap-2 mb-1.5">
              <span className="text-[#0EA5E9]/50 group-hover:text-[#0EA5E9]/80 transition-colors">
                {stat.icon}
              </span>
              <span className="text-[10px] text-white/30 font-medium tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
            <div className="text-xl font-black text-white/85">
              {stat.raw ? stat.value : (
                <motion.span key={stat.value}>
                  {stat.value}
                </motion.span>
              )}
              {stat.suffix && (
                <span className="text-xs font-normal text-white/25 ml-0.5">{stat.suffix}</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Skip map timeline ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 8 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] shadow-[0_0_6px_2px_rgba(14,165,233,0.5)]" />
            <span className="text-[10px] font-semibold text-white/40 tracking-widest uppercase">
              Skip Map
            </span>
          </div>
          <span className="text-[10px] text-white/25 font-mono">
            {skipMap.length} section{skipMap.length !== 1 ? "s" : ""} configured
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {skipMap.map((section, i) => {
            const duration = section.to - section.from
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isReady ? 1 : 0, x: isReady ? 0 : -10 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3 group"
              >
                {/* index */}
                <span className="text-[10px] font-mono text-white/20 w-4 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* bar */}
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full origin-left bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] rounded-full"
                  />
                </div>

                {/* range */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-white/35">{formatTime(section.from)}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[10px] font-mono text-white/35">{formatTime(section.to)}</span>
                </div>

                {/* duration pill */}
                <span className="text-[9px] font-semibold text-[#0EA5E9]/60 bg-[#0EA5E9]/10 border border-[#0EA5E9]/15 rounded-full px-2 py-0.5 shrink-0">
                  −{formatTime(duration)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

    </div>
  )
}