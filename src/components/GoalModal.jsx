import React, { useState, useEffect } from 'react';
import { X, Check, Target } from 'lucide-react';

export default function GoalModal({ isOpen, onClose, onSave, goalToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  useEffect(() => {
    if (goalToEdit) {
        setFormData({
            name: goalToEdit.name,
            targetAmount: goalToEdit.targetAmount,
            currentAmount: goalToEdit.currentAmount,
            deadline: goalToEdit.deadline || ''
        });
    } else {
        setFormData({
            name: '',
            targetAmount: '',
            currentAmount: '',
            deadline: ''
        });
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;
    
    onSave({
        ...formData,
        ...(goalToEdit && { id: goalToEdit.id })
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="text-yellow-400" />
            {goalToEdit ? 'Editar Meta' : 'Nova Meta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome da Meta */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nome da Meta</label>
            <input 
              type="text" 
              placeholder="Ex: Viagem para Disney, Carro Novo..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              autoFocus
            />
          </div>

          {/* Valor Alvo */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Valor Alvo (R$)</label>
            <input 
              type="number" 
              placeholder="0,00"
              step="0.01"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={formData.targetAmount}
              onChange={e => setFormData({...formData, targetAmount: e.target.value})}
            />
          </div>

          {/* Valor Atual */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Já economizado (R$)</label>
            <input 
              type="number" 
              placeholder="0,00"
              step="0.01"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={formData.currentAmount}
              onChange={e => setFormData({...formData, currentAmount: e.target.value})}
            />
          </div>

          {/* Prazo (Opcional) */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Prazo (Opcional)</label>
            <input 
              type="date" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-6 transition-transform active:scale-95"
          >
            <Check size={20} />
            Salvar Meta
          </button>

        </form>
      </div>
    </div>
  );
}
