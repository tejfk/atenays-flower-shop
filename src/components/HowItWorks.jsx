import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const steps = [
    { num: '1', title: 'Pick Your Theme', desc: 'Browse our curated catalog or start a custom build. Tell us if it’s a romantic gesture, sympathy, or just because.', icon: '🎨' },
    { num: '2', title: 'Set Your Budget', desc: 'Whether it’s a simple sweet gesture or a grand luxury bouquet, our artisans scale the floral density perfectly to your budget.', icon: '💰' },
    { num: '3', title: 'Let Us Handcraft', desc: 'Our master florists carefully select the freshest daily blooms to bring your unique arrangement to life.', icon: '✨' }
]

export default function HowItWorks() {
    const navigate = useNavigate()

    return (
        <section className="py-24 bg-transparent relative z-30">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-20">
                    <span className="text-primary uppercase tracking-[0.3em] text-[11px] font-bold mb-4 block opacity-80">Simple & Effortless</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-text-dark leading-tight">How It <em className="text-primary-dark font-light italic">Works</em></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[4rem] left-1/6 right-1/6 h-[2px] bg-border/40 z-0"></div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-transparent shadow-xl flex items-center justify-center text-4xl mb-8 relative group">
                                <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                                <span className="relative z-10">{step.icon}</span>
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">{step.num}</div>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-text-dark mb-4">{step.title}</h3>
                            <p className="text-text-dark/60 leading-relaxed font-medium">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        onClick={() => navigate('/customize')}
                        className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto"
                    >
                        Start Customizing <ArrowRight size={20} />
                    </motion.button>
                </div>
            </div>
        </section>
    )
}
