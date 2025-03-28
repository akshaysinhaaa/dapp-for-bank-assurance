import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { requestSignature } from '../utils/web3';

interface CustomerPolicy {
  id: string;
  customerName: string;
  policyName: string;
  status: 'active' | 'pending' | 'claimed';
  startDate: string;
  premium: number;
  nextPayment: string;
}

interface ClaimForm {
  policyId: string;
  claimAmount: number;
  reason: string;
  description: string;
  documents: string[];
}

function CustomerPolicies() {
  const [customerPolicies, setCustomerPolicies] = useState<CustomerPolicy[]>([
    {
      id: '1',
      customerName: 'John Doe',
      policyName: 'Basic Life Insurance',
      status: 'active',
      startDate: '2024-01-15',
      premium: 50,
      nextPayment: '2024-03-15',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      policyName: 'Comprehensive Health',
      status: 'claimed',
      startDate: '2023-12-01',
      premium: 150,
      nextPayment: '2024-03-01',
    },
  ]);

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CustomerPolicy | null>(null);
  const [claimForm, setClaimForm] = useState<ClaimForm>({
    policyId: '',
    claimAmount: 0,
    reason: '',
    description: '',
    documents: [],
  });

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    try {
      const message = `Process claim for policy: ${selectedPolicy.id}`;
      await requestSignature(message);

      // Update policy status
      setCustomerPolicies(prev =>
        prev.map(policy =>
          policy.id === selectedPolicy.id
            ? { ...policy, status: 'claimed' as const }
            : policy
        )
      );

      // Reset form and close modal
      setClaimForm({
        policyId: '',
        claimAmount: 0,
        reason: '',
        description: '',
        documents: [],
      });
      setShowClaimForm(false);
      setSelectedPolicy(null);
    } catch (error) {
      console.error('Error processing claim:', error);
      alert('Failed to process claim. Please try again.');
    }
  };

  const handleProcessClaim = (policy: CustomerPolicy) => {
    setSelectedPolicy(policy);
    setClaimForm(prev => ({ ...prev, policyId: policy.id }));
    setShowClaimForm(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
      case 'claimed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Claimed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Policies</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customerPolicies.map((policy) => (
                <tr key={policy.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.policyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(policy.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${policy.premium}/month</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.nextPayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleProcessClaim(policy)}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={policy.status === 'claimed'}
                    >
                      Process Claim
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showClaimForm && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Process Claim</h3>
              <button
                onClick={() => {
                  setShowClaimForm(false);
                  setSelectedPolicy(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleClaimSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedPolicy.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Policy Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedPolicy.policyName}</p>
              </div>
              <div>
                <label htmlFor="claimAmount" className="block text-sm font-medium text-gray-700">Claim Amount</label>
                <input
                  type="number"
                  name="claimAmount"
                  id="claimAmount"
                  required
                  value={claimForm.claimAmount}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, claimAmount: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Claim</label>
                <input
                  type="text"
                  name="reason"
                  id="reason"
                  required
                  value={claimForm.reason}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  id="description"
                  required
                  value={claimForm.description}
                  onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700">Supporting Documents</label>
                <input
                  type="file"
                  name="documents"
                  id="documents"
                  multiple
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowClaimForm(false);
                    setSelectedPolicy(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Process Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPolicies;