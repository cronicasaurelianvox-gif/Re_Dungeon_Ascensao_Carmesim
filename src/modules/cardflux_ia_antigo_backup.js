/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║    BACKUP - SISTEMA ANTIGO DE GERAÇÃO IA (REMOVIDO)           ║
 * ║    Mantido apenas como arquivo de backup/referência           ║
 * ║    Data de remoção: 17 de abril de 2026                       ║
 * ║    Motivo: Remoção completa do gerador automático por IA      ║
 * ╚═══════════════════════════════════════════════════════════════╝
 * 
 * AVISO: Este arquivo contém código REMOVIDO da aplicação.
 * Não deve ser carregado no index.html
 * Mantém referência histórica e possibilidade de recuperação futuro.
 */

// ============================================================
// 1. SELEÇÃO INTELIGENTE DE CARTAS DE EXEMPLO
// ============================================================

/**
 * Seleciona cartas do banco como referência para IA
 * @param {Object} config - {tipo?, deck?, raridade?, tema?}
 * @returns {Array} Até 5 cartas relevantes
 */
function selecionarCartasExemplo(config = {}) {
    inicializarCardfluxEstrutura();
    
    if (!armazenar.cardflux || armazenar.cardflux.length === 0) {
        console.log('⚠️ Banco vazio - usando modo sem exemplos');
        return [];
    }
    
    let cartas = [...armazenar.cardflux];
    
    // Filtro 1: Cartas ativas apenas
    cartas = cartas.filter(c => c.ativa !== false);
    
    // Filtro 2: Filtrar por tipo (prioridade alta)
    if (config.tipo) {
        const porTipo = cartas.filter(c => c.tipo === config.tipo);
        if (porTipo.length > 0) {
            cartas = porTipo;
        }
    }
    
    // Filtro 3: Filtrar por deck (prioridade média)
    if (config.deck && cartas.length > 1) {
        const porDeck = cartas.filter(c => c.deck === config.deck);
        if (porDeck.length > 0) {
            cartas = porDeck;
        }
    }
    
    // Filtro 4: Filtrar por raridade (prioridade baixa)
    if (config.raridade && cartas.length > 1) {
        const porRaridade = cartas.filter(c => c.raridade === config.raridade);
        if (porRaridade.length > 0) {
            cartas = porRaridade;
        }
    }
    
    // Embaralhar e pegar até 5
    cartas = cartas
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    console.log(`📚 Selecionadas ${cartas.length} cartas de exemplo`);
    return cartas;
}

/**
 * Formata cartas para contexto legível pela IA
 * @param {Array} cartas - Array de cartas
 * @returns {String} Texto formatado com exemplos
 */
function formatarCartasParaIA(cartas) {
    if (!cartas || cartas.length === 0) {
        return '';
    }
    
    return cartas.map((carta, idx) => `
EXEMPLO ${idx + 1}:
├─ Nome: ${carta.nome}
├─ Tipo: ${carta.tipo}
├─ Raridade: ${carta.raridade}
├─ Intensidade: ${carta.intensidade}
├─ Descrição: ${carta.descricao || '(vazia)'}
├─ Contexto: ${carta.contexto || '(vazio)'}
├─ Testes: ${carta.testes || '(vazio)'}
├─ Sucessos: ${carta.sucessos || '(vazio)'}
├─ Falhas: ${carta.falhas || '(vazio)'}
├─ Recompensas: ${carta.recompensas || '(vazio)'}
├─ Consequências: ${carta.consequencias || '(vazio)'}
├─ Ganchos: ${carta.ganchos || '(vazio)'}
└─ Tags: ${(carta.tags || []).join(', ') || '(nenhuma)'}
    `).join('\n');
}

// ============================================================
// 2. ANÁLISE INTELIGENTE DO BANCO
// ============================================================

/**
 * Analisa padrões no banco de cartas
 * @returns {Object} Estatísticas e insights
 */
