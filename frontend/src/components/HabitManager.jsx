import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, ChevronLeft, ChevronRight, Plus, Trash2, AlertCircle, Loader2, Edit2, Check } from 'lucide-react';

export default function HabitManager() {
    const [habits, setHabits] = useState([]);
    const [nuevoHabito, setNuevoHabito] = useState('');
    const [diasSeleccionados, setDiasSeleccionados] = useState([1, 2, 3, 4, 5]); 
    
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [mesVisualizado, setMesVisualizado] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [errorGeneral, setErrorGeneral] = useState('');


    const [idEditando, setIdEditando] = useState(null);
    const [nombreEditando, setNombreEditando] = useState('');

    const diasDeLaSemanaNombre = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vi\u200Be', 'Sá\u200Bb'];
    const fechasClaves = {
        "2026-06-24": "Entrega de Laboratorio de Electrónica",
        "2026-07-02": "Parcial Técnicas Digitales I",
        "2026-07-15": "Trabajo Integrador Final - Programación Web"
    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/habits', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                
                if (response.ok) {
                    const habitsAdaptados = (data.data || []).map(h => ({
                        id: h._id,
                        nombre: h.name, 
                        diasSemana: h.diasSemana || [1,2,3,4,5],
                        historialCompletados: h.historialCompletados || []
                    }));
                    setHabits(habitsAdaptados);
                } else {
                    setErrorGeneral(data.error || 'No se pudieron cargar los hábitos');
                }
            } catch (err) {
                console.error(err);
                setErrorGeneral('Error de conexión con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchHabits();
    }, [token]);

    const formatearFechaString = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const obtenerEtiquetaDiaDinamica = (dateObj) => {
        const hoy = new Date();
        const objetivo = new Date(dateObj);
        hoy.setHours(0,0,0,0);
        objetivo.setHours(0,0,0,0);
        const diferenciaTiempo = objetivo.getTime() - hoy.getTime();
        const diferenciaDias = Math.round(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (diferenciaDias === 0) return "Agenda de Hoy";
        if (diferenciaDias === 1) return "Agenda de Mañana";
        if (diferenciaDias === -1) return "Agenda de Ayer";
        
        const opciones = { weekday: 'long', day: 'numeric', month: 'short' };
        return `Agenda: ${objetivo.toLocaleDateString('es-AR', opciones)}`;
    };

    const crearHabito = async (e) => {
        e.preventDefault();
        if (!nuevoHabito.trim() || diasSeleccionados.length === 0) return;

        try {
            const response = await fetch('http://localhost:8080/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: nuevoHabito.trim(),
                    frequency: 'semanal',
                    diasSemana: diasSeleccionados
                })
            });
            const data = await response.json();

            if (response.ok && data.data) {
                const creado = {
                    id: data.data._id,
                    nombre: data.data.name,
                    diasSemana: data.data.diasSemana || diasSeleccionados,
                    historialCompletados: []
                };
                setHabits([...habits, creado]);
                setNuevoHabito('');
            }
        } catch (err) {
            console.error("Error al crear hábito:", err);
        }
    };

    const guardarEdicionHabito = async (id) => {
        if (!nombreEditando.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/api/habits/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: nombreEditando.trim() })
            });

            if (response.ok) {
                setHabits(habits.map(h => h.id === id ? { ...h, nombre: nombreEditando.trim() } : h));
                setIdEditando(null);
            }
        } catch (err) {
            console.error("Error al editar hábito:", err);
        }
    };

    const eliminarHabito = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/habits/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setHabits(habits.filter(h => h.id !== id));
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    const toggleHabitoFecha = (habitoId, fechaStr) => {
        setHabits(habits.map(h => {
            if (h.id === habitoId) {
                const yaCompletado = h.historialCompletados.includes(fechaStr);
                return {
                    ...h,
                    historialCompletados: yaCompletado 
                        ? h.historialCompletados.filter(f => f !== fechaStr)
                        : [...h.historialCompletados, fechaStr]
                };
            }
            return h;
        }));
    };

    const toggleDiaSeleccionadoForm = (index) => {
        setDiasSeleccionados(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const obtenerDiasDelMes = (fecha) => {
        const año = fecha.getFullYear();
        const mes = fecha.getMonth();
        const primerDiaMes = new Date(año, mes, 1).getDay();
        const totalDiasMes = new Date(año, mes + 1, 0).getDate();
        
        const celdas = [];
        for (let i = 0; i < primerDiaMes; i++) celdas.push(null);
        for (let dia = 1; dia <= totalDiasMes; dia++) celdas.push(new Date(año, mes, dia));
        return celdas;
    };

    const cambiarMes = (direccion) => {
        const nuevoMes = new Date(mesVisualizado);
        nuevoMes.setMonth(nuevoMes.getMonth() + direccion);
        setMesVisualizado(nuevoMes);
    };

    const calcularRendimientoDia = (fechaObj) => {
        if (!fechaObj) return { programados: 0, completados: 0, porcentaje: 0 };
        const fechaStr = formatearFechaString(fechaObj);
        const diaSemana = fechaObj.getDay();

        const programados = habits.filter(h => h.diasSemana.includes(diaSemana));
        if (programados.length === 0) return { programados: 0, completados: 0, porcentaje: 0 };

        const completados = programados.filter(h => h.historialCompletados.includes(fechaStr));
        return {
            programados: programados.length,
            completados: completados.length,
            porcentaje: (completados.length / programados.length) * 100
        };
    };

    const fechaSeleccionadaStr = formatearFechaString(fechaSeleccionada);
    const diaSemanaSeleccionado = fechaSeleccionada.getDay();
    const habitoDelDiaFiltrados = habits.filter(h => h.diasSemana.includes(diaSemanaSeleccionado));
    const eventoClaveDeHoy = fechasClaves[fechaSeleccionadaStr];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-sage-600 dark:text-dark-sage-light">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-3 text-sm font-medium">Sincronizando con el servidor de la UTN...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 transition-colors duration-300">
            {errorGeneral && <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-xs text-rose-400">⚠️ {errorGeneral}</div>}
            
            {/* FORMULARIO DE CREACION */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border shadow-2xs max-w-2xl">
                <h3 className="font-serif font-bold text-base text-slate-800 dark:text-dark-text-base mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-sage-600" /> Crear Hábito Recurrente
                </h3>
                <form onSubmit={crearHabito} className="space-y-4">
                    <input 
                        type="text" value={nuevoHabito} onChange={e => setNuevoHabito(e.target.value)}
                        placeholder="Nombre del hábito (Ej: Estudiar Electrónica, Gimnasio...)"
                        className="w-full p-3 text-xs rounded-xl border border-sage-200 dark:border-dark-border dark:bg-dark-bg outline-none text-slate-700 dark:text-dark-text-base focus:border-sage-600"
                        required
                    />
                    
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-text-muted mb-2">Días de repetición semanal</label>
                        <div className="grid grid-cols-7 gap-1.5 max-w-md">
                            {diasDeLaSemanaNombre.map((dia, idx) => {
                                const activo = diasSeleccionados.includes(idx);
                                return (
                                    <button
                                        key={dia} type="button" onClick={() => toggleDiaSeleccionadoForm(idx)}
                                        className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                                            activo 
                                                ? 'bg-sage-800 text-white border-transparent dark:bg-dark-sage-light dark:text-dark-bg' 
                                                : 'bg-transparent text-slate-500 border-slate-200 dark:border-dark-border hover:bg-slate-50/50'
                                        }`}
                                    >
                                        {dia}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-sage-800 text-white dark:bg-dark-sage-light dark:text-dark-bg font-semibold text-xs rounded-xl shadow-3xs hover:bg-sage-700 cursor-pointer">
                        Añadir Hábito a la Agenda
                    </button>
                </form>
            </div>

            {/* VISTA DIARIA*/}
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border shadow-2xs">
                <div className="flex items-center gap-6 mb-6 pb-4 border-b border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => setFechaSeleccionada(prev => { const n = new Date(prev.getTime()); n.setDate(n.getDate() - 1); return n; })} className="p-2 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200/60 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                        <button type="button" onClick={() => setFechaSeleccionada(prev => { const n = new Date(prev.getTime()); n.setDate(n.getDate() + 1); return n; })} className="p-2 bg-slate-50 dark:bg-dark-bg rounded-xl border border-slate-200/60 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-dark-card cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                    <div className="flex-1 text-center">
                        <h3 className="font-serif font-bold text-lg text-sage-900 dark:text-dark-text-base capitalize">{obtenerEtiquetaDiaDinamica(fechaSeleccionada)}</h3>
                        <p className="text-[11px] text-slate-400 dark:text-dark-text-muted mt-0.5">Fecha: {fechaSeleccionada.toLocaleDateString('es-AR')}</p>
                    </div>
                    <button type="button" onClick={() => { setFechaSeleccionada(new Date()); setMesVisualizado(new Date()); }} className="px-4 py-2 bg-sage-50 text-sage-700 dark:bg-dark-bg dark:text-dark-text-base text-xs font-bold rounded-xl border border-sage-100 dark:border-dark-border cursor-pointer hover:bg-sage-100 transition-all shrink-0">Volver a Hoy</button>
                </div>

                {eventoClaveDeHoy && (
                    <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-2 max-w-2xl animate-pulse">
                        <AlertCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span>¡Fecha Clave!: {eventoClaveDeHoy}</span>
                    </div>
                )}

                <div className="space-y-2 max-w-2xl">
                    {habitoDelDiaFiltrados.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">No hay tareas o hábitos programados para este día de la semana.</p>
                    ) : (
                        habitoDelDiaFiltrados.map(h => {
                            const estaCompletado = h.historialCompletados.includes(fechaSeleccionadaStr);
                            const editandoEste = idEditando === h.id;

                            return (
                                <div key={h.id} className="flex items-center justify-between p-3.5 bg-sage-50/40 dark:bg-dark-bg/40 rounded-xl border border-slate-100/80 dark:border-dark-border/40 hover:bg-white dark:hover:bg-dark-bg transition-all group">
                                    {editandoEste ? (
                                        <div className="flex items-center gap-2 flex-1 mr-4">
                                            <input 
                                                type="text" value={nombreEditando} onChange={e => setNombreEditando(e.target.value)}
                                                className="flex-1 p-1 text-xs rounded-lg border border-sage-300 dark:bg-dark-bg text-slate-700 dark:text-dark-text-base outline-none"
                                                autoFocus
                                            />
                                            <button onClick={() => guardarEdicionHabito(h.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer"><Check className="h-4 w-4" /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => toggleHabitoFecha(h.id, fechaSeleccionadaStr)} className="flex items-center gap-3 text-left flex-1 cursor-pointer">
                                            {estaCompletado ? <CheckCircle2 className="h-5 w-5 text-sage-700 dark:text-dark-text-muted shrink-0" /> : <Circle className="h-5 w-5 text-slate-300 dark:text-dark-border shrink-0" />}
                                            <span className={`text-xs font-medium transition-all ${estaCompletado ? 'line-through text-slate-400' : 'text-slate-700 dark:text-dark-text-base'}`}>{h.nombre}</span>
                                        </button>
                                    )}

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!editandoEste && (
                                            <button onClick={() => { setIdEditando(h.id); setNombreEditando(h.nombre); }} className="p-1 text-slate-400 hover:text-sage-700 rounded-md cursor-pointer"><Edit2 className="h-3.5 w-3.5" /></button>
                                        )}
                                        <button onClick={() => eliminarHabito(h.id)} className="p-1 text-slate-400 hover:text-rose-500 rounded-md cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/*CALENDARIO MENSUAL */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-sage-200/60 dark:border-dark-border shadow-2xs">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100 dark:border-dark-border">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-sage-600" /><h3 className="font-serif font-bold text-base text-slate-800 dark:text-dark-text-base">Consistencia Mensual</h3></div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold font-serif text-sage-900 dark:text-dark-sage-light capitalize">{mesVisualizado.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => cambiarMes(-1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg cursor-pointer"><ChevronLeft className="h-4 w-4" /></button>
                            <button onClick={() => cambiarMes(1)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg cursor-pointer"><ChevronRight className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 max-w-xl text-center">
                    {diasDeLaSemanaNombre.map(d => <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-dark-text-muted uppercase tracking-wider py-1">{d}</span>)}
                    {obtenerDiasDelMes(mesVisualizado).map((fechaCelda, index) => {
                        if (!fechaCelda) return <div key={`empty-${index}`} className="aspect-square bg-transparent" />;
                        const currentCeldaStr = formatearFechaString(fechaCelda);
                        const { porcentaje, programados } = calcularRendimientoDia(fechaCelda);
                        const esDiaSeleccionadoActivo = currentCeldaStr === fechaSeleccionadaStr;
                        const esFechaClave = !!fechasClaves[currentCeldaStr];

                        let estilosBoton = "bg-transparent text-slate-700 dark:text-dark-text-base hover:bg-slate-100/70 dark:hover:bg-dark-bg/50";
                        if (programados > 0 && porcentaje === 100) estilosBoton = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold";

                        return (
                            <button key={fechaCelda.getTime()} type="button" onClick={() => setFechaSeleccionada(fechaCelda)} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all relative border cursor-pointer ${estilosBoton} ${esDiaSeleccionadoActivo ? 'ring-2 ring-sage-600 dark:ring-dark-sage-light border-transparent font-bold scale-105 shadow-3xs' : esFechaClave ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/10 shadow-xs' : 'border-transparent'}`}>
                                <span className={esFechaClave ? "text-indigo-700 dark:text-indigo-400 font-bold" : ""}>{fechaCelda.getDate()}</span>
                                {programados > 0 && <div className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 transition-all ${porcentaje === 100 ? 'bg-emerald-500 scale-110' : porcentaje > 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`} />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}