import { ethers } from 'ethers';
import { getSecret } from './azure';

const contractAddress = '0x1234...'; // Replace with actual address
const abi = [/* Paste ABI from build/contracts/Detachd.json */];

export async function addToBlockchain(imageUrl: string, status: string, userId: string): Promise<string> {
  const endpoint = process.env.QUORUM_ENDPOINT || 'http://13.76.128.123:8545';
  const privateKey = await getSecret('quorum-private-key');
  const provider = new ethers.providers.JsonRpcProvider(endpoint);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  const imageHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(imageUrl));
  const tx = await contract.addVerification(imageHash, status, userId);
  const receipt = await tx.wait();
  return receipt.transactionHash;
} 