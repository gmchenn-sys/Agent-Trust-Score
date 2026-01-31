import { useState } from 'react';
import { ethers } from 'ethers';
import { Star, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import './index.css';

// Contract ABI - only the functions we need
const CONTRACT_ABI = [
  "function rateAgent(address _agent, uint256 _score) public",
  "function getReputation(address _agent) public view returns (uint256 averageScore, uint256 totalRatings)",
];

// Update this after deployment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

// 0G Testnet configuration
const CHAIN_ID = 16602;
const RPC_URL = "https://evmrpc-testnet.0g.ai";

function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentAddress, setAgentAddress] = useState<string>('');
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application.');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setWalletAddress(accounts[0]);

      // Check and switch to 0G Testnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: '0G Testnet',
                nativeCurrency: {
                  name: '0G',
                  symbol: '0G',
                  decimals: 18,
                },
                rpcUrls: [RPC_URL],
                blockExplorerUrls: ['https://explorer.0g.ai'],
              }],
            });
          }
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Get reputation
  const getReputation = async () => {
    if (!agentAddress) {
      alert('Please enter an agent address.');
      return;
    }

    if (!CONTRACT_ADDRESS) {
      alert('Contract address not configured. Please deploy the contract first and set VITE_CONTRACT_ADDRESS in .env.');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const [avgScore, ratings] = await contract.getReputation(agentAddress);

      setAverageScore(Number(avgScore) / 100); // Convert back from 100x multiplier
      setTotalRatings(Number(ratings));
    } catch (error) {
      console.error('Error getting reputation:', error);
      alert('Failed to get reputation. Please check the agent address.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rate agent
  const rateAgent = async (score: number) => {
    if (!agentAddress) {
      alert('Please enter an agent address first.');
      return;
    }

    if (!CONTRACT_ADDRESS) {
      alert('Contract address not configured. Please deploy the contract first and set VITE_CONTRACT_ADDRESS in .env.');
      return;
    }

    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    setSelectedScore(score);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.rateAgent(agentAddress, score);
      setTxHash(tx.hash);

      await tx.wait();

      alert('Rating submitted successfully!');
      // Refresh reputation after rating
      await getReputation();
      setTxHash('');
    } catch (error) {
      console.error('Error rating agent:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedScore(null);
    }
  };

  // Render stars
  const renderStars = (score: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  // Render rating buttons
  const renderRatingButtons = () => {
    return [1, 2, 3, 4, 5].map((score) => (
      <button
        key={score}
        onClick={() => rateAgent(score)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          selectedScore === score
            ? 'bg-primary text-white scale-105'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Star className="w-5 h-5 fill-current" />
        {score}
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Agent Trust Score
            </h1>
          </div>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primaryHover rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : walletAddress ? (
              <>
                <CheckCircle className="w-4 h-4" />
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Build Trust in the{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Agent Ecosystem
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Rate and review AI agents based on their performance, reliability, and trustworthiness.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent Address
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={agentAddress}
                onChange={(e) => setAgentAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              />
              <button
                onClick={getReputation}
                disabled={isLoading}
                className="px-6 py-3 bg-secondary hover:bg-cyan-600 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Reputation'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {averageScore !== null && (
            <div className="mb-8 p-6 bg-gray-900/50 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Reputation Score</h3>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {averageScore.toFixed(2)}
                </div>
                <div className="flex gap-1">
                  {renderStars(averageScore)}
                </div>
              </div>
              <p className="text-gray-400 mt-2">
                Based on {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Rating Section */}
          {averageScore !== null && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Rate This Agent</h3>
              <div className="flex flex-wrap gap-3">
                {renderRatingButtons()}
              </div>
              <p className="text-gray-500 text-sm mt-3">
                Click a star to rate from 1 (poor) to 5 (excellent)
              </p>
            </div>
          )}

          {/* Transaction Status */}
          {txHash && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-gray-300">
                  Transaction pending...
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 break-all">
                {txHash}
              </p>
            </div>
          )}
        </div>

        {/* Contract Info */}
        {CONTRACT_ADDRESS && (
          <div className="max-w-3xl mx-auto mt-6 text-center text-sm text-gray-500">
            Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          Built for 0G Hackathon | Powered by Ethereum & 0G Network
        </div>
      </footer>
    </div>
  );
}

export default App;
