/**
 * 🖼️ REFERÊNCIA TÉCNICA - SISTEMA DE OTIMIZAÇÃO DE IMAGENS
 * 
 * ============================================================
 * ARQUITETURA
 * ============================================================
 * 
 * INPUT (Usuário)
 *   ↓
 * previewHabilidadeImagem() | previewImagemItem()
 *   ↓
 * ImageOptimizer.loadImage()
 *   ├─ Verifica Memory Cache
 *   ├─ Verifica IndexedDB
 *   ├─ Fetch da rede
 *   └─ Compressão + Armazenamento
 *   ↓
 * Canvas API (re-encode)
 *   ↓
 * OUTPUT (Elemento IMG)
 * 
 * ============================================================
 * CACHE STRATEGY (LRU - Least Recently Used)
 * ============================================================
 * 
 * Memory Cache (Map)
 *   └─ Acesso: O(1)
 *   └─ Limite: ~100 imagens
 *   └─ TTL: Session
 * 
 * IndexedDB
 *   └─ Acesso: O(1) assíncrono
 *   └─ Limite: 100MB
 *   └─ TTL: Persistente
 * 
 * Network
 *   └─ Fallback quando cache miss
 *   └─ Validação MIME + tamanho
 *   └─ Timeout implícito (navegador)
 * 
 * ============================================================
 * TIPOS DE IMAGEM SUPORTADOS
 * ============================================================
 * 
 * image/jpeg    → .jpg, .jpeg
 * image/png     → .png
 * image/gif     → .gif (incluindo animado ✨)
 * image/webp    → .webp (moderno)
 * 
 * Data URIs     → data:image/...;base64,...
 * Blob URIs     → blob:https://...
 * HTTP/HTTPS    → https://exemplo.com/img.jpg
 * 
 * ============================================================
 * COMPRESSÃO
 * ============================================================
 * 
 * Se tamanho > 100KB:
 *   1. Render em Canvas
 *   2. Re-encode em JPEG Q85
 *   3. Redimensionar 75%
 *   4. Resultado: ~60-80% menor
 * 
 * Se tamanho <= 100KB:
 *   → Usar original (evita degradação)
 * 
 * Máximo permitido:
 *   - Upload: 50MB (antes do processamento)
 *   - Após compressão: ~5MB (em prática)
 * 
 * ============================================================
 * FLUXO DE CARREGAMENTO
 * ============================================================
 * 
 * 1️⃣ USER ACTION
 *    └─ onChange no input URL ou file
 * 
 * 2️⃣ VALIDATION
 *    ├─ Validar URL (http/https/data/blob)
 *    ├─ Validar tipo MIME
 *    └─ Validar tamanho
 * 
 * 3️⃣ CACHE CHECK
 *    ├─ Memory: 30ms (muito rápido)
 *    ├─ IndexedDB: 50-100ms (rápido)
 *    └─ Network: 500ms-5s (lento)
 * 
 * 4️⃣ LOADING UI
 *    ├─ Mostrar: "⏳ Carregando..."
 *    └─ Animação shimmer (opcional)
 * 
 * 5️⃣ FETCH + PROCESS
 *    ├─ Buscar imagem
 *    ├─ Canvas re-encode se necessário
 *    └─ Armazenar em ambos caches
 * 
 * 6️⃣ DISPLAY
 *    ├─ Remover "Carregando..."
 *    ├─ Fade-in 0.3s
 *    └─ Lazy load attribute
 * 
 * 7️⃣ ERROR HANDLING
 *    ├─ Catch na rede: "❌ Falha ao carregar"
 *    ├─ Catch na compressão: usar original
 *    └─ Fallback visual: placeholder
 * 
 * ============================================================
 * PERFORMANCE EXPECTATIONS
 * ============================================================
 * 
 * First Load:
 *   - URL: ~500ms - 2s (depende da rede)
 *   - File: ~100ms - 500ms (I/O local)
 * 
 * Cached Load:
 *   - Memory: ~5ms (casi instantâneo)
 *   - IndexedDB: ~50ms (muito rápido)
 * 
 * Compression:
 *   - 1MB image: ~200ms (Canvas + JPEG encode)
 *   - 5MB image: ~1000ms (mas assíncrono)
 * 
 * ============================================================
 * API REFERENCE
 * ============================================================
 * 
 * class ImageOptimizer
 *   constructor(options: ImageLoaderOptions)
 *   
 *   async loadImage(
 *     url: string,
 *     options?: { container?, fallbackText? }
 *   ): Promise<string>
 *   
 *   async clearCache(): Promise<void>
 *   
 *   getStats(): {
 *     memoryCacheSize: number,
 *     cachedImages: number,
 *     loadingQueue: number
 *   }
 * 
 * Global Functions:
 *   
 *   logImageCacheStats(): void
 *   limparCacheImagens(): Promise<void>
 *   preCarregarImagem(url: string): Promise<void>
 *   
 *   previewHabilidadeImagem(urlOrEvent): void
 *   previewImagemItem(inputId?, previewId?): void
 *   previewItemFile(event, inputId?, previewId?): Promise<void>
 * 
 * ============================================================
 * BROWSER STORAGE LIMITS
 * ============================================================
 * 
 * IndexedDB (não há limite claro, mas):
 *   - Chrome: ~50% do disco livre
 *   - Firefox: ~50% do disco livre
 *   - Safari: ~600MB (configurável)
 *   - IE11: ~250MB
 * 
 * Nosso limite: 100MB (conservador)
 * 
 * ============================================================
 * EVENTOS & CALLBACKS
 * ============================================================
 * 
 * img.onload
 *   → Disparado quando imagem carrega
 *   → Remove "Carregando..." do DOM
 *   → Aplica fade-in animation
 * 
 * img.onerror
 *   → Disparado quando falha o carregamento
 *   → Mostra mensagem de erro
 *   → Console.warn com URL
 * 
 * reader.onload (FileReader)
 *   → Disparado quando arquivo é lido
 *   → Base64 pronto para uso
 *   → Atualiza preview instantaneamente
 * 
 * ============================================================
 * DEBUGGING TIPS
 * ============================================================
 * 
 * // Ver instância
 * window.imageOptimizer
 * 
 * // Ver cache em memória
 * imageOptimizer.memoryCache
 * 
 * // Ver fila de carregamento
 * imageOptimizer.loadingQueue
 * 
 * // Obter estatísticas
 * imageOptimizer.getStats()
 * 
 * // Limpar tudo
 * imageOptimizer.clearCache()
 * 
 * // Logs no console
 * logImageCacheStats()
 * 
 * ============================================================
 * EDGE CASES HANDLED
 * ============================================================
 * 
 * ✅ URL inválida
 *    → Mostra erro sem quebrar layout
 * 
 * ✅ CORS bloqueado
 *    → Canvas.drawImage falha gracefully
 *    → Usa data URI original
 * 
 * ✅ Arquivo corrompido
 *    → FileReader.onerror dispara
 *    → Fallback para placeholder
 * 
 * ✅ Memory full
 *    → Auto-limpa 10% mais antigas
 *    → Continua funcionando
 * 
 * ✅ Browser sem IndexedDB
 *    → Usa apenas memory cache
 *    → Sem persistência entre sessões
 * 
 * ✅ Imagem muito grande
 *    → Comprime automaticamente
 *    → Se falhar, usa original
 * 
 * ============================================================
 * MIGRATION GUIDE (se necessário)
 * ============================================================
 * 
 * Código antigo:
 *   preview.innerHTML = `<img src="${url}">`
 * 
 * Compatível! Sem mudanças necessárias.
 * 
 * O otimizador trabalha transparentemente:
 *   - Cache automático
 *   - Compressão automática
 *   - Lazy loading automático
 * 
 * ============================================================
 * ROADMAP (Versão 2.0)
 * ============================================================
 * 
 * [ ] Service Worker para offline
 * [ ] WebP com fallback automático
 * [ ] AVIF format (próxima geração)
 * [ ] Progressive JPEG (blur-up)
 * [ ] Responsive srcset
 * [ ] Intersection Observer API
 * [ ] Analytics (falhas por URL)
 * [ ] CDN integration
 * [ ] Metrics export
 * 
 * ============================================================
 */
