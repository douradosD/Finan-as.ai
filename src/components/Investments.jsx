import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, Plus, Trash2, X, DollarSign, PieChart } from 'lucide-react';

export default function Investments() {
    const { investments, addInvestment, removeInvestment } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cálculos
    const totalPatrimonio = investments.reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
    const totalInvestido = investments.reduce((acc, inv) => acc + (parseFloat(inv.initialAmount) || 0), 0);
    const rendimento = totalPatrimonio - totalInvestido;
    const rendimentoPct = totalInvestido > 0 ? (rendimento / totalInvestido) * 100 : 0;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-zinc-400 text-sm">Patrimônio Total</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{formatCurrency(totalPatrimonio)}</h2>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${rendimento >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-zinc-400 text-sm">Rentabilidade</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className={`text-3xl font-bold ${rendimento >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {rendimento >= 0 ? '+' : ''}{formatCurrency(rendimento)}
                        </h2>
                        <span className={`text-sm font-bold ${rendimento >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ({rendimentoPct.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Lista de Ativos */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Meus Ativos</h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                    >
                        <Plus size={18} /> Novo Ativo
                    </button>
                </div>

                {investments.length > 0 ? (
                    <div className="divide-y divide-zinc-800">
                        {investments.map((inv) => (
                            <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                                        <PieChart size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{inv.name}</h4>
                                        <p className="text-xs text-zinc-500">{inv.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-bold">{formatCurrency(inv.amount)}</p>
                                        <p className={`text-xs ${(inv.amount - inv.initialAmount) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {(inv.amount - inv.initialAmount) >= 0 ? '+' : ''}{formatCurrency(inv.amount - inv.initialAmount)}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => removeInvestment(inv.id)}
                                        className="text-zinc-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-zinc-500">
                        <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Nenhum investimento cadastrado.</p>
                        <button onClick={() => setIsModalOpen(true)} className="text-yellow-400 mt-2 hover:underline">
                            Adicionar o primeiro
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Novo Investimento */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-800 p-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Novo Investimento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            addInvestment({
                                name: formData.get('name'),
                                type: formData.get('type'),
                                amount: parseFloat(formData.get('amount')),
                                initialAmount: parseFloat(formData.get('amount')) // Inicialmente é igual
                            });
                            setIsModalOpen(false);
                        }} className="space-y-4">
                            
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Nome do Ativo</label>
                                <input 
                                    name="name" 
                                    required
                                    placeholder="Ex: CDB Nubank, PETR4" 
                                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Tipo</label>
                                <select 
                                    name="type" 
                                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                >
                                    <option value="Renda Fixa">Renda Fixa (CDB, Tesouro)</option>
                                    <option value="Ações">Ações (Bolsa)</option>
                                    <option value="FIIs">Fundos Imobiliários</option>
                                    <option value="Cripto">Criptomoedas</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Valor Atual</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                                    <input 
                                        name="amount" 
                                        type="number" 
                                        step="0.01" 
                                        required
                                        placeholder="0,00" 
                                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-colors active:scale-95 mt-4"
                            >
                                Salvar Investimento
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
