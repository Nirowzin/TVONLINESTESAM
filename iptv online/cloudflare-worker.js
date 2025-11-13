// CORS Proxy Worker para Cloudflare Workers (GRATUITO)
// Deploy em: workers.cloudflare.com

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Configurar CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Responder OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Extrair URL target do parâmetro
  const targetUrl = url.searchParams.get('url')
  
  if (!targetUrl) {
    return new Response('Parâmetro "url" é obrigatório', { 
      status: 400,
      headers: corsHeaders 
    })
  }

  try {
    // Fazer requisição para a URL target
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StreamoraBot/1.0)',
        'Accept': 'application/vnd.apple.mpegurl, text/plain, */*',
      }
    })

    // Criar nova response com CORS headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        'Cache-Control': 'public, max-age=300',
      }
    })

    return newResponse

  } catch (error) {
    return new Response(`Erro: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    })
  }
}

// Instruções de deploy:
// 1. Vá para workers.cloudflare.com (grátis)
// 2. Crie um novo Worker
// 3. Cole este código
// 4. Deploy
// 5. Use: https://seu-worker.workers.dev/?url=URL_DA_PLAYLIST
