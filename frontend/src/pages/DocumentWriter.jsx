import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, Sparkles, Search, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function DocumentWriter() {
    const [documents, setDocuments] = useState(() => {
        const saved = localStorage.getItem('writer_multiple_docs_v1');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: "Resumen de Física 2", content: "Leyes de Maxwell y electromagnetismo..." }
        ];
    });

    const [activeDocId, setActiveDocId] = useState(() => {
        const savedActive = localStorage.getItem('writer_active_doc_id');
        return savedActive ? Number(savedActive) : (documents[0]?.id || null);
    });

    // 🌟 NUEVOS ESTADOS: Búsqueda y Notificaciones
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => { localStorage.setItem('writer_multiple_docs_v1', JSON.stringify(documents)); }, [documents]);
    useEffect(() => { if (activeDocId) localStorage.setItem('writer_active_doc_id', activeDocId.toString()); }, [activeDocId]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500); // Desaparece a los 2.5 segundos
    };

    const activeDoc = documents.find(d => d.id === activeDocId);

    // 🔍 LÓGICA DEL FILTRO EN CALIENTE
    const documentosFiltrados = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const crearNuevoDocumento = () => {
        const nuevo = { id: Date.now(), title: "Nuevo Resumen", content: "" };
        setDocuments([nuevo, ...documents]);
        setActiveDocId(nuevo.id);
        showToast("Documento inicializado");
    };

    const actualizarDocumento = (campo, valor) => {
        setDocuments(documents.map(d => d.id === activeDocId ? { ...d, [campo]: valor } : d));
    };

    const eliminarDocumento = (id, e) => {
        e.stopPropagation();
        const filtrados = documents.filter(d => d.id !== id);
        setDocuments(filtrados);
        if (activeDocId === id) setActiveDocId(filtrados[0]?.id || null);
        showToast("Documento eliminado");
    };

    const exportarTextoAPDF = () => {
        if (!activeDoc) return;
        const doc = new jsPDF();
        doc.setFont("serif", "bold"); doc.setFontSize(24); doc.setTextColor(27, 94, 32); doc.text(activeDoc.title || "Sin Título", 20, 25);
        doc.line(20, 30, 190, 30);
        doc.setFont("sans-serif", "normal"); doc.setFontSize(12); doc.setTextColor(51, 65, 85);
        const lineasTexto = doc.splitTextToSize(activeDoc.content, 170);
        doc.text(lineasTexto, 20, 42);
        doc.save(`${activeDoc.title.toLowerCase().replace(/\s+/g, '-') || 'resumen'}.pdf`);
        
        showToast("¡PDF descargado con éxito! 📄");
    };

    return (
        <div className="bg-white rounded-3xl border border-sage-200/60 shadow-xs overflow-hidden h-[calc(100vh-180px)] flex flex-col md:flex-row bg-white relative">
            
            {/* BARRA LATERAL INTERNA CON BUSCADOR */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-sage-100 bg-sage-50/20 p-4 flex flex-col gap-3 shrink-0">
                <button onClick={crearNuevoDocumento} className="w-full flex items-center justify-center gap-2 py-2.5 bg-sage-800 hover:bg-sage-700 text-white font-medium text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                    <Plus className="h-4 w-4" /> Crear Nuevo Resumen
                </button>

                {/* 🔍 Input de Búsqueda Minimalista */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar apuntes..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-sage-200 bg-white outline-none focus:border-sage-600 transition-all"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mt-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">Mis Carpetas</span>
                    {documentosFiltrados.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6 italic">No se encontraron archivos.</p>
                    ) : (
                        documentosFiltrados.map(d => (
                            <div
                                key={d.id} onClick={() => setActiveDocId(d.id)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all group ${activeDocId === d.id ? 'bg-white border-sage-200 text-sage-800 shadow-2xs' : 'bg-transparent border-transparent hover:bg-sage-50/50 text-slate-600'}`}
                            >
                                <p className="text-xs font-semibold truncate pr-1 flex-1">{d.title || 'Sin título'}</p>
                                <button onClick={(e) => eliminarDocumento(d.id, e)} className="p-1 text-slate-300 hover:text-rose-500 rounded-md hover:bg-rose-50 md:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ENTORNO EDITORIAL */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white">
                {activeDoc ? (
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-sage-600 bg-sage-50 px-2.5 py-1 rounded-lg border border-sage-100/50">
                                <Sparkles className="h-3 w-3" /> Editor Inteligente
                            </div>
                            <button onClick={exportarTextoAPDF} className="flex items-center gap-2 px-4 py-2 bg-sage-800 hover:bg-sage-700 text-white font-medium text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                                <Download className="h-3.5 w-3.5" /> Exportar a PDF
                            </button>
                        </div>

                        <input 
                            type="text" value={activeDoc.title} onChange={(e) => actualizarDocumento('title', e.target.value)}
                            placeholder="Título del resumen..."
                            className="w-full text-2xl font-serif font-bold text-sage-900 outline-none border-0 p-0 focus:ring-0"
                        />
                        <textarea
                            value={activeDoc.content} onChange={(e) => actualizarDocumento('content', e.target.value)}
                            placeholder="Escribí los apuntes de la cátedra acá..."
                            className="w-full flex-1 text-sm outline-none border-0 p-0 focus:ring-0 bg-transparent resize-none font-sans text-slate-700 leading-relaxed"
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12">
                        <FileText className="h-12 w-12 text-sage-300 stroke-[1.2] mb-3" />
                        <h4 className="font-serif font-semibold text-slate-700">No hay hojas seleccionadas</h4>
                    </div>
                )}
            </div>

            {/* 🌟 NOTIFICACIÓN FLOTANTE (TOAST) */}
            {toast && (
                <div className="absolute bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce transition-all border border-slate-800 z-50">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{toast}</span>
                </div>
            )}

        </div>
    );
}