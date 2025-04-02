import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import multer from "multer";

const startTime = Date.now();
log("Starting server...");
log(`Environment: ${process.env.NODE_ENV}`);
log(`Port: ${process.env.PORT || 5000}`);
log(`Process ID: ${process.pid}`);
log(`Platform: ${process.platform}`);

// Initialize Express
const app = express();
log(`Express initialized (${Date.now() - startTime}ms)`);

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  log(`Incoming ${req.method} request to ${req.path}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} completed in ${duration}ms`);
  });

  next();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const health = {
    status: "ok",
    uptime: Date.now() - startTime,
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString(),
    pid: process.pid
  };
  log(`Health check requested, responding with: ${JSON.stringify(health)}`);
  res.json(health);
});

// Staged server initialization
(async () => {
  try {
    log("Starting core server setup...");
    const server = await registerRoutes(app);
    log(`Routes registered (${Date.now() - startTime}ms)`);

    // Start the server first
    const port = process.env.PORT || 5000;
    const host = "0.0.0.0";

    log(`Attempting to start server on ${host}:${port}...`);

    await new Promise<void>((resolve, reject) => {
      try {
        server.listen({
          port,
          host,
          reusePort: true,
        }, () => {
          const address = server.address();
          log(`Server listening on: ${typeof address === 'string' ? address : JSON.stringify(address)}`);
          log(`API server started on ${host}:${port} (${Date.now() - startTime}ms)`);
          resolve();
        });

        server.on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            log(`Port ${port} is already in use`);
          }
          reject(error);
        });
      } catch (error) {
        log(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
        reject(error);
      }
    });

    // Setup frontend after server is running
    if (app.get("env") === "development") {
      log("Setting up Vite development server...");
      try {
        await setupVite(app, server);
        log(`Vite setup complete (${Date.now() - startTime}ms)`);
      } catch (error) {
        log(`Failed to setup Vite: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    } else {
      log("Setting up static file serving...");
      try {
        serveStatic(app);
        log(`Static serving setup complete (${Date.now() - startTime}ms)`);
      } catch (error) {
        log(`Failed to setup static serving: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }

    log(`Server fully initialized (total startup time: ${Date.now() - startTime}ms)`);
  } catch (error) {
    log(`Server startup error: ${error instanceof Error ? error.message : String(error)}`);
    console.error("Server startup error details:", error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof Error && 'status' in err ? (err as any).status : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";
  log(`Error handler: ${status} - ${message}`);
  res.status(status).json({ message });
});