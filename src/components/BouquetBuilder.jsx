import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Check, Info, Sparkles, Palette, Save, ZoomIn, X, ArrowRight, UploadCloud, Image as ImageIcon } from 'lucide-react'
import OrderSummaryModal from './OrderSummaryModal'
import toast from 'react-hot-toast'
import useBuilderOptions from '../hooks/useBuilderOptions'

export default function BouquetBuilder() {
    const { options, loading } = useBuilderOptions()

    const [currentStep, setCurrentStep] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [zoomedImage, setZoomedImage] = useState(null)

    const [budget, setBudget] = useState('')
    const [selectedFlowers, setSelectedFlowers] = useState([])
    const [wrapper, setWrapper] = useState(null)
    const [ribbon, setRibbon] = useState(null)
    const [filler, setFiller] = useState(null)
    const [message, setMessage] = useState('')
    const [bespokeRequest, setBespokeRequest] = useState('')

    // Optional Reference Image State
    const [referenceImage, setReferenceImage] = useState(null)

    const steps = [
        { id: 1, title: 'Budget' },
        { id: 2, title: 'Reference' },
        { id: 3, title: 'Flowers' },
        { id: 4, title: 'Style' },
        { id: 5, title: 'Details' }
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
        // Step 2 is Reference Image, which is optional.
        if (step === 3 && selectedFlowers.length === 0) {
            toast.error("Please select at least one flower")
            return false
        }
        if (step === 4 && (!wrapper || !ribbon)) {
            toast.error("Please select a wrapper and ribbon")
            return false
        }
        return true
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length))
        }
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    // Handle Image Upload with Strict Size Limit
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Strict 2MB Limit to prevent Base64 bloat & smooth html2canvas rendering
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image too large! Please upload a file under 2MB.", { duration: 4000 })
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setReferenceImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const orderData = {
        budget: `₱${(parseInt(budget) || 0).toLocaleString('en-PH')}`,
        referenceImage,
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
        <div className="bg-white rounded-3xl md:rounded-[3rem] shadow-2xl border border-border/50 overflow-hidden flex flex-col lg:flex-row mb-12">
            {/* Configuration Form */}
            <div className="w-full lg:w-[62%] p-5 md:p-8 lg:p-12 lg:border-r border-border/40 flex flex-col h-auto lg:h-[85vh] relative pb-24 lg:pb-12">

                {/* Wizard Progress Bar */}
                <div className="mb-8 lg:mb-12 flex items-center justify-between px-1">
                    {steps.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-2 relative z-10">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${currentStep >= s.id ? 'bg-primary text-white shadow-lg' : 'bg-bg-main text-text-dark/30'}`}>
                                    {currentStep > s.id ? <Check size={20} /> : s.id}
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep >= s.id ? 'text-primary' : 'text-text-dark/30'}`}>{s.title}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 bg-bg-main relative top-[-10px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: currentStep > s.id ? '100%' : '0%' }}
                                        className="h-full bg-primary origin-left"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex-1 lg:overflow-y-auto hide-scrollbar px-1 md:px-2">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.section
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-text-dark mb-4">Set Your Budget</h3>
                                    <p className="text-text-dark/50 text-base font-medium leading-relaxed">This helps us know how grand to make your bouquet. Minimum is ₱100.</p>
                                </div>
                                <div className="relative group max-w-md">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-serif font-bold text-3xl text-text-dark/20 group-focus-within:text-primary transition-colors">₱</span>
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="1000"
                                        className="w-full pl-14 pr-6 py-8 bg-bg-main border-2 border-transparent focus:border-primary/20 rounded-[2rem] focus:outline-none font-serif font-bold text-3xl text-text-dark transition-all placeholder:text-text-dark/10"
                                        autoFocus
                                    />
                                </div>
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 text-sm text-text-dark/80 mt-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <Info className="text-primary shrink-0 mt-0.5" size={18} />
                                    <p>
                                        <strong>Note on Pricing:</strong> The budget you set above will cover all <span className="font-bold text-primary">Materials + Labor</span>.
                                        Labor is ₱150 per dozen for simple wrap local flowers, and starts at ₱300 for fragile or imported flowers.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['100', '500', '1000', '1500', '2500'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setBudget(val)}
                                            className={`px-6 py-3 rounded-xl border font-bold text-sm transition-all ${budget === val ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-text-dark/40 border-border/60 hover:border-primary/40'}`}
                                        >
                                            ₱{parseInt(val).toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {currentStep === 2 && (
                            <motion.section
                                key="step2-reference"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-text-dark mb-4">Reference Photo <span className="text-primary/60 text-lg font-medium">(Optional)</span></h3>
                                    <p className="text-text-dark/50 text-base font-medium leading-relaxed">Have a specific design in mind? Upload a photo and our florists will do their best to match the style within your budget. You can skip this step if you prefer to just pick colors and let us handle the rest.</p>
                                </div>

                                <div className="border-t border-border pt-8">
                                    <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Upload Photo</label>

                                    {!referenceImage ? (
                                        <label className="w-full relative flex flex-col items-center justify-center p-12 bg-bg-main border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] cursor-pointer transition-all group overflow-hidden">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="text-primary" size={28} />
                                            </div>
                                            <span className="font-serif font-bold text-lg text-text-dark mb-1">Click to Upload</span>
                                            <span className="text-xs text-text-dark/40 uppercase tracking-wider font-bold">PNG, JPG up to 2MB</span>
                                        </label>
                                    ) : (
                                        <div className="relative rounded-[2rem] overflow-hidden group shadow-lg">
                                            <img src={referenceImage} alt="Reference" className="w-full h-64 md:h-80 object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <div className="flex gap-4">
                                                    <label className="px-6 py-3 bg-white text-text-dark rounded-xl font-bold text-sm cursor-pointer hover:bg-bg-main transition-colors shadow-xl">
                                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                        Change
                                                    </label>
                                                    <button onClick={() => setReferenceImage(null)} className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-xl">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}

                        {currentStep === 3 && (
                            <motion.section
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-text-dark mb-4">Choose Your Flowers</h3>
                                    <p className="text-text-dark/50 text-base font-medium leading-relaxed">Select one or more varieties. Our florists will balance them beautifully within your budget.</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {options.flowers.map((flower) => (
                                        <button
                                            key={flower.name}
                                            onClick={() => toggleFlower(flower.name)}
                                            className={`relative p-5 rounded-[2rem] border transition-all text-left group overflow-hidden ${selectedFlowers.includes(flower.name)
                                                ? 'bg-white border-primary shadow-xl ring-1 ring-primary'
                                                : 'bg-white border-border/60 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="aspect-square mb-4 bg-bg-main rounded-2xl p-4 flex items-center justify-center relative overflow-hidden">
                                                {flower.imageUrl ? (
                                                    <>
                                                        <img src={flower.imageUrl} alt={flower.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setZoomedImage({ src: flower.imageUrl, name: flower.name });
                                                            }}
                                                            className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                        >
                                                            <ZoomIn size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <Sparkles className="text-primary/20" size={32} />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-serif font-bold text-text-dark">{flower.name}</span>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedFlowers.includes(flower.name) ? 'bg-primary text-white' : 'bg-bg-main text-transparent'}`}>
                                                    <Check size={14} />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {currentStep === 4 && (
                            <motion.section
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-text-dark mb-4">Ribbons, Wrapper, and Fillers</h3>
                                    <p className="text-text-dark/50 text-base font-medium leading-relaxed">Define the mood of your bouquet with premium ribbons, wrappers and fillers.</p>
                                </div>

                                <div className="space-y-12">
                                    {/* Wrapper Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6 block">Wrapper Style</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {options.wrappers.map((w) => (
                                                <button
                                                    key={w.name}
                                                    onClick={() => setWrapper(w)}
                                                    className={`relative p-4 rounded-[2rem] border transition-all text-left group overflow-hidden ${wrapper?.name === w.name
                                                        ? 'bg-white border-primary shadow-xl ring-1 ring-primary'
                                                        : 'bg-white border-border/60 hover:shadow-md'}`}
                                                >
                                                    <div className="aspect-square mb-3 bg-bg-main rounded-2xl p-3 flex items-center justify-center relative overflow-hidden">
                                                        {w.imageUrl ? (
                                                            <>
                                                                <img src={w.imageUrl} alt={w.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setZoomedImage({ src: w.imageUrl, name: w.name });
                                                                    }}
                                                                    className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                                >
                                                                    <ZoomIn size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: w.hex || '#ccc' }} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-serif font-bold text-text-dark truncate pr-2">{w.name}</span>
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${wrapper?.name === w.name ? 'bg-primary text-white' : 'bg-bg-main text-transparent'}`}>
                                                            <Check size={12} />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ribbon Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6 block">Ribbon Style</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {options.ribbons.map((r) => (
                                                <button
                                                    key={r.name}
                                                    onClick={() => setRibbon(r)}
                                                    className={`relative p-4 rounded-[2rem] border transition-all text-left group overflow-hidden ${ribbon?.name === r.name
                                                        ? 'bg-white border-primary shadow-xl ring-1 ring-primary'
                                                        : 'bg-white border-border/60 hover:shadow-md'}`}
                                                >
                                                    <div className="aspect-square mb-3 bg-bg-main rounded-2xl p-3 flex items-center justify-center relative overflow-hidden">
                                                        {r.imageUrl ? (
                                                            <>
                                                                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setZoomedImage({ src: r.imageUrl, name: r.name });
                                                                    }}
                                                                    className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                                >
                                                                    <ZoomIn size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: r.hex || '#ccc' }} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-serif font-bold text-text-dark truncate pr-2">{r.name}</span>
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${ribbon?.name === r.name ? 'bg-primary text-white' : 'bg-bg-main text-transparent'}`}>
                                                            <Check size={12} />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filler Selection */}
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-6 block">Accent Fillers (Optional)</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <button
                                                onClick={() => setFiller(null)}
                                                className={`relative p-4 rounded-[2rem] border transition-all text-center flex flex-col items-center justify-center gap-3 ${!filler
                                                    ? 'bg-white border-primary shadow-xl ring-1 ring-primary'
                                                    : 'bg-white border-border/60 hover:shadow-md'}`}
                                            >
                                                <div className="aspect-square w-full bg-bg-main rounded-2xl flex items-center justify-center">
                                                    <X size={24} className="text-text-dark/20" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-dark/40">No Filler</span>
                                            </button>
                                            {options.fillers.map((f) => (
                                                <button
                                                    key={f.name}
                                                    onClick={() => setFiller(f)}
                                                    className={`relative p-4 rounded-[2rem] border transition-all text-left group overflow-hidden ${filler?.name === f.name
                                                        ? 'bg-white border-primary shadow-xl ring-1 ring-primary'
                                                        : 'bg-white border-border/60 hover:shadow-md'}`}
                                                >
                                                    <div className="aspect-square mb-3 bg-bg-main rounded-2xl p-3 flex items-center justify-center relative overflow-hidden">
                                                        {f.imageUrl ? (
                                                            <>
                                                                <img src={f.imageUrl} alt={f.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setZoomedImage({ src: f.imageUrl, name: f.name });
                                                                    }}
                                                                    className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                                >
                                                                    <ZoomIn size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <Sparkles className="text-primary/20" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-serif font-bold text-text-dark truncate pr-2">{f.name}</span>
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${filler?.name === f.name ? 'bg-primary text-white' : 'bg-bg-main text-transparent'}`}>
                                                            <Check size={12} />
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {currentStep === 5 && (
                            <motion.section
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-text-dark mb-4">A Personal Touch</h3>
                                    <p className="text-text-dark/50 text-base font-medium leading-relaxed">Add a heartfelt message for the card and any special instructions for our florists.</p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block ml-1">Card Message</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write something sweet..."
                                            maxLength={200}
                                            rows={4}
                                            className="w-full p-5 md:p-8 bg-bg-main border-none rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark font-medium placeholder:text-text-dark/20 text-base md:text-lg shadow-inner"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-4 block ml-1">Bespoke Vision</label>
                                        <textarea
                                            value={bespokeRequest}
                                            onChange={(e) => setBespokeRequest(e.target.value)}
                                            placeholder="Any specific requests? (Rare colors, themes, additions)..."
                                            rows={4}
                                            className="w-full p-5 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark font-medium placeholder:text-primary/20 text-base md:text-lg"
                                        />
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-border/30 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4 z-20">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`w-full sm:w-auto px-6 lg:px-8 py-3.5 md:py-4 rounded-2xl font-bold transition-all text-center text-sm md:text-base ${currentStep === 1 ? 'opacity-0 pointer-events-none hidden sm:block' : 'text-text-dark/40 hover:text-text-dark bg-bg-main hover:bg-border/20'}`}
                    >
                        Go Back
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={() => { nextStep(); window.scrollTo({ top: 100, behavior: 'smooth' }); }}
                            className="w-full sm:w-auto px-6 lg:px-12 py-3.5 md:py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 flex items-center justify-center gap-3 text-sm md:text-base"
                        >
                            Continue to {steps[currentStep].title} <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerateSummary}
                            className="w-full sm:w-auto px-6 lg:px-12 py-3.5 md:py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 flex items-center justify-center gap-3 text-sm md:text-base"
                        >
                            Review & Order <Save size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Live Preview Pane */}
            <div className="w-full lg:w-[38%] bg-bg-main p-6 md:p-8 lg:p-12 flex flex-col relative overflow-hidden pb-32">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="sticky top-0 h-full flex flex-col z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <Palette className="text-primary" size={20} />
                        <h3 className="text-xl font-serif font-bold text-text-dark tracking-wide">Builder Preview</h3>
                    </div>

                    <div className="flex-1 space-y-6">
                        {/* High-Level Stats */}
                        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] shadow-xl border border-white relative overflow-hidden">
                            <div className="space-y-6">
                                <div className="flex items-end justify-between border-b border-border/40 pb-6">
                                    <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-[0.3em]">Total Budget</span>
                                    <span className="text-3xl font-serif font-bold text-primary">₱{(parseInt(budget) || 0).toLocaleString()}</span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-[0.3em] block mb-3">Selections</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFlowers.length > 0 ? (
                                                selectedFlowers.map(f => (
                                                    <span key={f} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 transition-all">{f}</span>
                                                ))
                                            ) : (
                                                <span className="text-text-dark/20 text-xs italic">No flowers chosen...</span>
                                            )}
                                        </div>
                                    </div>

                                    {referenceImage && (
                                        <div className="mt-4 border-2 border-border/50 rounded-2xl overflow-hidden aspect-video bg-bg-main">
                                            <img src={referenceImage} alt="Reference Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                                        <div className="p-4 bg-white/40 rounded-2xl border border-white flex flex-col justify-center">
                                            <span className="text-[8px] font-bold text-text-dark/40 uppercase tracking-widest block mb-1">Wrapper</span>
                                            <span className="font-bold text-xs truncate block">{wrapper?.name || 'Pending'}</span>
                                        </div>
                                        <div className="p-4 bg-white/40 rounded-2xl border border-white flex flex-col justify-center">
                                            <span className="text-[8px] font-bold text-text-dark/40 uppercase tracking-widest block mb-1">Ribbon</span>
                                            <span className="font-bold text-xs truncate block">{ribbon?.name || 'Pending'}</span>
                                        </div>
                                        <div className="p-4 bg-white/40 rounded-2xl border border-white flex flex-col justify-center">
                                            <span className="text-[8px] font-bold text-text-dark/40 uppercase tracking-widest block mb-1">Filler</span>
                                            <span className="font-bold text-xs truncate block">{filler?.name || 'None'}</span>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="mt-2 p-4 bg-white/40 rounded-2xl border border-white">
                                            <span className="text-[8px] font-bold text-text-dark/40 uppercase tracking-widest block mb-1">Card Message</span>
                                            <p className="text-[10px] text-text-dark font-medium leading-relaxed italic line-clamp-2">"{message}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            className="relative bg-white rounded-[2.5rem] p-4 max-w-xl w-full flex flex-col items-center shadow-2xl"
                        >
                            <button
                                onClick={() => setZoomedImage(null)}
                                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-text-dark/60 hover:text-text-dark hover:bg-white shadow-sm transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-full aspect-square bg-bg-main rounded-[2rem] overflow-hidden p-6 flex items-center justify-center">
                                <img src={zoomedImage.src} alt={zoomedImage.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-6 mb-2 font-serif font-bold text-2xl text-text-dark">{zoomedImage.name}</h3>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
