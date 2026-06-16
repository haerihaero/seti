import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-spaces-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save-spaces' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const spacesData = JSON.parse(body);
                const spacesFilePath = path.resolve('src/spaces.json');
                
                fs.writeFileSync(spacesFilePath, JSON.stringify(spacesData, null, 2), 'utf-8');
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else if (req.url === '/api/save-tech-actions' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const actionsData = JSON.parse(body);
                const actionsFilePath = path.resolve('src/tech_actions.json');
                
                fs.writeFileSync(actionsFilePath, JSON.stringify(actionsData, null, 2), 'utf-8');
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else if (req.url === '/api/save-top-board-slots' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const slotsData = JSON.parse(body);
                const slotsFilePath = path.resolve('src/top_board_slots.json');
                
                fs.writeFileSync(slotsFilePath, JSON.stringify(slotsData, null, 2), 'utf-8');
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
