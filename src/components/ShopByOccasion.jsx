import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const occasions = [
    { name: "Valentine's Day", emoji: "❤️", desc: "Expressions of true love", bg: "bg-red-50" },
    { name: "Mother's Day", emoji: "👩‍👧", desc: "For the one who does it all", bg: "bg-pink-50" },
    { name: "Anniversary", emoji: "🥂", desc: "Celebrating milestones", bg: "bg-orange-50" },
    { name: "Wedding", emoji: "💍", desc: "To a lifetime of happiness", bg: "bg-blue-50" },
    { name: "Funeral", emoji: "🕊️", desc: "Deepest sympathies", bg: "bg-gray-50" }
]

export default function ShopByOccasion() {
    const navigate = useNavigate()

    return (
        <section className="py-24 bg-transparent relative z-30">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-primary uppercase tracking-[0.3em] text-[11px] font-bold mb-4 block opacity-80">Find the Perfect Gift</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-text-dark leading-tight">Shop by <em className="text-primary-dark font-light italic">Occasion</em></h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {occasions.map((occ, i) => (
                        <motion.div
                            key={occ.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            onClick={() => navigate('/products', { state: { selectedCategory: occ.name } })}
                            className={`${occ.bg} rounded-[2rem] p-8 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 border border-border/40 shadow-sm hover:shadow-xl group`}
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{occ.emoji}</div>
                            <h3 className="font-serif font-bold text-lg text-text-dark mb-2">{occ.name}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-text-dark/50 font-bold">{occ.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
