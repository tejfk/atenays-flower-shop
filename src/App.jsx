import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoaderSkeleton from './components/LoaderSkeleton'

const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const Customize = lazy(() => import('./pages/Customize'))
const Contact = lazy(() => import('./pages/Contact'))
const SellerPortal = lazy(() => import('./pages/SellerPortal'))
const Login = lazy(() => import('./pages/Login'))

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-center" />
            <Router>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-primary animate-pulse relative left-0 animate-slide"></div></div></div>}>
                    <Routes>
                        {/* Public Website with Header/Footer */}
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="products" element={<Products />} />
                            <Route path="customize" element={<Customize />} />
                            <Route path="contact" element={<Contact />} />
                        </Route>

                        {/* Standalone Admin Area */}
                        <Route path="login" element={<Login />} />
                        <Route
                            path="seller-portal"
                            element={
                                <ProtectedRoute>
                                    <SellerPortal />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    )
}
