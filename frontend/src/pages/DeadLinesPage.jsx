import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';

export default function DeadlinesPage() {
    const [deadlines, setDeadlines] = useState(() => {
        try {
            const saved = localStorage.getItem('panel_deadlines_v2');
            return saved ? JSON.parse(saved) : [
                { id: 1, materia: "Física 2", descripcion: "Entrega de Laboratorio N°1", fecha: "2026-06-30" }
            ];
        } catch (error) {
            return [];
        }
    });

    const [materia, setMateria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        localStorage.setItem('panel_deadlines_v2', JSON.stringify(deadlines));
    }, [deadlines]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const agregarDeadline = (e) => {
        e.preventDefault();
        if (!materia.trim() || !descripcion.trim() || !fecha) return;

        const nuevo = {
            id: Date.now(),
            materia: materia.trim(),
            descripcion: descripcion.trim(),
            fecha: fecha
        };

        setDeadlines([...deadlines, nuevo].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
        setMateria('');
        setDescripcion('');
        setFecha('');
        showToast("Fecha clave registrada");
    };

    const obtenerDiasRestantes = (fechaEntrega) => {
        if (!fechaEntrega) return 0;
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            const entrega = new Date(fechaEntrega);
            if (isNaN(entrega.getTime())) return 0; 
            entrega.setHours(0, 0, 0, 0);
            
            const diferenciaTiempo = entrega.getTime() - hoy.getTime();
            return Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
        } catch (e) {
            return 0;
        }
    };

    const obtenerEstiloBadge = (dias) => {
        if (dias < 0) return "bg-slate-100 text-slate-500 dark:bg-dark-border dark:text-dark-text-muted";
        if (dias === 0) return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-bold animate-pulse";
        if (dias <= 3) return "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 font-semibold";
        if (dias <= 7) return "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400";
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">

            <div className="md:col-span-1 bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border shadow-xs space-y-4 transition-all">
                <h3 className="font-serif font-bold text-base text-sage-900 dark:text-dark-text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-sage-600" /> Agendar Entrega
                </h3>
                
                <form onSubmit={agregarDeadline} className="space-y-3.5">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-text-muted mb-1">Materia / Cátedra</label>
                        <input 
                            type="text" value={materia} onChange={(e) => setMateria(e.target.value)}
                            placeholder="Ej: Física 2..."
                            className="w-full p-3 text-xs rounded-xl border border-sage-200 bg-sage-50/20 dark:border-dark-border dark:bg-dark-bg outline-none focus:border-sage-600 dark:focus:border-dark-sage-light transition-all text-slate-700 dark:text-dark-text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-text-muted mb-1">Descripción</label>
                        <input 
                            type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej: Parcial, TP..."
                            className="w-full p-3 text-xs rounded-xl border border-sage-200 bg-sage-50/20 dark:border-dark-border dark:bg-dark-bg outline-none focus:border-sage-600 dark:focus:border-dark-sage-light transition-all text-slate-700 dark:text-dark-text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-text-muted mb-1">Fecha Límite</label>
                        <input 
                            type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                            className="w-full p-3 text-xs rounded-xl border border-sage-200 bg-sage-50/20 dark:border-dark-border dark:bg-dark-bg outline-none focus:border-sage-600 dark:focus:border-dark-sage-light transition-all text-slate-700 dark:text-dark-text-base"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-sage-800 hover:bg-sage-700 text-white dark:bg-dark-sage-light dark:text-dark-bg font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <Plus className="h-4 w-4" /> Registrar Fecha
                    </button>
                </form>
            </div>

            <div className="md:col-span-2 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {deadlines.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border text-slate-400 italic text-xs">
                        No tenés entregas pendientes. ¡Al día! 🎉
                    </div>
                ) : (
                    deadlines.map(item => {
                        const diasRestantes = obtenerDiasRestantes(item.fecha);
                        return (
                            <div key={item.id} className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-2xs flex items-center justify-between group relative transition-all">
                                <div className="space-y-1.5 min-w-0 flex-1 pr-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage-700 dark:text-dark-sage-light bg-sage-50 dark:bg-dark-bg px-2 py-0.5 rounded-md border border-sage-100 dark:border-transparent">
                                            {item.materia}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${obtenerEstiloBadge(diasRestantes)}`}>
                                            <Clock className="h-3 w-3" />
                                            {diasRestantes < 0 && "Entregado"}
                                            {diasRestantes === 0 && "¡Es Hoy! "}
                                            {diasRestantes === 1 && "Falta 1 día "}
                                            {diasRestantes > 1 && `Faltan ${diasRestantes} días`}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-dark-text-base leading-relaxed truncate">{item.descripcion}</p>
                                    <p className="text-[10px] font-semibold text-slate-400 dark:text-dark-text-muted">
                                        Fecha: {item.fecha}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setDeadlines(deadlines.filter(d => d.id !== item.id))}
                                    className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all z-50 border border-slate-800">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{toast}</span>
                </div>
            )}
        </div>
    );
}