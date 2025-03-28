import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield, Menu, X, Building2, Users, Heart, Car, Home, Umbrella, Wallet } from 'lucide-react';
import CustomerView from './pages/CustomerView';
import PolicyDetails from './pages/PolicyDetails';
import InsurancePolicies from './pages/InsurancePolicies';
import CustomerPolicies from './pages/CustomerPolicies';
import AdminLogin from './pages/AdminLogin';
import PaymentConfirmation from './pages/PaymentConfirmation';
import { ethers } from 'ethers';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        
        // Create Web3 instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.getSigner();
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Main Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Bank-Assurance</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Browse Policies
                  </Link>
                  <Link
                    to="/life"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Life Insurance
                  </Link>
                  <Link
                    to="/health"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Health Insurance
                  </Link>
                  <Link
                    to="/property"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Property Insurance
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar for Admin Access */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 py-6 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-4 space-y-2">
                {/* Wallet Connection Button */}
                <button
                  onClick={connectWallet}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 bg-gray-100"
                >
                  <Wallet className="h-5 w-5 mr-3" />
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
                </button>

                <div className="pt-4 border-t">
                  <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Admin Access
                  </h3>
                </div>

                <Link
                  to="/admin/insurance"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <Building2 className="h-5 w-5 mr-3" />
                  Insurance Company Login
                </Link>
                <Link
                  to="/admin/bank"
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Bank Employee Login
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<CustomerView />} />
            <Route path="/policy/:id" element={<PolicyDetails walletAddress={walletAddress} />} />
            <Route path="/admin/insurance" element={<AdminLogin type="insurance" />} />
            <Route path="/admin/bank" element={<AdminLogin type="bank" />} />
            <Route path="/insurance-dashboard" element={<InsurancePolicies />} />
            <Route path="/bank-dashboard" element={<CustomerPolicies />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/:category" element={<CustomerView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;