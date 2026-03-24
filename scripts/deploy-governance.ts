import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n🏛️ --- DEPLOYING UHU GOVERNANCE (TIMELOCK) --- 🏛️");
  console.log(`👨‍✈️ Admin: ${deployer.address}`);

  // การตั้งค่าระดับสถาบัน
  const minDelay = 172800; // 2 วัน (สร้างความเชื่อมั่นให้นักลงทุน)
  const proposers = [deployer.address]; // กระเป๋าหลัก 0x2Eeb... ของกัปตันเป็นคนเสนอ
  const executors = [deployer.address]; // กระเป๋าหลักเป็นคนกดรัน (ในอนาคตเปลี่ยนเป็น Multisig ได้)
  const admin = deployer.address;

  const UHUTimelock = await ethers.getContractFactory("UHUTimelock");
  const timelock = await UHUTimelock.deploy(minDelay, proposers, executors, admin);

  await timelock.waitForDeployment();
  console.log(`✅ Timelock Deployed at: ${await timelock.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});