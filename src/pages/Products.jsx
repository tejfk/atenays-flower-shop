import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import LoaderSkeleton from '../components/LoaderSkeleton'
import OrderingHelperBanner from '../components/OrderingHelperBanner'

// Dummy data for fallback if Firestore is empty
const FALLBACK_PRODUCTS = [
    {
        id: 'p1', name: 'Blushing Romance', minPrice: 850, maxPrice: 1500,
        description: 'A dreamy arrangement of soft pink roses and baby\'s breath, wrapped in blush organza. Perfect for anniversaries, Valentine\'s Day, or simply saying "I love you."',
        flowers: ['Pink Roses', 'Baby\'s Breath', 'Pink Carnations', 'Eucalyptus'],
        sizes: ['Mini (10–12 stems)', 'Standard (18–20 stems)', 'Grand (30+ stems)'],
        badge: 'Best Seller', emoji: '🌸', category: 'Romance'
    },
    {
        id: 'p2', name: 'Sunlit Garden', minPrice: 650, maxPrice: 1200,
        description: 'A cheerful burst of sunflowers and yellow daisies that brings warmth and joy to any room. Ideal for birthdays, get-well-soon, or celebrating milestones.',
        flowers: ['Sunflowers', 'Yellow Daisies', 'White Chrysanthemums', 'Green Ferns'],
        sizes: ['Mini (8–10 stems)', 'Standard (15–18 stems)', 'Grand (25+ stems)'],
        badge: 'New', emoji: '🌻', category: 'Cheerful'
    },
    {
        id: 'p3', name: 'Peony Paradise', minPrice: 1200, maxPrice: 2500,
        description: 'An ethereal bouquet of premium peonies and white lilies. Elegantly wrapped in muted silk ribbon — a gift of serene beauty.',
        flowers: ['Peonies', 'White Lilies', 'Eucalyptus'],
        sizes: ['Standard (15–20 stems)', 'Grand (30+ stems)'],
        badge: 'Premium', emoji: '🌸', category: 'Elegant'
    }
];

export default function Products() {
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedOccasion, setSelectedOccasion] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6 // Since we use a grid of 3 on desktop, 6 or 9 is good. Let's go with 6 for better spacing.

    const occasions = ['All', "Valentine's Day", "Mother's Day", 'Anniversary', 'Wedding', 'Funeral']

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchProducts = async () => {
            // Force a 5-second timeout for the fetch
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 5000)
            );

            try {
                const q = query(collection(db, 'products'), limit(100));
                // Race between the actual fetch and the 5-second timeout
                const querySnapshot = await Promise.race([
                    getDocs(q),
                    timeoutPromise
                ]);

                if (!querySnapshot.empty) {
                    const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    setProducts(fetchedProducts)
                } else {
                    console.log("Firestore 'products' collection is empty, using fallback data.");
                    setProducts(FALLBACK_PRODUCTS)
                }
            } catch (error) {
                console.error("Error or timeout fetching products from Firestore:", error)
                setProducts(FALLBACK_PRODUCTS)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (location.state?.selectedCategory) {
            setSelectedOccasion(location.state.selectedCategory)
        }
    }, [location.state])

    // Filter logic: Only show AVAILABLE products, then filter by occasion if not 'All'
    const filteredProducts = products.filter(product => {
        // Fallback data doesn't have isAvailable, so we assume true
        const isAvailable = product.isAvailable !== undefined ? product.isAvailable : true
        if (!isAvailable) return false

        if (selectedOccasion === 'All') return true
        return product.occasion === selectedOccasion || product.category === selectedOccasion
    })

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Reset pagination when occasion changes
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedOccasion])

    return (
        <>
            <section className="py-20 md:py-24 pt-28 md:pt-32 relative bg-white/80 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <span className="text-primary uppercase tracking-widest text-xs font-semibold mb-2 block">Fresh Arrangements</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-text-dark mb-4 md:mb-6 leading-tight">Our <em className="text-primary-dark">Featured</em> Bouquets</h2>
                        <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-8"></div>

                        {/* Occasion Filters */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {occasions.map((occasion) => (
                                <button
                                    key={occasion}
                                    onClick={() => setSelectedOccasion(occasion)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedOccasion === occasion
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-white text-text-dark/60 hover:bg-bg-main hover:text-text-dark border border-border/40'
                                        }`}
                                >
                                    {occasion}
                                </button>
                            ))}
                        </div>

                        <p className="text-text-dark/70 text-base md:text-lg">Each arrangement is uniquely crafted and made to order — no two are ever exactly alike.</p>
                    </div>

                    <OrderingHelperBanner />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => <LoaderSkeleton key={i} />)
                            : currentItems.map((product, i) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    delay={i}
                                    onViewDetails={setSelectedProduct}
                                />
                            ))
                        }
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-text-dark/40 hover:bg-primary/10 hover:text-primary border border-border/50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
                            <div className="text-6xl mb-4 opacity-50">🥀</div>
                            <h3 className="text-2xl font-serif text-text-dark mb-2">No Bouquets Found</h3>
                            <p className="text-text-dark/60 max-w-md mx-auto">We don't have available arrangements for "{selectedOccasion}" right now. Please check another occasion!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    )
}
