# 🧪 GUIA DE TESTE - VERIFICAR SE PROBLEMA FOI RESOLVIDO

## ✅ TESTE 1: Desligar PC

### Passo a passo:
1. Abra a aplicação
2. Navegue até aba **NPCs**
3. Crie um novo NPC (ou edite um existente)
4. Preencha alguns campos (nome, tipo, etc)
5. Clique **"Salvar" → "Tudo"** (para salvar explicitamente)
6. **Aguarde 2-3 segundos** para garantir salvamento
7. **Desligar PC completamente**
8. **Religar PC**
9. Abra a aplicação novamente
10. Navegue até **NPCs**

### Resultado esperado:
✅ **O NPC que você criou/editou AINDA ESTÁ LÁ**

### Se falhar:
❌ Abra Console (F12) → cole aqui os erros 🔴

---

## ✅ TESTE 2: Reabrir Navegador

### Passo a passo:
1. Abra a aplicação
2. Edite algo (NPC, Item, etc)
3. Salve explicitamente (**Salvar → Tudo**)
4. **Feche O NAVEGADOR COMPLETAMENTE** (não só a aba)
5. **Reabra O NAVEGADOR**
6. Abra a aplicação novamente

### Resultado esperado:
✅ **Os dados que você editou APARECEM NOVAMENTE**

### Se falhar:
❌ Abra Console (F12) → procure por mensagens 🔴 no início

---

## ✅ TESTE 3: Mudar Entre Abas

### Passo a passo:
1. Abra a aplicação
2. Navegue até aba **NPCs**
3. Crie um novo NPC com dados visíveis (ex: nome "Teste123")
4. **Mude para aba CRIATURAS**
5. Faça algo lá
6. **Volte para aba NPCs**

### Resultado esperado:
✅ **O NPC "Teste123" AINDA ESTÁ VISÍVEL**

### Se falhar:
❌ Abra Console (F12) → procure por `[StorageSync]` para ver logs

---

## ✅ TESTE 4: Painel de Diagnóstico

### Passo a passo:
1. Abra a aplicação
2. Procure pelo botão **"🔍 Diagnóstico Storage"**
3. Clique nele
4. Verifique a lista de "DADOS ARMAZENADOS"

### Resultado esperado:
✅ **Você vê uma tabela com seus dados**
✅ **Todos com status "✅ OK"**
✅ **Tamanho total < 5 MB**

### Se algo estiver errado:
- ❌ Status "❌ CORROMPIDO": Clique "🧹 Limpar Corrompidos"
- ❌ Tamanho > 5MB: Exporte dados e limpe cache

---

## ✅ TESTE 5: Sincronização Manual

### Passo a passo:
1. Abra painel **"🔍 Diagnóstico Storage"**
2. Clique **"🔄 Sincronizar Agora"**
3. Aguarde confirmação
4. Se algo tiver sumido, deve reaparecer

### Resultado esperado:
✅ **Mensagem "Sincronização concluída! X dados validados"**
✅ **Se dados haviam sumido, reaparecem**

---

## 📊 TESTE COMPLETO (Rodar todos os testes)

Se TODOS os testes acima passarem ✅:

**PROBLEMA RESOLVIDO! 🎉**

Se algum falhar ❌:

1. Abra Console (F12)
2. Procure por mensagens com 🔴
3. Tire screenshot
4. Mande para debug

---

## 🔍 CHECKLIST PASSO A PASSO

- [ ] Teste 1: Desligar PC
  - [ ] Dados permanecem após religar
  
- [ ] Teste 2: Reabrir navegador
  - [ ] Dados permanecem após fechar/reabrir
  
- [ ] Teste 3: Mudar de aba
  - [ ] Dados não desaparecem ao trocar de aba
  
- [ ] Teste 4: Painel diagnóstico
  - [ ] Botão "🔍 Diagnóstico" está presente
  - [ ] Mostra lista de dados
  - [ ] Todos com status ✅ OK
  
- [ ] Teste 5: Sincronizar
  - [ ] "🔄 Sincronizar Agora" funciona
  - [ ] Recupera dados se desaparecidos

---

## 🎯 SE TODOS OS TESTES PASSAREM

**Parabéns! O problema foi resolvido!**

Agora recomendamos:
1. ✅ Exportar dados 1x por semana (Salvar → Exportar)
2. ✅ Manter Monitor aberto ocasionalmente
3. ✅ Se armazenamento atingir > 4MB, limpar cache

---

## ❌ SE ALGUM TESTE FALHAR

### Passo 1: Coletar informações
1. Abra Console (F12)
2. Copie TODAS as mensagens de erro 🔴
3. Screenshot

### Passo 2: Tentar auto-recover
1. Abra "🔍 Diagnóstico Storage"
2. Clique "🔄 Sincronizar Agora"
3. Teste novamente

### Passo 3: Última tentativa
1. Abra "🔍 Diagnóstico Storage"
2. Clique "🧹 Limpar Corrompidos"
3. Teste novamente

### Passo 4: Se ainda falhar
- Envie screenshot do Console + erro
- Mencione qual teste falhou

---

## 📞 INFORMAÇÕES ÚTEIS

**Dados no painel de diagnóstico:**
- `redungeon_npcs` = NPCs
- `redungeon_itens` = Itens
- `redungeon_criatura` = Criaturas
- etc

**Tamanho esperado:**
- < 1 MB: Perfeito
- 1-4 MB: OK
- 4-5 MB: Considere exportar
- > 5 MB: **URGENTE - Exporte dados!**

---

**Versão do teste**: 1.0
**Data**: 30 de maio de 2026
**Status**: Pronto para executar

