import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { InsurancePolicy, ApiResponse } from '../../../lib/types';

// Mock database - replace with actual database implementation
let policies: InsurancePolicy[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<InsurancePolicy>>
) {
  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const { user } = session;
  const { id } = req.query;

  // Ensure user has appropriate role
  if (user.role !== 'insurer' && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Insufficient permissions',
    });
  }

  // Find the policy
  const policyIndex = policies.findIndex(p => p.id === id);

  if (policyIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Policy not found',
    });
  }

  // Check if user has permission to access this policy
  if (user.role !== 'admin' && policies[policyIndex].userId !== user.sub) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Insufficient permissions',
    });
  }

  switch (req.method) {
    case 'GET':
      return res.status(200).json({
        success: true,
        data: policies[policyIndex],
      });

    case 'PUT':
      try {
        const {
          type,
          status,
          coverage,
          startDate,
          endDate,
        } = req.body;

        // Validate required fields
        if (!type || !status || !coverage || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields',
          });
        }

        // Update policy
        const updatedPolicy: InsurancePolicy = {
          ...policies[policyIndex],
          type,
          status,
          coverage,
          startDate,
          endDate,
          updatedAt: new Date().toISOString(),
        };

        policies[policyIndex] = updatedPolicy;

        return res.status(200).json({
          success: true,
          data: updatedPolicy,
          message: 'Policy updated successfully',
        });
      } catch (error) {
        console.error('Error updating policy:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }

    case 'DELETE':
      try {
        // Only allow deletion of pending or cancelled policies
        if (policies[policyIndex].status !== 'pending' && policies[policyIndex].status !== 'cancelled') {
          return res.status(400).json({
            success: false,
            error: 'Cannot delete active or expired policies',
          });
        }

        // Remove policy from array
        policies.splice(policyIndex, 1);

        return res.status(200).json({
          success: true,
          message: 'Policy deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting policy:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`,
      });
  }
} 