export type UserRole = 'admin' | 'insurer' | 'claimant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export type PolicyStatus = 'active' | 'pending' | 'expired' | 'cancelled';
export type PolicyType = 'property' | 'liability' | 'health' | 'life';

export interface Coverage {
  amount: number;
  currency: string;
  type: string;
  details?: Record<string, any>;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  status: PolicyStatus;
  coverage: Coverage;
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  verificationCode?: string;
  blockchainHash?: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'bypassed';
export type ClaimType = 'property' | 'liability' | 'health' | 'life';

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  hash: string;
  uploadedAt: string;
  verified: boolean;
  verificationResult?: {
    status: 'success' | 'failure';
    message: string;
    timestamp: string;
  };
}

export interface Claim {
  id: string;
  type: ClaimType;
  status: ClaimStatus;
  policyId: string;
  userId: string;
  description: string;
  incidentDate: string;
  submissionDate: string;
  documents: Document[];
  blockchainHash?: string;
  bypassCode?: string;
  verificationHistory?: {
    timestamp: string;
    action: 'submitted' | 'approved' | 'rejected' | 'bypassed';
    performedBy: string;
    notes?: string;
  }[];
}

export interface VerificationResult {
  success: boolean;
  message: string;
  timestamp: string;
  documentId?: string;
  claimId?: string;
  policyId?: string;
  blockchainHash?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
} 