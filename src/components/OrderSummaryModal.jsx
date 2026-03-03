import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, MessageCircle, Download, Image as ImageIcon } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function OrderSummaryModal({ isOpen, onClose, orderData, type = 'regular' }) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [imageSaved, setImageSaved] = useState(false)
    const [isOrdering, setIsOrdering] = useState(false)
    const summaryRef = useRef(null)

    React.useEffect(() => {
        if (isOpen) {
            setImageSaved(false)
        }
    }, [isOpen])

    if (!isOpen || !orderData) return null

    const isCustom = type === 'custom'
    const isBudgetBasis = orderData.type === 'budget-basis'

    const total = isCustom
        ? (isBudgetBasis ? parseInt(orderData.budget.replace(/[^0-9]/g, '')) : orderData.estimatedPrice)
        : orderData.unitPrice * orderData.quantity

    const handleDownloadImage = async () => {
        if (!summaryRef.current) return
        setIsDownloading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 150))
            const canvas = await html2canvas(summaryRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true
            })
            const image = canvas.toDataURL("image/png", 1.0)
            const link = document.createElement('a')
            link.download = `AteNays-Order-Summary.png`
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
        let message = `Hello Ate Nays! I would like to order this bouquet.\n`
        message += `Type: ${isCustom ? 'Custom Build' : orderData.productName || 'Bespoke Item'}\n`
        message += `Total Amount: ₱${total.toLocaleString('en-PH')}\n`
        message += `\nI have saved and attached the image of my summary here.`

        return `https://m.me/fwenKO?text=${encodeURIComponent(message)}`
    }

    const handleMessengerClick = () => {
        if (!imageSaved) return

        setIsOrdering(true)
        setTimeout(() => {
            window.open(generateMessengerLink(), '_blank', 'noopener,noreferrer')
            setIsOrdering(false)
        }, 1200)
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-5 md:p-8 overflow-y-auto hide-scrollbar">
                        <button onClick={onClose} className="absolute top-5 right-5 z-[210] p-2 hover:bg-bg-main rounded-full text-text-dark/50 hover:text-text-dark transition-colors">
                            <X size={20} />
                        </button>

                        {/* Capture Area */}
                        <div ref={summaryRef} className="bg-white p-2">
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <h1 className="font-serif text-xl font-bold text-primary-dark">Ate Nays Flower Shop</h1>
                                </div>
                                <h2 className="text-lg font-serif text-text-dark leading-tight">Order Summary</h2>
                                <p className="text-text-dark/40 text-[10px] uppercase tracking-widest font-bold mt-1">Direct Boutique Inquiry</p>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6">
                                {isCustom ? (
                                    <>
                                        <DetailRow label="Budget Focus" value={orderData.budget} />
                                        {isBudgetBasis ? (
                                            <>
                                                <DetailRow label="Selected Flowers" value={orderData.flowers} />
                                                <DetailRow label="Wrapper Color" value={orderData.wrapperColor} />
                                                <DetailRow label="Ribbon Color" value={orderData.ribbonColor} />
                                                {orderData.fillers && <DetailRow label="Accent" value={orderData.fillers} />}
                                            </>
                                        ) : (
                                            <>
                                                <DetailRow label="Flower Type" value={orderData.flowerType} />
                                                <DetailRow label="Quantity" value={`${orderData.dozens} Dozen(s)`} />
                                                <DetailRow label="Wrapper" value={orderData.wrapperColor} />
                                            </>
                                        )}
                                        {orderData.message && <DetailRow label="Card Message" value={`"${orderData.message}"`} />}
                                    </>
                                ) : (
                                    <>
                                        <DetailRow label="Product" value={orderData.productName} />
                                        <DetailRow label="Unit Price" value={`₱${orderData.unitPrice.toLocaleString('en-PH')}`} />
                                        <DetailRow label="Quantity" value={orderData.quantity.toString()} />
                                        {orderData.cardMessage && <DetailRow label="Card Message" value={`"${orderData.cardMessage}"`} />}
                                    </>
                                )}

                                <div className="pt-4 mt-6 border-t border-dashed border-border flex justify-between items-center">
                                    <span className="font-bold text-text-dark uppercase tracking-widest text-[10px]">Total Amount</span>
                                    <span className="text-xl md:text-2xl font-bold text-primary-dark">₱{total.toLocaleString('en-PH')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
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
                                        <><Check size={20} /> Image Saved</>
                                    ) : (
                                        <><Download size={20} /> 1. Save Image</>
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
                                        <><MessageCircle size={20} /> 2. Messenger</>
                                    ) : (
                                        <><MessageCircle size={20} /> Messenger (Locked)</>
                                    )}
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-text-dark/40 font-bold uppercase tracking-[0.1em] mt-3 leading-relaxed">
                                {imageSaved
                                    ? "Perfect! Now click Messenger and paste the image! 🌸"
                                    : "Step 1: Save the summary image above 📸"}

                            </p>
                            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-[11px] text-center text-primary-dark font-bold uppercase tracking-wider leading-relaxed">
                                    Step 2:<br />
                                    <span className="text-[10px] lowercase first-letter:uppercase font-medium opacity-80">Message the seller for more transaction details or any request you want to make for your order</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-border/50 pb-2 gap-1 sm:gap-4">
            <span className="text-sm font-medium text-text-dark/60 shrink-0">{label}</span>
            <span className="text-text-dark font-medium sm:text-right break-words w-full sm:max-w-[70%]">{value}</span>
        </div>
    )
}
