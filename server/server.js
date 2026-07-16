import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'products.json');
const port = Number(process.env.PORT || 5000);

const defaultProducts = [];

const ensureDataFile = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(defaultProducts, null, 2));
  }
};

const readProducts = async () => {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw);
};

const writeProducts = async (products) => {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(products, null, 2));
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (url.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (url.pathname === '/api/products') {
    if (req.method === 'GET') {
      const products = await readProducts();
      sendJson(res, 200, products);
      return;
    }

    if (req.method === 'POST') {
      try {
        const payload = await parseJsonBody(req);
        const products = await readProducts();
        const newProduct = {
          ...payload,
          id: payload.id || `server-${Date.now()}`,
          price: Number(payload.price) || 0,
          available: payload.available !== false,
        };
        const updatedProducts = [newProduct, ...products.filter((item) => item.id !== newProduct.id)];
        await writeProducts(updatedProducts);
        sendJson(res, 201, newProduct);
      } catch {
        sendJson(res, 400, { error: 'Invalid product payload' });
      }
      return;
    }
  }

  const productMatch = /^\/api\/products\/(.+)$/.exec(url.pathname);
  if (productMatch) {
    const productId = productMatch[1];

    if (req.method === 'PUT') {
      try {
        const payload = await parseJsonBody(req);
        const products = await readProducts();
        const updatedProducts = products.map((item) => (item.id === productId ? { ...item, ...payload, id: productId } : item));
        await writeProducts(updatedProducts);
        const updatedProduct = updatedProducts.find((item) => item.id === productId);
        sendJson(res, 200, updatedProduct || {});
      } catch {
        sendJson(res, 400, { error: 'Invalid product update payload' });
      }
      return;
    }

    if (req.method === 'DELETE') {
      const products = await readProducts();
      const filteredProducts = products.filter((item) => item.id !== productId);
      await writeProducts(filteredProducts);
      sendJson(res, 200, { deleted: true, id: productId });
      return;
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Catalog API listening on http://localhost:${port}`);
});
