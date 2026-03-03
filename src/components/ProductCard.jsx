import React from 'react'
import { motion } from 'framer-motion'

export default function ProductCard({ product, onViewDetails, delay = 0 }) {
    const priceDisplay = product.minPrice !== undefined && product.maxPrice !== undefined
        ? `₱${product.minPrice.toLocaleString('en-PH')} - ₱${product.maxPrice.toLocaleString('en-PH')}`
        : `₱${(typeof product.price === 'number' ? product.price.toLocaleString('en-PH') : product.price)}`

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: delay * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-border flex flex-col cursor-pointer group"
            onClick={() => onViewDetails(product)}
        >
            {/* Image Area */}
            <div className="aspect-[4/5] overflow-hidden relative bg-[#FDFBF7] flex items-center justify-center">
                {product.imageUrl ? (
                    <img
                        loading="lazy"
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="text-6xl transform transition-transform duration-500 group-hover:scale-110">
                        {product.emoji || '🌸'}
                    </div>
                )}

                {/* Badge */}
                {product.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary-dark px-3 py-1 rounded-full text-xs font-semibold shadow-sm tracking-wide uppercase">
                        {product.badge}
                    </span>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-xl font-semibold text-text-dark mb-2">{product.name}</h3>
                <p className="text-sm text-text-dark/70 line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="font-medium text-lg text-primary-dark">
                        {priceDisplay}
                    </div>
                    <button
                        className="text-base font-semibold text-white bg-primary hover:bg-primary-dark px-5 py-2.5 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            onViewDetails(product)
                        }}
                    >
                        View
                    </button>
                </div>
            </div>
        </motion.article>
    )
}
