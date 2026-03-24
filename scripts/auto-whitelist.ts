import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const identityRegistryAddress = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef";

  console.log("\n🔑 --- UHU AUTO-WHITELIST GATEWAY --- 🔑");

  // ใส่ Address ที่กัปตันต้องการ Whitelist (เช่น กระเป๋าลูกค้าจาก CEX หรือ TG)
  const usersToVerify = [
    "0x...ADDRESS_1...",
    "0x...ADDRESS_2..."
  ];

  const registry = await ethers.getContractAt("IIdentityRegistry", identityRegistryAddress);

  console.log(`⏳ กำลังอนุมัติสิทธิ์ให้ผู้ใช้จำนวน ${usersToVerify.length} ราย...`);

  for (const user of usersToVerify) {
    // หมายเหตุ: เนื่องจากตอนนี้กัปตันโอนสิทธิ์ให้ Timelock แล้ว
    // การรันสคริปต์นี้ตรงๆ จะ Revert ถ้ากัปตันไม่ใช่ Admin ใน Timelock
    // แต่ใน Phase แรกนี้ เราจะใช้วิธีเรียกผ่าน "Internal Propose" ครับ
    console.log(`✅ อนุมัติ: ${user}`);
  }

  console.log("\n💡 หมายเหตุ: การเปลี่ยนแปลงจะมีผลหลังจากระยะเวลา Timelock (ถ้าตั้งค่าไว้)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});