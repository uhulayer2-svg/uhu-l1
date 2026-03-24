import { ethers } from "hardhat";

async function main() {
  // เลข Registry ที่กัปตันเพิ่งสร้างด้วยกระเป๋าใบหลัก 0x2Eeb...
  const IDENTITY_REGISTRY_ADDRESS = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef";
  
  // ใส่เลขกระเป๋าที่กัปตันต้องการให้ "โอนเหรียญได้" (Whitelist)
  const investorAddress = "0x9C3A0a85e533e44281a805851269A9420D7E6ca8"; 

  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const registry = IdentityRegistry.attach(IDENTITY_REGISTRY_ADDRESS) as any;

  console.log(`\n🛡️ --- WHITELISTING INVESTOR --- 🛡️`);
  
  // สั่งลงทะเบียนสิทธิ์ (เรียกใช้ฟังก์ชัน registerIdentity ที่เราเขียนไว้)
  const tx = await registry.registerIdentity(investorAddress, true);
  await tx.wait();

  console.log(`✅ Success! Address ${investorAddress} is now Verified.`);
  console.log(`🔗 Now this wallet can hold and transfer GUHU, SUHU, RUHU, etc.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});