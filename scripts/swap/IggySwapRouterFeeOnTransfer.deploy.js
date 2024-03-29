// npx hardhat run scripts/swap/IggySwapRouterFeeOnTransfer.deploy.js --network modeMainnet

const contractName = "IggySwapRouterFeeOnTransfer";

const iggyAddress = "0x20aeB41bCfaFb05b580dB2f687123eDa605315Ed"; // mandatory (distributor)
const routerAddress = "0x5d61c537393cf21893be619e36fc94cd73c77dd3"; // mandatory
const frontendAddress = ethers.constants.AddressZero; // optional
const stakingAddress = ethers.constants.AddressZero; // optional
const statsAddress = "0xb29e981343daa6ea18D58cdB0800DFE962aA53e4"; // stats middleware address (optional)
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

const swapFee = 80; // 0.8%
const stakingShare = 4000; // bps
const frontendShare = 4000; // bps

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";

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
    frontendAddress,
    iggyAddress,
    routerAddress,
    stakingAddress,
    statsAddress,
    sfsAddress,
    sfsNftTokenId,
    swapFee,
    stakingShare,
    frontendShare
  );

  await instance.deployed();
  
  console.log(contractName + " contract address:", instance.address);

  // add this address to the Stats middleware contract
  if (statsAddress != ethers.constants.AddressZero) {
    console.log("Adding this address to the stats middleware contract:");
    const statsContract = await ethers.getContractFactory("StatsMiddleware");
    const statsInstance = await statsContract.attach(statsAddress);
    const tx1 = await statsInstance.addWriter(instance.address);
    await tx1.wait();
    console.log("Done!");
  }

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log(
    "npx hardhat verify --network " + network.name + " " + instance.address + " " + frontendAddress + " " + 
    iggyAddress + " " + routerAddress + " " + stakingAddress + " " + statsAddress + " " + sfsAddress + ' "' + sfsNftTokenId + '" "' + swapFee + '" "' + stakingShare + '" "' + frontendShare + '"'
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });