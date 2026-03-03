import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Pencil, Sparkles, FileText, Zap } from 'lucide-react'
import { db } from '../firebase/firebaseConfig'
import { doc } from 'firebase/firestore'
import { useCart } from '../context/CartContext'
import OrderSummaryModal from './OrderSummaryModal'
import toast from 'react-hot-toast'

export default function ProductModal({ product, isOpen, onClose }) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [isSummaryOpen, setIsSummaryOpen] = useState(false)
    const [cardMessage, setCardMessage] = useState('')
    const [showInspiration, setShowInspiration] = useState(false)

    const INSPO_TEMPLATES = [
        { label: 'Birthday', text: "Wishing you a day as beautiful as these blooms. Happy Birthday!" },
        { label: 'Anniversary', text: "To many more years of love and laughter. Happy Anniversary!" },
        { label: 'Sympathy', text: "With deepest sympathy and love during this difficult time." },
        { label: 'Romance', text: "Just because I was thinking of you. I love you!" },
    ]

    useEffect(() => {
        if (isOpen && product?.id) {
            document.body.style.overflow = 'hidden'
            setQuantity(1)
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen, product?.id])

    if (!isOpen || !product) return null

    const isRange = product.minPrice !== undefined && product.maxPrice !== undefined
    const priceNum = isRange ? product.minPrice : (typeof product.price === 'number' ? product.price : parseFloat((product.price || '0').replace(/,/g, '')))
    const priceDisplay = isRange
        ? `₱${product.minPrice.toLocaleString('en-PH')} - ₱${product.maxPrice.toLocaleString('en-PH')}`
        : `₱${priceNum.toLocaleString('en-PH')}`

    const handleAddToCart = () => {
        const item = {
            id: product.id,
            name: product.name,
            price: priceNum,
            quantity: quantity,
            imageUrl: product.imageUrl,
            emoji: product.emoji,
            cardMessage: cardMessage,
            type: 'catalog'
        }
        addToCart(item)
        onClose()
    }

    const orderData = {
        productId: product.id,
        productName: isRange ? `${product.name} (Range)` : product.name,
        quantity: quantity,
        unitPrice: priceNum,
        imageUrl: product.imageUrl,
        emoji: product.emoji,
        cardMessage: cardMessage
    }

    const handleGenerateSummary = () => {
        setIsSummaryOpen(true)
        toast.success('Your summary is ready! 🌸')
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
                    onClick={() => !isSummaryOpen && onClose()}
                ></motion.div>

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-text-dark hover:bg-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>

                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 bg-[#FDFBF7] relative min-h-[240px] md:min-h-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                        {product.imageUrl ? (
                            <img
                                loading="lazy"
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        ) : (
                            <div className="text-[6rem] md:text-[8rem]">{product.emoji || '🌸'}</div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto hide-scrollbar flex flex-col">
                        <span className="text-sm font-semibold tracking-wider text-primary uppercase mb-2 block">
                            {product.category || 'Bouquet'}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif text-text-dark mb-2 leading-tight">
                            {product.name}
                        </h2>
                        <div className="text-xl md:text-2xl font-medium text-primary-dark mb-6">
                            {priceDisplay}
                        </div>

                        <p className="text-text-dark/80 leading-relaxed mb-6 flex-grow">
                            {product.description}
                        </p>

                        {/* Card Message Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-text-dark/60">Message for Card</h4>
                                <button
                                    onClick={() => setShowInspiration(!showInspiration)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 hover:text-primary-dark transition-colors"
                                >
                                    <Sparkles size={12} /> Get Inspiration
                                </button>
                            </div>

                            <AnimatePresence>
                                {showInspiration && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mb-4"
                                    >
                                        <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                                            {INSPO_TEMPLATES.map((tmp) => (
                                                <button
                                                    key={tmp.label}
                                                    onClick={() => {
                                                        setCardMessage(tmp.text)
                                                        setShowInspiration(false)
                                                    }}
                                                    className="px-3 py-1.5 bg-white text-[10px] font-bold text-primary rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all"
                                                >
                                                    {tmp.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative">
                                <textarea
                                    value={cardMessage}
                                    onChange={(e) => setCardMessage(e.target.value)}
                                    placeholder="Write a heartfelt message or use our inspiration..."
                                    className="w-full bg-bg-main/50 border border-border/50 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[100px]"
                                />
                                {cardMessage.length === 0 && (
                                    <div className="absolute top-4 right-5 text-text-dark/20 pointer-events-none">
                                        <Pencil size={16} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Flowers Included */}
                        {product.flowers && product.flowers.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-text-dark/60 mb-3">Flowers Included</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.flowers.map((f, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-bg-main text-text-dark text-sm rounded-full border border-border/50">
                                            🌸 {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-4 mt-auto pt-6 border-t border-border/50">
                            <div className="flex items-center justify-between p-3 bg-bg-main/30 rounded-xl border border-border/50">
                                <span className="font-medium text-text-dark text-sm">Quantity</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center font-bold text-lg hover:text-primary">-</button>
                                    <span className="font-bold w-4 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center font-bold text-lg hover:text-primary">+</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-primary border-2 border-primary/20 rounded-[1.2rem] font-bold hover:bg-primary/5 transition-all text-sm md:text-base shadow-sm"
                                >
                                    <ShoppingBag size={18} /> Add to Cart
                                </button>
                                <button
                                    onClick={handleGenerateSummary}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-[1.2rem] font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 shadow-xl shadow-primary/20 text-sm md:text-base"
                                >
                                    <Zap size={18} /> Quick Order
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <OrderSummaryModal
                    isOpen={isSummaryOpen}
                    onClose={() => setIsSummaryOpen(false)}
                    orderData={orderData}
                    type="regular"
                />
            </div>
        </AnimatePresence>
    )
}
