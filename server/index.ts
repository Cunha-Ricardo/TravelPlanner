import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import http from 'http';

// 1. Configuração inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
const ENV = process.env.NODE_ENV || 'development';

// 2. Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Middleware de logging (customizado)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, path } = req;

  // Captura a resposta JSON
  let responseBody: any;
  const originalJson = res.json;
  res.json = function(body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  // Log quando a resposta terminar
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${method} ${path} [${res.statusCode}] - ${duration}ms` + 
                     (responseBody ? ` | ${JSON.stringify(responseBody).slice(0, 100)}` : '');
    log(logMessage);
  });

  next();
});

// 4. Inicialização do servidor
(async () => {
  try {
    // Configura rotas
    const server = http.createServer(app);
    await registerRoutes(app);

    // 5. Configuração do Vite (apenas em desenvolvimento)
    if (ENV === 'development') {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // 6. Tratamento centralizado de erros
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      log(`[ERROR] ${err.stack || err.message}`);
      res.status(500).json({ error: ENV === 'development' ? err.message : 'Internal Server Error' });
    });

    // 7. Inicia o servidor
    server.listen(PORT, HOST, () => {
      log(`🚀 Server running on http://${HOST}:${PORT}`);
      log(`⚡ Environment: ${ENV}`);
      log(`⚡ PID: ${process.pid}`);
    });

    // 8. Graceful shutdown
    const shutdown = () => {
      log('\n🛑 Shutting down server...');
      server.close(() => {
        log('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    log(`❌ Failed to start server: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
})();