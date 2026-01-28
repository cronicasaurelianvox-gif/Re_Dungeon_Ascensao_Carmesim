import { saveData } from "../db/save";
import { loadData } from "../db/load";
import { resetData } from "../db/reset";
import { syncData } from "../db/sync";

export function bindDatabaseButtons() {
  document.getElementById("btn-salvar")?.addEventListener("click", () => {
    const data = collectAppData();
    saveData(data);
  });

  document.getElementById("btn-importar")?.addEventListener("click", () => {
    const data = loadData();
    console.log("📥 Dados carregados", data);
  });

  document.getElementById("btn-resetar")?.addEventListener("click", resetData);
  document.getElementById("btn-sincronizar")?.addEventListener("click", syncData);
}

function collectAppData() {
  // depois você liga com Raças, Classes, NPCs, etc
  return {
    version: 1,
    timestamp: Date.now(),
    placeholder: true
  };
}
