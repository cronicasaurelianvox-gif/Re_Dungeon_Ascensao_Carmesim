# 🐛 GUIA DE DEBUG - CHAIN NÃO ESTÁ SALVANDO

## ✅ Correções Aplicadas

1. **Função `limparFormularioChain` - Completa agora**
   - Reseta tipo de ativação (para 'automatic')
   - Reseta slider de chance (para 50%)
   - Reseta botões de tipo (marca automático)

2. **Função `obterDadosChainFormulario` - Com Debug**
   - Log de cada passo do processo
   - Mostra o que está acontecendo

3. **Função `salvarCartaCardfluxEditor` - Com Debug**
   - Log do chainData recebido
   - Log da carta completa sendo salva

---

## 🔍 COMO DEBUGAR

### **Passo 1: Abrir Console (F12)**

1. Pressione `F12` no navegador
2. Vá para aba "Console"
3. Deixe em aberto

### **Passo 2: Criar/Editar uma Carta com Chain**

1. Vá para **"🂡 Cardflux"**
2. Clique em **"➕ CRIAR NOVA CARTA"** ou **"✏️ EDITAR"**
3. Scroll para **"🔗 ENCADEAMENTO DE EVENTOS"**
4. Marque ☑️ **"Ativar Chain"**
5. Escolha um tipo (ex: ⚡ Automática)
6. Busque e adicione uma ou mais cartas
7. Escreva uma descrição
8. Clique **"💾 SALVAR CARTA"**

### **Passo 3: Observar Console**

Você deve ver mensagens como:

```
🔍 chainAtiva.checked: true
🎯 Tipo de ativação: automatic
📚 Cartas selecionadas: [...]
✅ Chain objeto criado: {...}
📝 Salvando carta: {...}
```

---

## ❌ SE NÃO APARECER A SEÇÃO DE CHAIN

### **Verificar:**

1. Scroll completamente para baixo no modal
   - A seção "🔗 ENCADEAMENTO DE EVENTOS" deve estar lá

2. Se não está visível:
   - Abra console (F12)
   - Digite: `document.getElementById('cardfluxChainAtiva')`
   - Deve retornar um elemento `<input>`

3. Se retornar `null`:
   - A seção HTML não foi carregada corretamente
   - Faça refresh (F5) no navegador
   - Limpe cache (Ctrl+Shift+Del)

---

## ⚠️ SE APARECER ERRO NO CONSOLE

### **Erro: "Cannot read property 'checked'"**
- Elemento `cardfluxChainAtiva` não existe
- Faça refresh (F5)

### **Erro: "obterCartasChainSelecionadas is not defined"**
- Função não foi carregada
- Faça rebuild: `npm run build`
- Refresh no navegador

### **Mensagem: "⚠️ Chain ativa mas sem cartas selecionadas"**
- Você marcou "Ativar Chain" mas não selecionou nenhuma carta
- **Solução:** Busque no campo de search e clique em uma carta

### **Mensagem: "❌ Chain não está marcada"**
- Você não marcou o checkbox "Ativar Chain"
- **Solução:** Marque ☑️ "Ativar Chain"

---

## ✅ FLUXO ESPERADO

```
1. Marca ☑️ Ativar Chain
   └─ Console: 🔍 chainAtiva.checked: true

2. Escolhe tipo (ex: Automática)
   └─ Console: 🎯 Tipo de ativação: automatic

3. Busca e adiciona cartas
   └─ Console: 📚 Cartas selecionadas: [{cartaId, cartaNome, ...}]

4. Clica SALVAR
   └─ Console: ✅ Chain objeto criado: {...}
   └─ Console: 📝 Salvando carta: {...}
   └─ Alerta: ✅ Carta salva com sucesso!

5. Modal fecha
   └─ Chain foi salva! ✅
```

---

## 🧪 TESTE RÁPIDO

1. Abra **Cardflux** → **Nova Carta**
2. Preencha campos normais (nome, tipo, etc)
3. Marque ☑️ "Ativar Chain"
4. Busque 1-2 cartas e adicione
5. Clique **SALVAR**
6. Abra **Console (F12)**
7. Procure por mensagens de debug

---

## 📊 VERIFICAR SE SALVOU

Depois de salvar, verifique:

**No Console (F12):**
```javascript
// Ver todas as cartas
armazenar.cardflux

// Ver a última carta criada
armazenar.cardflux[armazenar.cardflux.length - 1]

// Ver se tem chain
armazenar.cardflux[armazenar.cardflux.length - 1].chain
```

Se aparecer um objeto com `{ativa, tipoAtivacao, cartas, ...}` → ✅ Salvou!

---

## 🚀 PRÓXIMO PASSO

Após confirmar que salvou no console:

1. Vá para **"🎲 MODO EXECUÇÃO - Cardflux / FADO"**
2. Clique **"SORTEAR CARTA"** até sortear a carta que criou
3. Procure pela seção **"🔗 EVENTOS ENCADEADOS"** abaixo da carta
4. Deve aparecer as cartas encadeadas em grid

---

## 🆘 AINDA NÃO FUNCIONA?

Se mesmo com essas correções não funcionar:

1. **Verificar console para erros específicos**
2. **Fazer refresh completo (Ctrl+Shift+R)**
3. **Limpar localStorage:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```
4. **Resetar tudo (última opção)**

---

**Versão:** Com debug ativado  
**Status:** Pronto para troubleshooting

