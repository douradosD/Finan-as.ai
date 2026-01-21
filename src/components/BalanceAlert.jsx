import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function BalanceAlert() {
    const { summary } = useFinance();

    // Se não tiver renda, não faz sentido calcular porcentagem
    if (summary.income === 0) return null;

    const balancePercentage = (summary.balance / summary.income) * 100;

    // Regras de Alerta
    const isCritical = summary.balance < 0 || balancePercentage < 10;
    const isWarning = !isCritical && balancePercentage < 20;

    if (!isCritical && !isWarning) return null;

    return (
        <div className={`rounded-xl p-4 border mb-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${isCritical
                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
            }`}>
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                {isCritical ? <AlertOctagon size={24} /> : <AlertTriangle size={24} />}
            </div>

            <div>
                <h3 className="font-bold text-lg">
                    {isCritical ? 'Atenção Crítica: Saldo Baixo!' : 'Alerta de Orçamento'}
                </h3>
                <p className={`text-sm ${isCritical ? 'text-red-400' : 'text-yellow-400/80'}`}>
                    {isCritical
                        ? 'Seu saldo está perigosamente baixo ou negativo. Pare gastos não essenciais imediatamente.'
                        : 'Você já consumiu mais de 80% da sua renda mensal. Cuidado com novos gastos.'}
                </p>
                <div className="mt-2 text-sm font-bold">
                    Saldo Restante: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.balance)}
                </div>
            </div>
        </div>
    );
}
