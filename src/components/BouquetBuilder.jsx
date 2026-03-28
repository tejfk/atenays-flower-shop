import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info, Save, ZoomIn, X, ArrowRight, Flower, Wind, Ribbon, Box, Plus } from 'lucide-react'
import OrderSummaryModal from './OrderSummaryModal'
import toast from 'react-hot-toast'
import useBuilderOptions from '../hooks/useBuilderOptions'

export default function BouquetBuilder() {
    const { options, loading } = useBuilderOptions()

    const [currentStep, setCurrentStep] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [zoomedImage, setZoomedImage] = useState(null)

    const [budget, setBudget] = useState('1000')
    const [selectedFlowers, setSelectedFlowers] = useState([])
    const [wrapper, setWrapper] = useState(null)
    const [ribbon, setRibbon] = useState(null)
    const [filler, setFiller] = useState(null)
    const [message, setMessage] = useState('')
    const [bespokeRequest, setBespokeRequest] = useState('')
    const [activeCategory, setActiveCategory] = useState('Flowers')

    const steps = [
        { id: 1, title: 'BUDGET' },
        { id: 2, title: 'ELEMENTS' },
        { id: 3, title: 'REVIEW' }
    ]

    const categories = [
        { id: 'Flowers', label: 'Flowers', icon: Flower, count: selectedFlowers.length },
        { id: 'Fillers', label: 'Fillers', icon: Wind, count: filler ? 1 : 0 },
        { id: 'Satin', label: 'Satin', icon: Ribbon, count: ribbon ? 1 : 0 },
        { id: 'Wrapping', label: 'Wrapping', icon: Box, count: wrapper ? 1 : 0 },
        { id: 'Add Ons', label: 'Add Ons', icon: Plus, count: 0 }
    ]

    const toggleFlower = (name) => {
        setSelectedFlowers(prev =>
            prev.includes(name)
                ? prev.filter(f => f !== name)
                : [...prev, name]
        )
    }

    const validateStep = (step) => {
        if (step === 1 && (!budget || parseInt(budget) < 100)) {
            toast.error("Please set a valid budget (Min ₱100)")
            return false
        }
        if (step === 2) {
            if (selectedFlowers.length === 0) {
                toast.error("Please select at least one flower")
                return false
            }
            if (!wrapper || !ribbon) {
                toast.error("Please select a wrapper and ribbon")
                return false
            }
        }
        return true
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length))
        }
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const orderData = {
        budget: `₱${(parseInt(budget) || 0).toLocaleString('en-PH')}`,
        flowers: selectedFlowers.join(', '),
        ribbonColor: ribbon?.name || 'Standard',
        wrapperColor: wrapper?.name || 'Standard',
        fillers: filler?.name || 'None',
        message,
        bespokeRequest,
        type: 'budget-basis'
    }

    const handleGenerateSummary = () => {
        if (validateStep(currentStep)) {
            setIsModalOpen(true)
            toast.success('Your summary is ready! 🌸')
        }
    }

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-[1200px] mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-border/30 overflow-hidden flex flex-col mb-12">
            {/* Header */}
            <div className="px-4 lg:px-8 py-4 lg:py-6 border-b border-border/20 flex items-center justify-between bg-white">
                <h2 className="text-xl lg:text-2xl font-bold text-primary font-serif">Customize Your Bouquet</h2>
                <button className="p-2 hover:bg-bg-main rounded-full transition-colors text-text-dark/20">
                    <X size={24} />
                </button>
            </div>

            {/* Stepper */}
            <div className="px-4 lg:px-8 py-4 bg-white border-b border-border/10 flex justify-center items-center gap-4 lg:gap-12 overflow-x-auto hide-scrollbar">
                {steps.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-2 lg:gap-3 shrink-0">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep === s.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : currentStep > s.id ? 'bg-green-500 text-white' : 'bg-bg-main text-text-dark/30'}`}>
                                {currentStep > s.id ? <Check size={16} className="lg:w-5 lg:h-5" /> : s.id}
                            </div>
                            <span className={`text-[8px] lg:text-[10px] font-bold tracking-widest ${currentStep === s.id ? 'text-primary' : 'text-text-dark/30'}`}>{s.title}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="w-8 lg:w-16 h-0.5 bg-border/30 rounded-full">
                                <div className={`h-full bg-primary transition-all duration-500 rounded-full ${currentStep > s.id ? 'w-full' : 'w-0'}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 min-h-[600px] bg-white overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="w-full p-6 lg:p-12 flex flex-col items-center justify-center text-center space-y-6 lg:space-y-8"
                        >
                            <div className="max-w-md space-y-2 lg:space-y-4">
                                <h3 className="text-3xl lg:text-4xl font-serif font-bold text-text-dark">Set Your Target Budget</h3>
                                <p className="text-text-dark/50 text-base lg:text-lg">Our florists will craft your bouquet to fit perfectly within this price point.</p>
                            </div>
                            
                            <div className="relative group max-w-sm w-full">
                                <span className="absolute left-8 top-1/2 -translate-y-1/2 font-bold text-4xl text-primary">₱</span>
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="1000"
                                    className="w-full pl-16 pr-8 py-10 bg-bg-main border-2 border-transparent focus:border-primary/20 rounded-[3rem] focus:outline-none font-bold text-4xl text-text-dark transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl">
                                {['500', '1000', '1500', '2500'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setBudget(val)}
                                        className={`py-4 rounded-2xl border-2 font-bold transition-all ${budget === val ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-text-dark/40 border-border/40 hover:border-primary/40'}`}
                                    >
                                        ₱{parseInt(val).toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex gap-4 text-left max-w-xl">
                                <Info className="text-primary shrink-0" size={24} />
                                <p className="text-sm text-text-dark/70 leading-relaxed">
                                    <strong>Note:</strong> Budget includes materials and labor (₱150-₱300 depending on flower complexity). We'll optimize the stem count to maximize visual impact.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col lg:flex-row w-full h-full overflow-y-auto lg:overflow-hidden hide-scrollbar"
                        >
                            {/* Categories Sidebar */}
                            <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/10 p-4 lg:p-6 flex flex-col bg-white shrink-0">
                                <span className="hidden lg:block text-[10px] font-bold text-text-dark/30 tracking-[0.2em] mb-4 uppercase px-4">Categories</span>
                                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all group shrink-0 ${activeCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-dark/40 hover:bg-bg-main hover:text-text-dark'}`}
                                        >
                                            <cat.icon size={20} className={activeCategory === cat.id ? 'text-white' : 'group-hover:text-primary'} />
                                            <span className="text-sm lg:text-base lg:flex-1 text-left whitespace-nowrap">{cat.label}</span>
                                            <span className={`hidden lg:flex text-[10px] w-5 h-5 rounded-full items-center justify-center font-bold ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-bg-main text-text-dark/30'}`}>
                                                {cat.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Elements Grid View */}
                            <div className="flex-1 p-4 lg:p-8 bg-white/50 lg:overflow-y-auto hide-scrollbar border-b lg:border-b-0">
                                <div className="mb-6 lg:mb-8">
                                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-2">
                                        <h3 className="text-xl lg:text-2xl font-bold text-text-dark">Target Budget</h3>
                                        <span className="text-2xl lg:text-3xl font-serif font-bold text-primary">₱{(parseInt(budget) || 0).toLocaleString()}</span>
                                    </div>
                                    <p className="text-text-dark/40 text-xs lg:text-sm">Select elements you'd like. Our team will handle quantities to fit your ₱{(parseInt(budget) || 0).toLocaleString()} budget.</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                                    {activeCategory === 'Flowers' && options.flowers.map((item) => (
                                        <ElementCard 
                                            key={item.name} 
                                            item={item} 
                                            isSelected={selectedFlowers.includes(item.name)}
                                            onClick={() => toggleFlower(item.name)}
                                            onZoom={() => setZoomedImage({ src: item.imageUrl, name: item.name })}
                                        />
                                    ))}
                                    {activeCategory === 'Satin' && options.ribbons.map((item) => (
                                        <ElementCard 
                                            key={item.name} 
                                            item={item} 
                                            isSelected={ribbon?.name === item.name}
                                            onClick={() => setRibbon(item)}
                                            onZoom={() => item.imageUrl && setZoomedImage({ src: item.imageUrl, name: item.name })}
                                        />
                                    ))}
                                    {activeCategory === 'Wrapping' && options.wrappers.map((item) => (
                                        <ElementCard 
                                            key={item.name} 
                                            item={item} 
                                            isSelected={wrapper?.name === item.name}
                                            onClick={() => setWrapper(item)}
                                            onZoom={() => item.imageUrl && setZoomedImage({ src: item.imageUrl, name: item.name })}
                                        />
                                    ))}
                                    {activeCategory === 'Fillers' && (
                                        <>
                                            <button
                                                onClick={() => setFiller(null)}
                                                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${!filler ? 'border-primary bg-white shadow-xl shadow-primary/10 ring-1 ring-primary' : 'border-border/30 bg-white hover:border-primary/40'}`}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-bg-main flex items-center justify-center text-text-dark/20 group-hover:text-primary transition-colors">
                                                    <X size={24} />
                                                </div>
                                                <span className="font-bold text-xs text-text-dark/40">No Fillers</span>
                                            </button>
                                            {options.fillers.map((item) => (
                                                <ElementCard 
                                                    key={item.name} 
                                                    item={item} 
                                                    isSelected={filler?.name === item.name}
                                                    onClick={() => setFiller(item)}
                                                    onZoom={() => item.imageUrl && setZoomedImage({ src: item.imageUrl, name: item.name })}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {activeCategory === 'Add Ons' && (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-dark/20 gap-4">
                                            <Plus size={48} strokeWidth={1} />
                                            <p className="font-bold uppercase tracking-widest text-xs">No Add-ons Available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Wishlist Sidebar */}
                            <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border/10 p-6 lg:p-8 flex flex-col bg-bg-main/30 shrink-0">
                                <h4 className="text-[10px] font-bold text-text-dark/30 tracking-[0.2em] uppercase mb-4 lg:mb-8 text-center">Your Wishlist</h4>
                                <div className="flex-1 space-y-4 lg:overflow-y-auto hide-scrollbar">
                                    {selectedFlowers.length === 0 && !ribbon && !wrapper && !filler ? (
                                        <p className="text-center text-text-dark/20 text-sm italic py-12">• No items selected yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedFlowers.map(f => (
                                                <WishlistItem key={f} label={f} category="Flower" onRemove={() => toggleFlower(f)} />
                                            ))}
                                            {filler && <WishlistItem label={filler.name} category="Filler" onRemove={() => setFiller(null)} />}
                                            {ribbon && <WishlistItem label={ribbon.name} category="Ribbon" onRemove={() => setRibbon(null)} />}
                                            {wrapper && <WishlistItem label={wrapper.name} category="Wrapper" onRemove={() => setWrapper(null)} />}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-6 border-t border-border/20 mt-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-text-dark/40">Total Budget</span>
                                        <span className="text-xl font-bold text-primary">₱{(parseInt(budget) || 0).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-text-dark/20 italic">Quantities adjusted to fit budget</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="w-full p-6 lg:p-12 flex flex-col space-y-6 lg:space-y-8"
                        >
                            <div className="max-w-md">
                                <h3 className="text-2xl lg:text-3xl font-serif font-bold text-text-dark mb-2 lg:mb-4">Final Touches</h3>
                                <p className="text-text-dark/50 text-sm lg:text-base">Add a heart-felt message and any special vision you have for this bouquet.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest pl-1">Card Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write something sweet for the recipient..."
                                        maxLength={200}
                                        rows={5}
                                        className="w-full p-6 bg-bg-main border-2 border-transparent focus:border-primary/10 rounded-[2rem] focus:outline-none text-text-dark font-medium placeholder:text-text-dark/20 text-lg resize-none"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest pl-1">Special Vision</label>
                                    <textarea
                                        value={bespokeRequest}
                                        onChange={(e) => setBespokeRequest(e.target.value)}
                                        placeholder="Specific requests? (e.g., 'Make it look vintage', 'More white fillers')..."
                                        rows={5}
                                        className="w-full p-6 bg-bg-main border-2 border-transparent focus:border-primary/10 rounded-[2rem] focus:outline-none text-text-dark font-medium placeholder:text-text-dark/20 text-lg resize-none"
                                    />
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <span className="text-[10px] font-bold text-primary/40 uppercase block mb-1">Budget</span>
                                    <p className="font-bold text-lg text-text-dark">₱{(parseInt(budget) || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary/40 uppercase block mb-1">Flowers</span>
                                    <p className="font-bold text-lg text-text-dark truncate">{selectedFlowers.join(', ') || 'None selected'}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary/40 uppercase block mb-1">Style</span>
                                    <p className="font-bold text-lg text-text-dark truncate">{wrapper?.name} & {ribbon?.name}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-primary/40 uppercase block mb-1">Filler</span>
                                    <p className="font-bold text-lg text-text-dark">{filler?.name || 'None'}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="px-4 lg:px-8 py-4 lg:py-6 border-t border-border/10 bg-white flex items-center justify-between">
                <button
                    onClick={prevStep}
                    className={`flex items-center gap-1 lg:gap-2 px-4 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-sm lg:text-base font-bold transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-text-dark/40 hover:text-primary hover:bg-bg-main'}`}
                >
                    <ArrowRight size={18} className="rotate-180 lg:w-5 lg:h-5" /> Back
                </button>

                {currentStep < steps.length ? (
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-1 lg:gap-2 px-6 lg:px-12 py-3 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl text-sm lg:text-base font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                    >
                        Next Step <ArrowRight size={18} className="lg:w-5 lg:h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleGenerateSummary}
                        className="flex items-center gap-1 lg:gap-2 px-6 lg:px-12 py-3 lg:py-4 bg-primary text-white rounded-xl lg:rounded-2xl text-sm lg:text-base font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
                    >
                        Review & Order <Save size={18} className="lg:w-5 lg:h-5" />
                    </button>
                )}
            </div>

            {/* Modals */}
            <OrderSummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orderData={orderData}
                type="custom"
            />

            {/* Enlarge Image Modal */}
            <AnimatePresence>
                {zoomedImage && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setZoomedImage(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white rounded-[3rem] p-6 max-w-xl w-full flex flex-col items-center shadow-2xl"
                        >
                            <button
                                onClick={() => setZoomedImage(null)}
                                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-text-dark/40 hover:text-primary transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-full aspect-square bg-bg-main rounded-[2rem] overflow-hidden p-8 flex items-center justify-center">
                                <img src={zoomedImage.src} alt={zoomedImage.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-8 font-serif font-bold text-3xl text-text-dark">{zoomedImage.name}</h3>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ElementCard({ item, isSelected, onClick, onZoom }) {
    return (
        <button
            onClick={onClick}
            className={`group relative p-6 rounded-[2.5rem] border-2 transition-all text-center flex flex-col items-center bg-white ${isSelected ? 'border-primary shadow-xl shadow-primary/10 ring-1 ring-primary' : 'border-border/30 hover:border-primary/40 hover:shadow-lg'}`}
        >
            <div className="aspect-square w-full mb-4 bg-bg-main rounded-[1.5rem] p-2 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                {item.imageUrl ? (
                    <>
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onZoom(); }}
                            className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-dark/30 opacity-0 group-hover:opacity-100 hover:text-primary shadow-sm transition-all"
                        >
                            <ZoomIn size={14} />
                        </button>
                    </>
                ) : (
                    <div className="w-12 h-12 rounded-full shadow-inner border border-white/40" style={{ backgroundColor: item.hex || '#E0E0E0' }} />
                )}
            </div>
            <span className="font-bold text-text-dark text-sm leading-tight group-hover:text-primary transition-colors">{item.name}</span>
            {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0">
                    <Check size={14} />
                </div>
            )}
        </button>
    )
}

function WishlistItem({ label, category, onRemove }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-border/10 group">
            <div className="flex flex-col">
                <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">{category}</span>
                <span className="font-bold text-xs text-text-dark">{label}</span>
            </div>
            <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-text-dark/20 hover:text-red-500 transition-all">
                <X size={14} />
            </button>
        </div>
    )
}
