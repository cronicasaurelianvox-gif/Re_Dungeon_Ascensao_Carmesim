# 🎯 Atualização do Sistema de Classificação de NPCs

**Data**: 12 de abril de 2026  
**Status**: ✅ Completo e Refatorado  
**Compatibilidade**: Total - Dados antigos são automaticamente migrados

---

## 📋 Resumo das Alterações

O sistema de NPCs foi atualizado para suportar uma nova estrutura de classificação em **dois níveis**:
- **Nível 1 (Categoria)**: `NPC` ou `MOB`
- **Nível 2 (Tipo)**: Varia dependendo da categoria

### ⚠️ Mudança Importante
- Sistema legado (NPC/MOB/BOSS) foi **completamente removido**
- Campo `npcClasse` foi renomeado para `npcCategoria` para evitar conflito com o campo `classe` (que representa a profissão: Guerreiro, Mago, etc)

---

## 🔄 Nova Classificação

### Se `npcCategoria = NPC`:
- `Neutro`
- `Hostil`
- `Chefes`

### Se `npcCategoria = MOB`:
- `Comuns`
- `Elites`
- `Chefes`
- `Chefões`

---

## 📝 Estrutura de Dados

### Novos Campos Adicionados ao NPC:
```javascript
{
  // ... campos existentes ...
  npcCategoria: 'NPC' | 'MOB',     // Nível 1 - Categoria principal
  npcTipo: string,                  // Nível 2 - Tipo específico (dependente da categoria)
  tipo: string                       // Campo antigo - mantido para compatibilidade
}
```

---

## ✅ Implementações Realizadas

### 1. **Migração Inteligente** (`migrarNPCAntigo`)
- ✅ Interpreta dados antigos automaticamente
- ✅ Mapeia tipo antigo (NPC/MOB/BOSS) para nova estrutura:
  - `NPC` → `npcCategoria='NPC', npcTipo='Neutro'`
  - `MOB` → `npcCategoria='MOB', npcTipo='Comuns'`
  - `BOSS` → `npcCategoria='MOB', npcTipo='Chefões'`
- ✅ Sem necessidade de migração manual

### 2. **Interface de Seleção**
- ✅ Campos HTML para selecionar categoria e tipo
  - `npcCategoriaNPC`, `npcCategoriaMOB`: Botões de seleção de categoria
  - `npcTipoSelected`: Select dinâmico para tipo
- ✅ Opções de tipo mudam dinamicamente conforme a categoria selecionada

### 3. **Funções JavaScript**
- ✅ `selecionarCategoriaNPC(categoria)`: Seleciona categoria (NPC ou MOB)
- ✅ `atualizarOpcoesTipoNPC(categoria)`: Atualiza dropdown de tipos
- ✅ `salvarNPC()`: Salva novos campos (`npcCategoria`, `npcTipo`)
- ✅ `editarNPC()`: Carrega e exibe novos campos ao editar
- ✅ `verNPCCompleto()`: Carrega novos campos ao visualizar

### 4. **Renderização**
- ✅ `listarNPCsComFiltro()`: Separa NPCs por `npcCategoria`
  - NPCs com `npcCategoria='NPC'` → Aba "NPC"
  - NPCs com `npcCategoria='MOB'` → Aba "MOB"
- ✅ Cards mostram tipo específico do NPC
- ✅ Abas organizadas por categoria (NPC/MOB) ao invés de tipo antigo (NPC/MOB/BOSS)

### 5. **Filtros e Busca**
- ✅ `filtrarNPCsInteligente()`: Busca inclui `npcCategoria` e `npcTipo`
- ✅ Autocomplete inclui novos campos
- ✅ Mudança automática de abas baseada em resultados

### 6. **Limpeza do Sistema Legado**
- ✅ Botões legados (NPC/MOB/BOSS) **removidos** da interface
- ✅ Função `selecionarTipoNPC()` **removida** (sistema legado)
- ✅ Todos os IDs renomeados para usar "categoria" ao invés de "classe"
- ✅ Consolidação: `npcTipoNivelDoisSelected` → `npcTipoSelected`

---

## 🔐 Compatibilidade Garantida

