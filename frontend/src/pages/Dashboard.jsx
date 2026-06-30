import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckSquare, BookOpen, FileSpreadsheet, Sun, Moon, Timer, CalendarDays, Plus, Trash2 } from 'lucide-react';
import HabitManager from '../components/HabitManager';
import Journal from './Journal';
import DocumentWriter from './DocumentWriter';
import PomodoroPage from './PomodoroPage';
import DeadlinesPage from './DeadLinesPage';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [seccionActiva, setSeccionActiva] = useState('habitos');
    const [pendientesHoyCount, setPendientesHoyCount] = useState(0);

    const [deadlines, setDeadlines] = useState(() => {
        const saved = localStorage.getItem('panel_deadlines_direct_v1');
        return saved ? JSON.parse(saved) : [
            { id: 1, materia: "Materia de Prueba", descripcion: "Entrega de Trabajo Práctico N°1", fecha: "2026-06-30" }
        ];
    });

    const [mat, setMat] = useState('');
    const [desc, setDesc] = useState('');
    const [fec, setFec] = useState('');

    const [modoOscuro, setModoOscuro] = useState(() => {
        return localStorage.getItem('theme_preference') === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('panel_deadlines_direct_v1', JSON.stringify(deadlines));
    }, [deadlines]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (modoOscuro) { root.classList.add('dark'); localStorage.setItem('theme_preference', 'dark'); }
        else { root.classList.remove('dark'); localStorage.setItem('theme_preference', 'light'); }
    }, [modoOscuro]);

    useEffect(() => {
        const checkPendientes = () => {
            const saved = localStorage.getItem('agenda_habitos_v5');
            if (saved) {
                const habits = JSON.parse(saved);
                const diaHoy = new Date().getDay();
                const delDia = habits.filter(h => h.dias.includes(diaHoy));
                const pendientes = delDia.filter(h => !h.completadosPorDia.includes(diaHoy));
                setPendientesHoyCount(pendientes.length);
            }
        };
        checkPendientes();
        const interval = setInterval(checkPendientes, 2000);
        return () => clearInterval(interval);
    }, []);

    const agregarNuevoDeadline = (e) => {
        e.preventDefault();
        if (!mat.trim() || !desc.trim() || !fec) return;
        const n = { id: Date.now(), materia: mat.trim(), descripcion: desc.trim(), fecha: fec };
        setDeadlines([...deadlines, n].sort((a,b) => new Date(a.fecha) - new Date(b.fecha)));
        setMat(''); setDesc(''); setFec('');
    };

    const calcularDias = (f) => {
        if(!f) return 0;
        const h = new Date(); h.setHours(0,0,0,0);
        const e = new Date(f); e.setHours(0,0,0,0);
        return Math.ceil((e.getTime() - h.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-sage-50 dark:bg-dark-bg text-slate-700 dark:text-dark-text-base transition-colors duration-300">

            <aside className="w-full md:w-64 bg-white dark:bg-dark-card border-b md:border-b-0 md:border-r border-sage-200 dark:border-dark-border p-6 flex flex-col gap-4 md:gap-6 shrink-0 md:h-screen md:sticky md:top-0">
                <div className="flex md:block items-center justify-between">
                    <div>

                        <h2 className="text-xl md:text-2xl font-serif font-bold text-sage-800 dark:text-dark-sage-light tracking-tight">Panel de Control</h2>
                        <p className="text-[10px] md:text-[11px] text-sage-600 dark:text-dark-text-muted font-medium uppercase tracking-wider mt-0.5">Gestión Universitaria</p>
                    </div>

                    <button onClick={logout} className="md:hidden p-2 text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={logout} 
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/80 rounded-xl transition-all border border-rose-100 dark:border-rose-900 cursor-pointer w-full"
                    >
                        <LogOut className="h-3.5 w-3.5" /> Cerrar Sesión
                    </button>
                    <button onClick={() => setModoOscuro(!modoOscuro)} className="p-2.5 rounded-xl border transition-all cursor-pointer bg-white dark:bg-dark-card border-sage-200 dark:border-dark-border text-slate-600 dark:text-dark-text-base hover:bg-sage-50 dark:hover:bg-dark-border shrink-0">
                        {modoOscuro ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
                    </button>
                </div>
                
                <hr className="hidden md:block border-sage-100 dark:border-dark-border" />
                
                <nav className="flex flex-col gap-1.5 flex-1">
                    <button onClick={() => setSeccionActiva('habitos')} className={`flex items-center justify-between px-4 py-3 text-sm font-medium w-full text-left rounded-xl border cursor-pointer ${seccionActiva === 'habitos' ? 'text-sage-700 bg-sage-50 border-sage-200/60 dark:text-dark-sage-light dark:bg-dark-border' : 'text-slate-600 hover:bg-sage-50/60 border-transparent dark:text-dark-text-muted'}`}>
                        <div className="flex items-center gap-3"><CheckSquare className="h-4 w-4" /> <span>Mis Habits</span></div>
                        {pendientesHoyCount > 0 && <span className="bg-sage-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">{pendientesHoyCount}</span>}
                    </button>
                    
                    <button onClick={() => setSeccionActiva('diario')} className={`flex items-center justify-between px-4 py-3 text-sm font-medium w-full text-left rounded-xl border cursor-pointer ${seccionActiva === 'diario' ? 'text-sage-700 bg-sage-50 border-sage-200/60 dark:text-dark-sage-light dark:bg-dark-border' : 'text-slate-600 hover:bg-sage-50/60 border-transparent dark:text-dark-text-muted'}`}>
                        <div className="flex items-center gap-3"><BookOpen className="h-4 w-4" /> <span>Diario Libre</span></div>
                    </button>

                    <button onClick={() => setSeccionActiva('documentos')} className={`flex items-center justify-between px-4 py-3 text-sm font-medium w-full text-left rounded-xl border cursor-pointer ${seccionActiva === 'documentos' ? 'text-sage-700 bg-sage-50 border-sage-200/60 dark:text-dark-sage-light dark:bg-dark-border' : 'text-slate-600 hover:bg-sage-50/60 border-transparent dark:text-dark-text-muted'}`}>
                        <div className="flex items-center gap-3"><FileSpreadsheet className="h-4 w-4" /> <span>Resúmenes & PDF</span></div>
                    </button>

                    <button onClick={() => setSeccionActiva('pomodoro')} className={`flex items-center justify-between px-4 py-3 text-sm font-medium w-full text-left rounded-xl border cursor-pointer ${seccionActiva === 'pomodoro' ? 'text-sage-700 bg-sage-50 border-sage-200/60 dark:text-dark-sage-light dark:bg-dark-border' : 'text-slate-600 hover:bg-sage-50/60 border-transparent dark:text-dark-text-muted'}`}>
                        <div className="flex items-center gap-3"><Timer className="h-4 w-4" /> <span>Temporizador</span></div>
                    </button>

                    <button onClick={() => setSeccionActiva('deadlines')} className={`flex items-center justify-between px-4 py-3 text-sm font-medium w-full text-left rounded-xl border cursor-pointer ${seccionActiva === 'deadlines' ? 'text-sage-700 bg-sage-50 border-sage-200/60 dark:text-dark-sage-light dark:bg-dark-border' : 'text-slate-600 hover:bg-sage-50/60 border-transparent dark:text-dark-text-muted'}`}>
                        <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4" /> <span>Fechas Clave</span></div>
                    </button>
                </nav>
                <div className="text-[10px] text-slate-400 dark:text-dark-text-muted font-medium text-center pt-4 border-t border-slate-100 dark:border-dark-border">v1.7.0 • UTN FRBA</div>
            </aside>


            <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto h-auto md:h-screen">
                <header className="mb-8 border-b border-sage-100 dark:border-dark-border pb-6">

                    <h1 className="text-3xl font-serif font-bold text-sage-800 dark:text-dark-text-base">¡Hola, {user?.name || 'Usuario'}! 🌿</h1>
                    <p className="text-slate-500 dark:text-dark-text-muted mt-1">Ecosistema de organización personal y académico.</p>
                </header>

                {seccionActiva === 'habitos' && <HabitManager />}
                {seccionActiva === 'diario' && <Journal />}
                {seccionActiva === 'documentos' && <DocumentWriter />}
                {seccionActiva === 'pomodoro' && <PomodoroPage />}

                {seccionActiva === 'deadlines' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border shadow-xs space-y-4">
                            <h3 className="font-serif font-bold text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sage-600" /> Agendar Entrega</h3>
                            <form onSubmit={agregarNuevoDeadline} className="space-y-3">
                                <input type="text" value={mat} onChange={e => setMat(e.target.value)} placeholder="Materia" className="w-full p-3 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base" required />
                                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción (TP, Parcial)" className="w-full p-3 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base" required />
                                <input type="date" value={fec} onChange={e => setFec(e.target.value)} className="w-full p-3 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base" required />
                                <button type="submit" className="w-full py-2.5 bg-sage-800 text-white dark:bg-dark-sage-light dark:text-dark-bg font-semibold text-xs rounded-xl">Registrar Fecha</button>
                            </form>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            {deadlines.map(item => {
                                const dias = calcularDias(item.fecha);
                                return (
                                    <div key={item.id} className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-2xs flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold bg-sage-50 dark:bg-dark-bg px-2 py-0.5 rounded text-sage-700 dark:text-dark-sage-light">{item.materia}</span>
                                                <span className={`text-[10px] font-semibold px-2 rounded ${dias <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {dias < 0 ? "Pasado" : dias === 0 ? "¡Hoy! 🔥" : `Faltan ${dias} días`}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-700 dark:text-dark-text-base">{item.descripcion}</p>
                                        </div>
                                        <button onClick={() => setDeadlines(deadlines.filter(d => d.id !== item.id))} className="text-slate-300 hover:text-rose-500 p-2"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}