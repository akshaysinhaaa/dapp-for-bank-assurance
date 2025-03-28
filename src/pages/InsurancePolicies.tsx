import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { requestSignature } from '../utils/web3';

interface Policy {
  id: string;
  name: string;
  type: string;
  coverage: string;
  premium: number;
  terms: string;
}

function InsurancePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      name: 'Basic Life Insurance',
      type: 'Life',
      coverage: '$100,000',
      premium: 50,
      terms: 'Term life insurance with 20-year coverage period',
    },
    {
      id: '2',
      name: 'Comprehensive Health',
      type: 'Health',
      coverage: '$500,000',
      premium: 150,
      terms: 'Full coverage health insurance with dental and vision',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState<Omit<Policy, 'id'>>({
    name: '',
    type: '',
    coverage: '',
    premium: 0,
    terms: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'premium' ? Number(value) : value
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message = `Add new policy: ${formData.name}`;
      await requestSignature(message);

      const newPolicy = {
        id: Date.now().toString(),
        ...formData
      };
      setPolicies(prev => [...prev, newPolicy]);
      setShowAddForm(false);
      setFormData({
        name: '',
        type: '',
        coverage: '',
        premium: 0,
        terms: '',
      });
    } catch (error) {
      console.error('Error adding policy:', error);
      alert('Failed to add policy. Please try again.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;
    
    try {
      const message = `Edit policy: ${editingPolicy.id}`;
      await requestSignature(message);

      setPolicies(prev => prev.map(policy => 
        policy.id === editingPolicy.id ? { ...policy, ...formData } : policy
      ));
      setShowEditForm(false);
      setEditingPolicy(null);
    } catch (error) {
      console.error('Error editing policy:', error);
      alert('Failed to edit policy. Please try again.');
    }
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      type: policy.type,
      coverage: policy.coverage,
      premium: policy.premium,
      terms: policy.terms,
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        const message = `Delete policy: ${id}`;
        await requestSignature(message);

        setPolicies(prev => prev.filter(policy => policy.id !== id));
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Failed to delete policy. Please try again.');
      }
    }
  };

  const PolicyForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void, title: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={() => {
              setShowAddForm(false);
              setShowEditForm(false);
              setEditingPolicy(null);
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Policy Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              id="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Life">Life</option>
              <option value="Health">Health</option>
              <option value="Property">Property</option>
              <option value="Vehicle">Vehicle</option>
            </select>
          </div>
          <div>
            <label htmlFor="coverage" className="block text-sm font-medium text-gray-700">Coverage Amount</label>
            <input
              type="text"
              name="coverage"
              id="coverage"
              required
              value={formData.coverage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="premium" className="block text-sm font-medium text-gray-700">Monthly Premium</label>
            <input
              type="number"
              name="premium"
              id="premium"
              required
              value={formData.premium}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
            <textarea
              name="terms"
              id="terms"
              required
              value={formData.terms}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setShowEditForm(false);
                setEditingPolicy(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingPolicy ? 'Save Changes' : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Insurance Policies</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Policy
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.coverage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${policy.premium}/month</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{policy.terms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <PolicyForm onSubmit={handleAddSubmit} title="Add New Policy" />
      )}

      {showEditForm && editingPolicy && (
        <PolicyForm onSubmit={handleEditSubmit} title="Edit Policy" />
      )}
    </div>
  );
}

export default InsurancePolicies;