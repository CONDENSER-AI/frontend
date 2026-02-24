import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

function HeroSection() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.97]);
    const [inputFocused, setInputFocused] = useState(false);
    
    const [inputValue, setInputValue] = useState("");
  return (
    <motion.section
        id="home"
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen w-full flex items-center justify-center relative pt-24 pb-16"
      > <div className="absolute inset-0 w-full opacity-10 flex">
      
      {/* LEFT SIDE >>>>> */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <div className="absolute inset-[-40%] rotate-45 flex flex-col gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0, filter: "blur(10px)", y:300}}
              animate={{ opacity: 0.15, scaleX: 1 , filter: "blur(0px)" , y: 0}}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="h-10 w-[200%] bg-white"
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE <<<<< */}
      <div className="relative w-1/2 h-full overflow-hidden">
        <div className="absolute inset-[-40%] -rotate-45 flex flex-col gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0, filter: "blur(10px)", y:300}}
              animate={{ opacity: 0.15, scaleX: 1, filter: "blur(0px)" , y: 0}}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="h-10 w-[200%] bg-white"
            />
          ))}
        </div>
      </div>

    </div>
        <div className="max-w-5xl w-full mx-auto px-6 text-center relative z-10">



          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EA5E9] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0EA5E9]" />
            </span>
            <span className="text-xs font-medium text-white/60 tracking-wide">
              AI-powered lecture compression
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-medium mb-6 tracking-tight leading-[1.0]"
          >
            Condense Long Lectures
            <br />
            <span className="bg-gradient-to-r from-[#7DD3FC] via-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
              into crisp learning
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-white/40 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
             removes pauses, filler,
            and repetition — without losing key concepts.
          </motion.p>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="flex justify-center "
          >
            <div
              className={`relative flex items-center bg-white/15  w-full max-w-2xl rounded-2xl transition-all duration-300 ${
                inputFocused
                  ? "shadow-[0_0_0_1px_rgba(14,165,233,0.5),0_0_40px_rgba(14,165,233,0.12)]"
                  : "shadow-[inset_2px_2px_6px_rgba(100,130,246,0.15)]"
              } backdrop-blur-xl`}
            >
              {/* YouTube icon */}
              <div className="pl-5 pr-3 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/25">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="1.5"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                className="flex-1  py-4 pr-4 text-sm text-white placeholder-white/25 outline-none"
                type="text"
                placeholder="Paste your YouTube lecture link here…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <div className="pr-2 shrink-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden flex items-center gap-2 bg-gradient-to-r from-[#3d98c2] to-[#06B6D4] text-white text-sm font-semibold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  <span className="relative z-10">Condense</span>
                  <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {/* shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
      </motion.section>
  )
}

export default HeroSection