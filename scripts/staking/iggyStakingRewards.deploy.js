// npx hardhat run scripts/staking/iggyStakingRewards.deploy.js --network modeMainnet
const contractName = "IggyStakingRewards";

const assetAddress = ""; // token to stake
const wethAddress = ""; // wrapped native coin (WETH)
const tokenName = "ModeChat Governance Token";
const symbol = "MCG";
const claimRewardsMinimum = ethers.utils.parseEther("0.001"); // minimum total reward for a given week (if not met, rewards are rolled over to the next week)
const minDeposit = 1; // 1 wei LP tokens minimum deposit to stake
const periodLength = 604800; // 7 days

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    assetAddress, 
    wethAddress, 
    tokenName, 
    symbol, 
    claimRewardsMinimum, 
    minDeposit, 
    periodLength,
    sfsAddress,
    sfsNftTokenId
  );
  
  console.log(contractName + " contract address:", instance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + assetAddress + " " + wethAddress + ' "' + tokenName + '" "' + symbol + '" "' + claimRewardsMinimum + '" "' + minDeposit + '" "' + periodLength + '" ' + sfsAddress + ' "' + sfsNftTokenId + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });