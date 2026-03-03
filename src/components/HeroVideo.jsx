import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import heroVideo from '../assets/videos/Bloomie.mp4'

export default function HeroVideo() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.5
            }
        }
    }

    const childVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }
    }

    return (
        <div className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#1a1a1a]">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60"
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                preload="metadata"
                style={{ backgroundColor: '#1a1a1a' }}
            />

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] z-15"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pt-20 pb-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto flex flex-col items-center"
                >
                    <motion.h1
                        variants={childVariants}
                        className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-serif text-white mb-8 md:mb-10 leading-none drop-shadow-2xl select-none"
                    >
                        Ate <span className="text-grad-top" style={{ color: '#FF8A8A' }}>Nays</span><br />
                        <span className="italic font-light text-white/80 text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] sm:tracking-widest mt-4 block">Flower Crafts</span>
                    </motion.h1>

                    <motion.p
                        variants={childVariants}
                        className="text-lg md:text-2xl text-white/70 max-w-2xl mb-16 font-light leading-relaxed drop-shadow-md tracking-wider"
                    >
                        "Your Flower Crafter." Crafting your surprises with heart and passion ❤️💐 Connecting Emotions ❤️
                    </motion.p>

                    <motion.div
                        variants={childVariants}
                        className="flex justify-center w-full"
                    >
                        <Link
                            to="/products"
                            className="group relative px-12 py-5 bg-white text-primary-dark rounded-full font-semibold overflow-hidden transition-all transform hover:-translate-y-1 shadow-2xl text-lg flex items-center justify-center min-w-[240px]"
                        >
                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Explore Collection</span>
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100 origin-left"></div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom fade for transition to content */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-grad-top/30 to-transparent z-15 pointer-events-none"></div>
        </div>
    )
}
