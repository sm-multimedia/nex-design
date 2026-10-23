import express from 'express';
import cors from 'cors';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import dalleRoutes from './routes/dalle.routes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use("/api/v1/dalle", dalleRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from DALL.E" })
})

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(8080, () => console.log('Server has started on port 8080'))
}

export default app;