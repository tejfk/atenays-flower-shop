import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function QuickOrderBanner() {
    const prefilledMessage = encodeURIComponent(
        "Hi Ate Nays! I'd like to order a bouquet. Here are my details:\n\n" +
        "Occasion: \n" +
        "Budget: \n" +
        "Preferred Flowers: \n" +
        "Delivery Date: \n\n" +
        "Thank you! 🌸"
    )

    const messengerLink = `https://m.me/fwenKO?text=${prefilledMessage}`

    return (
        <section className="py-16 md:py-20 bg-transparent relative z-30">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[3rem] shadow-xl border border-primary/10 p-8 md:p-12 text-center relative overflow-hidden"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-5xl mb-4">💬</div>
                        <span className="text-primary uppercase tracking-[0.3em] text-[11px] font-bold mb-3 block opacity-80">
                            No Hassle Ordering
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-text-dark mb-4 leading-tight">
                            Want to order <em className="text-primary-dark font-light italic">quickly?</em>
                        </h2>
                        <p className="text-text-dark/60 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed font-medium">
                            Skip the form — just message us directly! Tell us what you want and we'll handle the rest. It's that easy.
                        </p>

                        <a
                            href={messengerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-[#00B2FF] hover:bg-[#009AE0] text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-[#00B2FF]/20 transition-all hover:-translate-y-1 active:scale-95"
                        >
                            <MessageCircle size={24} />
                            Message Us on Messenger
                        </a>

                        <p className="text-[10px] text-text-dark/40 font-bold uppercase tracking-[0.15em] mt-5">
                            We reply fast — usually within minutes! 💨
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
