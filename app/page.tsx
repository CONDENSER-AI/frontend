'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import Navbar from './ui/Navbar';

export default function CondenserLanding() {
  const [currentReview, setCurrentReview] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);



  const reviews = [
    {
      name: "Chirag",
      role: "Student",
      text: "Condenser AI saved me hours during exam week. My 1-hour lectures became super quick to revise.",
    },
    {
      name: "Darsh",
      role: "Student",
      text: "The AI Chapters feature is insane. I can jump directly to the topic I need in seconds.",
    },
    {
      name: "Aryaman",
      role: "Student",
      text: "I used to watch lectures on 2x and still waste time. This actually removes the useless parts.",
    },
    {
      name: "Nikhil",
      role: "Student",
      text: "AI Notes are clean and structured. Perfect for quick revision before tests and examinations.",
    },
    {
      name: "Upanshi",
      role: "Student",
      text: "Best tool for backlog completion. I finished 3 lectures in the time it took to watch 1.",
    },
    {
      name: "Suryanshu",
      role: "GOAT",
      text: "Simple UI, fast results, and the condensed video still keeps all important concepts.",
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Condense Long Lectures",
      subtitle: "Into Crisp, High-Value Learning",
      description: "Turn 50+ minute lectures into 15–20 minutes by removing pauses, filler, and repetition without losing key concepts.",
    },
    {
      icon: "📝",
      title: "AI Notes",
      description: "Get crisp, structured notes from every lecture in seconds — perfect for revision, exams, and quick understanding.",
    },
    {
      icon: "📚",
      title: "AI Chapters",
      description: "Auto split long lectures into clear topic wise chapters with timestamps.",
    },
  ];

  const galleryVideos = [
    { id: 1, title: "Physics Lecture", duration: "15:32", views: "1.2k" },
    { id: 2, title: "Calculus Basics", duration: "12:45", views: "890" },
    { id: 3, title: "Chemistry 101", duration: "18:20", views: "2.1k" },
    { id: 4, title: "Biology Review", duration: "14:15", views: "1.5k" },
    { id: 5, title: "History Notes", duration: "16:40", views: "980" },
    { id: 6, title: "Economics", duration: "13:25", views: "1.8k" },
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const SectionTitle = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
      >
        {children}
      </motion.h2>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#171717] via-[#000000] to-[#040404] text-white min-h-screen overflow-x-hidden">
      {/* Navigation */}
    <Navbar />

<span className='w-[60%] h-[20%] absolute top-0 bg-blue-500 blur-[100px]'></span>

<span className='w-[40%] h-[20%] absolute top-0 bg-blue-200 blur-[100px]'></span>
      {/* Hero Section */}
      <motion.section
        id="home"
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      >
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-6xl  mb-6 tracking-tighter leading-[0.9]"
          >
           Condense Long Lectures  <br /><i>into Crisp, High-Value Learning</i>
        
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl  text-stone-300/80 mb-12 max-w-3xl mx-auto font-light"
          >
           Turn 50+ minute lectures into 15–20 minutes 
            <br />
            by removing pauses, filler, and repetition without losing key concepts.
          </motion.p>

          <motion.a
            href="/signup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white px-12 py-5 rounded-full font-black text-lg hover:from-[#06B6D4] hover:to-[#0EA5E9] transition-all shadow-2xl shadow-cyan-500/30"
          >
            Click here to start
          </motion.a>

          {/* Floating Elements */}
          {/* <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 border-4 border-cyan-400/30 rounded-lg backdrop-blur-sm bg-white/5"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-32 h-32 border-4 border-sky-400/20 rounded-full backdrop-blur-sm bg-white/5"
          /> */}
        </div>
      </motion.section>

      {/* How It Works */}
      {/* <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <SectionTitle>
            How it <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">works</span>
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-cyan-100/70 mb-20 font-light"
          >
            in 3 simple steps
          </motion.p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Paste Your Lecture Link',
                description: 'Upload a video or paste a lecture link. Condenser AI instantly starts processing it for you.',
              },
              {
                step: '02',
                title: 'AI Detects What to Remove',
                description: 'Our AI finds pauses, filler words, and repeated explanations. Then it cuts only the unnecessary parts without breaking flow.',
              },
              {
                step: '03',
                title: 'Get Your Condensed Lecture',
                description: 'Watch a shorter, cleaner lecture with all key concepts intact. Save time, revise faster, and stay consistent every day.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-cyan-400/20 p-8 rounded-3xl hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
                  <div className="text-7xl font-black bg-gradient-to-br from-cyan-400/30 to-blue-500/30 bg-clip-text text-transparent mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-cyan-100/70 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features */}
      {/* <section id="features" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>
            AI Powered <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">Features</span>
          </SectionTitle>

          <div className="space-y-8 mt-20">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-cyan-400/20 p-12 rounded-3xl hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="text-6xl"
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-black mb-2">{feature.title}</h3>
                      {feature.subtitle && (
                        <h4 className="text-xl bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent font-bold mb-4">{feature.subtitle}</h4>
                      )}
                      <p className="text-cyan-100/70 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Gallery */}
      {/* <section id="gallery" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <SectionTitle>
            Discover <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">More</span>
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-cyan-100/70 mb-20 font-light"
          >
            Not sure where to start? Explore a gallery full of stunning AI generated content from other users.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-cyan-400/30 rounded-2xl overflow-hidden hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-500">
                  <div className="aspect-video bg-gradient-to-br from-[#003d66] to-[#002b4d] flex items-center justify-center relative">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-16 h-16 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50"
                    >
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                    </motion.div>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-cyan-400/20">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 backdrop-blur-sm">
                    <h4 className="font-bold mb-2">{video.title}</h4>
                    <p className="text-sm text-cyan-100/60">{video.views} views</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Pricing */}
      {/* <section id="pricing" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <SectionTitle>
            Plans That <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">Suit You</span>
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-cyan-100/70 mb-20 font-light"
          >
            Pricing
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Basic',
                price: 'Free',
                description: 'Perfect for students who want quick study help.',
                features: [
                  'Generate AI Notes from any topic',
                  'Get AI Chapters (auto structured)',
                  'Limited daily usage (fair use)',
                ],
                cta: 'Get Started',
                link: '/signup',
              },
              {
                name: 'Pro',
                price: '₹199/month',
                description: 'For serious learners who want faster + unlimited studying',
                features: [
                  'Unlimited AI Notes + AI Chapters',
                  'Faster processing + priority access',
                  'Export notes (PDF / copy format)',
                ],
                cta: 'Get Started',
                link: '/pricing',
                featured: true,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="relative group"
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-cyan-500/50">
                    POPULAR
                  </div>
                )}
                <div
                  className={`relative h-full bg-white/10 backdrop-blur-xl border ${
                    plan.featured ? 'border-cyan-400/50 shadow-xl shadow-cyan-500/20' : 'border-cyan-400/20'
                  } p-10 rounded-3xl hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-500`}
                >
                  <h3 className="text-3xl font-black mb-2">{plan.name}</h3>
                  <p className="text-cyan-100/70 mb-6">{plan.description}</p>
                  <div className="text-5xl font-black mb-8 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">{plan.price}</div>
                  
                  <div className="space-y-4 mb-10">
                    <div className="font-bold text-sm text-cyan-100/60 mb-4">Features:</div>
                    {plan.features.map((feature, fi) => (
                      <motion.div
                        key={fi}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + fi * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-cyan-100/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.a
                    href={plan.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`block text-center py-4 rounded-full font-bold transition-all ${
                      plan.featured
                        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white hover:shadow-lg hover:shadow-cyan-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-cyan-400/30'
                    }`}
                  >
                    {plan.cta}
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Reviews */}
      {/* <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <SectionTitle>
            What people <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">think</span>
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-cyan-100/70 mb-20 font-light"
          >
            Reviews
          </motion.p>

          <div className="relative">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/10 backdrop-blur-xl border border-cyan-400/30 p-12 rounded-3xl shadow-xl shadow-cyan-500/10"
            >
              <div className="text-6xl bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent mb-6">"</div>
              <p className="text-2xl font-light mb-8 leading-relaxed">{reviews[currentReview].text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/50">
                  {reviews[currentReview].name[0]}
                </div>
                <div>
                  <div className="font-bold">{reviews[currentReview].name}</div>
                  <div className="text-sm text-cyan-100/60">{reviews[currentReview].role}</div>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                onClick={prevReview}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(14, 165, 233, 0.2)' }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    whileHover={{ scale: 1.2 }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentReview ? 'bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] w-8 shadow-lg shadow-cyan-500/50' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextReview}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(14, 165, 233, 0.2)' }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-full flex items-center justify-center hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-cyan-400/20 py-12 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-2xl font-black mb-4">
                Condenser <span className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent">AI</span>
              </div>
              <p className="text-cyan-100/60 text-sm">
                Turn 50+ minute lectures into crisp, high-value learning sessions.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'Features', 'Gallery', 'Pricing', 'Contact Us'].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="block text-cyan-100/60 hover:text-[#0EA5E9] transition-colors text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2">
                {['Privacy Policy', 'Terms of Service'].map((link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="block text-cyan-100/60 hover:text-[#0EA5E9] transition-colors text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-400/20 pt-8 text-center text-cyan-100/60 text-sm">
            © 2026 Condenser AI
          </div>
        </div>
      </footer>
    </div>
  );
}