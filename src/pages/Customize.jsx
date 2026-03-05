import React, { useEffect } from 'react'
import BouquetBuilder from '../components/BouquetBuilder'
import OrderingHelperBanner from '../components/OrderingHelperBanner'

export default function Customize() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className="py-24 pt-32 bg-transparent min-h-screen relative">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary uppercase tracking-widest text-sm font-semibold mb-2 block">Personalize Your Bloom</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-text-dark mb-6">Build Your <em className="text-primary-dark">Dream</em> Bouquet</h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-text-dark/70 text-lg">Choose every detail — we'll handcraft it just for you.</p>
                </div>

                <OrderingHelperBanner />

                {/* Main Builder Injection */}
                <BouquetBuilder />
            </div>
        </section>
    )
}