function analisarBancoCardflux() {
    inicializarCardfluxEstrutura();
    
    const cartas = armazenar.cardflux || [];
    
    if (cartas.length === 0) {
        return {
            hasExemplos: false,
            totalCartas: 0,
            tiposComuns: [],
            decksComuns: [],
            raridadesComuns: [],
            intensidadeMedia: 5,
            estilo: 'neutro'
        };
    }
    
    // Contar tipos
    const tiposComuns = [...new Set(cartas.map(c => c.tipo))]
        .map(tipo => ({
            tipo,
            count: cartas.filter(c => c.tipo === tipo).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    // Contar decks
    const decksComuns = [...new Set(cartas.map(c => c.deck))]
        .map(deck => ({
            deck,
            count: cartas.filter(c => c.deck === deck).length
        }))
        .sort((a, b) => b.count - a.count);
    
    // Contar raridades
    const raridadesComuns = [...new Set(cartas.map(c => c.raridade))]
        .map(raridade => ({
            raridade,
            count: cartas.filter(c => c.raridade === raridade).length
        }))
        .sort((a, b) => b.count - a.count);
    
    // Calcular intensidade média
    const intensidadeMedia = Math.round(
        cartas.reduce((sum, c) => sum + (c.intensidade || 5), 0) / cartas.length
    );
    
    // Detectar estilo (combinando palavras-chave)
    const todasAsDescricoes = cartas
        .map(c => `${c.descricao} ${c.contexto} ${c.nome}`)
        .join(' ')
        .toLowerCase();
    
    let estilo = 'neutro';
    if (todasAsDescricoes.includes('magia') || todasAsDescricoes.includes('arcano')) {
        estilo = 'fantasia arcana';
    } else if (todasAsDescricoes.includes('combate') || todasAsDescricoes.includes('batalha')) {
        estilo = 'combate tático';
    } else if (todasAsDescricoes.includes('social') || todasAsDescricoes.includes('diplomacia')) {
        estilo = 'intriga social';
    } else if (todasAsDescricoes.includes('exploração') || todasAsDescricoes.includes('descoberta')) {
        estilo = 'exploração aventureira';
    }
    
    const analise = {
        hasExemplos: cartas.length > 0,
        totalCartas: cartas.length,
        tiposComuns: tiposComuns.map(t => t.tipo),
        decksComuns: decksComuns.map(d => d.deck),
        raridadesComuns: raridadesComuns.map(r => r.raridade),
        intensidadeMedia,
        estilo,
        padraoNomeacao: detectarPadraoNomeacao(cartas),
        palavrasChave: extrairPalavrasChave(todasAsDescricoes)
    };
    
    console.log('📊 Análise do banco:', analise);
    return analise;
}

/**
 * Detecta padrão de nomeação usado no banco
 */
function detectarPadraoNomeacao(cartas) {
    const nomes = cartas.map(c => c.nome);
    
    // Verificar se usa verbos no gerúndio
    if (nomes.some(n => n.includes('ando') || n.includes('endo') || n.includes('indo'))) {
        return 'verbo_gerundio';
    }
    
    // Verificar se usa "o" "a" "de"
    if (nomes.some(n => n.includes(' do ') || n.includes(' de ') || n.includes(' da '))) {
        return 'locucao_descritiva';
    }
    
    // Verificar se usa "de [tipo]"
    if (nomes.some(n => n.includes(' de ') && (n.includes('Combate') || n.includes('Magia')))) {
        return 'tipo_descritivo';
    }
    
    return 'livre';
}

/**
 * Extrai palavras-chave mais frequentes
 */
function extrairPalavrasChave(texto) {
    const palavrasComuns = ['o', 'a', 'de', 'em', 'é', 'para', 'com', 'por', 'e', 'um', 'uma', 'ao', 'os', 'as', 'do', 'da', 'dos', 'das', 'que', 'se', 'não', 'ou', 'eu', 'tu', 'ele', 'nós', 'vós', 'eles', 'elas'];
    
    const palavras = texto
        .split(/\s+/)
        .filter(p => p.length > 4 && !palavrasComuns.includes(p))
        .slice(0, 10);
    
    // Retornar top 5
    const frequencia = {};
    palavras.forEach(p => {
        frequencia[p] = (frequencia[p] || 0) + 1;
    });
    
    return Object.entries(frequencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([palavra]) => palavra);
}

// ============================================================
// 3. CONSTRUÇÃO DO PROMPT INTELIGENTE
// ============================================================

/**
 * Monta prompt customizado baseado em análise do banco
 */
function montarPromptIA(config, exemplosTexto, analise) {
    const secaoExemplos = exemplosTexto 
        ? `Estude esses exemplos REAIS do sistema para entender tom e estilo:\n\n${exemplosTexto}\n\n`
        : '';
    
    const secaoAnalise = analise && analise.hasExemplos
        ? `Padrões detectados no banco:
- Tipos comuns: ${analise.tiposComuns.slice(0, 3).join(', ')}
- Decks principais: ${analise.decksComuns.slice(0, 3).join(', ')}
- Raridades: ${analise.raridadesComuns.join(', ')}
- Intensidade média: ${analise.intensidadeMedia}/10
- Estilo geral: ${analise.estilo}
- Padrão de nomeação: ${analise.padraoNomeacao}
${analise.palavrasChave.length > 0 ? `- Palavras-chave frequentes: ${analise.palavrasChave.join(', ')}` : ''}

`
        : '';
    
    const prompt = `Você é um criador de eventos narrativos para um sistema de RPG chamado CardFlux.

${secaoExemplos}${secaoAnalise}TAREFA:
Gere UMA NOVA carta ORIGINAL baseada em:
- Tipo: ${config.tipo || 'Flash Event'}
- Deck: ${config.deck || 'jornada'}
- Raridade: ${config.raridade || 'Comum'}
- Intensidade: ${config.intensidade || 5}/10
- Tema: ${config.tema || 'Aventura genérica'}

REQUIREMENTS:
1. Nome ORIGINAL (não copiar exemplos)
2. Texto IMERSIVO e VARIADO
3. Estrutura apropriada para RPG
4. Chain (encadeamento) faz SENTIDO narrativo
5. Responda APENAS com JSON válido

ESTRUTURA JSON ESPERADA:
{
  "nome": "Nome Único e Criativo",
  "descricao": "Descrição breve (1-2 linhas)",
  "contexto": "Contexto da situação (2-3 linhas)",
  "testes": "Teste/Habilidade necessária",
  "sucessos": "O que acontece se passar",
  "falhas": "Consequência do fracasso",
  "recompensas": "Prêmios/benefícios",
  "consequencias": "Impacto narrativo",
  "ganchos": "Próximos eventos possíveis",
  "chain": {
    "ativa": true/false,
    "tipoAtivacao": "automatic|optional|chance",
    "chancePorcentagem": 0-100,
    "descricao": "Por que essa chain faz sentido"
  }
}

IMPORTANTE:
- SEM explicações adicionais
- SEM comentários
- APENAS JSON
- JSON válido e parseável`;
    
    return prompt;
}

// ============================================================
// 4. VERIFICAÇÃO DE DUPLICATAS
// ============================================================

/**
 * Verifica se nome já existe
 */
function verificarNomeDuplicado(nome) {
    inicializarCardfluxEstrutura();
    return armazenar.cardflux.some(c => 
        c.nome.toLowerCase().trim() === nome.toLowerCase().trim()
    );
}

/**
 * Verifica se descrição é muito similar
 */
function verificarSimilaridade(descricao) {
    inicializarCardfluxEstrutura();
    
    if (!descricao) return false;
    
    const desc_lower = descricao.toLowerCase();
    
    for (let carta of armazenar.cardflux) {
        const existente = (carta.descricao || '').toLowerCase();
        
        // Calcular similaridade simples (palavras em comum)
        const palavrasNova = desc_lower.split(/\s+/);
        const palavrasExistente = existente.split(/\s+/);
        
        const coincidencias = palavrasNova.filter(p => 
            palavrasExistente.includes(p) && p.length > 4
        ).length;
        
        // Se mais de 50% das palavras coincidem, é similar
        if (coincidencias > Math.max(palavrasNova.length, palavrasExistente.length) * 0.5) {
            return true;
        }
    }
    
    return false;
}

// ============================================================
// 5. SUGESTÃO DE CHAIN INTELIGENTE
// ============================================================

/**
 * Sugere cartas reais para encadear
 */
function sugerirChainInteligente(cartaNova, limite = 2) {
    inicializarCardfluxEstrutura();
    
    if (!armazenar.cardflux || armazenar.cardflux.length < 2) {
        return [];
    }
    
    // Buscar cartas de tipos complementares
    const tipoAtual = cartaNova.tipo;
    
    // Mapear tipos complementares
    const complementos = {
        'Emboscada': ['Perseguição', 'Fuga', 'Combate Mortal'],
        'Obstáculo': ['Exploração', 'Puzzle / Enigma', 'Descanso / Acampamento'],
        'Descoberta': ['Evento de Lore', 'Investigação', 'Revelação'],
        'Social': ['Aliança', 'Traição', 'Conflito Interno'],
        'Presságio': ['Evento Sobrenatural', 'Maldição', 'Bênção'],
        'Boss': ['Carnificina', 'Invasão', 'Defesa'],
        'Perseguição': ['Fuga', 'Emboscada', 'Combate Mortal']
    };
    
    const tiposComplementares = complementos[tipoAtual] || 
        ['Aliança', 'Recompensa', 'Cura / Redenção'];
    
    // Buscar cartas desses tipos
    const candidatas = armazenar.cardflux
        .filter(c => 
            c.id !== (cartaNova.id || '') && // Não a mesma carta
            tiposComplementares.includes(c.tipo) && // Tipo complementar
            c.ativa !== false
        )
        .slice(0, limite);
    
    console.log(`🔗 Sugeridas ${candidatas.length} cartas para chain`);
    return candidatas;
}

// ============================================================
// 6. PROCESSAMENTO DE RESPOSTA DA IA
// ============================================================

/**
 * Processa e valida resposta JSON da IA
 */
function processarRespostaIA(respostaTexto) {
    try {
        // Limpar possíveis markdown code blocks
        let json = respostaTexto
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        
        // Parse JSON
        const cartaIA = JSON.parse(json);
        
        // Validar campos obrigatórios
        if (!cartaIA.nome) {
            throw new Error('Campo "nome" obrigatório');
        }
        
        // Gerar ID único
        cartaIA.id = gerarIdCarta();
        
        // Adicionar campos padrão se faltarem
        cartaIA.dataCriacao = new Date().toISOString();
        cartaIA.ativa = true;
        cartaIA.tags = cartaIA.tags || [];
        cartaIA.pesoSorteio = cartaIA.pesoSorteio || 1;
        cartaIA.cooldown = cartaIA.cooldown || 0;
        cartaIA.intensidade = cartaIA.intensidade || 5;
        cartaIA.raridade = cartaIA.raridade || 'Comum';
        cartaIA.tipo = cartaIA.tipo || 'Flash Event';
        cartaIA.deck = cartaIA.deck || 'jornada';
        
        // Validar chain se existir
        if (cartaIA.chain && cartaIA.chain.ativa) {
            if (!cartaIA.chain.tipoAtivacao) {
                cartaIA.chain.tipoAtivacao = 'automatic';
            }
            if (!cartaIA.chain.descricao) {
                cartaIA.chain.descricao = 'Eventos encadeados relacionados';
            }
            if (cartaIA.chain.tipoAtivacao === 'chance' && !cartaIA.chain.chancePorcentagem) {
                cartaIA.chain.chancePorcentagem = 50;
            }
        }
        
        console.log('✅ Resposta IA processada com sucesso');
        return cartaIA;
        
    } catch (error) {
        console.error('❌ Erro ao processar resposta IA:', error);
        throw new Error(`Resposta IA inválida: ${error.message}`);
    }
}

// ============================================================
// 7. CHAMADA À IA (COM FALLBACK)
// ============================================================

/**
 * Chama a IA (implementar com seu provider)
 * Este é um template - implementar com Claude, GPT, etc.
 */
async function chamarIA(prompt, provedor = 'anthropic') {
    try {
        // Se modo demo está ativo, usar demo ao invés de backend
        if (typeof window !== 'undefined' && window.CARDFLUX_DEMO_MODE === true) {
            console.log('🎲 Usando MODO DEMO');
            return await window.chamarIA_Demo(prompt, 'demo');
        }
        
        // IMPORTANTE: Implementar com seu provider
        // Opções: 'anthropic', 'openai', 'google', 'backend'
        
        if (provedor === 'anthropic') {
            return await chamarClaudeAPI(prompt);
        } else if (provedor === 'openai') {
            return await chamarOpenAIAPI(prompt);
        } else if (provedor === 'backend') {
            return await chamarBackendIA(prompt);
        } else {
            throw new Error(`Provedor não implementado: ${provedor}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao chamar IA:', error);
        // Fallback para demo mode
        console.log('⚠️ Ativando MODO DEMO como fallback...');
        if (typeof window !== 'undefined') {
            window.CARDFLUX_DEMO_MODE = true;
            return await window.chamarIA_Demo(prompt, 'demo');
        }
        throw error;
    }
}

/**
 * Template para Claude (Anthropic)
 * Requer: ANTHROPIC_API_KEY no backend
 */
async function chamarClaudeAPI(prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': window.ANTHROPIC_API_KEY, // ⚠️ Nunca expor no frontend
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

/**
 * Template para OpenAI
 */
async function chamarOpenAIAPI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.OPENAI_API_KEY}` // ⚠️ Nunca expor
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo',
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 2000,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Chamar backend próprio (RECOMENDADO)
 * Mais seguro, API key fica no servidor
 */
async function chamarBackendIA(prompt) {
    try {
        const response = await fetch('/api/cardflux/gerar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                provedor: 'anthropic' // ou 'openai', etc
            })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data.resposta;
    } catch (error) {
        // Fallback: usar Claude diretamente se backend falhar (menos seguro)
        console.warn('⚠️ Backend indisponível, tentando Claude direto...');
        
        // Mensagem amigável ao usuário
        alert('💡 Backend não disponível. Use a opção "Demo" para testar sem backend.\n\nPara IA funcional: npm start no src/');
        
        throw new Error('Backend não disponível e sem API key direta');
    }
}

// ============================================================
// 8. FUNÇÃO PRINCIPAL - GERAR CARD COM IA
// ============================================================

/**
 * Função principal: Gera carta completa com IA
 * @param {Object} config - Configuração (tipo, deck, raridade, tema, intensidade)
 * @param {String} provedor - Qual IA usar ('anthropic', 'openai', 'backend')
 * @returns {Object} Carta gerada
 */
async function gerarCardfluxComIA(config = {}, provedor = 'backend') {
    try {
        console.log('🚀 Iniciando geração de carta com IA...');
        
        // Passo 1: Analisar banco com inteligência profunda
        const analise = analisarBancoCardflux();
        const analiseSemantica = window.CardFluxIA_Inteligencia?.analisarBancoSemantica?.();
        
        // Passo 2: Selecionar exemplos com inteligência
        const exemplos = analiseSemantica 
            ? window.CardFluxIA_Inteligencia.selecionarCartasInteligentes(config, analiseSemantica)
            : selecionarCartasExemplo(config);
        const exemplosTexto = formatarCartasParaIA(exemplos);
        
        // Passo 3: Montar prompt com análise inteligente
        const prompt = analiseSemantica
            ? window.CardFluxIA_Inteligencia.montarPromptInteligente(config, exemplos, analiseSemantica)
            : montarPromptIA(config, exemplosTexto, analise);
        
        console.log('📝 Prompt preparado, chamando IA...');
        
        // Passo 4: Chamar IA
        const resposta = await chamarIA(prompt, provedor);
        
        console.log('✅ Resposta recebida');
        
        // Passo 5: Processar resposta
        let carta = processarRespostaIA(resposta);
        
        // Passo 6: Validações adicionais
        
        // Verificar duplicação de nome
        let tentativas = 0;
        while (verificarNomeDuplicado(carta.nome) && tentativas < 3) {
            console.log(`⚠️ Nome duplicado, regenerando... (${tentativas + 1}/3)`);
            
            // Adicionar sufixo único
            const numero = Math.floor(Math.random() * 100);
            const versaoAnterior = carta.nome;
            carta.nome = `${versaoAnterior} [v${numero}]`;
            
            tentativas++;
        }
        
        if (verificarSimilaridade(carta.descricao)) {
            console.warn('⚠️ Descrição muito similar a existentes');
        }
        
        // Passo 7: Sugerir chain inteligente
        if (!carta.chain || !carta.chain.ativa) {
            const cartasChain = sugerirChainInteligente(carta);
            
            if (cartasChain.length > 0) {
                console.log(`💡 Sugerindo ${cartasChain.length} cartas para chain`);
                
                // Pré-popular com sugestão
                carta.chainSugerida = cartasChain.map(c => ({
                    cartaId: c.id,
                    cartaNome: c.nome,
                    cartaTipo: c.tipo,
                    cartaRaridade: c.raridade,
                    intensidadeMinima: c.intensidade
                }));
            }
        }
        
        console.log('✨ Carta gerada com sucesso!', carta);
        return carta;
        
    } catch (error) {
        console.error('❌ Erro ao gerar carta:', error.message);
        
        // Se houver função de fallback disponível, usar
        if (typeof criarCartaFallback === 'function') {
            console.warn('📦 Caindo para fallback seguro...');
            return criarCartaFallback(config);
        }
        
        throw error;
    }
}

/**
 * Wrapper v2: Gera carta com validação avançada integrada
 * Usa cardflux-ia-v2-enhancements.js
 * @param {Object} config - Configuração (tipo, deck, etc)
 * @param {String} provedor - Qual IA usar
 * @returns {Object} Carta validada e pronta para uso
 */
async function gerarCardfluxComIAv2(config = {}, provedor = 'backend') {
    try {
        console.log('🚀 Geração v2 (com validação avançada)...');
        
        // Gerar usando função original
        let carta = await gerarCardfluxComIA(config, provedor);
        
        // Validar com critérios avançados
        if (typeof validarCartaGeradaAvancado === 'function') {
            const validacao = validarCartaGeradaAvancado(carta);
            
            console.log(`📊 Validação v2 - Score: ${validacao.score}%`);
            console.log(`   Qualidade: ${validacao.qualidade}`);
            
            if (!validacao.valida) {
                console.warn('⚠️ Carta tem erros, tentando corrigir...');
                
                if (typeof corrigirCartaAutomatico === 'function') {
                    carta = corrigirCartaAutomatico(carta);
                    console.log('✅ Carta corrigida automaticamente');
                }
            }
            
            // Registrar relatório
            if (typeof gerarRelatorioCarta === 'function') {
                const relatorio = gerarRelatorioCarta(carta);
                console.log('📋 Relatório da carta:', relatorio);
            }
        }
        
        return carta;
        
    } catch (error) {
        console.error('❌ Erro na geração v2:', error.message);
        
        // Fallback automático
        if (typeof gerarComFallback === 'function') {
            return await gerarComFallback(config, provedor);
        }
        
        throw error;
    }
}

// ============================================================
// V4 - GERAÇÃO COM ANTI-CÓPIA
// ============================================================

async function gerarCardfluxComIAv4(config = {}, provedor = 'backend') {
    try {
        console.log('🚀 Geração v4 (com anti-cópia e qualidade)...');
        
        // Usar novo gerador anti-cópia se disponível
        if (typeof window.CardFluxIA_AntiCopia?.gerarCartaComQualidade === 'function') {
            console.log('✨ Usando novo gerador v4 (anti-cópia)...');
            const resultado = await window.CardFluxIA_AntiCopia.gerarCartaComQualidade(config, provedor);
            
            if (resultado.sucesso) {
                return resultado.carta;
            } else {
                console.warn('⚠️ Falha no v4, fallback para v2...');
                return await gerarCardfluxComIAv2(config, provedor);
            }
        }
        
        // Fallback: usar v2 se v4 não estiver disponível
        return await gerarCardfluxComIAv2(config, provedor);
        
    } catch (error) {
        console.error('❌ Erro na geração v4:', error.message);
        
        // Fallback automático para v2
        return await gerarCardfluxComIAv2(config, provedor);
    }
}

// ============================================================
// V5 - GERADOR NUCLEAR (NOVO!)
// ============================================================

async function gerarCardfluxComIAv5(config = {}, provedor = 'backend') {
    try {
        console.log('🚀 Geração v5 NUCLEAR (reescrita radical)...');
        
        // Usar novo gerador nuclear se disponível
        if (typeof window.CardFluxIA_V5_Nuclear?.gerarCartaNuclear === 'function') {
            console.log('💣 Iniciando gerador v5 NUCLEAR...');
            return await window.CardFluxIA_V5_Nuclear.gerarCartaNuclear(config, provedor);
        }
        
        // Fallback: usar v4 se v5 não estiver disponível
        console.warn('⚠️ v5 não disponível, usando v4...');
        return await gerarCardfluxComIAv4(config, provedor);
        
    } catch (error) {
        console.error('❌ Erro na geração v5:', error.message);
        
        // Fallback automático para v4
        return await gerarCardfluxComIAv4(config, provedor);
    }
}

// ============================================================
// 9. FUNÇÃO UI - ABRIR GERADOR COM IA
// ============================================================

/**
 * Abre modal de geração com configurações
 */
function abrirGeradorCardfluxComIA() {
    // Criar modal se não existir
    let modal = document.getElementById('modalGeradorCardfluxIA');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalGeradorCardfluxIA';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('data-bs-backdrop', 'static');
        modal.setAttribute('data-bs-keyboard', 'false');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg" style="z-index: 1050;">
                <div class="modal-content" style="background: linear-gradient(135deg, rgba(15, 15, 20, 0.98) 0%, rgba(22, 33, 62, 0.98) 100%); border: 2px solid rgba(212,175,55,0.3); border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);">
                    
                    <div class="modal-header border-0" style="border-bottom: 2px solid rgba(212,175,55,0.2); padding: 18px; background: rgba(212,175,55,0.05);">
                        <h5 class="modal-title text-gold" style="font-size: 1.2rem; font-weight: 700; text-shadow: 0 2px 6px rgba(0,0,0,0.5);">
                            🤖 Gerar Carta com IA
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.5));"></button>
                    </div>
                    
                    <div class="modal-body" style="padding: 20px;">
                        <div style="background: rgba(126, 211, 33, 0.1); border-left: 4px solid #7ED321; padding: 14px; margin-bottom: 20px; border-radius: 6px;">
                            <p style="margin: 0; color: rgba(236, 240, 241, 0.9); font-size: 0.9rem;">
                                ✨ A IA analisará suas cartas existentes e gerará uma nova, coerente com o estilo do seu universo.
                            </p>
                        </div>
                        
                        <form id="formGeradorIA" style="display: grid; gap: 15px;">
                            
                            <div>
                                <label style="color: #d4af37; font-weight: 700; margin-bottom: 6px; display: block;">⚡ Tipo</label>
                                <select id="geradorTipo" style="background: rgba(0,0,0,0.6); border: 1.5px solid rgba(212,175,55,0.4); color: #fff; border-radius: 6px; padding: 8px; font-size: 0.9rem; width: 100%; cursor: pointer;">
                                    <option value="">-- Aleatorio --</option>
                                    <option value="Emboscada">🗡️ Emboscada</option>
                                    <option value="Obstáculo">🚧 Obstáculo</option>
                                    <option value="Descoberta">💎 Descoberta</option>
                                    <option value="Social">🤝 Social</option>
                                    <option value="Boss">👹 Boss</option>
                                    <option value="Perseguição">🏃 Perseguição</option>
                                </select>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div>
                                    <label style="color: #d4af37; font-weight: 700; margin-bottom: 6px; display: block;">📚 Deck</label>
                                    <select id="geradorDeck" style="background: rgba(0,0,0,0.6); border: 1.5px solid rgba(212,175,55,0.4); color: #fff; border-radius: 6px; padding: 8px; font-size: 0.9rem; width: 100%; cursor: pointer;">
                                        <option value="">-- Aleatorio --</option>
                                        <option value="jornada">🛣️ Jornada</option>
                                        <option value="floresta">🌲 Floresta</option>
                                        <option value="tundra">❄️ Tundra</option>
                                        <option value="deserto">🏜️ Deserto</option>
                                        <option value="montanha">⛰️ Montanha</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label style="color: #d4af37; font-weight: 700; margin-bottom: 6px; display: block;">🎨 Raridade</label>
                                    <select id="geradorRaridade" style="background: rgba(0,0,0,0.6); border: 1.5px solid rgba(212,175,55,0.4); color: #fff; border-radius: 6px; padding: 8px; font-size: 0.9rem; width: 100%; cursor: pointer;">
                                        <option value="">-- Aleatorio --</option>
                                        <option value="Comum">Comum</option>
                                        <option value="Raro">Raro</option>
                                        <option value="Épico">Épico</option>
                                        <option value="Lendário">Lendário</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label style="color: #d4af37; font-weight: 700; margin-bottom: 6px; display: block;">🔥 Intensidade (1-10)</label>
                                <input type="range" id="geradorIntensidade" min="1" max="10" value="5" style="width: 100%; cursor: pointer;">
                                <span id="geradorIntensidadeDisplay" style="color: rgba(212,175,55,0.8); font-size: 0.85rem;">5/10</span>
                            </div>
                            
                            <div>
                                <label style="color: #d4af37; font-weight: 700; margin-bottom: 6px; display: block;">🎯 Tema (opcional)</label>
                                <input type="text" id="geradorTema" placeholder="Ex: magia negra, intriga política, exploração" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(212,175,55,0.3); color: #fff; border-radius: 6px; padding: 8px; font-size: 0.9rem; width: 100%;">
                            </div>
                            
                        </form>
                        
                        <div style="margin-top: 20px; padding: 14px; background: rgba(0,0,0,0.3); border-radius: 6px;">
                            <p style="margin: 0; color: rgba(212,175,55,0.7); font-size: 0.8rem; font-weight: 600;">
                                ⚙️ Configuração padrão: Sem filtros (geração aleatória)
                            </p>
                        </div>
                    </div>
                    
                    <div class="modal-footer border-0" style="border-top: 2px solid rgba(212,175,55,0.2); padding: 15px; background: rgba(212,175,55,0.05);">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="background: rgba(100,110,120,0.8); border: none; border-radius: 6px; padding: 8px 20px; font-weight: 600;">
                            ❌ Cancelar
                        </button>
                        <button type="button" onclick="executarGeradorIA()" style="background: linear-gradient(135deg, #7ED321, #9FD356); color: #1a1a2e; border: none; border-radius: 6px; padding: 10px 24px; font-weight: 700; transition: all 0.2s; cursor: pointer;" onmouseover="this.style.boxShadow='0 0 20px rgba(126, 211, 33, 0.4)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)';">
                            🚀 Gerar Carta
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Listeners
        document.getElementById('geradorIntensidade').addEventListener('input', (e) => {
            document.getElementById('geradorIntensidadeDisplay').textContent = `${e.target.value}/10`;
        });
    }
    
    // Abrir
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

/**
 * Executa geração com valores do formulário
 */
async function executarGeradorIA() {
    const btnGerar = event.target;
    const btnOriginal = btnGerar.textContent;
    
    try {
        btnGerar.disabled = true;
        btnGerar.textContent = '⏳ Gerando...';
        
        // Coletar valores
        const config = {
            tipo: document.getElementById('geradorTipo').value || undefined,
            deck: document.getElementById('geradorDeck').value || undefined,
            raridade: document.getElementById('geradorRaridade').value || undefined,
            intensidade: parseInt(document.getElementById('geradorIntensidade').value) || 5,
            tema: document.getElementById('geradorTema').value || 'Aventura genérica'
        };
        
        // Gerar usando v5 NUCLEAR (se disponível) → v4 → v2 → v1
        let carta;
        if (typeof gerarCardfluxComIAv5 === 'function') {
            console.log('💣 Usando gerador v5 NUCLEAR...');
            carta = await gerarCardfluxComIAv5(config, 'backend');
        } else if (typeof gerarCardfluxComIAv4 === 'function') {
            console.log('🚀 Usando gerador v4 (anti-cópia com qualidade)...');
            carta = await gerarCardfluxComIAv4(config, 'backend');
        } else if (typeof gerarCardfluxComIAv2 === 'function') {
            console.log('🚀 Usando gerador v2 (com validação avançada)...');
            carta = await gerarCardfluxComIAv2(config, 'backend');
        } else {
            console.log('🎲 Usando gerador v1 (compatibilidade)...');
            carta = await gerarCardfluxComIA(config, 'backend');
        }
        
        // Fechar modal gerador
        bootstrap.Modal.getInstance(document.getElementById('modalGeradorCardfluxIA')).hide();
        
        // Abrir editor com carta gerada
        setTimeout(() => {
            // IMPORTANTE: Abrir modal ANTES de preencher para evitar reset
            console.log('📋 Abrindo modal vazio...');
            abrirModalCardfluxUnificado();
            
            // DEPOIS preencher com a carta gerada
            setTimeout(() => {
                console.log('📝 Preenchendo campos com carta gerada:', carta);
                preencherEditorComCartaGerada(carta);
                console.log('✅ Campos preenchidos!');
            }, 100);
        }, 500);
        
        alert('✅ Carta gerada com sucesso! Revise antes de salvar.');
        
    } catch (error) {
        console.error('❌ Erro na geração:', error);
        alert(`❌ Erro ao gerar carta:\n${error.message}`);
        
    } finally {
        btnGerar.disabled = false;
        btnGerar.textContent = btnOriginal;
    }
}

/**
 * Preenche editor com carta gerada
 */
function preencherEditorComCartaGerada(carta) {
    const form = document.getElementById('formCardfluxEditor');
    
    if (!form) {
        console.error('❌ Formulário não encontrado');
        return;
    }
    
    // Preencher campos
    const campos = {
        'cardfluxNome': carta.nome,
        'cardfluxTipo': carta.tipo || '',
        'cardfluxIntensidade': carta.intensidade || 5,
        'cardfluxRaridade': carta.raridade || 'Comum',
        'cardfluxDeck': carta.deck || 'jornada',
        'cardfluxPeso': carta.pesoSorteio || 1,
        'cardfluxCooldown': carta.cooldown || 0,
        'cardfluxTags': (carta.tags || []).join(', '),
        'cardfluxDescricao': carta.descricao || '',
        'cardfluxContexto': carta.contexto || '',
        'cardfluxTestes': carta.testes || '',
        'cardfluxSucessos': carta.sucessos || '',
        'cardfluxFalhas': carta.falhas || '',
        'cardfluxRecompensas': carta.recompensas || '',
        'cardfluxConsequencias': carta.consequencias || '',
        'cardfluxGanchos': carta.ganchos || '',
        'cardfluxImagemUrl': carta.imagemUrl || ''
    };
    
    for (const [id, valor] of Object.entries(campos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.value = valor;
        }
    }
    
    // Preencher checkbox de ativa
    const checkboxAtiva = document.getElementById('cardfluxAtiva');
    if (checkboxAtiva) {
        checkboxAtiva.checked = carta.ativa !== false;
    }
    
    // Salvar cartaId e dados para edição
    form.dataset.cartaId = '';
    
    // Armazenar carta para referência (será salva ao clicar Salvar)
    form.dataset.cartaGerada = JSON.stringify(carta);
    
    // Preencher chain se sugerida
    if (carta.chainSugerida && carta.chainSugerida.length > 0) {
        console.log('💡 Pre-populando chain com sugestão...');
        
        setTimeout(() => {
            // Adicionar cartas sugeridas ao container de chain
            const containerChain = document.getElementById('cardfluxChainSelectedCards');
            if (containerChain) {
                carta.chainSugerida.forEach(cartaRef => {
                    // Simular clique no card para adicionar
                    adicionarCartaAChain(cartaRef);
                });
            }
        }, 100);
    }
    
    // Atualizar preview
    setTimeout(() => {
        if (typeof atualizarPreviewCardflux === 'function') {
            atualizarPreviewCardflux();
        }
    }, 100);
    
    console.log('✅ Editor preenchido com carta gerada');
}

// ============================================================
// HELPER: ADICIONAR CARTA À CHAIN
// ============================================================

/**
 * Adiciona uma carta ao formulário de chain (sugestão)
 * Integrável com sugestão de chain da IA
 */
function adicionarCartaAChain(cartaRef) {
    const containerChain = document.getElementById('cardfluxChainSelectedCards');
    
    if (!containerChain) {
        console.warn('⚠️ Container de chain não encontrado');
        return;
    }
    
    // Verificar se já está adicionada
    const jaAdicionada = Array.from(containerChain.querySelectorAll('[data-carta-id]'))
        .some(el => el.getAttribute('data-carta-id') === cartaRef.cartaId);
    
    if (jaAdicionada) {
        console.log(`⚠️ Carta ${cartaRef.cartaNome} já está na chain`);
        return;
    }
    
    // Criar elemento visual
    const cartaElement = document.createElement('div');
    cartaElement.setAttribute('data-carta-id', cartaRef.cartaId);
    cartaElement.style.cssText = `
        background: linear-gradient(135deg, rgba(126, 211, 33, 0.2), rgba(126, 211, 33, 0.05));
        border: 2px solid rgba(126, 211, 33, 0.4);
        border-radius: 8px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
        color: rgba(236, 240, 241, 0.9);
        font-size: 0.9rem;
        transition: all 0.2s;
    `;
    
    cartaElement.innerHTML = `
        <div style="flex: 1;">
            <strong style="color: #7ED321; display: block; margin-bottom: 3px;">🔗 ${cartaRef.cartaNome}</strong>
            <small style="color: rgba(212, 175, 55, 0.8);">
                ${cartaRef.cartaTipo || 'Tipo desconhecido'} • 
                ${cartaRef.cartaRaridade || 'Comum'} • 
                Int: ${cartaRef.intensidadeMinima || '?'}/10
            </small>
        </div>
        <button type="button" onclick="removerCartaChain(this)" style="
            background: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
            border: 1px solid rgba(231, 76, 60, 0.4);
            border-radius: 4px;
            padding: 6px 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.8rem;
            transition: all 0.2s;
        " onmouseover="this.style.background='rgba(231, 76, 60, 0.4)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(231, 76, 60, 0.2)'; this.style.color='#e74c3c';">
            ❌ Remover
        </button>
    `;
    
    containerChain.appendChild(cartaElement);
    
    // Armazenar referência nos dados do formulário
    const form = document.getElementById('formCardfluxEditor');
    if (form) {
        let cartasChain = form.dataset.cartasChain ? JSON.parse(form.dataset.cartasChain) : [];
        cartasChain.push(cartaRef);
        form.dataset.cartasChain = JSON.stringify(cartasChain);
    }
    
    console.log(`✅ Carta adicionada à chain: ${cartaRef.cartaNome}`);
}

/**
 * Remove uma carta da chain
 */
function removerCartaChain(botao) {
    const cartaElement = botao.closest('[data-carta-id]');
    if (!cartaElement) return;
    
    const cartaId = cartaElement.getAttribute('data-carta-id');
    
    // Remover do DOM
    cartaElement.remove();
    
    // Remover dos dados
    const form = document.getElementById('formCardfluxEditor');
    if (form && form.dataset.cartasChain) {
        let cartasChain = JSON.parse(form.dataset.cartasChain);
        cartasChain = cartasChain.filter(c => c.cartaId !== cartaId);
        form.dataset.cartasChain = JSON.stringify(cartasChain);
    }
    
    console.log(`❌ Carta removida da chain: ${cartaId}`);
}

// ============================================================
// EXPORTAR (NÃO DEVE SER USADO)
// ============================================================

// REMOVIDO: window.CardFluxIA
// Este arquivo é apenas para backup/referência histórica
