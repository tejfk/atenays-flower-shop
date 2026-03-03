import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // The administrative identity used behind the scenes
    const ADMIN_EMAIL = 'admin@atenays.com';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // We use the PIN as the password for the admin account
            await signInWithEmailAndPassword(auth, ADMIN_EMAIL, pin);
            navigate('/seller-portal');
        } catch (err) {
            setError('Access Denied. Incorrect Master Code.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-border/50 text-center"
            >
                <div className="mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-primary" size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-text-dark mb-2">Admin Unlock</h1>
                    <p className="text-text-dark/60 text-sm">Enter your Master Access Code to proceed.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100"
                    >
                        <AlertCircle size={18} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-dark/50 uppercase tracking-wider ml-1">Master Access Code</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/30" size={20} />
                            <input
                                required type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-bg-main border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium transition-all text-center tracking-widest"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                        {loading ? 'Unlocking...' : (
                            <>Unlock Portal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-[10px] text-text-dark/40 font-bold uppercase tracking-widest">
                    Authorized Seller Access Only
                </p>
            </motion.div>
        </div>
    );
}
