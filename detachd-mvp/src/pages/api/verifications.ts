import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getSecret } from '../../lib/azure';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const endpoint = process.env.QUORUM_ENDPOINT;
    const privateKey = await getSecret('quorum-private-key');
    const provider = new ethers.providers.JsonRpcProvider(endpoint);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract('0x1234...', ['/* ABI */'], wallet);
    const count = await contract.count();
    const verifications = [];
    for (let i = 0; i < count; i++) {
      const [imageHash, status, userId, timestamp] = await contract.getVerification(i);
      verifications.push({ imageHash, status, userId, timestamp: Number(timestamp) });
    }
    res.status(200).json(verifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
} 