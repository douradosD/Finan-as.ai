import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

const DEFAULT_CATEGORIES = [
    'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Compras', 'Outros'
];

export function FinanceProvider({ children }) {
    // Inicializa o estado lendo do LocalStorage ou começa com lista vazia
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('finance_transactions');
        return saved ? JSON.parse(saved) : [];
    });

    // Estado para categorias personalizadas
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('finance_categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    // NOVO: Estado para Metas Financeiras
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('finance_goals');
        return saved ? JSON.parse(saved) : [];
    });

    // Estado para Mês Selecionado (Filtro) - Padrão: Mês Atual
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Formato YYYY-MM

    // --- EFEITOS DE PERSISTÊNCIA ---
    useEffect(() => {
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('finance_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('finance_goals', JSON.stringify(goals));
    }, [goals]);


    // --- TRANSAÇÕES ---
    const addTransaction = (transaction) => {
        if (transaction.isInstallment && transaction.installmentsCount > 1) {
            const newTransactions = [];
            const currentDate = new Date();

            for (let i = 0; i < transaction.installmentsCount; i++) {
                const date = new Date(currentDate);
                date.setMonth(currentDate.getMonth() + i);

                newTransactions.push({
                    id: crypto.randomUUID(),
                    date: date.toISOString(),
                    description: `${transaction.description} (${i + 1}/${transaction.installmentsCount})`,
                    amount: parseFloat(transaction.amount),
                    type: transaction.type,
                    category: transaction.category
                });
            }
            setTransactions(prev => [...newTransactions, ...prev]);
        } else {
            const newTransaction = {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                ...transaction,
                amount: parseFloat(transaction.amount)
            };
            setTransactions(prev => [newTransaction, ...prev]);
        }

        if (transaction.type === 'expense' && transaction.category && !categories.includes(transaction.category)) {
            setCategories(prev => [...prev, transaction.category]);
        }
    };

    const editTransaction = (id, updatedData) => {
        setTransactions(prev => prev.map(t =>
            t.id === id ? { ...t, ...updatedData, amount: parseFloat(updatedData.amount) } : t
        ));

        if (updatedData.type === 'expense' && updatedData.category && !categories.includes(updatedData.category)) {
            setCategories(prev => [...prev, updatedData.category]);
        }
    };

    const removeTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    // --- METAS (GOALS) ---
    const addGoal = (goal) => {
        const newGoal = {
            id: crypto.randomUUID(),
            currentAmount: 0, // Começa com 0 ou o usuário define
            ...goal,
            targetAmount: parseFloat(goal.targetAmount),
            currentAmount: parseFloat(goal.currentAmount || 0)
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const editGoal = (id, updatedGoal) => {
        setGoals(prev => prev.map(g =>
            g.id === id ? { ...g, ...updatedGoal, targetAmount: parseFloat(updatedGoal.targetAmount), currentAmount: parseFloat(updatedGoal.currentAmount) } : g
        ));
    };

    const removeGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    // --- FILTRAGEM E CÁLCULOS ---
    const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

    const summary = filteredTransactions.reduce((acc, t) => {
        const val = t.amount;
        if (t.type === 'income') {
            acc.income += val;
            acc.balance += val;
        } else if (t.type === 'expense') {
            acc.expenses += val;
            acc.balance -= val;
        } else if (t.type === 'investment') {
            acc.investments += val;
            acc.balance -= val;
        }
        return acc;
    }, { income: 0, expenses: 0, investments: 0, balance: 0 });

    const expensesByCategory = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const categoriesData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name)
    })).sort((a, b) => b.value - a.value);

    const balanceHistory = React.useMemo(() => {
        const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let currentBalance = 0;

        return sorted.map(t => {
            if (t.type === 'income') currentBalance += t.amount;
            else currentBalance -= t.amount;

            return {
                date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit' }),
                balance: currentBalance
            };
        });
    }, [filteredTransactions]);


    return (
        <FinanceContext.Provider value={{
            transactions: filteredTransactions,
            allTransactions: transactions,
            addTransaction,
            editTransaction,
            removeTransaction,
            summary,
            categoriesData,
            categories,
            addCategory,
            balanceHistory,
            selectedMonth,
            setSelectedMonth,
            // Exportando Metas
            goals,
            addGoal,
            editGoal,
            removeGoal
        }}>
            {children}
        </FinanceContext.Provider>
    );
}

function getCategoryColor(category) {
    const colors = {
        'Alimentação': 'bg-orange-500',
        'Transporte': 'bg-blue-500',
        'Moradia': 'bg-red-500',
        'Lazer': 'bg-purple-500',
        'Saúde': 'bg-green-500',
        'Compras': 'bg-pink-500',
        'Outros': 'bg-gray-500'
    };
    if (colors[category]) return colors[category];
    const fallbackColors = ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500', 'bg-lime-500', 'bg-fuchsia-500'];
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackColors[hash % fallbackColors.length];
}

export function useFinance() {
    return useContext(FinanceContext);
}
