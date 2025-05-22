import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';

// 1. Configuração inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Alterado para 0.0.0.0 para compatibilidade com containers
const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';

// 2. Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Middleware de logging melhorado
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const contentLength = res.get('Content-Length') || 0;
    log(`${method} ${originalUrl} [${res.statusCode}] ${contentLength}bytes - ${duration}ms - ${ip}`);
  });

  next();
});

// 4. Inicialização segura do servidor
(async () => {
  try {
    // Configura rotas
    await registerRoutes(app);

    // 5. Configuração do Vite em desenvolvimento
    if (IS_DEV) {
      const server = http.createServer(app);
      await setupVite(app, server);
      startServer(server);
    } 
    // Configuração de produção
    else {
      // Middleware para arquivos estáticos
      app.use(express.static(path.join(__dirname, 'public'), {
        maxAge: '1y',
        immutable: true
      }));

      // Fallback para SPA (Single Page Application)
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      });

      startServer(app);
    }

  } catch (error) {
    log(`❌ Falha crítica ao iniciar o servidor: ${error instanceof Error ? error.stack : error}`);
    process.exit(1);
  }
})();

function startServer(server: http.Server | express.Application) {
  const httpServer = server instanceof http.Server ? server : http.createServer(server);
  
  httpServer.listen(PORT, HOST, () => {
    log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
    log(`⚡ Ambiente: ${ENV}`);
    log(`⚡ PID: ${process.pid}`);
  });

  // Graceful shutdown melhorado
  const shutdown = async () => {
    log('\n🛑 Desligando servidor graciosamente...');
    
    try {
      httpServer.close(() => {
        log('✅ Servidor encerrado com sucesso');
        process.exit(0);
      });
      
      // Força encerramento se demorar muito
      setTimeout(() => {
        log('⚠️ Encerramento forçado após timeout');
        process.exit(1);
      }, 5000);
      
    } catch (err) {
      log(`❌ Erro durante shutdown: ${err instanceof Error ? err.stack : err}`);
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('unhandledRejection', (reason) => {
    log(`⚠️ Rejeição não tratada: ${reason instanceof Error ? reason.stack : reason}`);
  });
}