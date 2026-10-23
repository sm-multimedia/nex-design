import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const routeDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(routeDirectory, '../.env') });
dotenv.config({ path: resolve(routeDirectory, '../../.env') });

const router = express.Router();

router.route('/').get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" })
})

router.route('/').post(async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return res.status(400).json({ message: 'A non-empty prompt is required.' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ message: 'Image generation is not configured on the server.' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.images.generate({
      model: 'gpt-image-2.5-flare',
      prompt,
      size: '1024x1024',
    });

    const image = response.data[0]?.b64_json;
    if (!image) {
      throw new Error('The image service returned no image data.');
    }

    res.status(200).json({ photo: image });
  } catch (error) {
    const status = Number.isInteger(error?.status) ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Image generation failed.';
    console.error('Image generation failed:', { status, message });
    res.status(status).json({ message });
  }
})

export default router;