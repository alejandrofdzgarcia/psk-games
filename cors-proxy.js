#!/usr/bin/env node

/**
 * CORS Proxy Server Simple
 * 
 * Este servidor proxy te permite evitar errores de CORS durante el desarrollo.
 * 
 * Para usar:
 * 1. Instala Node.js si no lo tienes
 * 2. Ejecuta: node cors-proxy.js
 * 3. Cambia la baseURL en api-client.js a 'http://localhost:3001'
 * 
 * El proxy reenviará todas las peticiones a la API real añadiendo los headers CORS necesarios.
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;
const TARGET_API = 'https://psk-games-api.onrender.com';

const server = http.createServer((req, res) => {
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas

    // Manejar preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Construir la URL de destino
    const targetUrl = TARGET_API + req.url;
    console.log(`📡 Proxy: ${req.method} ${req.url} -> ${targetUrl}`);

    // Configurar la petición al servidor de destino
    const parsedUrl = url.parse(targetUrl);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.path,
        method: req.method,
        headers: {
            ...req.headers,
            host: parsedUrl.host,
        }
    };

    // Eliminar headers que pueden causar problemas
    delete options.headers.origin;
    delete options.headers.referer;

    // Seleccionar el módulo correcto (http o https)
    const httpModule = parsedUrl.protocol === 'https:' ? https : http;

    // Hacer la petición al servidor de destino
    const proxyReq = httpModule.request(options, (proxyRes) => {
        // Copiar el status code
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        
        // Pipe la respuesta
        proxyRes.pipe(res);
        
        console.log(`✅ Respuesta: ${proxyRes.statusCode} ${req.url}`);
    });

    // Manejar errores
    proxyReq.on('error', (error) => {
        console.error(`❌ Error en proxy para ${req.url}:`, error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Proxy Error', 
            message: error.message,
            fallback: true 
        }));
    });

    // Si hay body en la petición, enviarlo
    req.pipe(proxyReq);
});

// Manejar errores del servidor
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso. Prueba con otro puerto.`);
    } else {
        console.error('❌ Error del servidor:', error.message);
    }
    process.exit(1);
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log('🚀 CORS Proxy Server iniciado');
    console.log(`📍 Servidor local: http://localhost:${PORT}`);
    console.log(`🎯 API de destino: ${TARGET_API}`);
    console.log('');
    console.log('📋 Para usar este proxy:');
    console.log('1. Deja este servidor ejecutándose');
    console.log('2. En api-client.js, cambia baseURL a: http://localhost:3001');
    console.log('3. Recarga tu aplicación web');
    console.log('');
    console.log('⏹️  Para detener: Ctrl+C');
});

// Manejar cierre limpio
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando CORS Proxy Server...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});
