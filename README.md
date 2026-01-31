# Agent Trust Score

A decentralized Agent Reputation DApp built for the 0G Hackathon. This application allows users to rate and review AI agents based on their performance, reliability, and trustworthiness.

## Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS
- **Smart Contract**: Solidity 0.8.20 (evmVersion: cancun)
- **Web3**: ethers.js v6
- **Network**: 0G Testnet (Chain ID: 16602)
- **Deployment**: Hardhat

## Features

- Connect wallet via MetaMask
- Query agent reputation scores
- Rate agents with scores from 1-5
- Modern dark UI with smooth animations
- Automatic network switching to 0G Testnet

## Getting Started

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
VITE_CONTRACT_ADDRESS=deployed_contract_address_here
```

**Note**: You can get testnet ETH from the [0G faucet](https://faucet.0g.ai/).

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy Smart Contract

```bash
npm run compile
npm run deploy
```

After deployment, copy the contract address and add it to your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 4. Run Frontend

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Smart Contract Details

The `AgentReputation` contract stores:
- Total score sum for each agent
- Number of ratings received
- Calculated average score (with 2 decimal precision)

### Contract Functions

- `rateAgent(address _agent, uint256 _score)` - Rate an agent (1-5 stars)
- `getReputation(address _agent)` - Get average score and total ratings
- `getRawReputation(address _agent)` - Get raw total score and count

## Network Configuration

- **Network**: 0G Testnet
- **RPC URL**: https://evmrpc-testnet.0g.ai
- **Chain ID**: 16602
- **Explorer**: https://explorer.0g.ai

## Project Structure

```
agent-trust-score/
├── contracts/              # Solidity contracts
│   └── AgentReputation.sol
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── src/                    # React frontend
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── hardhat.config.ts       # Hardhat configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## License

MIT
