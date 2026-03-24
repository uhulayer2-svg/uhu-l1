import { ethers } from "hardhat";

async function main() {
  const [proposer] = await ethers.getSigners();
  const timelockAddress = "0x9aAD0ce0A3d89AA2C05997F2dcC961a1B34FCa11";
  const identityRegistryAddress = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef";

  // 1. ระบุ Address ลูกค้าที่ต้องการ Whitelist
  const targetUser = "0x...เลขกระเป๋าลูกค้า..."; 

  console.log("\n📜 --- CREATING GOVERNANCE PROPOSAL --- 📜");

  const registry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);
  const timelock = await ethers.getContractAt("UHUTimelock", timelockAddress);

  // 2. เตรียมข้อมูลธุรกรรม (Encode Function Call)
  const data = registry.interface.encodeFunctionData("addVerified", [targetUser]);

  // 3. ส่งคำร้องเข้า Timelock
  console.log("⏳ Sending Proposal to Timelock...");
  const tx = await timelock.schedule(
    identityRegistryAddress,
    0, // value (ETH)
    data,
    ethers.ZeroHash, // predecessor (ถ้าไม่มีเงื่อนไขก่อนหน้า)
    ethers.id("WHITELIST_USER_V1"), // salt (รหัสอ้างอิง)
    172800 // delay (2 วัน)
  );

  await tx.wait();
  console.log(`✅ Proposal Scheduled! อีก 48 ชม. กัปตันค่อยมาสั่ง Execute นะครับ`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});