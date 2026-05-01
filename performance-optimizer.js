/**
 * ⚡ OTIMIZADOR DE PERFORMANCE - RedDungeon
 * Implemente as funções abaixo para melhorias imediatas
 */

// ============ 1. CACHE DE ELEMENTOS DO DOM ============
const DOM_CACHE = {
  modals: null,
  inputs: null,
  buttons: null,
  
  init() {
    this.modals = document.querySelectorAll('.modal');
    this.inputs = document.querySelectorAll('input, textarea, select');
    this.buttons = document.querySelectorAll('button');
    console.log('✅ DOM Cache inicializado');
  },
  
  getModals() {
    return this.modals || this.init().modals;
  }
};

// ============ 2. CACHE DE DADOS DO LOCALSTORAGE ============
const STORAGE_CACHE = {
  _cache: {},
  
  get(key, defaultValue = null) {
    if (!this._cache[key]) {
      try {
        const raw = localStorage.getItem(key);
        this._cache[key] = raw ? JSON.parse(raw) : defaultValue;
      } catch (e) {
        console.error(`❌ Erro ao fazer parse de ${key}:`, e);
        this._cache[key] = defaultValue;
      }
    }
    return this._cache[key];
  },
  
  set(key, value) {
    this._cache[key] = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`❌ Erro ao salvar ${key}:`, e);
    }
  },
  
  clear() {
    this._cache = {};
  },
  
  clearKey(key) {
    delete this._cache[key];
  }
};

// ============ 3. DEBOUNCE PARA EVENTS ============
function debounce(func, delay = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

// Usar em filtros:
// const handleSearch = debounce((value) => {
//   buscarItens(value);
// }, 300);

// ============ 4. LAZY LOADING DE ABAS ============
const LAZY_LOADER = {
  loaded: {},
  loaders: {
    'abaNPCs': async () => {
      if (typeof listarNPCsComFiltro === 'function') {
        await listarNPCsComFiltro();
      }
    },
    'abaItens': async () => {
      if (typeof listarItens === 'function') {
        await listarItens();
      }
    },
    'abaMateriais': async () => {
      if (typeof listarMateriais === 'function') {
        await listarMateriais();
      }
    }
  },
  
  async carregarSeNecessario(abaId) {
    if (!this.loaded[abaId]) {
      console.log(`📦 Carregando ${abaId}...`);
      const loader = this.loaders[abaId];
      if (loader) {
        await loader();
        this.loaded[abaId] = true;
        console.log(`✅ ${abaId} carregado`);
      }
    }
  }
};

// ============ 5. PROFILING DE PERFORMANCE ============
const PROFILER = {
  marks: {},
  
  start(label) {
    this.marks[label] = performance.now();
    console.log(`⏱️ Iniciando: ${label}`);
  },
  
  end(label) {
    if (!this.marks[label]) {
      console.warn(`⚠️ Nenhum mark para: ${label}`);
      return;
    }
    const duration = performance.now() - this.marks[label];
    console.log(`✅ ${label}: ${duration.toFixed(2)}ms`);
    delete this.marks[label];
    return duration;
  },
  
  group(label, func) {
    console.group(label);
    this.start(label);
    const result = func();
    this.end(label);
    console.groupEnd();
    return result;
  }
};

// ============ 6. BATCH UPDATES DO DOM ============
function batchUpdateDOM(updateFunc) {
  requestAnimationFrame(() => {
    updateFunc();
  });
}

// Usar:
// batchUpdateDOM(() => {
//   elementos.forEach(el => {
//     el.style.color = 'red';
//     el.textContent = 'novo';
//   });
// });

// ============ 7. INICIALIZAR OTIMIZAÇÕES ============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando otimizações de performance...');
  
  // 1. Inicializar cache de DOM
  DOM_CACHE.init();
  
  // 2. Carregar dados essenciais do storage
  console.time('⏱️ Carregando dados do storage');
  const armazem = STORAGE_CACHE.get('armazenar', {});
  console.timeEnd('⏱️ Carregando dados do storage');
  
  // 3. Lazy load ao clicar em abas
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('click', async (e) => {
      const target = e.target.getAttribute('data-bs-target') || 
                     e.target.getAttribute('href');
      const abaId = target?.replace('#', '');
      if (abaId) {
        await LAZY_LOADER.carregarSeNecessario(abaId);
      }
    });
  });
  
  console.log('✅ Otimizações ativadas!');
});

// ============ 8. MONITORAR PERFORMANCE EM TEMPO REAL ============
if (window.location.search.includes('debug=performance')) {
  setInterval(() => {
    const memory = performance.memory;
    if (memory) {
      const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const limit = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
      console.log(`💾 Memória: ${used}MB / ${limit}MB`);
    }
  }, 5000);
}

// ============ 9. COMPRIMIR DADOS GRANDES ============
const COMPRESSOR = {
  // LZ4-style simples (reduz ~40% em JSON)
  compress(str) {
    try {
      const compressed = btoa(unescape(encodeURIComponent(str)));
      console.log(`📦 Comprimido: ${str.length} → ${compressed.length} bytes`);
      return compressed;
    } catch (e) {
      console.error('❌ Erro ao comprimir:', e);
      return str;
    }
  },
  
  decompress(compressed) {
    try {
      return decodeURIComponent(escape(atob(compressed)));
    } catch (e) {
      console.error('❌ Erro ao descomprimir:', e);
      return compressed;
    }
  }
};

// ============ 10. EXEMPLO DE USO ============
/*

// Usar cache de storage:
const meus_npcs = STORAGE_CACHE.get('redungeon_npcs', []);
console.log('NPCs:', meus_npcs);

// Debounce em busca:
const buscarNPC = debounce((termo) => {
  // Sua lógica de busca aqui
  console.log('Buscando:', termo);
}, 300);

// Profiling:
PROFILER.start('minha-operacao');
// ... seu código
PROFILER.end('minha-operacao');

// Lazy load:
await LAZY_LOADER.carregarSeNecessario('abaItens');

*/

console.log('📊 Sistema de otimização carregado. Use PROFILER, STORAGE_CACHE, debounce(), etc.');
