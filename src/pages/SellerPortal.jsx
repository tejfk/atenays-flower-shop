import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Trash2, Edit3, Save, X, Image as ImageIcon,
    Check, Package, DollarSign, LayoutDashboard, User,
    LogOut, Globe, MessageCircle, Instagram, Facebook,
    Info, Settings, ChevronRight, TrendingUp, BarChart2,
    Camera, Palette, Sparkles, UploadCloud, ZoomIn
} from 'lucide-react'
import { db, storage } from '../firebase/firebaseConfig'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function SellerPortal() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const bloomInputRef = useRef(null)
    const flowerInputRef = useRef(null)
    const wrapperInputRef = useRef(null)
    const ribbonInputRef = useRef(null)
    const fillerInputRef = useRef(null)
    const [activeTab, setActiveTab] = useState('catalog') // 'catalog' | 'profile' | 'customization'
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Customization State
    const [customization, setCustomization] = useState({
        flowers: [],
        wrappers: [],
        ribbons: [],
        fillers: []
    })
    const [isSavingCustom, setIsSavingCustom] = useState(false)
    const [newFlower, setNewFlower] = useState({ name: '', image: null, preview: null })
    const [newWrapper, setNewWrapper] = useState({ name: '', hex: '#000000', image: null, preview: null })
    const [newRibbon, setNewRibbon] = useState({ name: '', hex: '#000000', image: null, preview: null })
    const [zoomedImage, setZoomedImage] = useState(null)
    const [newFiller, setNewFiller] = useState({ name: '', image: null, preview: null })

    // Catalog State
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [productFormData, setProductFormData] = useState({
        name: '', minPrice: '', maxPrice: '', description: '',
        emoji: '🌸', imageUrl: '', category: 'Romance', badge: '',
        occasion: "Valentine's Day", isAvailable: true
    })

    // Profile State
    const [profileData, setProfileData] = useState({
        sellerName: "Ate Nay's Flower Shop",
        tagline: "Floral Artistry for Every Occasion",
        about: "We specialize in personalized flower arrangements that speak the language of your heart.",
        facebook: "fwenKO",
        instagram: "",
        messenger: "fwenKO",
        address: "Carbon Market Interim Building, Cebu City"
    })
    const [isSavingProfile, setIsSavingProfile] = useState(false)



    useEffect(() => {
        fetchProducts()
        fetchProfile()

        fetchCustomization()
    }, [])

    const fetchCustomization = async () => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
        try {
            const docRef = doc(db, 'settings', 'customization')
            const docSnap = await Promise.race([getDoc(docRef), timeout])
            if (docSnap.exists()) {
                setCustomization(docSnap.data())
            }
        } catch (error) {
            console.error("Error fetching customization:", error)
        }
    }

    const uploadCustomImage = async (file, path) => {
        if (!file) return null
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const storageRef = ref(storage, `customization/${path}/${Date.now()}_${sanitizedName}`)
        const uploadTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Upload Timeout")), 30000))
        const uploadResult = await Promise.race([uploadBytes(storageRef, file), uploadTimeout])
        return await getDownloadURL(storageRef)
    }

    const handleSaveCustomization = async () => {
        setIsSavingCustom(true)
        try {
            await setDoc(doc(db, 'settings', 'customization'), customization)
            toast.success("Customization settings saved!")
        } catch (error) {
            console.error("Error saving customization:", error)
            toast.error("Failed to save customization.")
        } finally {
            setIsSavingCustom(false)
        }
    }



    const fetchProducts = async () => {
        setLoadingProducts(true)
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
        try {
            const querySnapshot = await Promise.race([getDocs(collection(db, 'products')), timeout])
            const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setProducts(fetched)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const fetchProfile = async () => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000))
        try {
            const docRef = doc(db, 'settings', 'sellerProfile')
            const docSnap = await Promise.race([getDoc(docRef), timeout])
            if (docSnap.exists()) {
                setProfileData(docSnap.data())
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setIsSavingProfile(true)
        try {
            await setDoc(doc(db, 'settings', 'sellerProfile'), {
                ...profileData,
                updatedAt: serverTimestamp()
            })
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error("Error saving profile:", error)
            toast.error("Failed to update profile.")
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // 5MB Limit
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File is too large! Please upload images smaller than 5MB.")
                e.target.value = null // Reset input
                return
            }
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadImage = async (file) => {
        if (!file) return null
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
        const storageRef = ref(storage, `product-images/${Date.now()}_${sanitizedName}`)
        const uploadTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Upload Timeout")), 30000))
        const uploadResult = await Promise.race([uploadBytes(storageRef, file), uploadTimeout])
        return await getDownloadURL(uploadResult.ref)
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault()
        setLoadingProducts(true)
        setIsUploading(true)
        try {
            let finalImageUrl = productFormData.imageUrl

            // Upload new image if selected
            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile)
                if (uploadedUrl) finalImageUrl = uploadedUrl
            }

            const payload = {
                ...productFormData,
                imageUrl: finalImageUrl,
                minPrice: Number(productFormData.minPrice),
                maxPrice: Number(productFormData.maxPrice),
                updatedAt: serverTimestamp()
            }

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), payload)
            } else {
                await addDoc(collection(db, 'products'), {
                    ...payload,
                    createdAt: serverTimestamp(),
                    viewCount: 0
                })
            }
            setIsProductModalOpen(false)
            setEditingProduct(null)
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            setImagePreview(null)
            setProductFormData({
                name: '', minPrice: '', maxPrice: '', description: '',
                emoji: '🌸', imageUrl: '', category: 'Romance', badge: '',
                occasion: "Valentine's Day", isAvailable: true
            })
            fetchProducts()
            toast.success(editingProduct ? "Bouquet updated successfully!" : "Bouquet added successfully!")
        } catch (error) {
            console.error("Error saving product:", error)

            let userMessage = "Failed to save product."
            if (error.code === 'storage/unauthorized') {
                userMessage = "Access Denied. Please make sure you published the Storage Rules in Firebase Console."
            } else if (error.code === 'storage/retry-limit-exceeded' || error.message?.includes('CORS')) {
                userMessage = "Cloud Connection Error. This is usually caused by CORS settings. Please check the 'cors.json' fix I provided."
            } else if (error.message?.includes('offline')) {
                userMessage = "Firebase says you are 'offline'. Please check your internet or try refreshing the page."
            } else {
                userMessage = `Error: ${error.message || error.code || "Something went wrong."}`
            }

            toast.error(userMessage)
        } finally {
            setLoadingProducts(false)
            setIsUploading(false)
        }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Delete this bouquet?")) return
        try {
            await deleteDoc(doc(db, 'products', id))
            fetchProducts()
        } catch (error) {
            console.error("Error deleting:", error)
        }
    }

    const openProductEdit = (product) => {
        setEditingProduct(product)
        setProductFormData({
            name: product.name,
            minPrice: product.minPrice,
            maxPrice: product.maxPrice,
            description: product.description,
            emoji: product.emoji || '🌸',
            imageUrl: product.imageUrl || '',
            category: product.category || 'Romance',
            badge: product.badge || '',
            occasion: product.occasion || "Valentine's Day",
            isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
        })
        setImagePreview(product.imageUrl || null)
        setIsProductModalOpen(true)
    }

    const handleLogout = async () => {
        if (window.confirm("Logout from Portal?")) {
            await logout()
            navigate('/login')
        }
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans text-text-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border/50 flex flex-col shrink-0">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-xl">
                            💐
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-lg leading-tight">Admin</h1>
                            <p className="text-[10px] text-text-dark/40 font-bold uppercase tracking-widest">Ate Nay's Shop</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <SidebarLink
                            icon={<Package size={20} />}
                            label="Catalog"
                            isActive={activeTab === 'catalog'}
                            onClick={() => setActiveTab('catalog')}
                        />
                        <SidebarLink
                            icon={<BarChart2 size={20} />}
                            label="Analytics"
                            isActive={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                        />
                        <SidebarLink
                            icon={<Palette size={20} />}
                            label="Customization"
                            isActive={activeTab === 'customization'}
                            onClick={() => setActiveTab('customization')}
                        />

                        <SidebarLink
                            icon={<User size={20} />}
                            label="Seller Profile"
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-border/40">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-text-dark/60 hover:text-primary font-medium transition-colors text-sm mb-2"
                    >
                        <Globe size={18} /> View Website
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all text-sm"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
                {!isOnline && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3 text-red-700">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <Info size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Connection Lost</p>
                                <p className="text-xs opacity-80">You are currently offline. Changes may not be saved.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { fetchProducts(); fetchProfile(); fetchRecentBlooms(); fetchCustomization(); }}
                            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Reconnect
                        </button>
                    </motion.div>
                )}
                <AnimatePresence mode="wait">
                    {activeTab === 'catalog' ? (
                        <motion.div
                            key="catalog"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold mb-2">Product Catalog</h2>
                                    <p className="text-text-dark/50">Manage your bouquets, prices, and availability.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setProductFormData({
                                            name: '', minPrice: '', maxPrice: '', description: '',
                                            emoji: '🌸', imageUrl: '', category: 'Romance', badge: ''
                                        });
                                        setIsProductModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95 shrink-0"
                                >
                                    <Plus size={20} /> Add New Bouquet
                                </button>
                            </div>

                            {loadingProducts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white animate-pulse rounded-[2rem] border border-border/40" />)}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-32 bg-white rounded-[3rem] border border-border/50 border-dashed">
                                    <div className="text-6xl mb-6 opacity-20">🌸</div>
                                    <h3 className="text-xl font-serif font-bold text-text-dark mb-2">Catalog is empty</h3>
                                    <p className="text-text-dark/40 max-w-sm mx-auto mb-8">Establish your storefront by adding your first bouquet.</p>
                                    {!isOnline && (
                                        <button
                                            onClick={fetchProducts}
                                            className="px-8 py-3 bg-bg-main text-text-dark rounded-xl font-bold hover:bg-border/20 transition-all border border-border"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product) => (
                                        <AdminProductCard
                                            key={product.id}
                                            product={product}
                                            onEdit={openProductEdit}
                                            onDelete={handleDeleteProduct}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : activeTab === 'analytics' ? (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl font-serif font-bold mb-2">Bouquet Analytics</h2>
                                <p className="text-text-dark/50">Tracking real-time engagement and popularity of your arrangements.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-dark/40 uppercase tracking-widest">Total Views</p>
                                        <h3 className="text-3xl font-serif font-bold">{products.reduce((acc, p) => acc + (p.viewCount || 0), 0)}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-dark/40 uppercase tracking-widest">Active Listings</p>
                                        <h3 className="text-3xl font-serif font-bold">{products.filter(p => p.isAvailable !== false).length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] border border-border/50 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-border/40">
                                    <h3 className="text-xl font-serif font-bold">Popularity Ranking</h3>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {[...products].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map((product, index) => (
                                            <div key={product.id} className="flex items-center gap-6 group">
                                                <div className="w-12 h-12 rounded-xl bg-bg-main flex items-center justify-center font-serif font-bold text-primary shrink-0 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                                    #{index + 1}
                                                </div>
                                                <div className="w-16 h-16 rounded-2xl bg-bg-main overflow-hidden border border-border/40 shrink-0">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">{product.emoji || '🌸'}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-text-dark mb-1 truncate">{product.name}</h4>
                                                    <p className="text-xs text-text-dark/40 font-bold uppercase tracking-widest">{product.occasion || 'General'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-primary">{product.viewCount || 0}</div>
                                                    <p className="text-[10px] text-text-dark/40 font-bold uppercase tracking-widest">Unique Views</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === 'customization' ? (
                        <motion.div
                            key="customization"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold mb-2">Bouquet Customization</h2>
                                    <p className="text-text-dark/50">Manage the options available in your Customize feature.</p>
                                </div>
                                <button
                                    onClick={handleSaveCustomization}
                                    disabled={isSavingCustom}
                                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isSavingCustom ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                                    Save Settings
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Flowers Section */}
                                <section className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
                                    <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Sparkles className="text-primary" size={24} /> Available Flowers
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                                        {customization.flowers.map((flower, idx) => (
                                            <div key={idx} title={flower.name} className="relative group aspect-square p-2 bg-white border border-primary/20 hover:border-primary/40 rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-all hover:shadow-sm">
                                                {flower.imageUrl ? (
                                                    <>
                                                        <img src={flower.imageUrl} alt={flower.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setZoomedImage({ src: flower.imageUrl, name: flower.name });
                                                            }}
                                                            className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                            title="Enlarge Image"
                                                        >
                                                            <ZoomIn size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-40 text-center break-words">{flower.name}</div>
                                                )}
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-2 z-10">
                                                    <span className="text-text-dark font-bold text-center text-[10px] leading-tight mb-2">{flower.name}</span>
                                                    <button onClick={async () => {
                                                        const newFlowers = [...customization.flowers]
                                                        newFlowers.splice(idx, 1)
                                                        const newState = { ...customization, flowers: newFlowers }
                                                        setCustomization(newState)
                                                        try { await setDoc(doc(db, 'settings', 'customization'), newState); toast.success("Flower removed!") }
                                                        catch (e) { toast.error("Failed to remove flower") }
                                                    }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {newFlower.preview ? (
                                        <div className="bg-bg-main p-6 rounded-2xl border border-border border-dashed flex flex-col md:flex-row gap-6 items-start mt-6">
                                            <div className="w-32 h-32 rounded-xl border border-border/60 overflow-hidden shrink-0 relative group shadow-inner">
                                                <img src={newFlower.preview} alt="Upload preview" className="w-full h-full object-cover" />
                                                <button onClick={() => {
                                                    setNewFlower({ name: '', image: null, preview: null })
                                                    if (flowerInputRef.current) flowerInputRef.current.value = ''
                                                }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div>
                                                    <label className="text-xs font-bold text-text-dark/50 uppercase tracking-wider ml-1">Flower Name</label>
                                                    <input
                                                        type="text"
                                                        value={newFlower.name}
                                                        onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
                                                        placeholder="e.g. Premium Ecuadorian Rose"
                                                        autoFocus
                                                        className="w-full mt-1 px-4 py-3 bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            if (newFlower.name.trim()) {
                                                                setIsSavingCustom(true)
                                                                try {
                                                                    let url = ''
                                                                    if (newFlower.image) {
                                                                        url = await uploadCustomImage(newFlower.image, 'flowers')
                                                                    }
                                                                    const newState = { ...customization, flowers: [...(customization.flowers || []), { name: newFlower.name.trim(), imageUrl: url }] }
                                                                    setCustomization(newState)
                                                                    await setDoc(doc(db, 'settings', 'customization'), newState)
                                                                    setNewFlower({ name: '', image: null, preview: null })
                                                                    if (flowerInputRef.current) flowerInputRef.current.value = ''
                                                                    toast.success("Flower added successfully!")
                                                                } catch (error) {
                                                                    console.error("Flower upload error:", error)
                                                                    toast.error("Failed to add flower: " + (error.message || "Unknown error"))
                                                                } finally {
                                                                    setIsSavingCustom(false)
                                                                }
                                                            }
                                                        }}
                                                        disabled={isSavingCustom || !newFlower.name.trim()}
                                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-sm"
                                                    >
                                                        {isSavingCustom ? 'Uploading...' : 'Add to Catalog'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setNewFlower({ name: '', image: null, preview: null })
                                                            if (flowerInputRef.current) flowerInputRef.current.value = ''
                                                        }}
                                                        disabled={isSavingCustom}
                                                        className="px-6 py-3 bg-transparent text-text-dark/50 rounded-xl font-bold hover:text-text-dark hover:bg-black/5 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => flowerInputRef.current?.click()}
                                            className="w-full mt-6 py-12 rounded-2xl border-2 border-dashed border-border/60 bg-bg-main/50 hover:bg-bg-main cursor-pointer transition-all flex flex-col items-center justify-center text-text-dark/60 gap-3 group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <UploadCloud size={24} />
                                            </div>
                                            <span className="font-medium">Click or drop image to upload a new Flower</span>
                                        </div>
                                    )}
                                    <input type="file" ref={flowerInputRef} className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) { toast.error("Image must be smaller than 2MB"); return; }
                                            setNewFlower({ ...newFlower, image: file, preview: URL.createObjectURL(file) })
                                        }
                                    }} />
                                </section>

                                {/* Wrappers Section */}
                                <section className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
                                    <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Palette className="text-primary" size={24} /> Available Wrappers
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                                        {customization.wrappers.map((wrapper, idx) => (
                                            <div key={idx} title={wrapper.name} className="relative group aspect-square p-2 bg-white border border-primary/20 hover:border-primary/40 rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-all hover:shadow-sm">
                                                {wrapper.imageUrl ? (
                                                    <>
                                                        <img src={wrapper.imageUrl} alt={wrapper.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setZoomedImage({ src: wrapper.imageUrl, name: wrapper.name });
                                                            }}
                                                            className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                            title="Enlarge Image"
                                                        >
                                                            <ZoomIn size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-40 text-center break-words">{wrapper.name}</div>
                                                )}
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-2 z-10">
                                                    <span className="text-text-dark font-bold text-center text-[10px] leading-tight mb-2">{wrapper.name}</span>
                                                    <button onClick={async () => {
                                                        const newWrappers = [...customization.wrappers]
                                                        newWrappers.splice(idx, 1)
                                                        const newState = { ...customization, wrappers: newWrappers }
                                                        setCustomization(newState)
                                                        try { await setDoc(doc(db, 'settings', 'customization'), newState); toast.success("Wrapper removed!") }
                                                        catch (e) { toast.error("Failed to remove wrapper") }
                                                    }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {newWrapper.preview ? (
                                        <div className="bg-bg-main p-6 rounded-2xl border border-border border-dashed flex flex-col md:flex-row gap-6 items-start mt-6">
                                            <div className="w-32 h-32 rounded-xl border border-border/60 overflow-hidden shrink-0 relative group shadow-inner">
                                                {newWrapper.preview && <img src={newWrapper.preview} alt="Upload preview" className="w-full h-full object-cover" />}
                                                <button onClick={() => {
                                                    setNewWrapper({ name: '', hex: '#000000', image: null, preview: null })
                                                    if (wrapperInputRef.current) wrapperInputRef.current.value = ''
                                                }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div className="flex gap-4 flex-col sm:flex-row">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-text-dark/50 uppercase tracking-wider ml-1">Wrapper Name</label>
                                                        <input
                                                            type="text"
                                                            value={newWrapper.name}
                                                            onChange={(e) => setNewWrapper({ ...newWrapper, name: e.target.value })}
                                                            placeholder="e.g. Matte Black"
                                                            autoFocus
                                                            className="w-full mt-1 px-4 py-3 bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            if (newWrapper.name.trim()) {
                                                                setIsSavingCustom(true)
                                                                try {
                                                                    let url = ''
                                                                    if (newWrapper.image) url = await uploadCustomImage(newWrapper.image, 'wrappers')
                                                                    const itemData = { name: newWrapper.name.trim(), hex: newWrapper.hex, imageUrl: url }
                                                                    const newState = { ...customization, wrappers: [...(customization.wrappers || []), itemData] }
                                                                    setCustomization(newState)
                                                                    await setDoc(doc(db, 'settings', 'customization'), newState)
                                                                    setNewWrapper({ name: '', hex: '#000000', image: null, preview: null })
                                                                    if (wrapperInputRef.current) wrapperInputRef.current.value = ''
                                                                    toast.success("Wrapper added successfully!")
                                                                } catch (error) {
                                                                    console.error("Wrapper upload error:", error)
                                                                    toast.error("Failed to add wrapper: " + (error.message || "Unknown error"))
                                                                } finally {
                                                                    setIsSavingCustom(false)
                                                                }
                                                            }
                                                        }}
                                                        disabled={isSavingCustom || !newWrapper.name.trim()}
                                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-sm"
                                                    >
                                                        {isSavingCustom ? 'Uploading...' : 'Add to Catalog'}
                                                    </button>
                                                    <button onClick={() => { setNewWrapper({ name: '', hex: '#000000', image: null, preview: null }); if (wrapperInputRef.current) wrapperInputRef.current.value = '' }} disabled={isSavingCustom} className="px-6 py-3 bg-transparent text-text-dark/50 rounded-xl font-bold hover:text-text-dark hover:bg-black/5 transition-all">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => wrapperInputRef.current?.click()} className="w-full mt-6 py-12 rounded-2xl border-2 border-dashed border-border/60 bg-bg-main/50 hover:bg-bg-main cursor-pointer transition-all flex flex-col items-center justify-center text-text-dark/60 gap-3 group">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><UploadCloud size={24} /></div>
                                            <span className="font-medium">Click or drop image to upload a new Wrapper</span>
                                        </div>
                                    )}
                                    <input type="file" ref={wrapperInputRef} className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) { toast.error("Image must be smaller than 2MB"); return; }
                                            setNewWrapper({ ...newWrapper, image: file, preview: URL.createObjectURL(file) })
                                        }
                                    }} />
                                </section>

                                {/* Ribbons Section */}
                                <section className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
                                    <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Info className="text-primary" size={24} /> Available Ribbons
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                                        {customization.ribbons?.map((ribbon, idx) => (
                                            <div key={idx} title={ribbon.name} className="relative group aspect-square p-2 bg-white border border-primary/20 hover:border-primary/40 rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-all hover:shadow-sm">
                                                {ribbon.imageUrl ? (
                                                    <>
                                                        <img src={ribbon.imageUrl} alt={ribbon.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setZoomedImage({ src: ribbon.imageUrl, name: ribbon.name });
                                                            }}
                                                            className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                            title="Enlarge Image"
                                                        >
                                                            <ZoomIn size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-40 text-center break-words">{ribbon.name}</div>
                                                )}
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-2 z-10">
                                                    <span className="text-text-dark font-bold text-center text-[10px] leading-tight mb-2">{ribbon.name}</span>
                                                    <button onClick={async () => {
                                                        const newRibbons = [...customization.ribbons]
                                                        newRibbons.splice(idx, 1)
                                                        const newState = { ...customization, ribbons: newRibbons }
                                                        setCustomization(newState)
                                                        try { await setDoc(doc(db, 'settings', 'customization'), newState); toast.success("Ribbon removed!") }
                                                        catch (e) { toast.error("Failed to remove ribbon") }
                                                    }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {newRibbon.preview ? (
                                        <div className="bg-bg-main p-6 rounded-2xl border border-border border-dashed flex flex-col md:flex-row gap-6 items-start mt-6">
                                            <div className="w-32 h-32 rounded-xl border border-border/60 overflow-hidden shrink-0 relative group shadow-inner">
                                                {newRibbon.preview && <img src={newRibbon.preview} alt="Upload preview" className="w-full h-full object-cover" />}
                                                <button onClick={() => {
                                                    setNewRibbon({ name: '', hex: '#000000', image: null, preview: null })
                                                    if (ribbonInputRef.current) ribbonInputRef.current.value = ''
                                                }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div className="flex gap-4 flex-col sm:flex-row">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-text-dark/50 uppercase tracking-wider ml-1">Ribbon Name</label>
                                                        <input
                                                            type="text"
                                                            value={newRibbon.name}
                                                            onChange={(e) => setNewRibbon({ ...newRibbon, name: e.target.value })}
                                                            placeholder="e.g. Silk Champagne"
                                                            autoFocus
                                                            className="w-full mt-1 px-4 py-3 bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            if (newRibbon.name.trim()) {
                                                                setIsSavingCustom(true)
                                                                try {
                                                                    let url = ''
                                                                    if (newRibbon.image) url = await uploadCustomImage(newRibbon.image, 'ribbons')
                                                                    const itemData = { name: newRibbon.name.trim(), hex: newRibbon.hex, imageUrl: url }
                                                                    const newState = { ...customization, ribbons: [...(customization.ribbons || []), itemData] }
                                                                    setCustomization(newState)
                                                                    await setDoc(doc(db, 'settings', 'customization'), newState)
                                                                    setNewRibbon({ name: '', hex: '#000000', image: null, preview: null })
                                                                    if (ribbonInputRef.current) ribbonInputRef.current.value = ''
                                                                    toast.success("Ribbon added successfully!")
                                                                } catch (error) {
                                                                    console.error("Ribbon upload error:", error)
                                                                    toast.error("Failed to add ribbon: " + (error.message || "Unknown error"))
                                                                } finally {
                                                                    setIsSavingCustom(false)
                                                                }
                                                            }
                                                        }}
                                                        disabled={isSavingCustom || !newRibbon.name.trim()}
                                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-sm"
                                                    >
                                                        {isSavingCustom ? 'Uploading...' : 'Add to Catalog'}
                                                    </button>
                                                    <button onClick={() => { setNewRibbon({ name: '', hex: '#000000', image: null, preview: null }); if (ribbonInputRef.current) ribbonInputRef.current.value = '' }} disabled={isSavingCustom} className="px-6 py-3 bg-transparent text-text-dark/50 rounded-xl font-bold hover:text-text-dark hover:bg-black/5 transition-all">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => ribbonInputRef.current?.click()} className="w-full mt-6 py-12 rounded-2xl border-2 border-dashed border-border/60 bg-bg-main/50 hover:bg-bg-main cursor-pointer transition-all flex flex-col items-center justify-center text-text-dark/60 gap-3 group">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"><UploadCloud size={24} /></div>
                                            <span className="font-medium">Click or drop image to upload a new Ribbon</span>
                                        </div>
                                    )}
                                    <input type="file" ref={ribbonInputRef} className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) { toast.error("Image must be smaller than 2MB"); return; }
                                            setNewRibbon({ ...newRibbon, image: file, preview: URL.createObjectURL(file) })
                                        }
                                    }} />
                                </section>

                                {/* Fillers Section */}
                                <section className="bg-white p-8 rounded-[2.5rem] border border-border/50 shadow-sm">
                                    <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Sparkles className="text-secondary" size={24} /> Available Fillers
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                                        {customization.fillers.map((filler, idx) => (
                                            <div key={idx} title={filler.name} className="relative group aspect-square p-2 bg-white border border-primary/20 hover:border-primary/40 rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-all hover:shadow-sm">
                                                {filler.imageUrl ? (
                                                    <>
                                                        <img src={filler.imageUrl} alt={filler.name} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setZoomedImage({ src: filler.imageUrl, name: filler.name });
                                                            }}
                                                            className="absolute top-2 left-2 z-20 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-text-dark/60 opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-white shadow-sm transition-all"
                                                            title="Enlarge Image"
                                                        >
                                                            <ZoomIn size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-40 text-center break-words">{filler.name}</div>
                                                )}
                                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-2 z-10">
                                                    <span className="text-text-dark font-bold text-center text-[10px] leading-tight mb-2">{filler.name}</span>
                                                    <button onClick={async () => {
                                                        const newFillers = [...customization.fillers]
                                                        newFillers.splice(idx, 1)
                                                        const newState = { ...customization, fillers: newFillers }
                                                        setCustomization(newState)
                                                        try { await setDoc(doc(db, 'settings', 'customization'), newState); toast.success("Filler removed!") }
                                                        catch (e) { toast.error("Failed to remove filler") }
                                                    }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {newFiller.preview ? (
                                        <div className="bg-bg-main p-6 rounded-2xl border border-border border-dashed flex flex-col md:flex-row gap-6 items-start mt-6">
                                            <div className="w-32 h-32 rounded-xl border border-border/60 overflow-hidden shrink-0 relative group shadow-inner">
                                                <img src={newFiller.preview} alt="Upload preview" className="w-full h-full object-cover" />
                                                <button onClick={() => {
                                                    setNewFiller({ name: '', image: null, preview: null })
                                                    if (fillerInputRef.current) fillerInputRef.current.value = ''
                                                }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-4 w-full">
                                                <div>
                                                    <label className="text-xs font-bold text-text-dark/50 uppercase tracking-wider ml-1">Filler Name</label>
                                                    <input
                                                        type="text"
                                                        value={newFiller.name}
                                                        onChange={(e) => setNewFiller({ ...newFiller, name: e.target.value })}
                                                        placeholder="e.g. Baby's Breath"
                                                        autoFocus
                                                        className="w-full mt-1 px-4 py-3 bg-white border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            if (newFiller.name.trim()) {
                                                                setIsSavingCustom(true)
                                                                try {
                                                                    let url = ''
                                                                    if (newFiller.image) {
                                                                        url = await uploadCustomImage(newFiller.image, 'fillers')
                                                                    }
                                                                    const newState = { ...customization, fillers: [...(customization.fillers || []), { name: newFiller.name.trim(), imageUrl: url }] }
                                                                    setCustomization(newState)
                                                                    await setDoc(doc(db, 'settings', 'customization'), newState)
                                                                    setNewFiller({ name: '', image: null, preview: null })
                                                                    if (fillerInputRef.current) fillerInputRef.current.value = ''
                                                                    toast.success("Filler added successfully!")
                                                                } catch (error) {
                                                                    console.error("Filler upload error:", error)
                                                                    toast.error("Failed to add filler: " + (error.message || "Unknown error"))
                                                                } finally {
                                                                    setIsSavingCustom(false)
                                                                }
                                                            }
                                                        }}
                                                        disabled={isSavingCustom || !newFiller.name.trim()}
                                                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 shadow-sm"
                                                    >
                                                        {isSavingCustom ? 'Uploading...' : 'Add to Catalog'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setNewFiller({ name: '', image: null, preview: null })
                                                            if (fillerInputRef.current) fillerInputRef.current.value = ''
                                                        }}
                                                        disabled={isSavingCustom}
                                                        className="px-6 py-3 bg-transparent text-text-dark/50 rounded-xl font-bold hover:text-text-dark hover:bg-black/5 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fillerInputRef.current?.click()}
                                            className="w-full mt-6 py-12 rounded-2xl border-2 border-dashed border-border/60 bg-bg-main/50 hover:bg-bg-main cursor-pointer transition-all flex flex-col items-center justify-center text-text-dark/60 gap-3 group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <UploadCloud size={24} />
                                            </div>
                                            <span className="font-medium">Click or drop image to upload a new Filler</span>
                                        </div>
                                    )}
                                    <input type="file" ref={fillerInputRef} className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 2 * 1024 * 1024) { toast.error("Image must be smaller than 2MB"); return; }
                                            setNewFiller({ ...newFiller, image: file, preview: URL.createObjectURL(file) })
                                        }
                                    }} />
                                </section>
                            </div>
                        </motion.div >

                    ) : (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-4xl"
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl font-serif font-bold mb-2">Seller Profile</h2>
                                <p className="text-text-dark/50">Update how your brand appears on the public website.</p>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-8 bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <AdminField
                                        label="Shop Name"
                                        value={profileData.sellerName}
                                        onChange={(v) => setProfileData({ ...profileData, sellerName: v })}
                                    />
                                    <AdminField
                                        label="Tagline"
                                        value={profileData.tagline}
                                        onChange={(v) => setProfileData({ ...profileData, tagline: v })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">About the Seller</label>
                                    <textarea
                                        rows={4}
                                        value={profileData.about}
                                        onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                                        className="w-full px-6 py-4 bg-bg-main border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                                        placeholder="Share your story..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <AdminField
                                        label="Facebook Username"
                                        value={profileData.facebook}
                                        placeholder="e.g. fwenKO"
                                        icon={<Facebook size={18} />}
                                        onChange={(v) => setProfileData({ ...profileData, facebook: v })}
                                    />
                                    <AdminField
                                        label="Messenger ID"
                                        value={profileData.messenger}
                                        placeholder="Usually same as Facebook"
                                        icon={<MessageCircle size={18} />}
                                        onChange={(v) => setProfileData({ ...profileData, messenger: v })}
                                    />
                                    <AdminField
                                        label="Instagram"
                                        value={profileData.instagram}
                                        icon={<Instagram size={18} />}
                                        onChange={(v) => setProfileData({ ...profileData, instagram: v })}
                                    />
                                    <AdminField
                                        label="Address / Area"
                                        value={profileData.address}
                                        onChange={(v) => setProfileData({ ...profileData, address: v })}
                                    />
                                </div>

                                <div className="pt-6 border-t border-border/40 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-3 active:scale-95"
                                    >
                                        <Save size={20} />
                                        {isSavingProfile ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )
                    }
                </AnimatePresence >
            </main >

            {/* Product Modal */}
            < AnimatePresence >
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-text-dark/60 backdrop-blur-md"
                            onClick={() => setIsProductModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 hide-scrollbar flex flex-col">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-text-dark">
                                            {editingProduct ? 'Edit Arrangement' : 'Craft New Bouquet'}
                                        </h2>
                                        <p className="text-sm text-text-dark/40">Provide the details for your new creation.</p>
                                    </div>
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-bg-main rounded-2xl transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <AdminField
                                        label="Arrangement Name"
                                        value={productFormData.name}
                                        onChange={(v) => setProductFormData({ ...productFormData, name: v })}
                                        required
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Occasion</label>
                                        <select
                                            value={productFormData.occasion}
                                            onChange={(e) => setProductFormData({ ...productFormData, occasion: e.target.value })}
                                            className="w-full px-6 py-4 bg-bg-main border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium appearance-none"
                                        >
                                            <option>Valentine's Day</option>
                                            <option>Mother's Day</option>
                                            <option>Anniversary</option>
                                            <option>Wedding</option>
                                            <option>Funeral</option>
                                        </select>
                                    </div>
                                    <AdminField
                                        label="Min Price (₱)"
                                        type="number"
                                        value={productFormData.minPrice}
                                        onChange={(v) => setProductFormData({ ...productFormData, minPrice: v })}
                                        required
                                    />
                                    <AdminField
                                        label="Max Price (₱)"
                                        type="number"
                                        value={productFormData.maxPrice}
                                        onChange={(v) => setProductFormData({ ...productFormData, maxPrice: v })}
                                        required
                                    />
                                    <div className="flex items-center gap-4 px-6 py-4 bg-bg-main border border-border/60 rounded-2xl">
                                        <div className="flex-1">
                                            <span className="text-xs font-bold text-text-dark/40 uppercase tracking-widest block">Availability</span>
                                            <span className="text-sm font-bold text-text-dark">{productFormData.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setProductFormData({ ...productFormData, isAvailable: !productFormData.isAvailable })}
                                            className={`w-12 h-6 rounded-full transition-all relative ${productFormData.isAvailable ? 'bg-primary' : 'bg-text-dark/20'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${productFormData.isAvailable ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Short Description</label>
                                        <textarea
                                            required rows={3}
                                            value={productFormData.description}
                                            onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                                            className="w-full px-6 py-4 bg-bg-main border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium resize-none shadow-inner"
                                            placeholder="Write something that moves the heart..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <AdminField
                                            label="Vibe / Emoji"
                                            value={productFormData.emoji}
                                            onChange={(v) => setProductFormData({ ...productFormData, emoji: v })}
                                        />
                                        <AdminField
                                            label="Badge (e.g. Best Seller)"
                                            value={productFormData.badge}
                                            onChange={(v) => setProductFormData({ ...productFormData, badge: v })}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">Product Image</label>
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            {/* Preview Area */}
                                            <div className="w-32 h-32 rounded-3xl bg-bg-main border border-border/60 flex items-center justify-center overflow-hidden shrink-0 group relative">
                                                {imagePreview ? (
                                                    <>
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedFile(null);
                                                                setImagePreview(null);
                                                                setProductFormData({ ...productFormData, imageUrl: '' });
                                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                                            }}
                                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <Trash2 size={24} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="text-4xl opacity-20">{productFormData.emoji || '🌸'}</div>
                                                )}
                                            </div>

                                            {/* Upload Trigger */}
                                            <div className="flex-1 w-full">
                                                <label className="block w-full border-2 border-dashed border-border/60 rounded-3xl p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                    <ImageIcon className="mx-auto mb-2 text-text-dark/20 group-hover:text-primary transition-colors" size={32} />
                                                    <p className="text-sm font-bold text-text-dark/40 group-hover:text-primary transition-colors">
                                                        {selectedFile ? selectedFile.name : 'Click to upload photo'}
                                                    </p>
                                                    <p className="text-[10px] text-text-dark/20 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-8 border-t border-border/40">
                                    <button
                                        type="button" onClick={() => setIsProductModalOpen(false)}
                                        className="flex-1 py-4 bg-bg-main text-text-dark rounded-2xl font-bold hover:bg-border/40 transition-all font-serif"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit" disabled={loadingProducts || isUploading}
                                        className="flex-[2] py-5 bg-primary text-white rounded-[1.5rem] font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing Image... (Slower internet may take a minute)
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                {editingProduct ? 'Save Changes' : 'Publish Arrangement'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

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
        </div >
    )
}

function SidebarLink({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-text-dark/50 hover:bg-bg-main hover:text-text-dark'
                }`}
        >
            {icon}
            {label}
        </button>
    )
}

