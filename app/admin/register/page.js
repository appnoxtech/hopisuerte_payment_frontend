'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            localStorage.setItem('auth_token', response.data.access_token);
            router.push('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full p-10 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2 text-center">HopiSuerte Freelancer</h1>
                    <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Join our platform</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-neutral-700 font-medium"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-neutral-700 font-medium"
                            placeholder="freelancer@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-neutral-700 font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-neutral-700 font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-neutral-800 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-900/10 uppercase tracking-widest mt-6"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    <div className="text-center mt-6 pt-6 border-t border-neutral-800">
                        <Link href="/admin/login" className="text-sm text-neutral-500 hover:text-yellow-400 font-bold transition-all">
                            Already have an account? <span className="underline decoration-yellow-400/30 underline-offset-4">Sign In</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
