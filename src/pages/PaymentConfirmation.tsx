import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, ExternalLink, Copy } from 'lucide-react';

interface PaymentConfirmationProps {
  txHash?: string;
}

function PaymentConfirmation({ txHash }: PaymentConfirmationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    policyName?: string;
    premium?: number;
    txHash?: string;
  };

  const displayTxHash = txHash || state?.txHash || '';
  const shortTxHash = displayTxHash 
    ? `${displayTxHash.slice(0, 6)}...${displayTxHash.slice(-4)}`
    : '';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Transaction hash copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Your insurance policy payment has been processed successfully.
          </p>

          {state?.policyName && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Policy Details</h2>
              <p className="text-gray-600">{state.policyName}</p>
              {state.premium && (
                <p className="text-gray-600 mt-1">
                  Premium: ${state.premium}/month
                </p>
              )}
            </div>
          )}

          {displayTxHash && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">Transaction Details</h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-mono">{shortTxHash}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(displayTxHash)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy transaction hash"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <a
                    href={`https://etherscan.io/tx/${displayTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View My Policies
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirmation;