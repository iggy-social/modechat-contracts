// npx hardhat run scripts/nft/early-stakers/earlyStakerNft.deploy.js --network modeMainnet

const data = require("./claimers.json");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const metadataContractName = "EarlyStakerMetadata";
const nftContractName = "EarlyStakerNft";
const claimerContractName = "MerkleClaimerERC721";

// metadata
const description = "Commemorative NFT for early CHIRP stakers on SGB Chat.";
const externalUrl = "https://sgb.chat";
const image = "ipfs://bafybeic3fpbvtqj6kqpu77vy56efkasgbaviguc3qm4jgy3dy7fuk7fire/early-staker-nft-sgb-chat.png";
const mdName = "Early CHIRP Staker";
const video = "ipfs://bafybeibajqsxbuihg4jxsmlnees2gytagp4gqwxr2sielhe2bcbgrjbi2y/early-staker-nft-sgb-chat-2.mp4";

const nftName = "Early CHIRP Staker";
const nftSymbol = "earlyCHIRP";

// create merkle tree
tree = StandardMerkleTree.of(data.claimers, ["address", "uint256"]); // TODO: Make sure you have the right data in claimers.json
const merkleRoot = String(tree.root);

console.log("Merkle root: " + merkleRoot);

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

  // deploy metadata contract
  console.log("Deploying " + metadataContractName + " contract");
  const metadataContract = await ethers.getContractFactory(metadataContractName);
  const metadataInstance = await metadataContract.deploy(
    description,
    externalUrl,
    image,
    mdName,
    video,
    sfsAddress,
    sfsNftTokenId
  );
  await metadataInstance.deployed();

  console.log(metadataContractName + " contract address:", metadataInstance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + metadataInstance.address + ' "' + description + '" "' + externalUrl + '" "' + image + '" "' + mdName + '" "' + video + '" ' + sfsAddress + ' "' + sfsNftTokenId + '"');

  // deploy NFT contract
  console.log("Deploying " + nftContractName + " contract");
  const nftContract = await ethers.getContractFactory(nftContractName);
  const nftInstance = await nftContract.deploy(
    metadataInstance.address,
    nftName,
    nftSymbol,
    sfsAddress,
    sfsNftTokenId
  );
  await nftInstance.deployed();

  console.log(nftContractName + " contract address:", nftInstance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + nftInstance.address + " " + metadataInstance.address + ' "' + nftName + '" "' + nftSymbol + '" ' + sfsAddress + ' "' + sfsNftTokenId + '"');

  // deploy claimer contract
  console.log("Deploying " + claimerContractName + " contract");
  const claimerContract = await ethers.getContractFactory(claimerContractName);
  const claimerInstance = await claimerContract.deploy(
    sfsAddress,
    sfsNftTokenId,
    nftInstance.address,
    merkleRoot
  );
  await claimerInstance.deployed();
  
  console.log(claimerContractName + " contract address:", claimerInstance.address);

  // add minter address to nft contract
  console.log("Adding minter address to " + nftContractName + " contract");
  await nftInstance.changeMinterAddress(claimerInstance.address);

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + claimerInstance.address + " " + sfsAddress + ' "' + sfsNftTokenId + '" ' + nftInstance.address + " " + merkleRoot);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });