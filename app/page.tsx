"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Navbar from "./ui/Navbar";
import { ReactLenis, useLenis } from 'lenis/react'
import HeroSection from "./ui/landing_sections/HeroSection";
// ── Micro: animated gradient border ──────────────────────────────────────────
const GlowBorder = ({ children, className = "", featured = false }) => (
  <div className={`relative ${className}`}>
    {featured && (
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#0EA5E9] via-[#06B6D4] to-[#0EA5E9] opacity-60 blur-[2px]" />
    )}
    <div className="relative">{children}</div>
  </div>
);

// ── Micro: subtle noise grain overlay ────────────────────────────────────────
const GrainOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[999] opacity-[0.09]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px",
    }}
  />
);

// ── Micro: section tag pill ───────────────────────────────────────────────────
const SectionTag = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 mb-6"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] shadow-[0_0_8px_2px_rgba(14,165,233,0.6)]" />
    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0EA5E9]/80">
      {children}
    </span>
  </motion.div>
);

// ── Micro: animated count-up ─────────────────────────────────────────────────
const CountUp = ({ end, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);
  return <span ref={ref}>{val}{suffix}</span>;
};

// ── Thin divider ──────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent my-2" />
);

export default function CondenserLanding() {
  const [currentReview, setCurrentReview] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.97]);

  const reviews = [
    { name: "Ayush", role: "GOAT", text: "Condenser AI saved me hours during exam week. My 1-hour lectures became super quick to revise." },
    { name: "Darsh", role: "Student", text: "The AI Chapters feature is insane. I can jump directly to the topic I need in seconds." },
    { name: "Aryaman", role: "Student", text: "I used to watch lectures on 2x and still waste time. This actually removes the useless parts." },
    { name: "Nikhil", role: "Student", text: "AI Notes are clean and structured. Perfect for quick revision before tests and examinations." },
    { name: "Upanshi", role: "Student", text: "Best tool for backlog completion. I finished 3 lectures in the time it took to watch 1." },
    { name: "Suryanshu", role: "Student", text: "Simple UI, fast results, and the condensed video still keeps all important concepts." },
  ];

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      tag: "Core",
      title: "Condense Long Lectures",
      subtitle: "Into Crisp, High-Value Learning",
      description: "Turn 50+ minute lectures into 15–20 minutes by removing pauses, filler, and repetition — without losing a single key concept.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      tag: "Intelligence",
      title: "AI Notes",
      description: "Get crisp, structured notes from every lecture in seconds — perfect for revision, exams, and quick understanding.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6h16M4 12h8m-8 6h16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      tag: "Navigation",
      title: "AI Chapters",
      description: "Auto-split long lectures into clear, topic-wise chapters with precise timestamps — navigate like a pro.",
    },
  ];

  const stats = [
    { value: 70, suffix: "%", label: "Average time saved" },
    { value: 5000, suffix: "+", label: "Lectures condensed" },
    { value: 98, suffix: "%", label: "Satisfaction rate" },
  ];

  const SectionTitle = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-[1.05]"
      >
        {children}
      </motion.div>
    );
  };

  return (<>

    <ReactLenis root/>
    <div className="flex flex-col items-center bg-[#080808] text-white min-h-screen overflow-x-hidden">
      <GrainOverlay />

 <div className="pointer-events-none fixed inset-0 opacity-5 flex overflow-hidden">
      
      {/* LEFT SIDE */}
      <div className="relative w-1/2 h-full flex justify-end gap-6 pr-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 0.15, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.6 }}
            className="w-2 h-full bg-white"
          />
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-1/2 h-full flex justify-start gap-6 pl-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.15, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.6 }}
            className="w-2 h-full bg-white"
          />
        ))}
      </div>

    </div>


      {/* ── ambient glow ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
       
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[100px] bg-[#FFF]/15 blur-[80px] rounded-full" />
      </div>

      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
     <HeroSection/>

     <hr className="w-full border-white/[0.08]" />
    
    
      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 w-full relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTag>Process</SectionTag>
          <SectionTitle>
            How it{" "}
            <h1 className="bg-gradient-to-r italic pr-1 inline from-[#7DD3FC] to-[#06B6D4] bg-clip-text text-transparent">
              works
            </h1>
          </SectionTitle>
          <p className="text-white/35 text-base mb-16 font-light">Three steps. Seconds to start.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Paste Your Link",
                description: "Upload a video or paste a lecture link. Condenser AI instantly starts processing it for you.",
              },
              {
                step: "02",
                title: "AI Detects & Removes",
                description: "Our AI finds pauses, filler words, and repeated explanations — cutting only the unnecessary parts without breaking flow.",
              },
              {
                step: "03",
                title: "Watch & Learn Faster",
                description: "Get a shorter, cleaner lecture with all key concepts intact. Save time, revise faster, stay consistent.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                {/* connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+1px)] w-6 h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
                )}
                <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-[#0EA5E9]/30 hover:bg-white/[0.05] transition-all duration-500">
                  {/* step number */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-mono font-semibold text-[#0EA5E9]/60 tracking-widest">{item.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center group-hover:bg-[#0EA5E9]/20 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#0EA5E9]/60 group-hover:bg-[#0EA5E9] transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white/90">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
<hr className="w-full border-white/[0.08]" />
      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 w-full relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTag>Features</SectionTag>
          <SectionTitle>
            AI-powered{" "}
            <h1 className="bg-gradient-to-r italic pr-1 inline from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
              capabilities
            </h1>
          </SectionTitle>
          <p className="text-white/35 text-base mb-16 font-light">Everything you need to study smarter.</p>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 md:p-10 hover:border-[#0EA5E9]/25 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                  {/* hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9]/0 to-[#06B6D4]/0 group-hover:from-[#0EA5E9]/[0.03] group-hover:to-[#06B6D4]/[0.03] transition-all duration-700" />

                  <div className="relative flex items-start gap-8">
                    {/* icon box */}
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#06B6D4]/10 border border-[#0EA5E9]/15 flex items-center justify-center text-[#0EA5E9] group-hover:border-[#0EA5E9]/30 transition-colors">
                      {feature.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-[#0EA5E9]/60 tracking-widest uppercase">{feature.tag}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-1 text-white/90">{feature.title}</h3>
                      {feature.subtitle && (
                        <p className="text-sm font-medium text-[#0EA5E9]/70 mb-3">{feature.subtitle}</p>
                      )}
                      <p className="text-white/40 text-sm leading-relaxed max-w-2xl">{feature.description}</p>
                    </div>

                    {/* arrow micro */}
                    <div className="shrink-0 hidden md:flex w-8 h-8 rounded-full border border-white/[0.06] items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(14,165,233,0.6)" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
<hr className="w-full border-white/[0.08]" />
      {/* ══════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 w-full relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTag>Pricing</SectionTag>
          <SectionTitle>
            Plans that{" "}
            <h1 className="bg-gradient-to-r italic pr-1 inline from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
              suit you
            </h1>
          </SectionTitle>
          <p className="text-white/35 text-base mb-16 font-light">Start free. Scale when you're ready.</p>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                name: "Basic",
                price: "Free",
                priceNote: "forever",
                description: "Perfect for students who want quick study help.",
                features: [
                  "Generate AI Notes from any topic",
                  "Get AI Chapters (auto structured)",
                  "Limited daily usage (fair use)",
                ],
                cta: "Get Started",
                link: "/signup",
                featured: false,
              },
              {
                name: "Pro",
                price: "₹199",
                priceNote: "per month",
                description: "For serious learners who want unlimited studying.",
                features: [
                  "Unlimited AI Notes + AI Chapters",
                  "Faster processing + priority access",
                  "Export notes (PDF / copy format)",
                ],
                cta: "Get Pro",
                link: "/pricing",
                featured: true,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="relative"
              >
                <GlowBorder featured={plan.featured}>
                  <div
                    className={`relative h-full rounded-3xl p-8 overflow-hidden ${
                      plan.featured
                        ? "bg-[#0A1628] border border-[#0EA5E9]/20"
                        : "bg-white/[0.03] border border-white/[0.07]"
                    }`}
                  >
                    {plan.featured && (
                      <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#0EA5E9]/60 to-transparent" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[40px] bg-[#0EA5E9]/10 blur-xl" />
                      </>
                    )}

                    {plan.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}

                    <h3 className="text-base font-semibold text-white/60 mb-6">{plan.name}</h3>

                    <div className="mb-1 flex items-end gap-2">
                      <span className={`text-4xl font-black ${plan.featured ? "bg-gradient-to-r from-[#7DD3FC] to-[#06B6D4] bg-clip-text text-transparent" : "text-white"}`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-white/30 text-xs mb-4">{plan.priceNote}</p>
                    <p className="text-white/45 text-sm mb-8 leading-relaxed">{plan.description}</p>

                    <div className="h-px w-full bg-white/[0.06] mb-8" />

                    <div className="space-y-4 mb-10">
                      {plan.features.map((feature, fi) => (
                        <motion.div
                          key={fi}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15 + fi * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.featured ? "bg-[#0EA5E9]/20" : "bg-white/[0.06]"}`}>
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke={plan.featured ? "#0EA5E9" : "rgba(255,255,255,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-white/55 text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.a
                      href={plan.link}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative overflow-hidden block text-center py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        plan.featured
                          ? "bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white"
                          : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1] border border-white/[0.08]"
                      }`}
                    >
                      {plan.featured && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 2 }}
                        />
                      )}
                      <span className="relative z-10">{plan.cta}</span>
                    </motion.a>
                  </div>
                </GlowBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
<hr className="w-full border-white/[0.08]" />
      {/* ══════════════════════════════════════════════════════
          REVIEWS
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 w-full relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <SectionTag>Testimonials</SectionTag>
          <SectionTitle>
            What people{" "}
            <h1 className="bg-gradient-to-r italic pr-1 inline from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
              think
            </h1>
          </SectionTitle>
          <p className="text-white/35 text-base mb-16 font-light">From students who've reclaimed their time.</p>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-10 md:p-14"
              >  
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#0EA5E9]/60 to-transparent" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[40px] bg-[#0EA5E9]/5 blur-xl" />

                       
                      
                {/* quote mark */}
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="mb-8 opacity-30">
                  <path d="M0 24V14.4C0 6.08 4.48 1.28 13.44 0l1.44 2.4C10.24 3.52 7.68 6.08 7.04 10.56H13.44V24H0ZM18.56 24V14.4C18.56 6.08 23.04 1.28 32 0l1.44 2.4C28.8 3.52 26.24 6.08 25.6 10.56H32V24H18.56Z" fill="#0EA5E9"/>
                </svg>
                <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-10">
                  {reviews[currentReview].text}
                </p>
                <div className="flex items-center gap-4">
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center font-bold text-sm">
                    {reviews[currentReview].name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{reviews[currentReview].name}</div>
                    <div className="text-xs text-white/35">{reviews[currentReview].role}</div>
                  </div>
                  {/* stars */}
                  <div className="ml-auto flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#0EA5E9" opacity="0.7">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              {/* dots */}
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentReview ? "w-8 bg-[#0EA5E9]" : "w-2 bg-white/15"
                    }`}
                  />
                ))}
              </div>

              {/* nav */}
              <div className="flex gap-3">
                {[
                  { fn: () => setCurrentReview(p => (p - 1 + reviews.length) % reviews.length), dir: "left" },
                  { fn: () => setCurrentReview(p => (p + 1) % reviews.length), dir: "right" },
                ].map(({ fn, dir }) => (
                  <motion.button
                    key={dir}
                    onClick={fn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-center hover:border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                      {dir === "left"
                        ? <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                        : <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>}
                    </svg>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
<hr className="w-full border-white/[0.08]" />
      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 w-full relative z-10">

        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden border border-[#0EA5E9]/15 bg-[#0A1628] p-14 md:p-20 text-center"
          >
            {/* glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px] bg-gradient-to-r from-transparent via-[#0EA5E9]/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-[#0EA5E9]/10 blur-2xl" />

            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0EA5E9]/60 mb-6">Start Today</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Stop wasting time.<br />
              <span className="bg-gradient-to-r italic pr-1 inline from-[#7DD3FC] to-[#06B6D4] bg-clip-text text-transparent">
                Start learning faster.
              </span>
            </h1>
            <p className="text-white/35 text-base mb-10 max-w-xl mx-auto font-light">
              Join thousands of students who've reclaimed hours every week with Condenser AI.
            </p>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white font-semibold px-8 py-4 rounded-xl text-sm"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1.5 }}
              />
              <span className="relative z-10">Get started for free</span>
              <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
<hr className="w-full border-white/[0.08]" />
      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-white/[0.06] py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-lg font-black mb-3">
                Condenser{" "}
                <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">
                  AI
                </span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-[220px]">
                Turn 50+ minute lectures into crisp, high-value learning sessions.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-5">Navigation</h4>
              <div className="space-y-3">
                {["Home", "Features", "Pricing", "Contact Us"].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="block text-white/35 hover:text-[#0EA5E9] transition-colors text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-5">Legal</h4>
              <div className="space-y-3">
                {["Privacy Policy", "Terms of Service"].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-white/35 hover:text-[#0EA5E9] transition-colors text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white/20 text-xs">© 2026 Condenser AI. All rights reserved.</span>
            <div className="flex items-center gap-1.5 text-white/15 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 inline-block" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div></>
  );
}