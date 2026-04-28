/**
 * 🖼️ IMAGE OPTIMIZER MODULE
 * Sistema inteligente de otimização de carregamento de imagens
 * - Cache em memória e IndexedDB
 * - Lazy loading automático
 * - Compressão de imagens grandes
 * - Fallback para imagens quebradas
 * - Deduplicas URLs iguais
 */

interface CachedImage {
    url: string;
    data: string; // base64
    timestamp: number;
    size: number;
}

interface ImageLoaderOptions {
    maxCacheSize?: number; // MB
    compressionQuality?: number; // 0-1
    enableLazyLoad?: boolean;
    fallbackColor?: string;
}

class ImageOptimizer {
    private memoryCache: Map<string, CachedImage> = new Map();
    private loadingQueue: Set<string> = new Set();
    private options: ImageLoaderOptions;
    private dbName = 'redungeon_images';
    private storeName = 'images';
    private db: IDBDatabase | null = null;

    constructor(options: ImageLoaderOptions = {}) {
        this.options = {
            maxCacheSize: 100, // 100MB padrão
            compressionQuality: 0.85,
            enableLazyLoad: true,
            fallbackColor: '#2a2a3e',
            ...options
        };
        
        this.initDB();
    }

    /**
     * Inicializa banco de dados IndexedDB
     */
    private async initDB(): Promise<void> {
        return new Promise((resolve) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => {
                console.warn('⚠️ Erro ao abrir IndexedDB para cache de imagens');
                resolve();
            };
            
            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'url' });
                }
            };
            
            request.onsuccess = (event: any) => {
                this.db = event.target.result;
                console.log('✅ Cache de imagens iniciado (IndexedDB)');
                resolve();
            };
        });
    }

    /**
     * Carrega imagem com otimizações
     */
    async loadImage(
        url: string,
        options: { container?: HTMLElement; fallbackText?: string } = {}
    ): Promise<string> {
        if (!url || typeof url !== 'string') return '';
        
        // Se já está em memória, retorna imediatamente
        if (this.memoryCache.has(url)) {
            const cached = this.memoryCache.get(url)!;
            return cached.data;
        }

        // Se está sendo carregado, aguarda
        if (this.loadingQueue.has(url)) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.memoryCache.has(url)) {
                        clearInterval(checkInterval);
                        resolve(this.memoryCache.get(url)!.data);
                    }
                }, 50);
            });
        }

        this.loadingQueue.add(url);

        try {
            // Tenta carregar do IndexedDB
            const cached = await this.loadFromDB(url);
            if (cached) {
                this.memoryCache.set(url, cached);
                this.loadingQueue.delete(url);
                return cached.data;
            }

            // Carrega da rede
            const imageData = await this.fetchImage(url);
            
            // Comprime e armazena
            const optimized = await this.compressImage(imageData);
            const cacheEntry: CachedImage = {
                url,
                data: optimized,
                timestamp: Date.now(),
                size: optimized.length / 1024 / 1024 // MB
            };

            this.memoryCache.set(url, cacheEntry);
            await this.saveToDB(cacheEntry);
            
            this.loadingQueue.delete(url);
            return optimized;
        } catch (error) {
            console.warn(`⚠️ Erro ao carregar imagem ${url}:`, error);
            this.loadingQueue.delete(url);
            
            if (options.container && options.fallbackText) {
                options.container.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        background: ${this.options.fallbackColor};
                        border-radius: 8px;
                        font-size: 0.85rem;
                        color: #999;
                        text-align: center;
                        padding: 10px;
                    ">
                        ${options.fallbackText || '❌ Imagem indisponível'}
                    </div>
                `;
            }
            return '';
        }
    }

    /**
     * Busca imagem da rede
     */
    private async fetchImage(url: string): Promise<string> {
        // Se é data URI ou blob, retorna direto
        if (url.startsWith('data:') || url.startsWith('blob:')) {
            return url;
        }

        // Validar URL
        if (!url.match(/^https?:\/\//i)) {
            throw new Error('URL inválida');
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) reject(new Error('Canvas context not available'));
                else {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/jpeg', this.options.compressionQuality));
                }
            };
            
            img.onerror = () => reject(new Error('Falha ao carregar imagem'));
            img.src = url;
        });
    }

    /**
     * Comprime imagem para reduzir tamanho
     */
    private async compressImage(imageData: string): Promise<string> {
        if (imageData.startsWith('data:')) {
            const sizeKB = imageData.length / 1024;
            
            // Se é pequena, não comprime
            if (sizeKB < 100) return imageData;
            
            // Redimensiona para 75% do tamanho
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width * 0.75;
                    canvas.height = img.height * 0.75;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        resolve(canvas.toDataURL('image/jpeg', 0.75));
                    } else {
                        resolve(imageData);
                    }
                };
                img.src = imageData;
            });
        }
        return imageData;
    }

    /**
     * Carrega do IndexedDB
     */
    private async loadFromDB(url: string): Promise<CachedImage | null> {
        if (!this.db) return null;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(url);

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                resolve(null);
            };
        });
    }

    /**
     * Salva no IndexedDB
     */
    private async saveToDB(entry: CachedImage): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            // Verifica espaço disponível
            const cursor = store.openCursor();
            let totalSize = entry.size;

            cursor.onsuccess = (event: any) => {
                const cursorResult = event.target.result;
                if (cursorResult) {
                    totalSize += cursorResult.value.size;
                    cursorResult.continue();
                } else {
                    // Limpa cache se ultrapassou limite
                    if (totalSize > this.options.maxCacheSize!) {
                        this.clearOldest(entry);
                    } else {
                        store.put(entry);
                    }
                    resolve();
                }
            };
        });
    }

    /**
     * Remove imagens mais antigas para liberar espaço
     */
    private clearOldest(newEntry: CachedImage): void {
        if (!this.db) return;

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
            const entries: CachedImage[] = getAllRequest.result;
            entries.sort((a, b) => a.timestamp - b.timestamp);
            
            // Remove as 10% mais antigas
            const toDelete = Math.ceil(entries.length * 0.1);
            for (let i = 0; i < toDelete; i++) {
                store.delete(entries[i].url);
            }
            
            store.put(newEntry);
        };
    }

    /**
     * Limpa todo o cache
     */
    async clearCache(): Promise<void> {
        this.memoryCache.clear();
        
        if (!this.db) return;

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.clear();

        console.log('✅ Cache de imagens limpo');
    }

    /**
     * Obtém estatísticas de cache
     */
    getStats(): {
        memoryCacheSize: number;
        cachedImages: number;
        loadingQueue: number;
    } {
        let totalSize = 0;
        this.memoryCache.forEach((img) => {
            totalSize += img.size;
        });

        return {
            memoryCacheSize: totalSize,
            cachedImages: this.memoryCache.size,
            loadingQueue: this.loadingQueue.size
        };
    }
}

// Instância global
const imageOptimizer = new ImageOptimizer({
    maxCacheSize: 100,
    compressionQuality: 0.85,
    enableLazyLoad: true
});

// Exportar para uso global
(window as any).imageOptimizer = imageOptimizer;
(window as any).ImageOptimizer = ImageOptimizer;

export { ImageOptimizer, imageOptimizer };
