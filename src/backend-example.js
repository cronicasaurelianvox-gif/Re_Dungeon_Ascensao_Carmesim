/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  BACKEND CARDFLUX IA - EXEMPLO NODE.JS/EXPRESS               ║
 * ║  Seguro, escalável, pronto para produção                     ║
 * ║  Implementar em seu servidor para máxima segurança            ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const CONFIG = {
    PORT: process.env.PORT || 3000,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    MAX_RETRIES: 3,
    TIMEOUT_MS: 30000
};

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS seguro
app.use(cors({
    origin: CONFIG.ALLOWED_ORIGINS,
    methods: ['POST', 'GET'],
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // máximo 20 requisições por IP
    message: 'Muitas requisições, tente novamente mais tarde'
});

app.use('/api/', limiter);

// ============================================================
// VALIDAÇÃO
// ============================================================

/**
 * Validar prompt para segurança
 */
function validarPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt inválido');
    }
    
    if (prompt.length > 10000) {
        throw new Error('Prompt muito longo (máximo 10000 caracteres)');
    }
    
    // Bloquear patterns perigosos
    const patterns = [
        /eval\s*\(/i,
        /execute\s*\(/i,
        /system\s*\(/i,
        /<script/i,
        /javascript:/i
    ];
    
    if (patterns.some(p => p.test(prompt))) {
        throw new Error('Prompt contém código suspeito');
    }
    
    return true;
}

/**
 * Validar provedor
 */
function validarProvedor(provedor) {
    const provedores = ['anthropic', 'openai'];
    if (!provedores.includes(provedor)) {
        throw new Error(`Provedor não suportado: ${provedor}`);
    }
    return true;
}

// ============================================================
// INICIALIZAR CLIENTES
// ============================================================

const anthropic = CONFIG.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: CONFIG.ANTHROPIC_API_KEY })
    : null;

const openai = CONFIG.OPENAI_API_KEY
    ? new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY })
    : null;

// ============================================================
// CHAMADAS À IA
// ============================================================

/**
 * Chamar Claude (Anthropic)
 */
async function chamarClaude(prompt, tentativa = 1) {
    if (!anthropic) {
        throw new Error('Claude não configurado (ANTHROPIC_API_KEY ausente)');
    }
    
    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2000,
            temperature: 0.7,
            system: 'Você é um criador de eventos narrativos para RPG. Responda SEMPRE com JSON válido e nada mais.',
            messages: [{
                role: 'user',
                content: prompt
            }],
            timeout: CONFIG.TIMEOUT_MS
        });
        
        if (!message.content[0] || message.content[0].type !== 'text') {
            throw new Error('Formato de resposta inválido');
        }
        
        return message.content[0].text;
        
    } catch (error) {
        if (tentativa < CONFIG.MAX_RETRIES) {
            console.log(`⚠️ Tentativa ${tentativa} falhou, retentando...`);
            await new Promise(r => setTimeout(r, 1000 * tentativa)); // Backoff
            return chamarClaude(prompt, tentativa + 1);
        }
        throw error;
    }
}

/**
 * Chamar GPT (OpenAI)
 */
async function chamarGPT(prompt, tentativa = 1) {
    if (!openai) {
        throw new Error('OpenAI não configurado (OPENAI_API_KEY ausente)');
    }
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            max_tokens: 2000,
            temperature: 0.7,
            messages: [{
                role: 'system',
                content: 'Você é um criador de eventos narrativos para RPG. Responda SEMPRE com JSON válido e nada mais.'
            }, {
                role: 'user',
                content: prompt
            }],
            timeout: CONFIG.TIMEOUT_MS
        });
        
        if (!response.choices[0].message.content) {
            throw new Error('Resposta vazia');
        }
        
        return response.choices[0].message.content;
        
    } catch (error) {
        if (tentativa < CONFIG.MAX_RETRIES) {
            console.log(`⚠️ Tentativa ${tentativa} falhou, retentando...`);
            await new Promise(r => setTimeout(r, 1000 * tentativa));
            return chamarGPT(prompt, tentativa + 1);
        }
        throw error;
    }
}

// ============================================================
// ENDPOINTS
// ============================================================

/**
 * POST /api/cardflux/gerar
 * Gera uma carta usando IA
 */
app.post('/api/cardflux/gerar', async (req, res) => {
    let startTime = Date.now();
    
    try {
        console.log('📨 Recebido requisição de geração');
        
        const { prompt, provedor = 'anthropic' } = req.body;
        
        // Validações
        validarPrompt(prompt);
        validarProvedor(provedor);
        
        console.log(`🚀 Usando provedor: ${provedor}`);
        
        // Chamar IA
        let resposta;
        
        if (provedor === 'anthropic') {
            resposta = await chamarClaude(prompt);
        } else if (provedor === 'openai') {
            resposta = await chamarGPT(prompt);
        } else {
            throw new Error('Provedor não reconhecido');
        }
        
        // Validar JSON
        JSON.parse(resposta); // Vai lançar erro se inválido
        
        const duracao = Date.now() - startTime;
        
        console.log(`✅ Geração bem-sucedida em ${duracao}ms`);
        
        res.json({
            sucesso: true,
            resposta: resposta,
            duracao_ms: duracao,
            provedor: provedor
        });
        
    } catch (error) {
        const duracao = Date.now() - startTime;
        
        console.error('❌ Erro:', error.message);
        
        res.status(400).json({
            sucesso: false,
            erro: error.message,
            duracao_ms: duracao,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/cardflux/status
 * Verificar status do servidor
 */
app.get('/api/cardflux/status', (req, res) => {
    const provedoresDisponíveis = [];
    
    if (anthropic) provedoresDisponíveis.push('anthropic');
    if (openai) provedoresDisponíveis.push('openai');
    
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        provedoresDisponíveis,
        versao: '1.0.0'
    });
});

/**
 * POST /api/cardflux/validar
 * Validar prompt sem chamador IA (útil para testes)
 */
app.post('/api/cardflux/validar', (req, res) => {
    try {
        const { prompt } = req.body;
        validarPrompt(prompt);
        
        res.json({
            sucesso: true,
            mensagem: 'Prompt válido'
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {
    console.error('❌ Erro não capturado:', err);
    
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Endpoint não encontrado',
        path: req.path
    });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(CONFIG.PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║     🤖 CARDFLUX IA SERVER - RODANDO COM SUCESSO        ║
╠════════════════════════════════════════════════════════╣
║ 🌐 URL: http://localhost:${CONFIG.PORT}
║ 📍 POST /api/cardflux/gerar
║ 📍 GET  /api/cardflux/status
║ 📍 POST /api/cardflux/validar
╠════════════════════════════════════════════════════════╣
║ ✅ Provedores disponíveis:
${anthropic ? '║   - Claude (Anthropic)\n' : ''}${openai ? '║   - GPT (OpenAI)\n' : ''}${!anthropic && !openai ? '║   ⚠️  NENHUM configurado! Defina ENV vars.\n' : ''}║ 🔒 Rate limit: 20 req/15min por IP
╚════════════════════════════════════════════════════════╝
    `);
});

// Exportar para testes
module.exports = app;
