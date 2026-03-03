import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroVideo from '../components/HeroVideo'
import ShopByOccasion from '../components/ShopByOccasion'
import HowItWorks from '../components/HowItWorks'
import QuickOrderBanner from '../components/QuickOrderBanner'

export default function Home() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <HeroVideo />

            <main className="bg-transparent overflow-x-hidden pb-12">
                <ShopByOccasion />
                <QuickOrderBanner />
                <HowItWorks />
            </main>
        </>
    )
}
