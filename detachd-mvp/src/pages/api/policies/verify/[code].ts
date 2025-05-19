import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { InsurancePolicy, VerificationResult, ApiResponse } from '../../../lib/types';
import { validateVerificationCode } from '../../../lib/utils';

// Mock database - replace with actual database implementation
let policies: InsurancePolicy[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VerificationResult>>
) {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Verification code is required',
    });
  }

  // Validate verification code format
  if (!validateVerificationCode(code)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid verification code format',
    });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Find policy with matching verification code
        const policy = policies.find(p => p.verificationCode === code);

        if (!policy) {
          return res.status(404).json({
            success: false,
            error: 'Policy not found',
          });
        }

        // Check if policy is active
        if (policy.status !== 'active') {
          return res.status(400).json({
            success: false,
            error: `Policy is ${policy.status}`,
          });
        }

        // Check if policy has expired
        const now = new Date();
        const endDate = new Date(policy.endDate);
        if (now > endDate) {
          return res.status(400).json({
            success: false,
            error: 'Policy has expired',
          });
        }

        // Return verification result
        const result: VerificationResult = {
          success: true,
          message: 'Policy is valid and active',
          timestamp: new Date().toISOString(),
          policyId: policy.id,
          blockchainHash: policy.blockchainHash,
        };

        return res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        console.error('Error verifying policy:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
      });
  }
} 