import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { InsurancePolicy, ApiResponse } from '../../../lib/types';
import { generateVerificationCode, generateBlockchainHash } from '../../../lib/utils';

// Mock database - replace with actual database implementation
let policies: InsurancePolicy[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<InsurancePolicy | InsurancePolicy[]>>
) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const { user } = session;

  // Ensure user has appropriate role
  if (user.role !== 'insurer' && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Insufficient permissions',
    });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Filter policies based on user role and query parameters
        let filteredPolicies = [...policies];

        // If not admin, only show policies created by the user
        if (user.role !== 'admin') {
          filteredPolicies = filteredPolicies.filter(p => p.userId === user.sub);
        }

        // Apply filters from query parameters
        const { status, type, startDate, endDate } = req.query;

        if (status) {
          filteredPolicies = filteredPolicies.filter(p => p.status === status);
        }

        if (type) {
          filteredPolicies = filteredPolicies.filter(p => p.type === type);
        }

        if (startDate) {
          filteredPolicies = filteredPolicies.filter(p => p.startDate >= startDate as string);
        }

        if (endDate) {
          filteredPolicies = filteredPolicies.filter(p => p.endDate <= endDate as string);
        }

        return res.status(200).json({
          success: true,
          data: filteredPolicies,
        });
      } catch (error) {
        console.error('Error fetching policies:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }

    case 'POST':
      try {
        const {
          type,
          coverage,
          startDate,
          endDate,
        } = req.body;

        // Validate required fields
        if (!type || !coverage || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields',
          });
        }

        // Generate unique policy number (replace with actual implementation)
        const policyNumber = `POL-${Date.now().toString(36).toUpperCase()}`;

        // Generate verification code and blockchain hash
        const verificationCode = generateVerificationCode();
        const blockchainHash = await generateBlockchainHash(policyNumber);

        const newPolicy: InsurancePolicy = {
          id: Date.now().toString(),
          policyNumber,
          type,
          status: 'pending',
          coverage,
          startDate,
          endDate,
          userId: user.sub,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          verificationCode,
          blockchainHash,
        };

        policies.push(newPolicy);

        return res.status(201).json({
          success: true,
          data: newPolicy,
          message: 'Policy created successfully',
        });
      } catch (error) {
        console.error('Error creating policy:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
      });
  }
} 