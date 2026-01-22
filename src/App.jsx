import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Trash2,
  Pencil,
  Target,
  LogOut,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TransactionModal from "./components/TransactionModal";
import ExpensesDetailModal from "./components/ExpensesDetailModal";
import BalanceAlert from "./components/BalanceAlert";
import AIConsultant from "./components/AIConsultant";
import MonthSelector from "./components/MonthSelector";
import MonthProgress from "./components/MonthProgress";
import GoalModal from "./components/GoalModal";
import Investments from "./components/Investments";
import Login from "./pages/Login";

// Wrapper principal que fornece o contexto
export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppRoutes />
      </FinanceProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <AppContent />
      <AIConsultant />
    </>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Auth Context para Logout
  const { user, logout } = useAuth();

  // Estados para Metas
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);

  // Usando dados reais do Contexto
  const {
    summary,
    categoriesData,
    transactions,
    addTransaction,
    editTransaction,
    removeTransaction,
    balanceHistory,
    selectedMonth,
    setSelectedMonth,
    goals,
    addGoal,
    editGoal,
    removeGoal,
  } = useFinance();

  // Handlers para Transações
  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleOpenNewTransaction = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (data) => {
    if (data.id) {
      editTransaction(data.id, data);
    } else {
      addTransaction(data);
    }
  };

  // Handlers para Metas
  const handleEditGoal = (goal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleOpenNewGoal = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (data) => {
    if (data.id) {
      editGoal(data.id, data);
    } else {
      addGoal(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black pb-24 md:pb-0">
      {/* Modais */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      <ExpensesDetailModal
        isOpen={isExpensesModalOpen}
        onClose={() => setIsExpensesModalOpen(false)}
      />

      {/* Sidebar (Desktop) */}
      <nav className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 p-6 hidden md:block z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold text-xl">
            $
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Finanças<span className="text-yellow-400">.ai</span>
          </h1>
        </div>

        <div className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Visão Geral"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<Wallet size={20} />}
            label="Transações"
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          />
          <NavItem
            icon={<PieChart size={20} />}
            label="Metas"
            active={activeTab === "budget"}
            onClick={() => setActiveTab("budget")}
          />
          <NavItem
            icon={<TrendingUp size={20} />}
            label="Investimentos"
            active={activeTab === "investments"}
            onClick={() => setActiveTab("investments")}
          />
        </div>

        {/* User Profile & Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              {/* Avatar (fake for now) */}
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-zinc-400 truncate">Online</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-2 md:hidden z-50 flex justify-around items-center safe-area-bottom">
        <MobileNavItem
          icon={<LayoutDashboard size={24} />}
          label="Início"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />
        <MobileNavItem
          icon={<Wallet size={24} />}
          label="Extrato"
          active={activeTab === "transactions"}
          onClick={() => setActiveTab("transactions")}
        />

        {/* Botão Central de Adicionar (Mobile) */}
        <button
          onClick={handleOpenNewTransaction}
          className="bg-yellow-400 text-black p-4 rounded-full shadow-lg -mt-8 border-4 border-black active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>

        <MobileNavItem
          icon={<PieChart size={24} />}
          label="Metas"
          active={activeTab === "budget"}
          onClick={() => setActiveTab("budget")}
        />
        <MobileNavItem
          icon={<TrendingUp size={24} />}
          label="Investir"
          active={activeTab === "investments"}
          onClick={() => setActiveTab("investments")}
        />
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-black font-bold">
              $
            </div>
            <span className="font-bold">Finanças.ai</span>
          </div>
          <button onClick={logout} className="text-zinc-500 hover:text-white">
            <LogOut size={20} />
          </button>
        </div>

        {activeTab !== "budget" && activeTab !== "investments" && (
          <div className="w-full">
            <MonthSelector
              selectedMonth={selectedMonth}
              onChange={setSelectedMonth}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-10 max-w-7xl mx-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Olá, {user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-zinc-400">
              {activeTab === "dashboard" && "Resumo financeiro mensal"}
              {activeTab === "transactions" &&
                "Gerencie suas entradas e saídas"}
              {activeTab === "budget" && "Planeje seus sonhos e objetivos"}
              {activeTab === "investments" &&
                "Acompanhe a evolução do seu patrimônio"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== "budget" && activeTab !== "investments" && (
              <MonthSelector
                selectedMonth={selectedMonth}
                onChange={setSelectedMonth}
              />
            )}

            <button
              onClick={handleOpenNewTransaction}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Nova Transação</span>
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
            <MonthProgress />
            <BalanceAlert />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SummaryCard
                title="Renda Mensal"
                value={summary.income}
                icon={<DollarSign size={20} />}
                trend="+5%"
                trendUp={true}
              />
              <div
                className="cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setIsExpensesModalOpen(true)}
              >
                <SummaryCard
                  title="Gastos Totais"
                  value={summary.expenses}
                  icon={<ArrowDownRight size={20} />}
                  trend="+12%"
                  trendUp={false}
                />
              </div>
              <SummaryCard
                title="Investimentos"
                value={summary.investments}
                icon={<TrendingUp size={20} />}
                trend="+2%"
                trendUp={true}
              />
              <SummaryCard
                title="Saldo (Mês)"
                value={summary.balance}
                icon={<Wallet size={20} />}
                highlight
              />
            </div>

            {/* GRÁFICO DE EVOLUÇÃO */}
            <div className="bg-zinc-900 rounded-2xl p-4 md:p-6 border border-zinc-800 mb-8 h-[250px] md:h-[300px]">
              <h3 className="font-bold text-lg mb-4">Evolução do Saldo</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceHistory}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#71717a"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#71717a"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `R$ ${value}`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      borderColor: "#27272a",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#FACC15" }}
                    formatter={(value) => [formatCurrency(value), "Saldo"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#FACC15"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h3 className="font-bold text-lg mb-6">Gastos por Categoria</h3>
                {categoriesData.length > 0 ? (
                  <div className="space-y-4">
                    {categoriesData.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-300">{cat.name}</span>
                          <span className="font-medium">
                            {formatCurrency(cat.value)}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${cat.color}`}
                            style={{
                              width: `${(cat.value / summary.expenses) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-zinc-500">
                    <p>Nenhum gasto registrado neste mês.</p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="font-bold text-lg mb-4">Diagnóstico</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${summary.balance >= 0 ? "border-green-500" : "border-red-500"}`}
                    >
                      <span
                        className={`text-xl font-bold ${summary.balance >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {summary.balance >= 0 ? "A" : "C"}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`font-bold ${summary.balance >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {summary.balance >= 0 ? "Saudável" : "Atenção"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {summary.balance >= 0
                          ? "Gastos sob controle."
                          : "Gastando mais que ganha."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "transactions" && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden mb-20">
            <div className="p-4 md:p-6 border-b border-zinc-800">
              <h3 className="text-xl font-bold">Extrato ({selectedMonth})</h3>
            </div>
            {transactions.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => handleEditTransaction(t)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-green-500/10 text-green-500" : t.type === "investment" ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {t.type === "income" ? (
                          <DollarSign size={20} />
                        ) : t.type === "investment" ? (
                          <TrendingUp size={20} />
                        ) : (
                          <ArrowDownRight size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[150px] sm:max-w-none">
                          {t.description}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(t.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}{" "}
                          • {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-sm sm:text-base mr-2 ${t.type === "income" ? "text-green-500" : t.type === "investment" ? "text-blue-500" : "text-white"}`}
                      >
                        {t.type === "expense" ? "-" : "+"}{" "}
                        {formatCurrency(t.amount)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTransaction(t);
                        }}
                        className="bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 p-2 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTransaction(t.id);
                        }}
                        className="bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-zinc-700 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-zinc-500">
                <Wallet size={48} className="mx-auto mb-4 opacity-50" />
                <p>Sem movimentações.</p>
              </div>
            )}
          </div>
        )}

        {/* ABA DE METAS (BUDGET) */}
        {activeTab === "budget" && (
          <div className="space-y-6 mb-20">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <div>
                <h3 className="text-xl font-bold">Minhas Metas</h3>
                <p className="text-zinc-400 text-sm">
                  Defina objetivos e acompanhe seu progresso.
                </p>
              </div>
              <button
                onClick={handleOpenNewGoal}
                className="bg-yellow-400 text-black p-3 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors"
              >
                <Plus size={20} />{" "}
                <span className="hidden sm:inline">Nova Meta</span>
              </button>
            </div>

            {goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400/10 text-yellow-400 rounded-lg">
                          <Target size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{goal.name}</h4>
                          {goal.deadline && (
                            <p className="text-xs text-zinc-500">
                              Meta:{" "}
                              {new Date(goal.deadline).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="text-zinc-500 hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => removeGoal(goal.id)}
                          className="text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2 flex justify-between text-sm font-medium">
                      <span className="text-zinc-300">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-zinc-500">
                        de {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>

                    <p className="text-right text-xs text-yellow-400 mt-2 font-bold">
                      {Math.round(
                        (goal.currentAmount / goal.targetAmount) * 100,
                      )}
                      % Concluído
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
                <Target size={64} className="mx-auto text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-zinc-300">
                  Nenhuma meta definida
                </h3>
                <p className="text-zinc-500 mb-6">
                  Comece a planejar seus sonhos hoje mesmo!
                </p>
                <button
                  onClick={handleOpenNewGoal}
                  className="text-yellow-400 hover:underline"
                >
                  Criar minha primeira meta
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "investments" && <Investments />}
      </main>
    </div>
  );
}

// ... Resto dos componentes auxiliares (NavItem, MobileNavItem, etc) permanecem iguais ...
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-yellow-400 text-black"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
        active ? "text-yellow-400" : "text-zinc-500"
      }`}
    >
      {React.cloneElement(icon, { size: 20 })}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );
}

function SummaryCard({ title, value, icon, trend, trendUp, highlight }) {
  return (
    <div
      className={`rounded-2xl p-6 border ${highlight ? "bg-yellow-400 text-black border-yellow-500" : "bg-zinc-900 border-zinc-800"}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 rounded-lg ${highlight ? "bg-black/10" : "bg-zinc-800"}`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              trendUp
                ? highlight
                  ? "bg-green-900/20 text-green-900"
                  : "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {trend}
          </div>
        )}
      </div>
      <p
        className={`text-sm mb-1 ${highlight ? "text-black/70" : "text-zinc-400"}`}
      >
        {title}
      </p>
      <h3 className="text-2xl font-bold">{formatCurrency(value)}</h3>
    </div>
  );
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
