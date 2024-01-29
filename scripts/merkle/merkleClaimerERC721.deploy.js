// npx hardhat run scripts/merkle/merkleClaimerERC721.deploy.js --network modeTestnet

const data = require("./claimers.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const contractName = "MerkleClaimerERC721";
const nftContractName = "EarlyStakerNft"; // TODO: Update this contract name

const nftAddress = ""; // TODO: address of deployed nft contract

const sfsAddress = (network.name == "modeTestnet") ? "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6" : "0x8680CEaBcb9b56913c519c069Add6Bc3494B7020";
const sfsNftTokenId = 0; // TODO: Enter SFS NFT token ID!!!

if (sfsNftTokenId == 0) {
  console.log("Please enter SFS NFT token ID!!!");
  return;
}

// create merkle tree
tree = StandardMerkleTree.of(data.claimers, ["address", "uint256"]); // TODO: Make sure you have the right data in claimers.json
const merkleRoot = String(tree.root);

console.log("Merkle root: " + merkleRoot);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    sfsAddress,
    sfsNftTokenId,
    nftAddress,
    merkleRoot
  );
  
  console.log(contractName + " contract address:", instance.address);

  // add minter address to nft contract
  const nftContract = await ethers.getContractFactory(nftContractName);
  const nftInstance = await nftContract.attach(nftAddress);

  await nftInstance.changeMinterAddress(instance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + " " + sfsAddress + " " + ' "' + sfsNftTokenId + '" ' + nftAddress + " " + merkleRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });