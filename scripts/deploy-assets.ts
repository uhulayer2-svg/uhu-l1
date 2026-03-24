import { ethers } from "hardhat";

async function main() {
  // เลข Registry ที่คุมโดยกระเป๋าหลัก 0x2Eeb... ของกัปตัน
  const IDENTITY_REGISTRY = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef"; 
  
  console.log("\n🚀 --- MINTING UHU RWA ARMY (1B SUPPLY EACH) --- 🚀");

  const UHUAsset = await ethers.getContractFactory("UHUAsset");

  // 🥇 1. GUHU (Gold UHU) - ทองคำ
  const guhu = await UHUAsset.deploy("Gold UHU", "GUHU", IDENTITY_REGISTRY);
  await guhu.waitForDeployment();
  console.log(`🥇 GUHU (Gold)      : ${await guhu.getAddress()}`);

  // 🥈 2. SUHU (Silver UHU) - เงิน
  const suhu = await UHUAsset.deploy("Silver UHU", "SUHU", IDENTITY_REGISTRY);
  await suhu.waitForDeployment();
  console.log(`🥈 SUHU (Silver)    : ${await suhu.getAddress()}`);

  // 💎 3. MUHU (Mineral UHU) - แร่ธาตุ
  const muhu = await UHUAsset.deploy("Mineral UHU", "MUHU", IDENTITY_REGISTRY);
  await muhu.waitForDeployment();
  console.log(`💎 MUHU (Mineral)   : ${await muhu.getAddress()}`);

  // 🏠 4. RUHU (Real Estate UHU) - อสังหาฯ
  const ruhu = await UHUAsset.deploy("Real Estate UHU", "RUHU", IDENTITY_REGISTRY);
  await ruhu.waitForDeployment();
  console.log(`🏠 RUHU (Real Estate): ${await ruhu.getAddress()}`);

  // 🤖 5. XUHU (AI Agent X UHU) - AI Agent
  const xuhu = await UHUAsset.deploy("AI Agent X UHU", "XUHU", IDENTITY_REGISTRY);
  await xuhu.waitForDeployment();
  console.log(`🤖 XUHU (AI Agent X) : ${await xuhu.getAddress()}`);

  console.log("\n✅ --- ALL 1B ASSETS ARE NOW IN YOUR MASTER WALLET (0x2Eeb...) --- ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});