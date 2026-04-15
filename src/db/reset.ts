/**
 * 🧹 Reseta TODOS os dados do banco de dados
 * Limpa localStorage de todas as entidades e IndexedDB
 */
export async function resetData() {
  // Solicitar confirmação do usuário
  if (!confirm("⚠️ ATENÇÃO!\n\nDeseja realmente DELETAR TODOS OS DADOS?\n\nEsta ação não pode ser desfeita!")) {
    console.log("✅ Reset cancelado pelo usuário");
    return;
  }

  try {
    // Lista de todas as entidades que precisam ser resetadas
    const entities = [
      'Mesa',
      'origens',
      'cardflux',
      'regioes',
      'cenarios',
      'racas',
      'classes',
      'aptidoes',
      'npcs',
      'criaturas',
      'materiais',
      'receitas',
      'itens',
      'condicoes',
      'regras'
    ];

    // Limpar localStorage de todas as entidades
    entities.forEach(entity => {
      const key = `redungeon_${entity}`;
      localStorage.removeItem(key);
      console.log(`🗑️ Removido: ${key}`);
    });

    // Limpar chave de backup geral
    localStorage.removeItem("redungeon-db");

    // Limpar outras chaves auxiliares
    localStorage.removeItem('abaAtiva');
    localStorage.removeItem('scrollPosition');
    
    console.log("✅ Todos os dados foram deletados do localStorage");

    // Tentar acessar IndexedDB para resetá-lo também
    const DataStore = (window as any).DataStore;
    if (DataStore && DataStore.isReady?.()) {
      console.log("🧹 Iniciando limpeza de IndexedDB...");
      // Reabrir a conexão para limpar os stores
      const dbName = 'ReDungeonDB';
      const dbRequest = indexedDB.open(dbName);
      
      dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        entities.forEach(entityName => {
          try {
            if (db.objectStoreNames.contains(entityName)) {
              const tx = db.transaction([entityName], 'readwrite');
              const store = tx.objectStore(entityName);
              store.clear();
              console.log(`🗑️ IndexedDB limpo: ${entityName}`);
            }
          } catch (e) {
            console.warn(`⚠️ Erro ao limpar ${entityName} no IndexedDB:`, e);
          }
        });
      };

      dbRequest.onerror = () => {
        console.warn("⚠️ Erro ao acessar IndexedDB para limpeza");
      };
    }

    // Exibir mensagem de sucesso e recarregar
    alert("✅ RESET CONCLUÍDO!\n\nTodos os dados foram deletados.\n\nA página será recarregada agora...");
    
    // Chamar função de atualizar UI global (se existir)
    const atualizarUIGlobal = (window as any).atualizarUIGlobal;
    if (atualizarUIGlobal && typeof atualizarUIGlobal === 'function') {
      try {
        await atualizarUIGlobal();
        console.log("✅ UI global atualizada após reset");
      } catch (uiError) {
        console.warn("⚠️ Erro ao atualizar UI após reset:", uiError);
      }
    }
    
    // Recarregar a página após 1 segundo para garantir que tudo foi limpo
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error("❌ Erro ao fazer reset:", error);
    alert("❌ Erro ao fazer reset dos dados: " + String(error));
  }
}
