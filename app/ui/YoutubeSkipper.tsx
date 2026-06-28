"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
type SkipSection = {
  from: number
  to: number
}

type Props = {
  videoId: string
  skipMap: SkipSection[]
  showStats: boolean
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

export default function YouTubeSkipper({ videoId, skipMap, showStats }: Props) {
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [skipCount, setSkipCount] = useState(0)
  const [lastSkipToast, setLastSkipToast] = useState<{ msg: string; from: number; to: number; duration: number } | null>(null)
  const [timeSaved, setTimeSaved] = useState(0)
  const toastTimeoutRef = useRef<any>(null)

  // Calculate total skippable seconds
  const totalSkippable = skipMap.reduce((acc, s) => acc + (s.to - s.from), 0)

  useEffect(() => {
    // Only attempt to create/load player when we have a videoId
    if (!videoId) return

    const setupPlayer = () => {
      const YT = (window as any).YT
      if (!YT || !YT.Player) return

      // If player already exists, load new video id
      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        try {
          playerRef.current.loadVideoById(videoId)
          setIsReady(true)
        } catch (e) {
          // ignore
        }
        return
      }

      // Create new player
      try {
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
      } catch (e) {
        // ignore
      }
    }

    // If YT script not loaded, inject and set callback
    if (!(window as any).YT || !(window as any).YT.Player) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(tag)
      ;(window as any).onYouTubeIframeAPIReady = setupPlayer
    } else {
      setupPlayer()
    }

    return () => {
      clearInterval(intervalRef.current)
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
      // destroy player instance when component unmounts
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try { playerRef.current.destroy() } catch (e) {}
        playerRef.current = null
      }
    }
  }, [videoId])

  const onPlayerReady = () => {
    setIsReady(true)
    // try to start playback (autoplay may be blocked by browser policies)
    try {
      if (playerRef.current && typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo()
      }
    } catch (e) {
      // ignore
    }
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

          // Overlay
          setLastSkipToast({ msg: `Skipped ${formatTime(saved)}`, from: section.from, to: section.to, duration: saved })
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
          toastTimeoutRef.current = setTimeout(() => setLastSkipToast(null), 2200)
          break
        }
      }
    }, 300)
  }


  return (
    <div className="w-full flex flex-col gap-4">

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

          {/* ── Skip overlay ──────────────────────────────────────────────── */}
          <AnimatePresence>
            {lastSkipToast && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex flex-col items-center gap-3 bg-black/70 border border-[#0EA5E9]/20 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-[0_0_40px_rgba(14,165,233,0.15)]"
                >
                  {/* lightning icon */}
                  <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/25 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0EA5E9">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>

                  <div className="text-center">
                    <p className="text-white/90 text-sm font-semibold">{lastSkipToast.msg}</p>
                    <p className="text-white/40 text-[11px] mt-1 font-mono">
                      {formatTime(lastSkipToast.from)} → {formatTime(lastSkipToast.to)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#0EA5E9]/60 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
                    Skipping filler content
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* top-left badge */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/50 border border-white/[0.08] backdrop-blur-md rounded-full px-3 py-1">
           <Image src="/logo.png" alt="Condenser AI" width={12} height={12} />
            <span className="text-[10px] font-semibold text-white/60 tracking-wide uppercase">
            Condenser AI
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats + Skip map (toggleable) ─────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 overflow-hidden"
          >
          <div className="grid grid-cols-3 gap-3">
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
      </div>{/* end stats grid */}

          {/* ── Skip map timeline ──────────────────────────────────────────── */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4">
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
                  <div
                    key={i}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-[10px] font-mono text-white/20 w-4 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full origin-left bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] rounded-full"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-white/35">{formatTime(section.from)}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[10px] font-mono text-white/35">{formatTime(section.to)}</span>
                    </div>

                    <span className="text-[9px] font-semibold text-[#0EA5E9]/60 bg-[#0EA5E9]/10 border border-[#0EA5E9]/15 rounded-full px-2 py-0.5 shrink-0">
                      −{formatTime(duration)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  )
}