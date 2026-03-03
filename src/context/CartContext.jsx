import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

export function useCart() {
    return useContext(CartContext)
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const item = window.localStorage.getItem('atenays_cart')
            return item ? JSON.parse(item) : []
        } catch (error) {
            console.warn('Error reading cart from localStorage', error)
            return []
        }
    })

    const [isCartOpen, setIsCartOpen] = useState(false)

    // 2. Sync changes back to localStorage whenever cartItems changes
    useEffect(() => {
        try {
            window.localStorage.setItem('atenays_cart', JSON.stringify(cartItems))
        } catch (error) {
            console.warn('Error saving cart to localStorage', error)
        }
    }, [cartItems])

    // 3. Cart Operations
    const addToCart = (item) => {
        setCartItems(prev => {
            // Check if exact same item exists (useful for catalog items)
            if (item.type === 'catalog') {
                const existing = prev.find(i => i.id === item.id)
                if (existing) {
                    toast.success(`Updated quantity for ${item.name}!`)
                    return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
                }
            }

            // Custom items or new catalog items get added as new entries
            const newItem = {
                ...item,
                // For custom items, generate a unique ID if they don't have one
                cartId: item.cartId || `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }

            toast.success('Added to Cart! 🌸')
            return [...prev, newItem]
        })
    }

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId))
        toast.success("Item removed")
    }

    const updateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) return
        setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item))
    }

    const clearCart = () => {
        setCartItems([])
    }

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
    const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0)

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
