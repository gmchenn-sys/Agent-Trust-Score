const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AgentReputation contract to 0G Testnet...");

  // Get the contract factory
  const AgentReputation = await ethers.getContractFactory("AgentReputation");

  // Deploy the contract
  const agentReputation = await AgentReputation.deploy();

  // Wait for the deployment to be confirmed
  await agentReputation.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await agentReputation.getAddress();

  console.log("==========================================");
  console.log("Deployment successful!");
  console.log("==========================================");
  console.log("Contract Address:", contractAddress);
  console.log("==========================================");
  console.log("Please save this address for your frontend configuration.");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
