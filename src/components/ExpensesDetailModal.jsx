import React from 'react';
import { X, TrendingDown, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function ExpensesDetailModal({ isOpen, onClose }) {
    const { transactions, categoriesData, summary } = useFinance();

    if (!isOpen) return null;

    // Filtrar apenas despesas e ordenar por valor
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => b.amount - a.amount);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative">

                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Detalhamento de Gastos</h2>
                            <p className="text-zinc-400 text-sm">Total: {formatCurrency(summary.expenses)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Top Categorias */}
                    <section>
                        <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider">Por Categoria</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoriesData.map((cat) => (
                                <div key={cat.name} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                        <span className="font-medium">{cat.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatCurrency(cat.value)}</p>
                                        <p className="text-xs text-zinc-400">{Math.round((cat.value / summary.expenses) * 100)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Top Gastos Individuais */}
                    <section>
                        <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider">Maiores Despesas</h3>
                        <div className="space-y-3">
                            {expenses.slice(0, 10).map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg transition-colors border-b border-zinc-800/50 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                                            <ArrowDownRight size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium">{expense.description}</p>
                                            <p className="text-xs text-zinc-400">{new Date(expense.date).toLocaleDateString('pt-BR')} • {expense.category}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-white">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                </div>
                            ))}
                            {expenses.length === 0 && (
                                <p className="text-zinc-500 text-center py-4">Nenhuma despesa registrada.</p>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