### ✅ Dados Antigos
- NPCs existentes mantêm o campo `tipo` antigo
- Novos campos são adicionados automaticamente ao carregar
- Nenhum dado é perdido

### ✅ Funcionalidades
- Importação/Exportação: Novos campos incluídos automaticamente
- Sincronização: Funciona com dados antigos e novos
- Visualização: Mostra tanto campos antigos quanto novos

### ✅ Fallback
- Todas as funções usam fallback: `npc.npcCategoria || npc.tipo || 'NPC'`
- Sistema continua funcionando se campos novos forem ausentes

---

## 🎮 Uso

### Ao Criar Novo NPC:
1. Selecione a **Classe** (NPC ou MOB)
2. O dropdown de **Tipo** será atualizado automaticamente
3. Selecione o **Tipo** apropriado
4. Salve normalmente

### Ao Editar NPC Existente:
- Classe e tipo serão carregados automaticamente
- Se NPC antigo: classe e tipo serão inferidos do campo `tipo`
- Pode ser atualizado para nova classificação

### Na Listagem:
- NPCs organizados por **Classe** (abas NPC/MOB)
- Cada card mostra o **Tipo** específico (ex: "Neutro", "Elites", etc.)
- Busca funciona com ambos os campos

---

## 🧪 Testes Realizados

✅ Criação de novo NPC com novos campos  
✅ Edição de NPC existente  
✅ Visualização de NPC  
✅ Migração automática de NPCs antigos  
✅ Filtro e busca  
✅ Salvar e carregar dados  
✅ Compatibilidade com dados antigos  

---

## 📊 Exemplo de Dados

### NPC Novo (Com novos campos):
```javascript
{
  id: "npc_1712973600000_abc123",
  nome: "Guardião da Floresta",
  tipo: "NPC",                    // Campo antigo (legado)
  npcCategoria: "NPC",            // ✨ Novo
  npcTipo: "Hostil",              // ✨ Novo
  raca: "Elfo",
  classe: "Mago",                 // Profissão (Guerreiro, Mago, etc)
  // ... outros campos ...
}
```

### NPC Antigo (Migrado automaticamente):
```javascript
{
  id: "npc_old_123",
  nome: "Comerciante",
  tipo: "NPC",                    // Campo antigo
  // Ao carregar, adiciona automaticamente:
  // npcCategoria: "NPC"
  // npcTipo: "Neutro"
  raca: "Humano",
  classe: "Ladino",               // Profissão
  // ... outros campos ...
}
```

---

## 🔄 Processo de Migração Automática

```
┌─────────────────────────┐
│  NPC Carregado          │
│  tipo: "NPC"            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  migrarNPCAntigo()      │
│  (chamado ao renderizar)│
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Verifica se tem        │
│  npcCategoria e npcTipo │
└────────┬────────────────┘
         │ Não tem?
         ▼
┌─────────────────────────┐
│  Mapeia tipo antigo:    │
│  NPC → NPC/Neutro       │
│  MOB → MOB/Comuns       │
│  BOSS → MOB/Chefões     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  NPC Atualizado ✅      │
│  Com novos campos       │
└─────────────────────────┘
```

---

## 🛠️ Notas Técnicas

- **Backward Compatibility**: 100% - Dados antigos funcionam normalmente
- **Forward Compatibility**: Código novo ignora campos faltantes usando fallback
- **Sem quebra de funcionalidades**: Todas as features existentes continuam funcionando
- **Sem migração manual**: Tudo é automático ao carregar dados

---

## 📝 Checklist de Integração

- [x] Estrutura de dados atualizada
- [x] Interface HTML implementada
- [x] Funções JavaScript criadas
- [x] Salvamento integrado
- [x] Carregamento integrado
- [x] Renderização atualizada
- [x] Filtros atualizados
- [x] Migração automática implementada
- [x] Compatibilidade verificada
- [x] Documentação completa

---

## 🚀 Próximos Passos (Opcional)

1. Adicionar sub-abas dentro de "NPC" e "MOB" para separar por tipo específico
2. Implementar cores diferentes para cada tipo
3. Adicionar ícones específicos para cada tipo
4. Expandir sistema para outras entidades (Classes, Raças, etc.)

---

**Sistema pronto para produção!** ✅
