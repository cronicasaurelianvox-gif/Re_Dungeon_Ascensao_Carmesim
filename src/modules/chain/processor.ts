/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║         SISTEMA CARDFLUX CHAIN - LÓGICA PRINCIPAL          ║
 * ║              Processamento e Exibição de Chain             ║
 * ╚════════════════════════════════════════════════════════════╝
 */

// Importar tipos
// NOTA: Em um ambiente TypeScript compilado, isto funcionaria
// Por enquanto, incluímos os tipos inline no index.html

/**
 * Processar chain durante sorteio
 * Decide se ativa a chain e quais cartas exibir
 */
function processarChainAoSortear(cartaPrincipal: any, todasAsCartas: any) {
    // Se a carta não tem chain, retornar sem fazer nada
    if (!cartaPrincipal.chain || !cartaPrincipal.chain.ativa) {
        return {
            sucesso: false,
            cartasExibir: [],
            mensagem: 'Carta não possui chain ativa',
            motivoAtivacao: null
        };
    }

    const chain = cartaPrincipal.chain;
    let deveMostrarChain = false;
    let motivoAtivacao = null;

    // Verificar tipo de ativação
    switch (chain.tipoAtivacao) {
        case 'automatic':
            deveMostrarChain = true;
            motivoAtivacao = 'automatic';
            break;

        case 'optional':
            // Será decidido pelo usuário mais tarde
            // Por enquanto, retornar um estado especial
            deveMostrarChain = true;
            motivoAtivacao = 'user_choice';
            break;

        case 'chance':
            // Gerar chance
            const chance = chain.chancePorcentagem || 50;
            deveMostrarChain = Math.random() * 100 <= chance;
            motivoAtivacao = deveMostrarChain ? 'chance_success' : null;
            break;

        default:
            deveMostrarChain = false;
    }

    if (!deveMostrarChain) {
        return {
            sucesso: false,
            cartasExibir: [],
            mensagem: `Chain não foi ativada (tipo: ${chain.tipoAtivacao})`,
            motivoAtivacao: null
        };
    }

    // Buscar as cartas referenciadas na chain
    const cartasExibir = chain.cartas
        .filter((ref: any) => {
            // Filtrar por disponibilidade
            const carta = todasAsCartas.find((c: any) => c.id === ref.cartaId);
            return carta && (carta.ativa !== false);
        })
        .map((ref: any) => ({
            ...ref,
            // Adicionar dados da carta real para exibição
            cartaDados: todasAsCartas.find((c: any) => c.id === ref.cartaId)
        }));

    if (cartasExibir.length === 0) {
        return {
            sucesso: false,
            cartasExibir: [],
            mensagem: 'Chain ativa mas nenhuma carta válida para exibir',
            motivoAtivacao: null
        };
    }

    return {
        sucesso: true,
        cartasExibir: cartasExibir,
        mensagem: `Chain ativada! ${cartasExibir.length} evento(s) encadeado(s)`,
        motivoAtivacao: motivoAtivacao
    };
}

/**
 * Validar se uma chain está bem formada
 */
function validarChain(chain: any) {
    if (!chain) return { valido: true, erros: [] };

    const erros = [];

    if (!chain.tipoAtivacao || !['automatic', 'optional', 'chance'].includes(chain.tipoAtivacao)) {
        erros.push('Tipo de ativação inválido');
    }

    if (chain.tipoAtivacao === 'chance') {
        if (chain.chancePorcentagem === undefined || chain.chancePorcentagem < 0 || chain.chancePorcentagem > 100) {
            erros.push('Chance percentual deve estar entre 0 e 100');
        }
    }

    if (!Array.isArray(chain.cartas)) {
        erros.push('Cartas vinculadas deve ser um array');
    } else if (chain.cartas.length > 0) {
        chain.cartas.forEach((ref: any, idx: any) => {
            if (!ref.cartaId) {
                erros.push(`Carta vinculada ${idx} não possui ID`);
            }
        });
    }

    return {
        valido: erros.length === 0,
        erros: erros
    };
}

/**
 * Remover carta das chains que a referenceiam
 * (Usar quando uma carta é deletada)
 */
function removerCartaDasChains(cartaIdParaRemover: any, todasAsCartas: any) {
    return todasAsCartas.map((carta: any) => {
        if (carta.chain && carta.chain.cartas) {
            carta.chain.cartas = carta.chain.cartas.filter((ref: any) => ref.cartaId !== cartaIdParaRemover);
            
            // Se ficou vazio, pode desativar a chain
            if (carta.chain.cartas.length === 0) {
                carta.chain.ativa = false;
            }
        }
        return carta;
    });
}

/**
 * Duplicar chain de uma carta para outra
 */
function duplicarChainEntre(cartaOrigem: any, cartaDestino: any) {
    if (cartaOrigem.chain) {
        cartaDestino.chain = JSON.parse(JSON.stringify(cartaOrigem.chain));
        cartaDestino.chain.ultimaModificacao = Date.now();
    }
    return cartaDestino;
}

/**
 * Obter estatísticas da chain
 */
function obterEstatisticasChain(carta: any) {
    if (!carta.chain) {
        return {
            temChain: false,
            chainAtiva: false,
            totalCartasVinculadas: 0,
            tipoAtivacao: null
        };
    }

    return {
        temChain: true,
        chainAtiva: carta.chain.ativa,
        totalCartasVinculadas: carta.chain.cartas ? carta.chain.cartas.length : 0,
        tipoAtivacao: carta.chain.tipoAtivacao,
        chancePorcentagem: carta.chain.chancePorcentagem || 0
    };
}

/**
 * Exibir HTML de uma chain (para visualização em edição)
 */
function renderizarChainInfo(carta: any) {
    if (!carta.chain || !carta.chain.ativa) {
        return '<p style="color: #999;">Nenhuma chain configurada</p>';
    }

    const stats = obterEstatisticasChain(carta);
    
    const tipoEmoji = {
        'automatic': '⚡',
        'optional': '❓',
        'chance': '🎲'
    };

    let html = `
        <div style="background: rgba(212, 175, 55, 0.1); padding: 12px; border-radius: 8px; border-left: 3px solid #d4af37;">
            <div style="color: #d4af37; font-weight: 600; margin-bottom: 8px;">
                🔗 Chain Ativa
            </div>
            <div style="color: #ecf0f1; font-size: 0.9rem;">
                <div style="margin-bottom: 6px;">
                    <span style="color: #d4af37; font-weight: 600;">Tipo:</span>
                    ${tipoEmoji[stats.tipoAtivacao as keyof typeof tipoEmoji]} ${stats.tipoAtivacao}
                </div>
                <div style="margin-bottom: 6px;">
                    <span style="color: #d4af37; font-weight: 600;">Cartas Vinculadas:</span>
                    ${stats.totalCartasVinculadas}
                </div>
    `;

    if (stats.tipoAtivacao === 'chance') {
        html += `
                <div>
                    <span style="color: #d4af37; font-weight: 600;">Chance:</span>
                    ${stats.chancePorcentagem}%
                </div>
        `;
    }

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Limpar dados órfãos de chain
 * (Cartas referenciadas que não existem mais)
 */
function limparDadosOrfaos(carta: any, todasAsCartas: any) {
    if (!carta.chain || !carta.chain.cartas) return carta;

    const idsExistentes = todasAsCartas.map((c: any) => c.id);
    
    carta.chain.cartas = carta.chain.cartas.filter((ref: any) => 
        idsExistentes.includes(ref.cartaId)
    );

    if (carta.chain.cartas.length === 0) {
        carta.chain.ativa = false;
    }

    return carta;
}
