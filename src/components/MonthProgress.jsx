import React from 'react';
import { CalendarClock } from 'lucide-react';

export default function MonthProgress() {
    const today = new Date();
    const currentDay = today.getDate();

    // Total de dias no mês atual
    const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Porcentagem do mês que já passou
    const percentage = (currentDay / totalDays) * 100;

    // Dias restantes
    const remainingDays = totalDays - currentDay;

    // Formatar data completa
    const formattedDate = today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6">

            {/* Ícone e Data */}
            <div className="flex items-center gap-4 min-w-fit">
                <div className="p-3 bg-zinc-800 rounded-xl text-yellow-400">
                    <CalendarClock size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg capitalize">{formattedDate}</h3>
                    <p className="text-sm text-zinc-400">
                        {remainingDays === 0
                            ? 'Último dia do mês!'
                            : `Faltam ${remainingDays} dias para acabar o mês`}
                    </p>
                </div>
            </div>

            {/* Barra de Progresso */}
            <div className="flex-1 w-full">
                <div className="flex justify-between text-xs mb-2 font-medium text-zinc-500 uppercase tracking-wider">
                    <span>Início</span>
                    <span>Dia {currentDay} de {totalDays}</span>
                    <span>Fim</span>
                </div>

                <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50 relative">
                    {/* Barra preenchida */}
                    <div
                        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out relative"
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Brilho na ponta */}
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    </div>

                    {/* Marcadores de semanas (opcional, para visual) */}
                    <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-zinc-700/30"></div>
                    <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-zinc-700/30"></div>
                    <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-zinc-700/30"></div>
                </div>
            </div>
        </div>
    );
}
