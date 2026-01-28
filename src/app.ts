import { getVersion, getName, getTauriVersion } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";

/* ======================================================
   CONTROLE DE JANELA
====================================================== */

const appWindow = getCurrentWindow();

// Maximizar / Restaurar
(window as any).maximizarJanela = async () => {
  const isMax = await appWindow.isMaximized();
  if (isMax) {
    await appWindow.unmaximize();
  } else {
    await appWindow.maximize();
  }
};

// Minimizar
(window as any).minimizarJanela = async () => {
  await appWindow.minimize();
};

// Fechar
(window as any).fecharJanela = async () => {
  await appWindow.close();
};

/* ======================================================
   ZOOM COM CTRL + SCROLL (ESTÁVEL)
====================================================== */

let zoomLevel = 1;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.1;

function applyZoom() {
  document.documentElement.style.transform = `scale(${zoomLevel})`;
  document.documentElement.style.transformOrigin = "0 0";
}

window.addEventListener(
  "wheel",
  (event) => {
    if (!event.ctrlKey) return;

    event.preventDefault();

    if (event.deltaY < 0) {
      zoomLevel += ZOOM_STEP;
    } else {
      zoomLevel -= ZOOM_STEP;
    }

    zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoomLevel));
    applyZoom();
  },
  { passive: false }
);

// Reset manual de zoom
(window as any).resetZoom = () => {
  zoomLevel = 1;
  applyZoom();
};

/* ======================================================
   INFORMAÇÕES DO APP (GLOBAL)
====================================================== */

(window as any).obterInfoApp = async () => {
  try {
    return {
      nome: await getName(),
      versao: await getVersion(),
      tauri: await getTauriVersion(),
      plataforma: navigator.platform || "desconhecida",
      arquitetura: "desconhecida"
    };
  } catch (error) {
    console.error("❌ Erro ao obter informações do app:", error);
    return {
      nome: "ReDungeon",
      versao: "desconhecida",
      tauri: "desconhecida",
      plataforma: navigator.platform || "desconhecida",
      arquitetura: "desconhecida"
    };
  }
};

// Log inicial (debug)
(async () => {
  const info = await (window as any).obterInfoApp();
  console.log(
    `[APP] ${info.nome} v${info.versao} | Tauri ${info.tauri} | ${info.plataforma}`
  );
})();

console.log("📚 app.ts carregado com sucesso");
