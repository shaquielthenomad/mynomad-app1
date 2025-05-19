import { useState } from 'react';
import { useRouter } from 'next/router';
import { InsurancePolicy, PolicyType } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface PolicyFormProps {
  initialData?: Partial<InsurancePolicy>;
  onSubmit: (data: Partial<InsurancePolicy>) => Promise<void>;
  isEditing?: boolean;
}

export default function PolicyForm({ initialData, onSubmit, isEditing = false }: PolicyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Partial<InsurancePolicy>>({
    type: initialData?.type || 'property',
    coverage: initialData?.coverage || {
      amount: 0,
      currency: 'USD',
      type: 'standard',
    },
    startDate: initialData?.startDate || formatDate(new Date()),
    endDate: initialData?.endDate || formatDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)), // 1 year from now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('coverage.')) {
      const coverageField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coverage: {
          ...prev.coverage,
          [coverageField]: coverageField === 'amount' ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      if (!isEditing) {
        router.push('/insurer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const policyTypes: PolicyType[] = ['property', 'liability', 'health', 'life'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  const coverageTypes = ['standard', 'premium', 'basic'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Policy Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#003366] focus:ring-[#003366]"
          disabled={isEditing}
        >
          {policyTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="coverage.amount" className="block text-sm font-medium text-gray-700">
            Coverage Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="coverage.amount"
              name="coverage.amount"
              value={formData.coverage?.amount || ''}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-[#003366] focus:ring-[#003366]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                name="coverage.currency"
                value={formData.coverage?.currency}
                onChange={handleChange}
                className="h-full rounded-r-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-[#003366] focus:ring-[#003366]"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="coverage.type" className="block text-sm font-medium text-gray-700">
            Coverage Type
          </label>
          <select
            id="coverage.type"
            name="coverage.type"
            value={formData.coverage?.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#003366] focus:ring-[#003366]"
          >
            {coverageTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            min={formatDate(new Date())}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#003366] focus:ring-[#003366]"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={formData.startDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#003366] focus:ring-[#003366]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditing ? 'Update Policy' : 'Create Policy'
          )}
        </button>
      </div>
    </form>
  );
} 