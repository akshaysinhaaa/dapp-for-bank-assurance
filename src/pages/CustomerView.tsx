import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Car, Home, Shield, Umbrella } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  company: string;
  type: string;
  coverage: string;
  premium: number;
  description: string;
  features: string[];
  image: string;
}

const policies: Policy[] = [
  {
    id: '1',
    name: 'Premium Life Protection',
    company: 'Guardian Insurance',
    type: 'life',
    coverage: '$500,000',
    premium: 45,
    description: 'Comprehensive life insurance coverage with additional benefits',
    features: ['Death benefit', 'Terminal illness benefit', 'Premium waiver on disability'],
    image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&w=400',
  },
  {
    id: '2',
    name: 'Family Health Plus',
    company: 'CarePlus Insurance',
    type: 'health',
    coverage: '$1,000,000',
    premium: 150,
    description: 'Complete family health coverage including dental and vision',
    features: ['Hospitalization', 'Prescription drugs', 'Preventive care'],
    image: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=400',
  },
  {
    id: '3',
    name: 'Home Shield Elite',
    company: 'SafeHaven Insurance',
    type: 'property',
    coverage: '$750,000',
    premium: 85,
    description: 'Comprehensive property protection for your home',
    features: ['Natural disasters', 'Theft protection', 'Personal liability'],
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=400',
  },
];

function CustomerView() {
  const { category } = useParams();
  const filteredPolicies = category ? policies.filter(policy => policy.type === category) : policies;

  const getIcon = (type: string) => {
    switch (type) {
      case 'life':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'health':
        return <Shield className="h-6 w-6 text-green-500" />;
      case 'property':
        return <Home className="h-6 w-6 text-blue-500" />;
      default:
        return <Umbrella className="h-6 w-6 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Insurance Policies` : 'Available Insurance Policies'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <Link
              key={policy.id}
              to={`/policy/${policy.id}`}
              className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="h-48 w-full rounded-t-lg overflow-hidden">
                <img
                  src={policy.image}
                  alt={policy.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getIcon(policy.type)}
                    <span className="ml-2 text-sm font-medium text-gray-500">{policy.type}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{policy.coverage}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{policy.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{policy.company}</p>
                <p className="text-sm text-gray-500 mb-4">{policy.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${policy.premium}</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerView;