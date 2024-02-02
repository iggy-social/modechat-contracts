// 3. Deploy minter contract
// npx hardhat run scripts/post/IggyPostNft1155/3_minter.deploy.js --network modeMainnet

const contractName = "IggyPostMinter";

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 286; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}
const daoAddress = "0x20aeB41bCfaFb05b580dB2f687123eDa605315Ed"; // distributor contract
const devAddress = "0xb29050965A5AC70ab487aa47546cdCBc97dAE45D"; // iggy address
const postAddress = "0x5e54CebB2612744cB56547bC7CC41466ad7ac557";

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