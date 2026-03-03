import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, MessageCircle, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { useCart } from '../context/CartContext'

export default function BatchSummaryModal({ isOpen, onClose }) {
    const { cartItems, cartTotal, clearCart } = useCart()
    const [isDownloading, setIsDownloading] = useState(false)
    const [imageSaved, setImageSaved] = useState(false)
    const [isOrdering, setIsOrdering] = useState(false)
    const summaryRef = useRef(null)

    React.useEffect(() => {
        if (isOpen) {
            setImageSaved(false)
        }
    }, [isOpen])

    if (!isOpen || cartItems.length === 0) return null

    const handleDownloadImage = async () => {
        if (!summaryRef.current) return
        setIsDownloading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 150)) // Allow fonts/images to paint
            const canvas = await html2canvas(summaryRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            })
            const image = canvas.toDataURL("image/png", 1.0)
            const link = document.createElement('a')
            link.download = `AteNays-Batch-Order.png`
            link.href = image
            link.click()
            setImageSaved(true)
        } catch (err) {
            console.error("Screenshot failed:", err)
        } finally {
            setIsDownloading(false)
        }
    }

    const generateMessengerLink = () => {
        let message = `Hello Ate Nays! I would like to place a batch order for the following items:\n\n`

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.quantity}x ${item.name} (₱${(item.price * item.quantity).toLocaleString('en-PH')})\n`
            if (item.cardMessage) {
                message += `   - Card Message: "${item.cardMessage}"\n`
            }
        })

        message += `\nGrand Total: ₱${cartTotal.toLocaleString('en-PH')}\n`
        message += `\nI have saved and attached the image of my receipt summary here.`

        return `https://m.me/fwenKO?text=${encodeURIComponent(message)}`
    }

    const handleMessengerClick = () => {
        if (!imageSaved) return

        setIsOrdering(true)
        setTimeout(() => {
            window.open(generateMessengerLink(), '_blank', 'noopener,noreferrer')
            setIsOrdering(false)
            onClose() // Close the modal
            // We do NOT clear the cart automatically just in case they fail to paste or want to adjust. 
            // They can clear it manually later or it persists.
        }, 1200)
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                >
                    <div className="p-4 md:p-6 overflow-y-auto hide-scrollbar flex-1 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 z-[210] p-2 hover:bg-bg-main rounded-full text-text-dark/50 hover:text-text-dark transition-colors">
                            <X size={20} />
                        </button>

                        {/* Capture Area - Digital Receipt Format */}
                        <div ref={summaryRef} className="bg-white p-4 md:p-6">
                            <div className="text-center mb-6 pb-6 border-b border-border/40 border-dashed">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h1 className="font-serif text-2xl font-bold text-primary-dark">Ate Nays Flower Shop</h1>
                                </div>
                                <h2 className="text-xl font-serif text-text-dark leading-tight">Digital Receipt</h2>
                                <p className="text-text-dark/40 text-[10px] uppercase tracking-widest font-bold mt-2">Boutique Batch Order</p>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-3 pb-4 border-b border-border/20 last:border-0 last:pb-0">
                                        <div className="w-6 font-bold text-text-dark/30 text-xs shrink-0">{item.quantity}x</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <h4 className="font-bold text-text-dark text-sm leading-tight break-words">{item.name}</h4>
                                                <span className="font-bold text-primary-dark text-sm shrink-0">₱{(item.price * item.quantity).toLocaleString('en-PH')}</span>
                                            </div>

                                            {/* Sub-details */}
                                            <div className="mt-1 space-y-1">
                                                {item.cardMessage && (
                                                    <p className="text-xs text-text-dark italic">Card: "{item.cardMessage}"</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Line */}
                            <div className="pt-4 border-t-2 border-dashed border-border flex justify-between items-center mb-4">
                                <span className="font-bold text-text-dark uppercase tracking-widest text-[11px]">Grand Total</span>
                                <span className="text-2xl font-serif font-bold text-primary">₱{cartTotal.toLocaleString('en-PH')}</span>
                            </div>
                            <div className="text-center text-[10px] text-text-dark/30 uppercase tracking-widest font-bold">
                                {cartItems.length} Item(s) Selected
                            </div>
                        </div>

                        {/* Actions fixed at bottom of modal scroll */}
                        <div className="mt-6 space-y-3 bg-white relative z-10 pt-4 border-t border-border/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={handleDownloadImage}
                                    disabled={isDownloading}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-sm active:scale-95 border-2 ${imageSaved
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-white border-primary/20 text-primary hover:bg-primary hover:text-white'
                                        }`}
                                >
                                    {isDownloading ? (
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></span>
                                    ) : imageSaved ? (
                                        <><Check size={20} /> Receipt Saved</>
                                    ) : (
                                        <><Download size={20} /> 1. Save Receipt</>
                                    )}
                                </button>

                                <button
                                    onClick={handleMessengerClick}
                                    disabled={!imageSaved || isOrdering}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${imageSaved && !isOrdering
                                        ? 'bg-[#0084FF] text-white hover:bg-[#0073E6] hover:-translate-y-0.5 shadow-[#0084FF]/20'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                        }`}
                                >
                                    {isOrdering ? (
                                        <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></span> Processing...</>
                                    ) : imageSaved ? (
                                        <><MessageCircle size={20} /> 2. Send Batch</>
                                    ) : (
                                        <><MessageCircle size={20} /> Messenger (Locked)</>
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                <p className="text-[10px] text-center text-text-dark/40 font-bold uppercase tracking-[0.1em] leading-relaxed">
                                    {imageSaved
                                        ? "Perfect! Now click Messenger and paste the receipt! 🌸"
                                        : "Step 1: Save the digital receipt above 📸"}
                                </p>
                                <p className="text-[10px] text-center text-text-dark/40 font-bold uppercase tracking-[0.1em] leading-relaxed">
                                    Step 2:<br />
                                    Message the seller for more transaction details or any request you want to make for your order
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
