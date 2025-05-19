import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { BlobServiceClient } from '@azure/storage-blob';
import { CosmosClient } from '@azure/cosmos';
import axios from 'axios';

export async function getSecret(secretName: string): Promise<string> {
  const credential = new DefaultAzureCredential();
  const client = new SecretClient('https://detachd-vault.vault.azure.net', credential);
  const secret = await client.getSecret(secretName);
  return secret.value;
}

export async function uploadFile(file: Buffer, fileName: string): Promise<string> {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient('detachd');
  const blobClient = containerClient.getBlockBlobClient(fileName);
  await blobClient.uploadData(file);
  return blobClient.url;
}

export async function verifyImage(imageUrl: string): Promise<{ status: string; confidence: number }> {
  const endpoint = process.env.AZURE_INFERENCE_ENDPOINT;
  const key = await getSecret('llama4-key');
  const response = await axios.post(
    endpoint,
    { image_url: imageUrl, prompt: 'Analyze this image for tampering. Return "verified" or "tampered" with confidence score.' },
    { headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } }
  );
  return response.data;
}

export async function saveVerification(userId: string, imageUrl: string, status: string, consent: boolean) {
  const client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
  const database = client.database('detachd');
  const container = database.container('verifications');
  await container.items.create({ userId, imageUrl, status, consent, timestamp: new Date() });
}

export async function getVerifications(userId: string): Promise<any[]> {
  const client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
  const database = client.database('detachd');
  const container = database.container('verifications');
  const { resources } = await container.items.query({
    query: 'SELECT * FROM c WHERE c.userId = @userId',
    parameters: [{ name: '@userId', value: userId }]
  }).fetchAll();
  return resources;
}

export async function generateCertificate(imageUrl: string, status: string, userId: string, timestamp: number): Promise<string> {
  const PDFDocument = require('pdfkit');
  const fs = require('fs');
  const { encrypt } = require('node-qpdf');
  const doc = new PDFDocument();
  const pdfPath = `certificates/certificate_${userId}_${timestamp}.pdf`;
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.image('public/logo.png', 50, 50, { width: 100 });
  doc.fontSize(20).text('Verification Certificate', 50, 150);
  doc.fontSize(14).text(`Status: ${status}`, 50, 200);
  doc.text(`User ID: ${userId}`, 50, 220);
  doc.text(`Timestamp: ${new Date(timestamp).toLocaleString()}`, 50, 240);
  if (status === 'verified') doc.image('public/seal.png', 400, 50, { width: 100 });
  doc.end();
  const key = await getSecret('detachd-encryption-key');
  const encryptedPath = pdfPath.replace('.pdf', '_encrypted.pdf');
  await encrypt({ input: pdfPath, output: encryptedPath, password: key, algorithm: 'aes256' });
  return await uploadFile(fs.readFileSync(encryptedPath), `certificate_${userId}.pdf`);
} 