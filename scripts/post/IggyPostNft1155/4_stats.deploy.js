// 4. Deploy stats contract
// npx hardhat run scripts/post/IggyPostNft1155/4_stats.deploy.js --network modeMainnet

const contractName = "IggyPostStats";

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}
const minterAddress = "0x2F103ec022a1d99291077a082b2DC24C734E58A3";
const shouldStatsBeEnabled = true;

const minterInterface = new ethers.utils.Interface([
  "function changeStatsAddress(address _statsAddress) external",
  "function statsEnabled() external view returns (bool)",
  "function toggleStatsEnabled() external"
]);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(sfsAddress, sfsNftTokenId, minterAddress);

  await instance.deployed();

  console.log(contractName + " contract deployed to:", instance.address);

  console.log("Changing stats address in minter contract...");

  // add stats address to minter contract
  const minterContract = new ethers.Contract(minterAddress, minterInterface, deployer);
  const changeStatsAddrTx = await minterContract.changeStatsAddress(instance.address);
  await changeStatsAddrTx.wait();

  console.log("Done!");

  console.log("Changing statsEnabled in minter contract...");

  // enable/disable stats
  const isStatsEnabled = await minterContract.statsEnabled();

  if (isStatsEnabled && !shouldStatsBeEnabled) {
    await minterContract.toggleStatsEnabled();
  } else if (!isStatsEnabled && shouldStatsBeEnabled) {
    await minterContract.toggleStatsEnabled();
  }

  console.log("Done!");

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + ' "' + sfsNftTokenId + '" ' + minterAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });