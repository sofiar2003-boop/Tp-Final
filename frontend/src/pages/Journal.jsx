import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Calendar, FileText } from 'lucide-react';

export default function Journal() {
    const [entradas, setEntradas] = useState(() => {
        const saved = localStorage.getItem('panel_journal_v2'); 
        return saved ? JSON.parse(saved) : [
            { id: 1, titulo: "Nota de Ejemplo", contenido: "Este es un espacio para escribir reflexiones, apuntes o bitácoras personales.", fecha: "23/6/2026" }
        ];
    });

    useEffect(() => {
        localStorage.setItem('panel_journal_v2', JSON.stringify(entradas));
    }, [entradas]);
    
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');

    const agregarEntrada = (e) => {
        e.preventDefault();
        if (!titulo.trim() || !contenido.trim()) return;

        const nueva = {
            id: Date.now(),
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            fecha: new Date().toLocaleDateString('es-AR')
        };

        setEntradas([nueva, ...entradas]);
        setTitulo('');
        setContenido('');
    };

    const eliminarEntrada = (id) => {
        setEntradas(entradas.filter(e => e.id !== id));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <div className="md:col-span-2 bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border space-y-4 shadow-xs">
                <h3 className="font-serif font-bold text-base flex items-center gap-2 text-sage-900 dark:text-dark-text-base">
                    <BookOpen className="h-4 w-4 text-sage-600" /> Nueva Entrada
                </h3>
                <form onSubmit={agregarEntrada} className="space-y-4">
                    <input 
                        type="text" value={titulo} onChange={e => setTitulo(e.target.value)} 
                        placeholder="Título de la nota..." 
                        className="w-full p-3.5 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base focus:border-sage-600 font-medium"
                        required 
                    />
                    <textarea 
                        value={contenido} onChange={e => setContenido(e.target.value)} 
                        placeholder="Escribí tus reflexiones o notas acá..." 
                        rows="8" 
                        className="w-full p-3.5 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base resize-none focus:border-sage-600 leading-relaxed"
                        required 
                    />
                    <button type="submit" className="w-full py-3 bg-sage-800 text-white dark:bg-dark-sage-light dark:text-dark-bg font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity">
                        <Plus className="h-4 w-4" /> Guardar Entrada
                    </button>
                </form>
            </div>


            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-dark-text-muted mb-1 pl-1">
                    Notas Anteriores
                </h3>
                {entradas.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border text-slate-400 italic text-xs">
                        La bitácora está vacía. 📝
                    </div>
                ) : (
                    entradas.map(item => (
                        <div key={item.id} className="p-4 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-2xs flex items-start justify-between group transition-all">
                            <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-semibold text-slate-400 dark:text-dark-text-muted flex items-center gap-1">
                                        <Calendar className="h-2.5 w-2.5" /> {item.fecha}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-sage-900 dark:text-dark-sage-light flex items-center gap-1.5 truncate">
                                    <FileText className="h-3 w-3 text-slate-400 shrink-0" /> {item.titulo}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-dark-text-base line-clamp-3 leading-relaxed">
                                    {item.contenido}
                                </p>
                            </div>
                            <button 
                                onClick={() => eliminarEntrada(item.id)} 
                                className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer shrink-0"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}