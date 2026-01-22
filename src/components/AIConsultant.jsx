import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { askFinancialAdvisor } from '../services/ai';

export default function AIConsultant() {
    const { summary, categoriesData } = useFinance();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Inicializa a mensagem de boas-vindas com o nome do usuário
    useEffect(() => {
        if (messages.length === 0 && user) {
            let firstName = user.name?.split(' ')[0] || 'Investidor';

            // PERSONALIZAÇÃO: Se não for o email do Eduardo, assume que é a Sandy
            if (user.email !== 'eduardodourado000099@gmail.com') {
                firstName = 'Sandy';
            }

            setMessages([
                { role: 'assistant', text: `Olá, ${firstName}! Sou seu Agente Financeiro Pessoal. 🤖\n\nEstou analisando seus dados em tempo real. Como posso te ajudar a economizar hoje?` }
            ]);
        }
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Define o nome para o contexto da IA
            let currentName = user?.name || 'Usuário';
            if (user?.email && user.email !== 'eduardodourado000099@gmail.com') {
                currentName = 'Sandy Alves';
            }

            const context = {
                summary,
                categoriesData,
                userName: currentName
            };

            // Chamando nosso Agente Local (sem API Key necessária)
            const responseText = await askFinancialAdvisor(null, userMsg.text, context);

            setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Ops! Tive um problema no meu processador. Tente novamente.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        let firstName = user?.name?.split(' ')[0] || 'Investidor';
        if (user?.email && user.email !== 'eduardodourado000099@gmail.com') {
            firstName = 'Sandy';
        }
        setMessages([{ role: 'assistant', text: `Histórico limpo! Vamos começar de novo, ${firstName}. O que você precisa?` }]);
    };

    return (
        <>
            {/* Botão Flutuante */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 ${isOpen ? 'scale-0' : 'scale-100'
                    } bg-yellow-400 text-black font-bold flex items-center gap-2`}
            >
                <Bot size={24} />
                <span className="hidden md:inline">Agente IA</span>
            </button>

            {/* Janela do Chat */}
            <div className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-[90%] md:w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
                }`} style={{ height: '500px', maxHeight: '70vh' }}>

                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-400 rounded-lg text-black">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Agente Financeiro</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Sistema Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearHistory}
                            className="text-zinc-400 hover:text-white p-1"
                            title="Limpar Conversa"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-400 hover:text-white p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user'
                                ? 'bg-yellow-400 text-black rounded-tr-none'
                                : 'bg-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 p-3 rounded-xl rounded-tl-none flex gap-1">
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-800/30 rounded-b-2xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ex: Como economizar? Investir?"
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:border-yellow-400 outline-none transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-yellow-400 text-black p-2 rounded-xl hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
