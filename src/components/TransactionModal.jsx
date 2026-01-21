import React, { useState, useEffect } from 'react';
import { X, Check, Plus, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function TransactionModal({ isOpen, onClose, onSave, transactionToEdit }) {
    const { categories } = useFinance();
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);
    const [installmentsCount, setInstallmentsCount] = useState(2);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense', // expense, income, investment
        category: 'Alimentação'
    });

    // Preenche o formulário se for edição
    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                description: transactionToEdit.description,
                amount: transactionToEdit.amount,
                type: transactionToEdit.type,
                category: transactionToEdit.category || 'Alimentação'
            });
            setIsInstallment(false); // Desativa parcelamento na edição para simplificar
        } else {
            // Reset se for nova transação
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: 'Alimentação'
            });
            setIsInstallment(false);
        }
    }, [transactionToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.description || !formData.amount) return;

        const dataToSave = {
            ...formData,
            // Se for edição, mantém o ID e Data originais (ou atualiza se quiser)
            ...(transactionToEdit && { id: transactionToEdit.id, date: transactionToEdit.date }),
            isInstallment: isInstallment && formData.type === 'expense' && !transactionToEdit, // Só permite criar parcelas na criação
            installmentsCount: parseInt(installmentsCount)
        };

        onSave(dataToSave);

        // Limpar form
        setFormData({
            description: '',
            amount: '',
            type: 'expense',
            category: 'Alimentação'
        });
        setIsNewCategory(false);
        setIsInstallment(false);
        setInstallmentsCount(2);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Tipo de Transação */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-800 p-1 rounded-lg">
                        {['expense', 'income', 'investment'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, type });
                                    if (type !== 'expense') setIsInstallment(false);
                                }}
                                className={`py-3 text-sm font-medium rounded-md transition-colors ${formData.type === type
                                        ? 'bg-zinc-700 text-white shadow-sm'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {type === 'expense' && 'Despesa'}
                                {type === 'income' && 'Receita'}
                                {type === 'investment' && 'Investir'}
                            </button>
                        ))}
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Descrição</label>
                        <input
                            type="text"
                            placeholder="Ex: TV Samsung, Jantar..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            autoFocus
                        />
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                            {isInstallment ? 'Valor da Parcela (R$)' : 'Valor Total (R$)'}
                        </label>
                        <input
                            type="number"
                            placeholder="0,00"
                            step="0.01"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>

                    {/* Opção de Parcelamento (Apenas Criação de Despesas) */}
                    {formData.type === 'expense' && !transactionToEdit && (
                        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-6 h-6 rounded border flex items-center justify-center cursor-pointer transition-colors ${isInstallment ? 'bg-yellow-400 border-yellow-400' : 'border-zinc-600'}`}
                                    onClick={() => setIsInstallment(!isInstallment)}>
                                    {isInstallment && <Check size={16} className="text-black" />}
                                </div>
                                <label className="text-sm text-zinc-300 cursor-pointer select-none flex items-center gap-2 py-2" onClick={() => setIsInstallment(!isInstallment)}>
                                    <CreditCard size={18} />
                                    Compra Parcelada?
                                </label>
                            </div>

                            {isInstallment && (
                                <div className="pl-9 animate-in slide-in-from-top-2 duration-200">
                                    <label className="block text-xs text-zinc-500 mb-1">Número de Parcelas</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="2"
                                            max="60"
                                            className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-center"
                                            value={installmentsCount}
                                            onChange={e => setInstallmentsCount(e.target.value)}
                                        />
                                        <span className="text-sm text-zinc-400">x de R$ {formData.amount || '0'}</span>
                                    </div>
                                    <p className="text-xs text-yellow-500/80 mt-2">
                                        Total Final: R$ {((parseFloat(formData.amount) || 0) * parseInt(installmentsCount)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Categoria (só aparece se for despesa) */}
                    {formData.type === 'expense' && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm text-zinc-400">Categoria</label>
                                {!isNewCategory && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsNewCategory(true);
                                            setFormData({ ...formData, category: '' });
                                        }}
                                        className="text-xs text-yellow-400 hover:underline flex items-center gap-1 p-2"
                                    >
                                        <Plus size={14} /> Nova
                                    </button>
                                )}
                                {isNewCategory && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsNewCategory(false);
                                            setFormData({ ...formData, category: 'Alimentação' });
                                        }}
                                        className="text-xs text-zinc-400 hover:text-white p-2"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            {isNewCategory ? (
                                <input
                                    type="text"
                                    placeholder="Digite o nome da nova categoria..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            ) : (
                                <select
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors appearance-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-6 transition-transform active:scale-95"
                    >
                        <Check size={20} />
                        {transactionToEdit ? 'Salvar Alterações' : 'Salvar Transação'}
                    </button>

                </form>
            </div>
        </div>
    );
}
