import React, { useState } from 'react';
import { Kitchen } from '../types';
import { SELLERS, INSTALLERS } from '../constants';

interface KitchenRegistrationFormProps {
  onAddKitchen: (kitchen: Omit<Kitchen, 'id'>) => void;
}

const KitchenRegistrationForm: React.FC<KitchenRegistrationFormProps> = ({ onAddKitchen }) => {
  const [ldap, setLdap] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [seller, setSeller] = useState<string>(SELLERS[0]);
  const [installer, setInstaller] = useState<string>(INSTALLERS[0]);
  const [installationDate, setInstallationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ldap || !orderNumber || !clientName || !seller || !installer || !installationDate) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    onAddKitchen({
      ldap,
      orderNumber,
      clientName,
      seller,
      installer,
      installationDate,
    });
    // Clear form
    setLdap('');
    setOrderNumber('');
    setClientName('');
    setSeller(SELLERS[0]);
    setInstaller(INSTALLERS[0]);
    setInstallationDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border h-full">
      <h2 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tighter">Registrar Nueva Cocina</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ldap" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">LDAP / Usuario</label>
            <input
              type="text"
              id="ldap"
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
              value={ldap}
              onChange={(e) => setLdap(e.target.value)}
              placeholder="Ej: LDAP1234"
              required
            />
          </div>
          <div>
            <label htmlFor="orderNumber" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Número de Pedido</label>
            <input
              type="text"
              id="orderNumber"
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ej: 80112233"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="clientName" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Nombre del Cliente</label>
          <input
            type="text"
            id="clientName"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 uppercase outline-none focus:border-emerald-500 transition-all"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="seller" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Vendedor Responsable</label>
            <select
              id="seller"
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all appearance-none"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              required
            >
              {SELLERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="installer" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Instalador Asignado</label>
            <select
              id="installer"
              className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all appearance-none"
              value={installer}
              onChange={(e) => setInstaller(e.target.value)}
              required
            >
              {INSTALLERS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="installationDate" className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Fecha de Instalación</label>
          <input
            type="date"
            id="installationDate"
            className="w-full border-2 border-gray-100 rounded-2xl p-3.5 font-bold text-gray-700 outline-none focus:border-emerald-500 transition-all"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            Dar de Alta Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default KitchenRegistrationForm;