const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 8000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Handle M3U proxy requests
    if (parsedUrl.pathname === '/proxy-m3u') {
        handleM3UProxy(req, res, parsedUrl.query);
        return;
    }
    
    // Handle stream proxy requests
    if (parsedUrl.pathname === '/proxy-stream') {
        handleStreamProxy(req, res, parsedUrl.query);
        return;
    }
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
        '.m3u': 'application/vnd.apple.mpegurl',
        '.m3u8': 'application/vnd.apple.mpegurl'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Página não encontrada</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Erro interno do servidor: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

function handleM3UProxy(req, res, query) {
    const targetUrl = query.url;
    
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'URL parameter is required' }));
        return;
    }

    console.log('Proxying M3U request to:', targetUrl);

    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        }
    };

    const proxyReq = client.request(options, (proxyRes) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
        // Set content type
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        
        res.writeHead(proxyRes.statusCode);

        // Pipe the response
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(500, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'Failed to fetch M3U playlist', 
            details: error.message 
        }));
    });

    proxyReq.end();
}

// Handle video/stream proxy requests
function handleStreamProxy(req, res, query) {
    const targetUrl = query.url;
    
    if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'URL parameter is required' }));
        return;
    }

    console.log('Proxying stream request to:', targetUrl);

    const parsedUrl = url.parse(targetUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Ranges': 'bytes',
            'Range': req.headers.range || '',
        }
    };

    const proxyReq = client.request(options, (proxyRes) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
        
        // Copy headers from original response
        Object.keys(proxyRes.headers).forEach(key => {
            res.setHeader(key, proxyRes.headers[key]);
        });
        
        res.writeHead(proxyRes.statusCode);

        // Pipe the response
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
        console.error('Stream proxy error:', error);
        res.writeHead(500, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'Failed to fetch stream', 
            details: error.message 
        }));
    });

    proxyReq.end();
}

server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
