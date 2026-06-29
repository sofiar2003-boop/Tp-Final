import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, KeyRound, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
     const { login } = useAuth();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // 🌟 CLAVE: Si el backend tiró un error de validación, capturamos su mensaje exacto
            throw new Error(data.error || data.message || 'Error al procesar el registro');
        }

        // 📬 REGISTRO EXITOSO: Mostramos un mensaje intermedio avisando lo del correo
        setSuccess(true); 
        setError('');
    } catch (err) {
        console.error("Error capturado en el registro:", err.message);
        // 🌟 ACÁ SE SETEA EL ERROR REAL PARA QUE NO APAREZCA VACÍO
        setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="flex min-h-screen items-center justify-center bg-sage-50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md border border-sage-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-sage-800">Crear Espacio</h2>
                    <p className="text-sm text-sage-700 mt-2 font-medium">Comenzá tu viaje de hábitos</p>
                </div>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <CheckCircle className="h-14 w-14 text-sage-600 mb-4" />
                        <h3 className="text-lg font-serif font-semibold text-sage-800">¡Registro completo!</h3>
                        <p className="text-sm text-slate-600 mt-2">Revisá tu casilla de correo virtual.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm font-medium text-rose-600 border border-rose-100">⚠️ {error}</div>}

                        <div>
                            <label className="block text-xs font-semibold uppercase text-sage-700 mb-2">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600" />
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-sage-200 bg-sage-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-sage-600 focus:bg-white" placeholder="Sofía Rodríguez" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-sage-700 mb-2">Email institucional</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-sage-200 bg-sage-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-sage-600 focus:bg-white" placeholder="sofi@utn.com" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-sage-700 mb-2">Contraseña</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-sage-200 bg-sage-50/50 py-3 pl-11 pr-4 text-sm outline-none focus:border-sage-600 focus:bg-white" placeholder="••••••••" required />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="flex w-full items-center justify-center rounded-2xl bg-sage-800 py-3.5 text-sm font-semibold text-white hover:bg-sage-700 disabled:opacity-50 cursor-pointer">
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Registrar Cuenta'}
                        </button>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            ¿Ya tenés un espacio?{' '}
                            <Link to="/login" className="font-semibold text-sage-700 hover:text-sage-800 underline">Inicia sesión</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}