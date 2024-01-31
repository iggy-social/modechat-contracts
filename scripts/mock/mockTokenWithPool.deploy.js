// npx hardhat run scripts/mock/mockTokenWithPool.deploy.js --network modeTestnet

const contractName = "MockErc20TokenDecimals";

const tokenName = "Test Token";
const symbol = "TEST";
const decimals = 18;

const routerAddress = "0x5951479fE3235b689E392E9BC6E968CE10637A52";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    tokenName, symbol, decimals
  );
  
  console.log(contractName + " contract address:", instance.address);

  // mint a million tokens
  console.log("Minting a million tokens...");
  const tx1 = await instance.mint(deployer.address, ethers.utils.parseEther("1000000"));
  await tx1.wait();

  // create a uniswap v2 router instance
  console.log("Creating a uniswap v2 router instance...");
  const routerInterface = new ethers.utils.Interface([
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
  ]);
  const routerContract = new ethers.Contract(routerAddress, routerInterface, deployer);

  // give token approval to router
  console.log("Giving router approval to spend tokens...");
  const tx2 = await instance.approve(routerAddress, ethers.utils.parseEther("1000000"));
  await tx2.wait();

  // add liquidity
  console.log("Adding liquidity...");
  const tx3 = await routerContract.addLiquidityETH(
    instance.address, // token address
    ethers.utils.parseEther("1000000"), // amountTokenDesired
    ethers.utils.parseEther("1000000"), // amountTokenMin
    ethers.utils.parseEther("0.1"), // amountETHMin
    deployer.address, // to
    9999999999, // deadline
    {value: ethers.utils.parseEther("0.1")} // value
  );
  await tx3.wait();

  console.log("Wait a minute and then run this command to verify contracts on block explorer:");
  console.log("npx hardhat verify --network " + network.name + " " + instance.address + ' "' + tokenName + '" "' + symbol + '" "' + decimals + '"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });