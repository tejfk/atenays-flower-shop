import React from 'react'
import { motion } from 'framer-motion'

export default function FloatingMessenger() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-8 right-8 z-[100]"
        >
            <a
                href="https://m.me/fwenKO"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center"
            >
                {/* Pulsing effect */}
                <span className="absolute inset-0 rounded-full bg-[#00B2FF]/20 animate-ping group-hover:bg-[#00B2FF]/40"></span>

                {/* Tooltip */}
                <div className="absolute right-full mr-4 px-4 py-2 bg-white text-[#00B2FF] text-sm font-bold rounded-xl shadow-xl border border-[#00B2FF]/10 whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                    Chat with Ate Nays 🌸
                </div>

                {/* The Button - Using Messenger SVG */}
                <div className="relative w-16 h-16 bg-[#00B2FF] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,178,255,0.4)] transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_48_rgba(0,178,255,0.6)]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.18 5.51 3.12 7.42V22l2.76-1.52c1.3.36 2.68.56 4.12.56 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.31 12.87l-2.62-2.79-5.11 2.79 5.62-5.96 2.69 2.79 5.03-2.79-5.61 5.96z" />
                    </svg>
                </div>
            </a>
        </motion.div>
    )
}
