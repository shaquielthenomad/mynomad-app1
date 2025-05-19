import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyImage } from '../../lib/azure';
import { addToBlockchain } from '../../lib/blockchain';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { imageUrl, userId } = req.body;
  if (!imageUrl || !userId) return res.status(400).json({ error: 'Missing parameters' });
  try {
    const result = await verifyImage(imageUrl);
    const txHash = await addToBlockchain(imageUrl, result.status, userId);
    res.status(200).json({ ...result, txHash });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
} 