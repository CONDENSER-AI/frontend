import { motion } from "motion/react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const navItems = [
    { Features: "#features" },
    { Pricing: "#pricing" },
    { Contact: "#contact" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 left-0 right-0 z-50 transition-all duration-500"
    >
      <div
        className={`mx-auto px-2 py-2 flex items-center justify-between
         backdrop-blur-md rounded-2xl transition-all border border-transparent ease-in duration-200 
        ${isScrolled ? "max-w-xl bg-[var(--card-alpha-2)] border-[var(--border-light)] shadow-[inset_2px_2px_6px_rgba(100,130,246,0.15)]" : "max-w-4xl"}`}
      >
        <span className="text-[var(--fg)] bg-[var(--bg-card)] font-bold border border-[var(--border-light)] px-2 py-1 rounded-full">
          C
        </span>
        <div className="hidden md:flex gap-8 items-center justify-center ml-2">
          {navItems.map((item, index) => {
            const [name, link] = Object.entries(item)[0];
            return (
              <motion.a
                key={index}
                onClick={() => scrollTo({ top: document.querySelector(link)?.getBoundingClientRect().top! + window.scrollY - 80, behavior: "smooth" })}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer transition-colors"
              >
                {name}
              </motion.a>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.a
            href="/signup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white px-6 py-2 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Get Started
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
