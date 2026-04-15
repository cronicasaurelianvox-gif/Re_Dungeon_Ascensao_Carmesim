import { resetData } from "../db/reset";
import { syncData } from "../db/sync";

export function bindDatabaseButtons() {
  document.getElementById("btn-salvar")?.addEventListener("click", () => {
    collectAndSaveAllData();
  });

  document.getElementById("btn-importar")?.addEventListener("click", () => {
    importAllData();
  });

  document.getElementById("btn-resetar")?.addEventListener("click", resetData);
  document.getElementById("btn-sincronizar")?.addEventListener("click", syncData);
}

/**
 * 💾 Coleta e salva dados de TODAS as abas
 * Integra-se com DataStore.exportToJSON() do index.html
 */
async function collectAndSaveAllData() {
  try {
    // Obter acesso ao DataStore global (definido em index.html)
    const DataStore = (window as any).DataStore;
    
    if (!DataStore) {
      console.error("❌ DataStore não disponível");
      alert("❌ Erro: Sistema de armazenamento não inicializado");
      return;
    }

    // Exportar todos os dados usando DataStore
    const result = await DataStore.exportToJSON();
    
    if (result.sucesso) {
      // Salvar no localStorage para compatibilidade
      localStorage.setItem("redungeon-db", JSON.stringify(result.data));
      
      console.log("✅ Todos os dados salvos com sucesso!");
      alert("✅ Dados salvos com sucesso!\n\n" + 
            `Entidades salvas:\n` +
            `📅 Mesa: ${result.data.Mesa?.length || 0}\n` +
            `🌍 Origens: ${result.data.origens?.length || 0}\n` +
            `🂡 CardFlux: ${result.data.cardflux?.length || 0}\n` +
            `🗺️ Regiões: ${result.data.regioes?.length || 0}\n` +
            `🏞️ Cenários: ${result.data.cenarios?.length || 0}\n` +
            `👥 Raças: ${result.data.racas?.length || 0}\n` +
            `🛡️ Classes: ${result.data.classes?.length || 0}\n` +
            `💫 Aptidões: ${result.data.aptidoes?.length || 0}\n` +
            `🧑 NPCs: ${result.data.npcs?.length || 0}\n` +
            `👹 Criaturas: ${result.data.criaturas?.length || 0}\n` +
            `⚙️ Materiais: ${result.data.materiais?.length || 0}\n` +
            `📖 Receitas: ${result.data.receitas?.length || 0}\n` +
            `🎒 Itens: ${result.data.itens?.length || 0}\n` +
            `⚡ Condições: ${result.data.condicoes?.length || 0}\n` +
            `📋 Regras: ${result.data.regras?.length || 0}`
      );
    } else {
      console.error("❌ Erro ao exportar dados:", result.error);
      alert("❌ Erro ao salvar: " + result.error);
    }
  } catch (error) {
    console.error("❌ Erro ao coletar dados:", error);
    alert("❌ Erro ao salvar dados: " + String(error));
  }
}

/**
 * 📥 Importa todos os dados de um arquivo JSON
 * Restaura todas as abas (Mesa, Raças, Classes, NPCs, etc)
 */
async function importAllData() {
  try {
    // Criar input file invisível
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      
      try {
        const jsonContent = await file.text();
        
        // Obter DataStore
        const DataStore = (window as any).DataStore;
        if (!DataStore) {
          alert("❌ DataStore não disponível");
          return;
        }
        
        // Importar dados
        const result = await DataStore.importFromJSON(jsonContent);
        
        if (result.sucesso) {
          console.log(`✅ ${result.imported} itens importados com sucesso!`);
          alert(`✅ Importação concluída!\n\nTotal de itens importados: ${result.imported}`);
          
          // Recarregar as listas das abas (dispara eventos para atualizar UI)
          window.location.reload();
        } else {
          console.error("❌ Erro na importação:", result.error);
          alert("❌ Erro ao importar: " + result.error);
        }
      } catch (fileError) {
        console.error("❌ Erro ao ler arquivo:", fileError);
        alert("❌ Erro ao ler arquivo JSON");
      }
    };
    
    input.click();
  } catch (error) {
    console.error("❌ Erro ao abrir diálogo de importação:", error);
    alert("❌ Erro ao importar dados");
  }
}
