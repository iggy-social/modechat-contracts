// 3. Deploy minter contract
// npx hardhat run scripts/post/IggyPostNft1155/3_minter.deploy.js --network modeTestnet

const contractName = "IggyPostMinter";

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 0; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}
const daoAddress = "0x6771F33Cfd8C6FC0A1766331f715f5d2E1d4E0e2"; // distributor contract
const devAddress = "0x6771F33Cfd8C6FC0A1766331f715f5d2E1d4E0e2"; // iggy address
const postAddress = "0x06A7Ab7Bb68b0ad6eB7688C5781E60BE6AFc658d";

const daoFee = 2000; // 10%
const devFee = 0; // 10%
const refFee = 1000; // 10%

const postInterface = new ethers.utils.Interface([
  "function ownerChangeMinterAddress(address _newMinterAddress) external"
]);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    sfsAddress, 
    daoAddress, 
    devAddress,
    sfsNftTokenId, 
    postAddress, 
    daoFee, 
    devFee, 
    refFee
  );

  await instance.deployed();

  console.log("Contract deployed to:", instance.address);

  console.log("Changing minter address in post contract...");

  // change minter address in post contract
  const postContract = new ethers.Contract(postAddress, postInterface, deployer);
  await postContract.ownerChangeMinterAddress(instance.address);

  console.log("Done!");
  
  // verify contracts
  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + " " + daoAddress + " " + devAddress + ' "' + sfsNftTokenId + '" ' + postAddress + ' "' + daoFee + '" "' + devFee + '" "' + refFee + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });