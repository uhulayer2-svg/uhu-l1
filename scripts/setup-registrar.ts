import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const identityRegistryAddress = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef";

  console.log("\n🖋️ --- SETTING UP FAST-TRACK REGISTRAR --- 🖋️");

  const registry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);

  // หมายเหตุ: ถ้ากัปตันโอน Ownership ให้ Timelock ไปแล้ว 
  // การรันสคริปต์นี้ต้องทำผ่าน Proposal ใน Timelock (รอ 2 วันเป็นครั้งสุดท้าย)
  // เพื่อแต่งตั้ง "นายทะเบียนด่วน" อย่างเป็นทางการครับ
  console.log(`⏳ ส่งคำร้องแต่งตั้ง ${deployer.address} เป็นนายทะเบียน...`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});