import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

function Navbar() {  const [isScrolled, setIsScrolled] = useState(false);
      useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
  <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-5 left-0 right-0 z-50 transition-all duration-500 
       
        }`}
      >
        <div className="max-w-fit mx-auto px-2 py-2 flex items-center justify-center
        bg-white/10 backdrop-blur-md border border-white/10 rounded-4xl 
        ">
          
          
          <div className="hidden md:flex gap-8 items-center justify-center ml-2">
            {['Home', 'Features', 'Pricing'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -2 }}
                className="text-sm font-semibold hover:text-[#0EA5E9] transition-colors"
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              href="/signup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Get Started
            </motion.a>
          </div>
        </div>
      </motion.nav>
  )
}

export default Navbar