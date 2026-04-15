/**
 * 🔄 Sincroniza dados entre abas/janelas
 * Suporta sincronização com servidores remotos no futuro
 */
export async function syncData() {
  try {
    console.log("🔄 Iniciando sincronização de dados...");

    // Obter acesso ao DataStore
    const DataStore = (window as any).DataStore;
    
    if (!DataStore) {
      console.error("❌ DataStore não disponível");
      alert("❌ Erro: Sistema de sincronização não inicializado");
      return;
    }

    // Exportar todos os dados atuais
    const exportResult = await DataStore.exportToJSON();
    
    if (!exportResult.sucesso) {
      console.error("❌ Erro ao exportar dados para sincronização:", exportResult.error);
      alert("❌ Erro ao preparar sincronização: " + exportResult.error);
      return;
    }

    // Preparar payload para sincronização
    const syncPayload = {
      timestamp: Date.now(),
      version: "1.0",
      data: exportResult.data
    };

    console.log("📊 Dados prontos para sincronização:", syncPayload);

    // 🔮 IMPLEMENTAÇÃO FUTURA: Sincronizar com servidor
    // Exemplo:
    // const response = await fetch('https://seu-servidor.com/api/sync', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(syncPayload)
    // });
    // const result = await response.json();

    // Por enquanto, apenas fazer sync local entre abas
    const stores = DataStore.getStores?.() || [
      'Mesa', 'origens', 'cardflux', 'regioes', 'cenarios', 'racas', 'classes', 'aptidoes', 'npcs', 'criaturas',
      'materiais', 'receitas', 'itens', 'condicoes', 'regras'
    ];

    let syncedCount = 0;
    for (const store of stores) {
      const storeData = exportResult.data[store];
      if (storeData && storeData.length > 0) {
        // Recarregar dados em cada store para sincronizar
        await DataStore.load(store);
        syncedCount++;
      }
    }

    console.log(`✅ Sincronização concluída! ${syncedCount} entidades sincronizadas`);
    alert(`✅ Sincronização concluída!\n\nEntidades sincronizadas: ${syncedCount}\n\n` +
          `Dados atualizados:\n` +
          `📅 Mesa: ${exportResult.data.Mesa?.length || 0}\n` +
          `🌍 Origens: ${exportResult.data.origens?.length || 0}\n` +
          `🂡 CardFlux: ${exportResult.data.cardflux?.length || 0}\n` +
          `🗺️ Regiões: ${exportResult.data.regioes?.length || 0}\n` +
          `🏞️ Cenários: ${exportResult.data.cenarios?.length || 0}\n` +
          `👥 Raças: ${exportResult.data.racas?.length || 0}\n` +
          `🛡️ Classes: ${exportResult.data.classes?.length || 0}\n` +
          `💫 Aptidões: ${exportResult.data.aptidoes?.length || 0}\n` +
          `🧑 NPCs: ${exportResult.data.npcs?.length || 0}\n` +
          `👹 Criaturas: ${exportResult.data.criaturas?.length || 0}\n` +
          `⚙️ Materiais: ${exportResult.data.materiais?.length || 0}\n` +
          `📖 Receitas: ${exportResult.data.receitas?.length || 0}\n` +
          `🎒 Itens: ${exportResult.data.itens?.length || 0}\n` +
          `⚡ Condições: ${exportResult.data.condicoes?.length || 0}\n` +
          `📋 Regras: ${exportResult.data.regras?.length || 0}`
    );

    // Disparar evento de sincronização completa para UI atualizar se necessário
    window.dispatchEvent(new CustomEvent('data-synced', { detail: syncPayload }));

  } catch (error) {
    console.error("❌ Erro na sincronização:", error);
    alert("❌ Erro ao sincronizar dados: " + String(error));
  }
}
