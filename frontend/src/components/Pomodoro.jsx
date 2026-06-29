import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BookOpenText, Coffee } from 'lucide-react';

export default function Pomodoro() {
    const ESTUDIO_MINUTOS = 25;
    const DESCANSO_MINUTOS = 5;
    
    const [segundos, setSegundos] = useState(ESTUDIO_MINUTOS * 60);
    const [estaCorriendo, setEstaCorriendo] = useState(false);
    const [esCicloEstudio, setEsCicloEstudio] = useState(true);

    useEffect(() => {
        let intervalo = null;
        if (estaCorriendo && segundos > 0) {
            intervalo = setInterval(() => {
                setSegundos(prev => prev - 1);
            }, 1000);
        } else if (segundos === 0) {
            setEstaCorriendo(false);
            if (esCicloEstudio) {
                alert("¡Tiempo de estudio terminado! Tómate un descanso ☕️");
                setEsCicloEstudio(false);
                setSegundos(DESCANSO_MINUTOS * 60);
            } else {
                alert("¡Descanso terminado! Volvemos a estudiar 📚");
                setEsCicloEstudio(true);
                setSegundos(ESTUDIO_MINUTOS * 60);
            }
        }
        return () => clearInterval(intervalo);
    }, [estaCorriendo, segundos, esCicloEstudio]);

    const toggleTemporizador = () => {
        setEstaCorriendo(!estaCorriendo);
    };

    const resetTemporizador = () => {
        setEstaCorriendo(false);
        setEsCicloEstudio(true);
        setSegundos(ESTUDIO_MINUTOS * 60);
    };

    const formatearTiempo = (secs) => {
        const mins = Math.floor(secs / 60);
        const restantes = secs % 60;
        return `${String(mins).padStart(2, '0')}:${String(restantes).padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-sage-100 dark:border-dark-border shadow-xs transition-all">
            <div className="flex items-center justify-between mb-3 border-b border-sage-50 dark:border-dark-border pb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                    {esCicloEstudio ? (
                        <BookOpenText className="h-3.5 w-3.5 text-sage-800 dark:text-dark-sage-light shrink-0" />
                    ) : (
                        <Coffee className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage-800 dark:text-dark-text-muted truncate">
                        {esCicloEstudio ? 'Estudio' : 'Descanso'}
                    </span>
                </div>
                <div className="text-[9px] text-slate-400 dark:text-dark-text-muted font-medium shrink-0">25/5 min</div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="text-3xl font-black text-sage-900 dark:text-dark-text-base tracking-tight tabular-nums">
                    {formatearTiempo(segundos)}
                </div>

                <div className="flex items-center gap-1.5 w-full">
                    <button 
                        type="button"
                        onClick={toggleTemporizador}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                            estaCorriendo 
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-dark-border dark:text-dark-text-muted' 
                                : 'bg-sage-800 hover:bg-sage-700 text-white dark:bg-dark-sage-light dark:text-dark-bg'
                        }`}
                    >
                        {estaCorriendo ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button 
                        type="button"
                        onClick={resetTemporizador}
                        className="p-1.5 text-slate-400 hover:text-sage-800 dark:text-dark-text-muted rounded-lg hover:bg-sage-50 dark:hover:bg-dark-border transition-colors cursor-pointer"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}