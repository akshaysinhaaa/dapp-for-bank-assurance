import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Check, AlertCircle, CreditCard, Wallet, ArrowRight } from 'lucide-react';
import { sendTransaction } from '../utils/web3';

interface PolicyDetailsProps {
  walletAddress: string;
}

function PolicyDetails({ walletAddress }: PolicyDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
  });

  const [otpData, setOtpData] = useState({
    emailOTP: '',
    phoneOTP: '',
    emailVerified: false,
    phoneVerified: false,
  });

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const policy = {
    id: '1',
    name: 'Premium Life Protection',
    company: 'Guardian Insurance',
    type: 'Life Insurance',
    coverage: '$500,000',
    premium: 45,
    description: 'Comprehensive life insurance coverage with additional benefits',
    features: [
      'Death benefit up to $500,000',
      'Terminal illness benefit',
      'Premium waiver on disability',
      '24/7 customer support',
      'Worldwide coverage',
    ],
    requirements: [
      'Age between 18-65 years',
      'Valid ID proof',
      'Medical examination',
      'Income proof',
    ],
    image: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?auto=format&fit=crop&w=800',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailOTP = generateOTP();
    const phoneOTP = generateOTP();
    console.log('Email OTP:', emailOTP);
    console.log('Phone OTP:', phoneOTP);
    setShowOTPVerification(true);
  };

  const handleOTPVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpData(prev => ({
      ...prev,
      emailVerified: true,
      phoneVerified: true
    }));
    setShowOTPVerification(false);
    setShowApplicationForm(false);
    setShowCheckout(true);
  };

  const handleCryptoPayment = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const txHash = await sendTransaction(policy.premium);
      navigate('/payment-confirmation', { 
        state: { 
          txHash,
          policyName: policy.name,
          premium: policy.premium
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const OTPVerificationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Verify Your Contact Details</h3>
        <form onSubmit={handleOTPVerification} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Verification</label>
            <p className="text-sm text-gray-500 mb-2">Enter the OTP sent to {formData.email}</p>
            <input
              type="text"
              name="emailOTP"
              maxLength={6}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={otpData.emailOTP}
              onChange={handleOTPInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Verification</label>
            <p className="text-sm text-gray-500 mb-2">Enter the OTP sent to {formData.phone}</p>
            <input
              type="text"
              name="phoneOTP"
              maxLength={6}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={otpData.phoneOTP}
              onChange={handleOTPInputChange}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowOTPVerification(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Verify & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const PaymentOptions = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Payment Method</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-900">Credit Card</p>
              <p className="text-sm text-gray-500">Pay with Visa, Mastercard</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </button>
        <button 
          onClick={handleCryptoPayment}
          className={`flex items-center justify-between p-4 border rounded-lg ${
            !walletAddress 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-blue-500 hover:bg-blue-50'
          }`}
          disabled={!walletAddress}
        >
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-semibold text-gray-900">Ethereum (ETH)</p>
              <p className="text-sm text-gray-500">
                {walletAddress ? 'Pay with cryptocurrency' : 'Connect wallet to pay with ETH'}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Monthly Premium</span>
          <span className="font-semibold">${policy.premium}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Processing Fee</span>
          <span className="font-semibold">$0</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-blue-600">${policy.premium}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ApplicationForm = () => (
    <form onSubmit={handleApplicationSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.city}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            id="country"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setShowApplicationForm(false)}
          className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Verification
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {!showApplicationForm && !showCheckout && (
        <>
          <div className="relative h-64 sm:h-96">
            <img
              src={policy.image}
              alt={policy.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{policy.name}</h1>
              <p className="text-lg opacity-90">{policy.company}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Coverage Amount</h3>
                <p className="text-2xl font-bold text-blue-700">{policy.coverage}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Monthly Premium</h3>
                <p className="text-2xl font-bold text-green-700">${policy.premium}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Insurance Type</h3>
                <p className="text-2xl font-bold text-purple-700">{policy.type}</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Policy Description</h2>
                <p className="text-gray-600">{policy.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policy.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {policy.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <span className="text-gray-600">{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="mt-8">
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply for This Policy
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showApplicationForm && (
        <div className="p-6">
          <ApplicationForm />
        </div>
      )}

      {showOTPVerification && (
        <OTPVerificationForm />
      )}

      {showCheckout && (
        <div className="p-6">
          <PaymentOptions />
        </div>
      )}
    </div>
  );
}

export default PolicyDetails;