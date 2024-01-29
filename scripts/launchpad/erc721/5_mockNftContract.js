// If verifying contract via step 3 does not work, use this script instead
// 5. Deploy mock/test Nft721Bonding contract so that others created through factory can get auto-verified.
// npx hardhat run scripts/launchpad/erc721/5_mockNftContract.js --network modeTestnet

const contractName = "Nft721Bonding";

const factoryAddress = "";
const metadataAddress = "";
const mintingFeeReceiver = "";
const cName = "Test collection";
const cSymbol = "TEST";
const mintingFeePercentage = ethers.utils.parseEther("0.02");
const ratio = ethers.utils.parseEther("1");

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    deployer.address,
    cName,
    cSymbol,
    ratio
  );
  await instance.deployed();
  
  console.log(contractName + " contract address:", instance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + " " + deployer.address + ' "' + cName + '" "' + cSymbol + '" "' + ratio + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });