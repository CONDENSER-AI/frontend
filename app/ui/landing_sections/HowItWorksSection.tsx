import { motion } from "motion/react";

function HowItWorksSection() {
  return (
    <section className="py-28 w-full relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] shadow-[0_0_8px_2px_rgba(14,165,233,0.6)]" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#0EA5E9]/80">
              Process
            </span>
          </motion.div>
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white/90">
              How it{" "}
              <span className="bg-gradient-to-r italic pr-1 from-[#7DD3FC] to-[#06B6D4] bg-clip-text text-transparent">
                works
              </span>
            </h2>
          </div>
          <p className="text-white/35 text-base mb-16 font-light -mt-8">Three steps. Seconds to start.</p>

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
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+1px)] w-6 h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
                )}
                <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-[#0EA5E9]/30 hover:bg-white/[0.05] transition-all duration-500">
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
  )
}

export default HowItWorksSection
