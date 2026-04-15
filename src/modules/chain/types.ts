/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║           SISTEMA CARDFLUX CHAIN - TIPOS E INTERFACES      ║
 * ║     Encadeamento de Cartas (Eventos Secundários Vinculados) ║
 * ║                   Implementação Modular                     ║
 * ╚════════════════════════════════════════════════════════════╝
 */

/**
 * Tipo de ativação da chain
 * - automático: sempre ativa quando a carta principal é sorteada
 * - opcional: pergunta ao usuário se quer ativar
 * - chance: ativa com base em uma porcentagem
 */
export type ChainActivationType = 'automatic' | 'optional' | 'chance';

/**
 * Estrutura de uma carta vinculada dentro de uma chain
 */
export interface ChainCardReference {
  /** ID único da carta vinculada */
  cartaId: string;
  
  /** Nome da carta (snapshot para referência visual) */
  cartaNome: string;
  
  /** Tipo da carta vinculada */
  cartaTipo: string;
  
  /** Raridade da carta vinculada */
  cartaRaridade: string;
  
  /** Intensidade mínima para esta carta ser considerada */
  intensidadeMinima?: number;
}

/**
 * Estrutura completa do sistema de Chain
 * Anexado a cada Carta do Cardflux
 */
export interface CardfluxChain {
  /** Se está ativada ou não */
  ativa: boolean;
  
  /** Tipo de ativação (automático, opcional, por chance) */
  tipoAtivacao: ChainActivationType;
  
  /** Porcentagem de chance (0-100) - usado apenas quando tipoAtivacao === 'chance' */
  chancePorcentagem?: number;
  
  /** Lista de cartas vinculadas */
  cartas: ChainCardReference[];
  
  /** Descrição narrativa do encadeamento */
  descricao?: string;
  
  /** Timestamp da última modificação */
  ultimaModificacao?: number;
}

/**
 * Estado de uma chain durante execução
 */
export interface ChainExecutionState {
  /** ID da carta principal que disparou a chain */
  cartaPrincipalId: string;
  
  /** Cartas encadeadas selecionadas para exibição */
  cartasEsconderastadas: ChainCardReference[];
  
  /** Se a chain foi ativada */
  ativada: boolean;
  
  /** Motivo da ativação */
  motivoAtivacao?: 'automatic' | 'user_choice' | 'chance_success';
}

/**
 * Extensão da interface Card com suporte a Chain
 * (Esta interface não modifica a Card original, apenas adiciona propriedade opcional)
 */
export interface CardWithChain {
  // Todas as propriedades originais da Card
  id?: string;
  nome?: string;
  tipo?: string;
  deck?: string;
  raridade?: string;
  intensidade?: number;
  pesoSorteio?: number;
  cooldown?: number;
  tags?: string[];
  descricao?: string;
  contexto?: string;
  testes?: string;
  sucessos?: string;
  falhas?: string;
  recompensas?: string;
  consequencias?: string;
  ganchos?: string;
  imagemUrl?: string;
  ativa?: boolean;
  
  // Nova propriedade: Chain (OPCIONAL - compatibilidade regressiva)
  chain?: CardfluxChain;
}

/**
 * Resultado do processamento de uma chain durante sorteio
 */
export interface ChainProcessResult {
  /** Se a chain foi ativada com sucesso */
  sucesso: boolean;
  
  /** Cartas encadeadas a exibir */
  cartasExibir: ChainCardReference[];
  
  /** Mensagem descritiva para log */
  mensagem: string;
  
  /** Motivo da ativação */
  motivoAtivacao?: ChainExecutionState['motivoAtivacao'];
}
