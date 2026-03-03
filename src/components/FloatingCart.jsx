import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function FloatingCart({ onCheckout }) {
    const {
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart
    } = useCart()

    // Don't show the floating icon if cart is completely empty and closed
    if (cartCount === 0 && !isCartOpen) return null

    return (
        <>
            {/* The Floating Bubble */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[90]"
            >
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative w-14 h-14 md:w-16 md:h-16 bg-white text-primary rounded-full flex items-center justify-center shadow-xl border border-primary/20 transition-all duration-300 hover:scale-110 hover:shadow-primary/30"
                >
                    <ShoppingBag size={24} className="md:w-7 md:h-7" />

                    {/* Badge */}
                    <AnimatePresence>
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-primary text-white text-xs md:text-sm font-bold w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </motion.div>

            {/* The Side Drawer Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-[200] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
                            onClick={() => setIsCartOpen(false)}
                        />

                        {/* The Drawer Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="relative w-full max-w-md bg-bg-main shadow-2xl flex flex-col h-full border-l border-border/50"
                        >
                            {/* Header */}
                            <div className="p-6 bg-white border-b border-border/50 flex items-center justify-between shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="text-primary" size={24} />
                                    <h2 className="font-serif text-2xl font-bold text-text-dark">Your Bag</h2>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 hover:bg-bg-main rounded-full text-text-dark/50 hover:text-primary transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 hide-scrollbar">
                                {cartItems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                                        <ShoppingBag size={64} className="text-border" />
                                        <p className="font-medium text-lg">Your bag is blossoming, but empty.</p>
                                    </div>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.cartId} className="bg-white p-4 rounded-2xl shadow-sm border border-border/40 flex gap-4 relative group">
                                            {/* Item Image / Emoji */}
                                            <div className="w-20 h-20 bg-bg-main rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl">{item.emoji || '🌸'}</span>
                                                )}
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="pr-6">
                                                    <h3 className="font-bold text-text-dark text-sm sm:text-base leading-tight line-clamp-2">{item.name}</h3>
                                                    {item.type === 'custom' && (
                                                        <p className="text-[10px] text-text-dark/50 uppercase tracking-wider mt-1 font-semibold block truncate">Custom Build</p>
                                                    )}
                                                    <div className="text-primary-dark font-bold mt-1 text-sm">
                                                        ₱{item.price.toLocaleString('en-PH')}
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center bg-bg-main rounded-xl border border-border/60">
                                                        <button
                                                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-text-dark hover:text-primary disabled:opacity-30"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-text-dark hover:text-primary"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(item.cartId)}
                                                    className="absolute top-4 right-4 text-text-dark/30 hover:text-red-500 transition-colors bg-white rounded-full p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer / Checkout */}
                            {cartItems.length > 0 && (
                                <div className="bg-white p-6 border-t border-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                                    <div className="flex items-end justify-between mb-6">
                                        <span className="uppercase tracking-[0.2em] font-bold text-xs text-text-dark/40">Grand Total</span>
                                        <span className="font-serif text-3xl font-bold text-primary-dark">
                                            ₱{cartTotal.toLocaleString('en-PH')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false)
                                            onCheckout()
                                        }}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-xl shadow-primary/20 text-lg flex items-center justify-center gap-2"
                                    >
                                        Generate Receipt ✨
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
