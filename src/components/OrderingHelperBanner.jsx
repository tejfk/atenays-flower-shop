import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, HelpCircle } from 'lucide-react'

export default function OrderingHelperBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem('atenays_helper_dismissed')
        if (!dismissed) {
            setIsVisible(true)
        }
    }, [])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('atenays_helper_dismissed', 'true')
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 bg-white rounded-3xl shadow-lg border border-primary/10 overflow-hidden"
            >
                <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <HelpCircle size={20} className="text-primary" />
                            </div>
                            <h3 className="font-serif font-bold text-lg text-text-dark">Need help ordering?</h3>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="w-8 h-8 rounded-full hover:bg-bg-main flex items-center justify-center text-text-dark/30 hover:text-text-dark transition-colors shrink-0"
                            aria-label="Dismiss helper"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-6">
                        {[
                            { step: '1', emoji: '👀', title: 'Browse', desc: 'Look at our bouquets' },
                            { step: '2', emoji: '👆', title: 'Pick', desc: 'Choose what you like' },
                            { step: '3', emoji: '💬', title: 'Message Us', desc: 'We\'ll handle the rest!' }
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="text-3xl mb-2">{item.emoji}</div>
                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Step {item.step}</div>
                                <div className="font-bold text-sm text-text-dark">{item.title}</div>
                                <div className="text-[10px] text-text-dark/50 mt-1 font-medium">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
