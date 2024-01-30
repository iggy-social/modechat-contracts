// 1. Deploy FriendKeys contract and automatically add it's address to the Stats middleware contract.
// npx hardhat run scripts/keys/1_friendKeys.deploy.js --network modeTestnet

const contractName = "FriendKeys";

const tldAddress = "";
const feeReceiver = "0xf0b0D10BE9fb96D139090cfeD4124b74c4D2217B"; // distributor contract address
const statsAddress = ""; // stats middleware contract address

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 0; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}

const protocolFeePercent = ethers.utils.parseEther("0.05"); // 1 is 100%
const domainHolderFeePercent = ethers.utils.parseEther("0.05"); // 1 is 100%
const ratio = ethers.utils.parseEther("69"); // 1 ETH for 16000 keys

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    tldAddress, 
    feeReceiver,
    statsAddress,
    sfsAddress,
    sfsNftTokenId,
    protocolFeePercent,
    domainHolderFeePercent,
    ratio
  );

  await instance.deployed();
  
  console.log(contractName + " contract address:", instance.address);

  // add this address to the Stats middleware contract
  console.log("Adding this address to the stats middleware contract:");
  const statsContract = await ethers.getContractFactory("StatsMiddleware");
  const statsInstance = await statsContract.attach(statsAddress);
  const tx1 = await statsInstance.addWriter(instance.address);
  await tx1.wait();
  console.log("Done!");

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + tldAddress + " " + feeReceiver + " " + statsAddress + " " + sfsAddress + ' "' + sfsNftTokenId + '" "' + protocolFeePercent + '" "' + domainHolderFeePercent + '" "' + ratio + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });