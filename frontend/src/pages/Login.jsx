import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // 🌟 SI EL BACKEND DEVUELVE UN ERROR (Ej: 403 No verificado), CORTAMOS ACÁ
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error al iniciar sesión');
            }

            // Si está todo OK, guardamos sesión y vamos al dashboard
            login(data.token, data.user);
            navigate('/dashboard'); 
        } catch (err) {
            // 🌟 AHORA MUESTRA EL ERROR REAL EN PANTALLA (Ideal para la entrega)
            console.error("Error en la autenticación:", err.message);
            setError(err.message || "No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-sage-50 px-4 dark:bg-dark-bg transition-colors duration-300">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-dark-card p-8 shadow-md border border-sage-200 dark:border-dark-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-sage-800 dark:text-dark-text-base">Panel Universitario</h2>
                    <p className="text-sm text-sage-700 dark:text-dark-text-muted mt-2 font-medium">Tu santuario diario de hábitos y estudio</p>
                </div>

                {/* 🌟 ACÁ SE RENDERIZAN LOS MENSAJES DE ERROR DEL BACKEND */}
                {error && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-sage-700 dark:text-dark-text-muted mb-2 tracking-wider">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-sage-200 dark:border-dark-border bg-sage-50/50 dark:bg-dark-bg py-3 pl-11 pr-4 text-sm outline-none focus:border-sage-600 focus:bg-white text-slate-700 dark:text-dark-text-base"
                                placeholder="usuario@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-sage-700 dark:text-dark-text-muted mb-2 tracking-wider">Contraseña</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-sage-200 dark:border-dark-border bg-sage-50/50 dark:bg-dark-bg py-3 pl-11 pr-4 text-sm outline-none focus:border-sage-600 focus:bg-white text-slate-700 dark:text-dark-text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-2xl bg-sage-800 dark:bg-dark-sage-light text-white dark:text-dark-bg py-3.5 text-sm font-semibold shadow-sm hover:bg-sage-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Ingresar al panel'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-4 border-t border-sage-100 dark:border-dark-border">
                    <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                        ¿No tenés una cuenta?{' '}
                        <Link to="/register" className="font-semibold text-sage-700 dark:text-dark-sage-light hover:underline underline-offset-4">
                            Registrate acá
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}