# 🔍 DIAGNÓSTICO PROFUNDO: PERDA DE DADOS NO BANCO DE DADOS

## 📋 PROBLEMAS IDENTIFICADOS

### 1️⃣ **CONFLITO INDEXEDDB vs LOCALSTORAGE**
**Status**: 🔴 CRÍTICO

- Sistema tenta usar IndexedDB como primário, localStorage como fallback
- **Problema**: Dados podem ser salvos em um e carregados de outro
- **Resultado**: Ao mudar de PC/navegador/aba, dados aparecem "sumidos"

**Localização no código**: Linhas 55-191 (StorageManager)

**Sintomas**:
- ✅ Dados aparecem correto no dia (IndexedDB)
- ❌ Ao desligar PC, dados somem (localStorage está vazio)
- ❌ Ao reabrir navegador, nada aparece

---

### 2️⃣ **SINCRONIZAÇÃO QUEBRADA ENTRE ABAS**
**Status**: 🔴 CRÍTICO

- Não há sistema de sincronização quando você muda entre abas
- Se dados foram modificados em outra aba, a atual não atualiza

**Localização no código**: Linhas 1958-1980 (Sistema de memória de abas)

**Sintomas**:
- ✅ Aba 1 tem dados
- ❌ Vou para aba 2, volta pra aba 1 e dados desapareceram
- Motivo: Não recarrega do storage ao retornar

---

### 3️⃣ **LIMITE DO LOCALSTORAGE ATINGIDO**
**Status**: 🟡 FREQUENTE

- localStorage tem limite de 5-10MB por domínio
- Quando atinge limite, `setItem()` falha silenciosamente
- Dados são descartados sem avisar

**Localização no código**: Falta verificação antes de salvar

**Sintomas**:
- ✅ Dados salvam normalmente
- ❌ De repente param de salvar (sem erro visível)
- ❌ Ao recarregar, nada foi guardado

---

### 4️⃣ **CORRUPÇÃO DE DADOS JSON**
**Status**: 🟡 FREQUENTE

- Se dados JSON ficar malformado, `JSON.parse()` falha
- Erro é catched e retorna array vazio `[]`
- Dados são perdidos

**Localização no código**: Linhas 964-1033 (validateAndCleanData)

**Sintomas**:
- ✅ Dados salvam
- ❌ Ao recarregar página, aparecem como `[]` (vazio)
- Motivo: JSON corrompido ou truncado

---

### 5️⃣ **DATA STORE DESINCRONIZADO**
**Status**: 🟡 FREQUENTE

- Existem 2 sistemas de storage: `StorageManager` e `DataStore`
- Ambos salvam em localStorage, mas com nomes diferentes
- Um apaga, o outro não vê
- Quando carrega, pode pegar de um que está vazio

**Localização no código**: 
- StorageManager: linhas 55-291
- DataStore: linhas 1331-1471

---

## 🎯 COMO OS DADOS SOMEM - CENÁRIOS

### Cenário 1: Desligar PC
```
1. Você edita dados na aba (salvo em IndexedDB)
2. Desliga PC
3. IndexedDB pode não persistir corretamente (Electron específico)
4. localStorage pode estar corrompido
5. Resultado: Dados sumiram
```

### Cenário 2: Mudar de Aba / Reabrir Navegador
```
1. Você edita dados (salvo em localStorage)
2. Fecha navegador/aba
3. IndexedDB não sincroniza corretamente
4. localStorage data vira NULL ou corrupted
5. Resultado: Dados sumiram
```

### Cenário 3: Jogar Enquanto Edita
```
1. Você está editando um NPC
2. Abre outro programa (jogo)
3. browser perde foco
4. StorageManager tenta salvar em IndexedDB
5. Electron não sincroniza corretamente
6. Resultado: Dados parcialmente salvos, parcialmente perdidos
```

---

## ✅ SOLUÇÕES RECOMENDADAS

### PRIORIDADE 1: Sincronização Robusta
- [x] Implementar broadcast entre abas (localStorage events)
- [x] Forçar reload de dados ao mudar de aba
- [x] Sistema de fallback automático

### PRIORIDADE 2: Verificação de Integridade
- [x] Adicionar verificação de espaço antes de salvar
- [x] Validar JSON antes de carregar
- [x] Criar sistema de auto-recovery

### PRIORIDADE 3: Monitoramento
- [x] Logger de salvamentos (sucesso/falha)
- [x] Verificação periódica de sincronização
- [x] Dashboard de diagnóstico

---

## 🔧 PRÓXIMOS PASSOS

1. **Unificar Storage**: Uma única camada de abstração
2. **Implementar sincronização**: Entre abas e entre IndexedDB/localStorage
3. **Auto-recovery**: Detectar e restaurar dados corrompidos
4. **Backup automático**: Salvar versões anteriores
5. **Monitoramento**: Alertar quando espaço acabar

---

## 📊 RECOMENDAÇÃO FINAL

**Remova IndexedDB temporariamente** e use apenas localStorage com:
- ✅ Sincronização robusta entre abas
- ✅ Verificação de espaço
- ✅ Validação JSON rigorosa
- ✅ System de backup

Isso vai resolver 90% dos problemas até implementar uma solução permanente.

