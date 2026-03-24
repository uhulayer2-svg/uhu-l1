import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const masterWallet = "0x9C3A0a85e533e44281a805851269A9420D7E6ca8";

  console.log("\n🚀 --- UHU RE-GENESIS START --- 🚀");
  console.log(`👨‍✈️ Deploying with: ${deployer.address}`);
  
  const UHUToken = await ethers.getContractFactory("UHUToken");
  
  // ส่ง masterWallet เข้าไปเป็นค่าเริ่มต้นของ Compliance
  const token = await UHUToken.deploy(masterWallet); 
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  
  console.log("\n✨ --- DEPLOYMENT SUCCESS --- ✨");
  console.log(`💎 New Token Address: ${tokenAddress}`);
  console.log(`👑 Owner/Compliance:  ${masterWallet}`);
  console.log(`💰 Total Supply:      10,000,000,000 UHU`);
  console.log("-----------------------------------\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});