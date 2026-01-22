import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import {
    subscribeTransactions,
    addTransactionDB,
    updateTransactionDB,
    deleteTransactionDB,
    subscribeGoals,
    addGoalDB,
    updateGoalDB,
    deleteGoalDB,
    subscribeInvestments,
    addInvestmentDB,
    updateInvestmentDB,
    deleteInvestmentDB
} from '../services/db';

const FinanceContext = createContext();

const DEFAULT_CATEGORIES = [
    'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Compras', 'Outros'
];

export function FinanceProvider({ children }) {
    const { user } = useAuth();

    // Estados Locais (usados quando deslogado ou como cache visual)
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [investments, setInvestments] = useState([]);

    // Estado para categorias personalizadas
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('finance_categories');
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    });

    // Estado para Mês Selecionado (Filtro)
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const baseKey = 'finance_selected_month';
        const saved = localStorage.getItem(baseKey);
        return saved || new Date().toISOString().slice(0, 7);
    });

    // Helper para chavear por usuário (email prioritário)
    const storageKey = (name) => {
        const idPart = user?.email || user?.id || 'guest';
        return `finance_${idPart}_${name}`;
    };

    // --- SINCRONIZAÇÃO (REALTIME) ---
    useEffect(() => {
        // Hidratar pelo usuário atual
        const savedTrans = localStorage.getItem(storageKey('transactions'));
        const savedGoals = localStorage.getItem(storageKey('goals'));
        const savedInv = localStorage.getItem(storageKey('investments'));
        const savedMonth = localStorage.getItem(storageKey('selected_month'));
        if (savedTrans) setTransactions(JSON.parse(savedTrans));
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (savedInv) setInvestments(JSON.parse(savedInv));
        if (savedMonth) setSelectedMonth(savedMonth);

        if (user) {
            const unsubTransactions = subscribeTransactions(user.id, (data) => setTransactions(data));
            const unsubGoals = subscribeGoals(user.id, (data) => setGoals(data));
            const unsubInvestments = subscribeInvestments(user.id, (data) => setInvestments(data));
            return () => {
                unsubTransactions();
                unsubGoals();
                unsubInvestments();
            };
        }
    }, [user]);

    // --- PERSISTÊNCIA LOCAL (BACKUP/OFFLINE) ---
    useEffect(() => {
        localStorage.setItem(storageKey('transactions'), JSON.stringify(transactions));
        localStorage.setItem(storageKey('goals'), JSON.stringify(goals));
        localStorage.setItem(storageKey('investments'), JSON.stringify(investments));
        localStorage.setItem('finance_categories', JSON.stringify(categories));
    }, [transactions, categories, goals, investments, user]);

    useEffect(() => {
        localStorage.setItem(storageKey('selected_month'), selectedMonth);
    }, [selectedMonth, user]);


    // --- TRANSAÇÕES ---
    const addTransaction = (transaction) => {
        const newTransactionsList = [];

        // Lógica de Parcelamento
        if (transaction.isInstallment && transaction.installmentsCount > 1) {
            const currentDate = new Date();
            for (let i = 0; i < transaction.installmentsCount; i++) {
                const date = new Date(currentDate);
                date.setMonth(currentDate.getMonth() + i);

                newTransactionsList.push({
                    id: crypto.randomUUID(),
                    date: date.toISOString(),
                    description: `${transaction.description} (${i + 1}/${transaction.installmentsCount})`,
                    amount: parseFloat(transaction.amount),
                    type: transaction.type,
                    category: transaction.category
                });
            }
        } else {
            newTransactionsList.push({
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                ...transaction,
                amount: parseFloat(transaction.amount)
            });
        }

        // Salvar (Firestore ou Local)
        if (user) {
            newTransactionsList.forEach(t => addTransactionDB(user.id, t));
        } else {
            setTransactions(prev => [...newTransactionsList, ...prev]);
        }

        // Categorias
        if (transaction.type === 'expense' && transaction.category && !categories.includes(transaction.category)) {
            setCategories(prev => [...prev, transaction.category]);
        }
    };

    const editTransaction = (id, updatedData) => {
        const data = { ...updatedData, amount: parseFloat(updatedData.amount) };

        if (user) {
            updateTransactionDB(user.id, id, data);
        } else {
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
        }

        if (updatedData.type === 'expense' && updatedData.category && !categories.includes(updatedData.category)) {
            setCategories(prev => [...prev, updatedData.category]);
        }
    };

    const removeTransaction = (id) => {
        if (user) {
            deleteTransactionDB(user.id, id);
        } else {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
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
            currentAmount: 0,
            ...goal,
            targetAmount: parseFloat(goal.targetAmount),
            currentAmount: parseFloat(goal.currentAmount || 0)
        };

        if (user) {
            addGoalDB(user.id, newGoal);
        } else {
            setGoals(prev => [...prev, newGoal]);
        }
    };

    const editGoal = (id, updatedGoal) => {
        const data = {
            ...updatedGoal,
            targetAmount: parseFloat(updatedGoal.targetAmount),
            currentAmount: parseFloat(updatedGoal.currentAmount)
        };

        if (user) {
            updateGoalDB(user.id, id, data);
        } else {
            setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
        }
    };

    const removeGoal = (id) => {
        if (user) {
            deleteGoalDB(user.id, id);
        } else {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    };

    // --- INVESTIMENTOS ---
    const addInvestment = (investment) => {
        const newInv = {
            id: crypto.randomUUID(),
            ...investment,
            amount: parseFloat(investment.amount),
            initialAmount: parseFloat(investment.initialAmount || investment.amount)
        };

        if (user) {
            addInvestmentDB(user.id, newInv);
        } else {
            setInvestments(prev => [...prev, newInv]);
        }
    };

    const removeInvestment = (id) => {
        if (user) {
            deleteInvestmentDB(user.id, id);
        } else {
            setInvestments(prev => prev.filter(i => i.id !== id));
        }
    };

    // --- CÁLCULOS ---
    const filteredTransactions = transactions.filter(t => t.date && t.date.startsWith(selectedMonth));

    const summary = filteredTransactions.reduce((acc, t) => {
        const val = t.amount;
        if (t.type === 'income') {
            acc.income += val;
            acc.balance += val;
        } else if (t.type === 'expense') {
            acc.expenses += val;
            acc.balance -= val;
        } else if (t.type === 'investment') {
            acc.investments += val; // Mantendo fluxo
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
            goals,
            addGoal,
            editGoal,
            removeGoal,
            investments,
            addInvestment,
            removeInvestment
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
