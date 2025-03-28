import { ethers } from 'ethers';

// Contract ABIs would be imported here in production
// import BankAssuranceABI from '../contracts/abis/BankAssurance.json';
// import PolicyManagerABI from '../contracts/abis/PolicyManager.json';
// import ClaimProcessorABI from '../contracts/abis/ClaimProcessor.json';
// import DisputeResolverABI from '../contracts/abis/DisputeResolver.json';

// Mock contract addresses - in production these would be actual deployed contract addresses
const CONTRACT_ADDRESSES = {
  bankAssurance: '0x1234567890123456789012345678901234567890',
  policyManager: '0x2345678901234567890123456789012345678901',
  claimProcessor: '0x3456789012345678901234567890123456789012',
  disputeResolver: '0x4567890123456789012345678901234567890123'
};

export async function requestSignature(message: string): Promise<string> {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
}

export async function sendTransaction(amountUSD: number): Promise<string> {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    // Convert USD to ETH (using a mock rate of 1 ETH = $2000 USD)
    // In production, you would get this rate from an oracle or price feed
    const ETH_USD_RATE = 2000;
    const ethAmount = amountUSD / ETH_USD_RATE;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESSES.policyManager, // In production, send to the actual contract
      value: ethers.parseEther(ethAmount.toFixed(18))
    });

    return tx.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

// These functions would be implemented in production to interact with the smart contracts
export const contractInteractions = {
  async createPolicy(customer: string, premium: number, coverage: number, duration: number) {
    // Implementation would use ethers.js to interact with PolicyManager contract
    console.log('Creating policy...', { customer, premium, coverage, duration });
  },

  async processClaim(policyId: number, amount: number, reason: string, evidence: string) {
    // Implementation would use ethers.js to interact with ClaimProcessor contract
    console.log('Processing claim...', { policyId, amount, reason, evidence });
  },

  async fileDispute(claimId: number, reason: string, evidence: string) {
    // Implementation would use ethers.js to interact with DisputeResolver contract
    console.log('Filing dispute...', { claimId, reason, evidence });
  }
};