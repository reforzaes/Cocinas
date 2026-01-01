
import React, { useState, useMemo } from 'react';
import { Kitchen, Incident, TaskStatus } from '../types';

interface KitchenListProps {
  kitchens: Kitchen[];
  incidents: Incident[];
}

const KitchenList: React.FC<KitchenListProps> = ({ kitchens, incidents }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKitchenId, setSelectedKitchenId] = useState<string | null>(null);
  const [expandedIncidentNotes, setExpandedIncidentNotes] = useState<string | null>(null);

  const filteredKitchens = useMemo(() => {
    if (searchQuery.trim().length < 2) return kitchens;
    const q = searchQuery.toLowerCase();
    return kitchens.filter(k =>
      k.orderNumber.toLowerCase().includes(q) ||
      k.clientName.toLowerCase().includes(q) ||
      k.seller.toLowerCase().includes(q) ||
      k.installer.toLowerCase().includes(q) ||
      k.ldap.toLowerCase().includes(q)
    );
  }, [kitchens, searchQuery]);

  const selectedKitchen = useMemo(() => 
    kitchens.find(k => k.id === selectedKitchenId), 
    [kitchens, selectedKitchenId]
  );

  const selectedKitchenIncidents = useMemo(() => 
    incidents.filter(i => i.kitchenId === selectedKitchenId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [incidents, selectedKitchenId]
  );

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border">
        <div className="relative">
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-3xl p-6 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all text-lg shadow-inner"
            placeholder="Buscar por Pedido, Cliente, LDAP o Profesional..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {selectedKitchen && (
        <div className="bg-white rounded-[3rem] border-2 border-emerald-100 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                  Proyecto: <span className="text-emerald-600 font-mono">{selectedKitchen.orderNumber}</span>
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-2">Expediente de Calidad</p>
              </div>
              <button onClick={() => setSelectedKitchenId(null)} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 font-black text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 border-b pb-4">Gestiones e Historial de Notas</h3>
              {selectedKitchenIncidents.length === 0 ? (
                <div className="py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold italic">No existen incidencias registradas.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedKitchenIncidents.map(incident => {
                    const history = incident.history || [];
                    const isExpanded = expandedIncidentNotes === incident.id;
                    
                    return (
                      <div key={incident.id} className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="bg-gray-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{incident.cause}</span>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${incident.status === TaskStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {incident.status}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                          <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Motivo / Descripción</span>
                          <p className="text-sm font-bold text-gray-800 leading-relaxed">{incident.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-emerald-600 uppercase block">Registro de Seguimiento</span>
                          {history.length > 0 ? (
                            <div className="space-y-3">
                              {(isExpanded ? history : history.slice(-1)).map((entry, idx) => (
                                <div key={idx} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] font-black text-emerald-600/50 uppercase">{entry.date ? new Date(entry.date).toLocaleString() : 'Sin fecha'}</span>
                                    <span className="text-[8px] font-black text-emerald-600 uppercase">{entry.statusAtTime}</span>
                                  </div>
                                  <p className="text-xs text-emerald-900 italic">{entry.text}</p>
                                </div>
                              ))}
                              {history.length > 1 && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedIncidentNotes(isExpanded ? null : incident.id);
                                  }}
                                  className="mt-2 flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                >
                                  {isExpanded ? '[-] Ocultar historial' : `[+] Ver ${history.length - 1} nota(s) anterior(es)`}
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic">Sin notas de seguimiento registradas aún.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
            <tr>
              <th className="px-8 py-6 text-left">Pedido / LDAP</th>
              <th className="px-8 py-6 text-left">Cliente</th>
              <th className="px-8 py-6 text-left">Vendedor / Instalador</th>
              <th className="px-8 py-6 text-center">Calidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-bold">
            {filteredKitchens.map((k) => {
              const kIncidents = incidents.filter(i => i.kitchenId === k.id);
              const activeIncidents = kIncidents.filter(i => i.status !== TaskStatus.COMPLETED);
              const isSelected = selectedKitchenId === k.id;
              
              return (
                <tr key={k.id} className={`transition-colors cursor-pointer group ${isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedKitchenId(k.id)}>
                  <td className="px-8 py-5">
                    <div className="text-emerald-700 font-mono font-black text-sm">{k.orderNumber}</div>
                    <div className="text-[9px] text-gray-300 uppercase tracking-tighter">{k.ldap}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-gray-800 uppercase">{k.clientName}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-gray-600 flex flex-col gap-1">
                      <span>V: {k.seller}</span>
                      <span>I: {k.installer}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {activeIncidents.length > 0 ? (
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] uppercase font-black animate-pulse">
                          ⚠️ {activeIncidents.length} Gestión
                        </span>
                      ) : (
                        <span className="text-emerald-500 text-[10px] uppercase font-black">✓ OK</span>
                      )}
                      {kIncidents.length > 0 && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">
                          {kIncidents.length} Entrada(s)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KitchenList;
