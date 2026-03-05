import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, MessageCircle } from 'lucide-react'
import logoImg from '../assets/img/logo.svg'

export default function Footer() {
    return (
        <footer className="bg-transparent text-text-dark py-16">
            <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

                {/* Brand */}
                <div className="flex flex-col items-center md:items-start">
                    <Link to="/" className="flex items-center gap-3 mb-6">
                        <img
                            src={logoImg}
                            alt="Ate Nays Logo"
                            className="w-12 h-12 object-contain rounded-full bg-white p-0.5 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-semibold text-primary-dark tracking-wide">Ate Nays</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Flower Crafts</span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed mb-8 opacity-70 text-center md:text-left max-w-xs">
                        Crafting artisanal floral experiences with genuine love and the freshest seasonal blooms. Elevating your moments, one arrangement at a time.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/fwenKO" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:text-[#1877F2] transition-all border border-border/40">
                            <Facebook size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:text-[#E4405F] transition-all border border-border/40">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.facebook.com/messages/t/fwenKO" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 hover:text-[#00B2FF] transition-all border border-border/40">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.18 5.51 3.12 7.42V22l2.76-1.52c1.3.36 2.68.56 4.12.56 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.31 12.87l-2.62-2.79-5.11 2.79 5.62-5.96 2.69 2.79 5.03-2.79-5.61 5.96z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center md:items-start border-y md:border-y-0 border-border/30 py-10 md:py-0">
                    <h3 className="font-bold text-lg mb-6 tracking-wide uppercase text-xs opacity-50">Explore</h3>
                    <ul className="space-y-4 text-center md:text-left font-medium">
                        <li><Link to="/" className="hover:text-primary transition-colors">Our Story</Link></li>
                        <li><Link to="/products" className="hover:text-primary transition-colors">Our Bouquets</Link></li>
                        <li><Link to="/customize" className="hover:text-primary transition-colors">Custom Bouquets</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact & Socials</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="font-bold text-lg mb-6 tracking-wide uppercase text-xs opacity-50">Connect</h3>
                    <ul className="space-y-5 text-sm font-medium">
                        <li className="flex flex-col md:flex-row items-center gap-3">
                            <span className="opacity-40">📍</span>
                            <span>Aisle #9 Interim Building Carbon Market,Cebu City</span>
                        </li>
                        <li className="flex flex-col md:flex-row items-center gap-3">
                            <span className="opacity-40">📞</span>
                            <div className="flex flex-col">
                                <span>0930 998 3213</span>
                                <span>0927 586 0154</span>
                            </div>
                        </li>
                        <li className="flex flex-col md:flex-row items-center gap-3">
                            <span className="opacity-40">💬</span>
                            <span>Chat on Messenger @fwenKO</span>
                        </li>
                        <li className="flex flex-col md:flex-row items-center gap-3">
                            <span className="opacity-40">🕐</span>
                            <span>Mon–Sat, 8 AM – 6 PM</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-6 max-w-7xl mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase opacity-40">
                <span>© {new Date().getFullYear()} Ate Nays. Brand by Artisans.</span>
                <Link to="/contact" className="mt-4 md:mt-0 hover:text-primary transition-colors underline decoration-primary/30">Work with us</Link>
            </div>
        </footer>
    )
}
