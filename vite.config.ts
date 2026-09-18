import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, sirve las funciones de /api (que en producción ejecuta Vercel)
// para poder probarlas con `npm run dev`. Las variables se leen de .env.local.
const devApi = (env: Record<string, string>): Plugin => ({
  name: 'dev-api',
  configureServer(server) {
    server.middlewares.use('/api', async (req, res, next) => {
      const name = req.url?.split('?')[0].replace(/^\//, '');
      if (!name || !/^[\w-]+$/.test(name) || !fs.existsSync(path.resolve(__dirname, 'api', `${name}.ts`))) {
        res.statusCode = 404;
        return res.end();
      }

      for (const [key, value] of Object.entries(env)) {
        if (!key.startsWith('VITE_')) process.env[key] ??= value;
      }

      try {
        const mod = await server.ssrLoadModule(`/api/${name}.ts`);
        const handler = mod[req.method ?? 'GET'];
        if (typeof handler !== 'function') {
          res.statusCode = 405;
          return res.end();
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const request = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body: chunks.length ? Buffer.concat(chunks) : undefined,
        });

        const response: Response = await handler(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      } catch (err) {
        server.config.logger.error(String(err));
        res.statusCode = 500;
        res.end();
      }
    });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), devApi(env)],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
