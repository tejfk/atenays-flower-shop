import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '../assets/img/logo.svg'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Catalog', href: '/products' },
        { label: 'Customize', href: '/customize' },
        { label: 'Contact', href: '/contact' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-main/40 backdrop-blur-xl border-b border-white/40 shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={logoImg}
                        alt="Ate Nays Logo"
                        className="h-16 w-auto object-contain drop-shadow-sm rounded-full"
                    />
                </Link>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center gap-8 font-medium">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <Link
                                to={link.href}
                                className={`transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full ${isActive(link.href) ? 'text-primary after:w-full' : 'text-text-dark hover:text-primary after:w-0'}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    <Link
                        to="/products"
                        className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 shadow hover:shadow-lg"
                    >
                        Order Now
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-text-dark"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Links */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/90 backdrop-blur-lg shadow-xl overflow-hidden border-t border-border/40"
                    >
                        <ul className="flex flex-col items-center py-8 gap-8 font-medium">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-xl transition-colors ${isActive(link.href) ? 'text-primary' : 'text-text-dark hover:text-primary'}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="w-full px-10">
                                <Link
                                    to="/products"
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Browse Collection
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
