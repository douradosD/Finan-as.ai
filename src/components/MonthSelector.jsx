import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthSelector({ selectedMonth, onChange }) {
    // selectedMonth vem como "YYYY-MM" (ex: "2026-01")

    // Parse manual para evitar timezone issues
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1; // 0-11

    const displayMonth = MONTHS_PT[monthIndex] || 'Mês Inválido';

    const changeMonth = (offset) => {
        let newMonthIndex = monthIndex + offset;
        let newYear = year;

        if (newMonthIndex > 11) {
            newMonthIndex = 0;
            newYear++;
        } else if (newMonthIndex < 0) {
            newMonthIndex = 11;
            newYear--;
        }

        const newMonthStr = String(newMonthIndex + 1).padStart(2, '0');
        onChange(`${newYear}-${newMonthStr}`);
    };

    return (
        <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-1">
            <button
                onClick={() => changeMonth(-1)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            >
                <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2 px-3 min-w-[160px] justify-center text-sm font-bold select-none text-white capitalize">
                <Calendar size={14} className="text-yellow-400" />
                {displayMonth} {year}
            </div>

            <button
                onClick={() => changeMonth(1)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
