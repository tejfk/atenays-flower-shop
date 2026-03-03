import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import gcashLogo from '../assets/img/gcash.svg'
import mayaLogo from '../assets/img/maya.png'
import gotymeLogo from '../assets/img/gotyme.png'

const SOCIAL_LINKS = [
    {
        name: 'Facebook',
        icon: <Facebook size={24} />,
        handle: '@fwenKO',
        link: 'https://www.facebook.com/fwenKO',
        color: 'hover:bg-[#1877F2]',
        desc: 'Join our community for daily floral inspiration.'
    },
    {
        name: 'Instagram',
        icon: <Instagram size={24} />,
        handle: '@atenays.flowers',
        link: '#', // Add real link if provided
        color: 'hover:bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]',
        desc: 'Behind the scenes and our latest artisanal builds.'
    },
    {
        name: 'Messenger',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.18 5.51 3.12 7.42V22l2.76-1.52c1.3.36 2.68.56 4.12.56 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.31 12.87l-2.62-2.79-5.11 2.79 5.62-5.96 2.69 2.79 5.03-2.79-5.61 5.96z" />
            </svg>
        ),
        handle: 'Direct Chat',
        link: 'https://www.facebook.com/messages/t/fwenKO',
        color: 'hover:bg-[#00B2FF]',
        desc: 'Chat with our designers for instant quotes.'
    },
    {
        name: 'WhatsApp',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.554 4.197 1.604 6.046l-1.706 6.234 6.378-1.673a11.83 11.83 0 005.727 1.474h.005c6.635 0 12.046-5.409 12.05-12.047 0-3.216-1.253-6.24-3.528-8.514" />
            </svg>
        ),
        handle: 'Message Us',
        link: 'https://wa.me/639309983213',
        color: 'hover:bg-[#25D366]',
        desc: 'Send us high-res photo inspirations.'
    }
]

export default function Contact() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <div className="min-h-screen pt-28 md:pt-32 pb-20 md:pb-24">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-4 block"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-serif text-text-dark mb-6 md:mb-8 leading-tight"
                    >
                        Let's Start a <br /><em className="text-primary-dark font-light italic text-3xl sm:text-4xl md:text-6xl">Conversations</em>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-text-dark/60 font-light leading-relaxed px-2"
                    >
                        Whether you're planning a grand celebration or a simple surprise, our team is here to help you choose the perfect blooms.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-8"
                    >
                        <div className="bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-xl">
                            <h3 className="text-xl md:text-2xl font-serif text-text-dark mb-8">Boutique Details</h3>

                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-dark">Our Studio</h4>
                                        <p className="text-text-dark/60 text-sm leading-relaxed mt-1">Carbon Market Interim Building <br />Cebu City, Philippines</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-dark">Call or Text</h4>
                                        <p className="text-text-dark/60 text-sm mt-1">Line 1: 09309983213</p>
                                        <p className="text-text-dark/60 text-sm mt-0.5">Line 2: 09275860154</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-dark">Email Us</h4>
                                        <p className="text-text-dark/60 text-sm mt-1">hello@atenaysflowers.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-dark">Hours</h4>
                                        <p className="text-text-dark/60 text-sm mt-1">Mon - Sat: 8:00 AM - 6:00 PM<br />Sun: By Appointment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Center & Right: Social Cards & Form Area */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Social Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid sm:grid-cols-2 md:grid-cols-4 gap-6"
                        >
                            {SOCIAL_LINKS.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variants={cardVariants}
                                    className={`group bg-white p-6 md:p-8 rounded-[2rem] border border-border/40 shadow-sm transition-all duration-300 ${social.color} hover:scale-[1.02] hover:shadow-2xl hover:border-transparent`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-bg-main flex items-center justify-center text-text-dark group-hover:bg-white/20 group-hover:text-white transition-colors mb-6 shadow-inner">
                                        {social.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-text-dark group-hover:text-white transition-colors mb-2">{social.name}</h4>
                                    <p className="text-primary font-medium text-sm group-hover:text-white/90 transition-colors mb-4">{social.handle}</p>
                                    <p className="text-text-dark/50 text-xs leading-relaxed group-hover:text-white/70 transition-colors">
                                        {social.desc}
                                    </p>
                                </motion.a>
                            ))}
                        </motion.div>

                        {/* Redesigned Payment & Offerings Section */}
                        <div className="grid md:grid-cols-2 gap-8 mt-12">
                            {/* Payment Methods with 'Logos' */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-border/40 shadow-sm"
                            >
                                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-10 text-center">Accepted Payments</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                                            <img src={gcashLogo} alt="GCash" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest">GCash</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="w-16 h-10 bg-black rounded-lg flex items-center justify-center p-3 shadow-md group-hover:scale-110 transition-transform">
                                            <img src={mayaLogo} alt="Maya" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest">Paymaya</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="w-16 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm border border-primary/20">
                                            <Send size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest">COD</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="w-16 h-10 bg-bg-main rounded-lg flex items-center justify-center text-text-dark/60 group-hover:scale-110 transition-transform shadow-sm border border-border/40 font-bold text-[8px] uppercase text-center px-1">Bank Transfer</div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest">Bank</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 group">
                                        <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center p-2 group-hover:scale-110 transition-transform shadow-sm border border-border/40">
                                            <img src={gotymeLogo} alt="GoTyme" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest">GoTyme</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Service Offerings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-[#FDFBF7] p-10 rounded-[2.5rem] border border-border/40"
                            >
                                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8">What We Guarantee</h4>
                                <div className="grid grid-cols-1 gap-y-4">
                                    {[
                                        'Online orders & payments', 'Same day delivery', 'Rush orders accepted',
                                        'Arrange while you wait', 'Full Customization', 'Personalized items',
                                        'Budget friendly pricing', 'Nationwide Shipping'
                                    ].map(offer => (
                                        <div key={offer} className="flex items-center gap-4 text-text-dark/70 group">
                                            <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                                            <span className="text-xs font-bold uppercase tracking-[0.15em] group-hover:text-text-dark transition-colors">{offer}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
