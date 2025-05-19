import { useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import PolicyForm from '../../components/policy/PolicyForm';
import { InsurancePolicy } from '../../lib/types';

export default function NewPolicyPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (data: Partial<InsurancePolicy>) => {
    try {
      const response = await fetch('/api/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create policy');
      }

      const result = await response.json();
      router.push(`/insurer/policies/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <ProtectedRoute requiredRole="insurer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Create New Policy
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill out the form below to create a new insurance policy.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <PolicyForm onSubmit={handleSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
} 