function AdminProductCard({ product, onEdit, onDelete }) {
    const isAvailable = product.isAvailable !== false
    return (
        <motion.div
            layout
            className={`bg-white rounded-[2.5rem] overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all group border-b-4 ${isAvailable ? 'hover:border-b-primary' : 'grayscale border-b-red-500 opacity-80'}`}
        >
            <div className="h-48 bg-bg-main relative flex items-center justify-center overflow-hidden border-b border-border/40">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{product.emoji || '🌸'}</div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badge && (
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                            {product.badge}
                        </div>
                    )}
                    {!isAvailable && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            Sold Out
                        </div>
                    )}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-text-dark shadow-sm">
                    {product.viewCount || 0} views
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-xl text-text-dark leading-tight line-clamp-1 mb-1">{product.name}</h3>
                        <p className="text-[10px] text-text-dark/40 font-bold uppercase tracking-widest">{product.occasion || 'General'}</p>
                    </div>
                    <div className="bg-primary/5 text-primary-dark p-1.5 rounded-lg shrink-0">
                        <Package size={16} />
                    </div>
                </div>
                <div className="text-primary font-bold text-sm mb-4">
                    ₱{product.minPrice?.toLocaleString()} - ₱{product.maxPrice?.toLocaleString()}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 bg-primary/5 hover:bg-primary/10 text-primary py-3 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 size={14} /> Update
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-2xl transition-colors"
                        title="Delete product"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

function AdminField({ label, value, onChange, placeholder, type = "text", required = false, icon = null }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-text-dark/40 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-dark/30">{icon}</div>}
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-6 py-4 bg-bg-main border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium ${icon ? 'pl-12' : ''}`}
                />
            </div>
        </div>
    )
}
