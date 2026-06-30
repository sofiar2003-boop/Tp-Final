import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, KeyRound, Loader2, CheckCircle } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error al procesar el registro');
            }

            setSuccess(true); 
            setError('');
        } catch (err) {
            console.error("Error capturado en el registro:", err.message);
            setError(err.message || 'No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1310] px-4">
            <div className="w-full max-w-md rounded-3xl bg-[#141f19] p-8 shadow-2xl border border-[#1e2f26]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-[#e1e7e4]">Crear Espacio</h2>
                    <p className="text-sm text-[#a3b899] mt-2 font-medium">Comenzá tu viaje de hábitos</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <CheckCircle className="h-14 w-14 text-[#a3b899] mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-[#e1e7e4]">¡Registro completo!</h3>
                        <p className="text-sm text-[#a3b899] mt-2 max-w-xs">
                            Te enviamos un correo de activación. Por favor, revisá tu casilla virtual para validar tu email.
                        </p>
                        
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-6 flex items-center justify-center rounded-2xl border border-[#1e2f26] bg-[#1a2920] px-6 py-2.5 text-sm font-semibold text-[#e1e7e4] hover:bg-[#23372b] transition-colors cursor-pointer"
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-2xl bg-rose-950/40 p-3 text-sm font-medium text-rose-400 border border-rose-900/50">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#a3b899] mb-2">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3b899]" />
                                
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="w-full rounded-2xl border border-[#1e2f26] bg-[#0d1310] py-3 pl-11 pr-4 text-sm text-[#e1e7e4] placeholder-[#4f6457] outline-none focus:border-[#a3b899] focus:bg-[#0f1713]" 
                                    placeholder="nombre y apellido" 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#a3b899] mb-2">Email institucional</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3b899]" />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full rounded-2xl border border-[#1e2f26] bg-[#0d1310] py-3 pl-11 pr-4 text-sm text-[#e1e7e4] placeholder-[#4f6457] outline-none focus:border-[#a3b899] focus:bg-[#0f1713]" 
                                    placeholder="email@gmail.com" 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-[#a3b899] mb-2">Contraseña</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a3b899]" />
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full rounded-2xl border border-[#1e2f26] bg-[#0d1310] py-3 pl-11 pr-4 text-sm text-[#e1e7e4] placeholder-[#4f6457] outline-none focus:border-[#a3b899] focus:bg-[#0f1713]" 
                                    placeholder="••••••••" 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="flex w-full items-center justify-center rounded-2xl bg-[#cad5cf] py-3.5 text-sm font-semibold text-[#141f19] hover:bg-[#b0c0b8] disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrar Cuenta'}
                        </button>

                        <p className="text-center text-sm text-[#a3b899] mt-6">
                            ¿Ya tenés un espacio?{' '}
                            <Link to="/login" className="font-semibold text-[#e1e7e4] hover:text-[#white] underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}