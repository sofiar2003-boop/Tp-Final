import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, BookOpenText, Coffee, Sparkles } from 'lucide-react';

export default function PomodoroPage() {
    const ESTUDIO_MINUTOS = 25;
    const DESCANSO_MINUTOS = 5;
    
    const [segundos, setSegundos] = useState(ESTUDIO_MINUTOS * 60);
    const [estaCorriendo, setEstaCorriendo] = useState(false);
    const [esCicloEstudio, setEsCicloEstudio] = useState(true);

    useEffect(() => {
        let  intervalo = null;
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

    const toggleTemporizador = () => setEstaCorriendo(!estaCorriendo);
    
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

    const porcentajeCompletado = esCicloEstudio 
        ? ((ESTUDIO_MINUTOS * 60 - segundos) / (ESTUDIO_MINUTOS * 60)) * 100
        : ((DESCANSO_MINUTOS * 60 - segundos) / (DESCANSO_MINUTOS * 60)) * 100;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card rounded-3xl p-8 md:p-12 border border-sage-200/60 dark:border-dark-border shadow-xs text-center space-y-8 transition-all">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-6">
                <div className="flex items-center gap-2">
                    {esCicloEstudio ? (
                        <BookOpenText className="h-5 w-5 text-sage-600 animate-pulse" />
                    ) : (
                        <Coffee className="h-5 w-5 text-rose-500 animate-bounce" />
                    )}
                    <h3 className="font-serif font-bold text-xl text-sage-800 dark:text-dark-text-base">
                        {esCicloEstudio ? 'Espacio de Enfoque' : 'Tiempo de Desconectarse'}
                    </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sage-50 dark:bg-dark-bg text-sage-700 dark:text-dark-text-muted px-3 py-1 rounded-lg border border-sage-100 dark:border-transparent">
                    Técnica Pomodoro
                </span>
            </div>

            <div className="py-6 flex flex-col items-center justify-center relative">
                <h1 className="text-7xl md:text-8xl font-black text-sage-900 dark:text-dark-text-base tracking-tight tabular-nums select-none">
                    {formatearTiempo(segundos)}
                </h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-4">
                    {esCicloEstudio ? '📚 Concentración Absoluta' : '☕️ Descanso Corto'}
                </p>

           
                <div className="w-64 bg-slate-100 dark:bg-dark-bg h-1.5 rounded-full mt-6 overflow-hidden">
                    <div 
                        className="bg-sage-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${porcentajeCompletado}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 max-w-md mx-auto">
                <button 
                    onClick={toggleTemporizador}
                    className={`flex-1 py-4 text-sm font-bold rounded-2xl shadow-xs transition-all cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2 ${
                        estaCorriendo 
                            ? 'bg-slate-100 text-slate-600 dark:bg-dark-border dark:text-dark-text-base' 
                            : 'bg-sage-800 text-white dark:bg-dark-sage-light dark:text-dark-bg'
                    }`}
                >
                    {estaCorriendo ? 'Pausar Sesión' : 'Comenzar a Estudiar'}
                </button>
                
                <button 
                    onClick={resetTemporizador}
                    className="p-4 bg-slate-50 dark:bg-dark-border hover:bg-slate-100 dark:hover:bg-dark-bg border border-slate-200/60 dark:border-transparent text-slate-400 hover:text-sage-800 dark:hover:text-dark-text-base rounded-2xl transition-all cursor-pointer"
                    title="Reiniciar Cronómetro"
                >
                    <RotateCcw className="h-5 w-5" />
                </button>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-dark-text-muted flex items-center justify-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Bloque de 25 minutos seguidos por 5 minutos de descanso.</span>
            </div>
        </div>
    );
}