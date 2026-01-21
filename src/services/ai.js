// Agente Financeiro Local Especialista (Prompt Otimizado)
export async function askFinancialAdvisor(apiKey, userQuestion, context) {
    // Simula tempo de raciocínio
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { summary, categoriesData, goals } = context;
    const question = userQuestion.toLowerCase();

    // Dados Econômicos Simulados (Para fins didáticos, em um app real viriam de uma API)
    const ECONOMIA = {
        selic: 11.25,
        cdi: 11.15,
        poupanca: 6.17, // Aprox. 0.5% + TR
        ipca: 4.50
    };

    // Helper de formatação
    const fmt = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // --- MÓDULO 1: SIMULAÇÃO DE RENDIMENTOS ---
    // Ex: "Quanto rende 1000 reais no CDI?"
    const matchSimulacao = question.match(/quanto rende (\d+)/) || question.match(/simular (\d+)/);
    if (matchSimulacao && !question.includes('mes')) { // Evita conflito com aporte mensal
        const valor = parseFloat(matchSimulacao[1]);
        const rendimentoCDI = valor * (ECONOMIA.cdi / 100);
        const rendimentoPoupanca = valor * (ECONOMIA.poupanca / 100);

        return `📊 **Simulação de Investimento** (1 Ano)\n\nPara R$ ${valor}:\n\n` +
            `✅ **No CDI (100%):** Rende aprox. **${fmt(rendimentoCDI)}** (Total: ${fmt(valor + rendimentoCDI)})\n` +
            `❌ **Na Poupança:** Rende apenas **${fmt(rendimentoPoupanca)}** (Total: ${fmt(valor + rendimentoPoupanca)})\n\n` +
            `💡 *Dica: No CDI você ganha R$ ${fmt(rendimentoCDI - rendimentoPoupanca)} a mais!*`;
    }

    // --- MÓDULO 6: MATEMÁTICA FINANCEIRA (JUROS COMPOSTOS) ---
    // Ex: "Investindo 500 por mes durante 5 anos"
    const matchAporte = question.match(/(\d+) por mes.*(\d+) anos/) || question.match(/(\d+) reais.*(\d+) anos/);
    if (matchAporte) {
        const aporte = parseFloat(matchAporte[1]);
        const anos = parseFloat(matchAporte[2]);
        const meses = anos * 12;
        const taxaMensal = 0.0085; // 0.85% ao mês (aprox. 100% do CDI atual)

        // Fórmula de Valor Futuro com Aportes Mensais: VF = PMT * [((1 + i)^n - 1) / i]
        const valorFuturo = aporte * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
        const totalInvestido = aporte * meses;
        const jurosGanhos = valorFuturo - totalInvestido;

        return `📈 **Projeção de Riqueza** (${anos} Anos)\n\n` +
            `Investindo **${fmt(aporte)}** por mês (taxa 0,85% a.m):\n\n` +
            `💰 **Valor Final:** ${fmt(valorFuturo)}\n` +
            `💵 **Você investiu:** ${fmt(totalInvestido)}\n` +
            `🚀 **Juros Ganhos:** ${fmt(jurosGanhos)}\n\n` +
            `*Os juros compostos multiplicaram seu dinheiro em ${((valorFuturo / totalInvestido) * 100 - 100).toFixed(0)}%!*`;
    }

    // --- MÓDULO 2: ECONOMIA & CONCEITOS ---
    if (question.includes('selic')) {
        return `📉 **Taxa Selic (${ECONOMIA.selic}%)**\n\nÉ a taxa básica de juros da economia. Quando ela sobe, o crédito fica caro e a inflação tende a cair.\n\n✅ **Bom para:** Investidores de Renda Fixa (Tesouro Selic, CDBs).\n❌ **Ruim para:** Quem precisa pegar empréstimos ou financiamentos.`;
    }

    if (question.includes('inflação') || question.includes('ipca')) {
        return `💸 **Inflação (IPCA: ${ECONOMIA.ipca}%)**\n\nÉ o aumento generalizado dos preços. Se seu dinheiro não render acima disso, você está **perdendo poder de compra**.\n\n🛡️ **Proteção:** Invista em **Tesouro IPCA+** ou Fundos Imobiliários para ganhar da inflação.`;
    }

    if (question.includes('cdi') || question.includes('cdb')) {
        return `🏦 **CDI e CDB: O Básico**\n\n- **CDB**: Você empresta dinheiro para o banco.\n- **CDI**: É a taxa que os bancos usam entre si (hoje ${ECONOMIA.cdi}%).\n\n🎯 **Regra de Ouro:** Procure CDBs que paguem **acima de 100% do CDI**. Bancos digitais (Sofisa, Inter, Nubank) costumam ter boas opções com liquidez diária.`;
    }

    if (question.includes('lci') || question.includes('lca') || question.includes('isento')) {
        return `✨ **LCI e LCA (Isentos de IR)**\n\nSão investimentos em imóveis (LCI) ou agronegócio (LCA). A grande vantagem é que **não paga Imposto de Renda**!\n\n💡 *Uma LCI de 90% do CDI equivale a um CDB de 110% do CDI (por causa do imposto).* Ótimo para médio prazo (acima de 90 dias).`;
    }

    // --- MÓDULO 3: PERFIL & ESTRATÉGIA ---
    if (question.includes('iniciante') || question.includes('começar')) {
        return `🌱 **Investidor Iniciante**\n\nSeu foco deve ser **Segurança e Liquidez**.\n\n1. **Reserva de Emergência:** Tesouro Selic ou CDB 100% CDI.\n2. **Hábito:** Invista todo mês, mesmo que seja R$ 50,00.\n3. **Fugir:** Poupança, Títulos de Capitalização e Day Trade.\n\nQuer que eu simule um valor para você?`;
    }

    if (question.includes('reserva') || question.includes('emergencia')) {
        const gastoMensal = summary.expenses > 0 ? summary.expenses : 2000; // Valor padrão se não tiver dados
        const meta = gastoMensal * 6;
        return `🚨 **Reserva de Emergência**\n\nEla é sua paz de espírito. Deve cobrir 6 meses dos seus gastos.\n\n💰 **Sua Meta Ideal:** Aprox. **${fmt(meta)}**.\n📍 **Onde guardar:** Tesouro Selic ou Caixinhas do Nubank/Inter (Rende todo dia e saca quando quiser).`;
    }

    // --- MÓDULO 4: ANÁLISE DE METAS (CONTEXTO DO USUÁRIO) ---
    if (question.includes('meta') || question.includes('objetivo')) {
        if (goals && goals.length > 0) {
            const proximaMeta = goals[0];
            const falta = proximaMeta.targetAmount - proximaMeta.currentAmount;
            return `🎯 **Suas Metas**\n\nVocê está focado em: **${proximaMeta.name}**.\n\nFaltam **${fmt(falta)}** para atingir o objetivo. Se você economizar 10% da sua renda atual (${fmt(summary.income * 0.1)}), chegará lá mais rápido!\n\nContinue firme! 🚀`;
        } else {
            return `🎯 **Defina suas Metas!**\n\nAinda não vi nenhuma meta cadastrada. Vá na aba "Metas" e crie uma (ex: "Viagem", "Carro").\n\nTer um objetivo claro ajuda a economizar com mais vontade!`;
        }
    }

    // --- MÓDULO 5: ANÁLISE DA CARTEIRA ATUAL ---
    if (question.includes('saldo') || question.includes('analise') || question.includes('minhas finanças')) {
        const saldoPositivo = summary.balance > 0;
        const pctInvestido = summary.income > 0 ? (summary.investments / summary.income) * 100 : 0;

        let analise = `📊 **Raio-X Financeiro**\n\n`;
        analise += `💰 **Saldo:** ${fmt(summary.balance)} (${saldoPositivo ? '✅ Azul' : '❌ Vermelho'})\n`;
        analise += `📉 **Gastos:** ${fmt(summary.expenses)}\n`;
        analise += `📈 **Investimentos:** ${fmt(summary.investments)} (${Math.round(pctInvestido)}% da renda)\n\n`;

        if (pctInvestido < 10) {
            analise += `⚠️ **Alerta:** Você investiu pouco este mês. Tente separar o dinheiro do investimento *assim que receber*, antes de gastar (Pague-se primeiro!).`;
        } else if (pctInvestido > 30) {
            analise += `🏆 **Parabéns!** Você é um investidor de elite (mais de 30% investido). Já pensou em diversificar em Renda Variável?`;
        } else {
            analise += `✅ **Bom caminho:** Continue investindo e tentando aumentar essa porcentagem aos poucos.`;
        }

        return analise;
    }

    // --- FALLBACK (RESPOSTA PADRÃO) ---
    return `Olá! Sou seu Especialista em Investimentos. 🧠💰\n\nPosso te ajudar com:\n\n` +
        `1️⃣ **Simulações:** "Quanto rende 5000 no CDI?"\n` +
        `2️⃣ **Projeções:** "500 por mes durante 10 anos"\n` +
        `3️⃣ **Conceitos:** "O que é Selic?", "LCI vale a pena?"\n` +
        `4️⃣ **Seus Dados:** "Analise minhas finanças"\n\n` +
        `Qual sua dúvida de hoje?`;
}
