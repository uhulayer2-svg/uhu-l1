import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const timelockAddress = "0x9aAD0ce0A3d89AA2C05997F2dcC961a1B34FCa11"; // เลข Timelock ที่เราเพิ่ง Deploy

  console.log("\n👑 --- TRANSFERRING OWNERSHIP TO TIMELOCK --- 👑");
  console.log(`👨‍✈️ Current Owner: ${deployer.address}`);
  console.log(`🏛️ New Owner (Timelock): ${timelockAddress}`);

  // รายชื่อสัญญาที่เราต้องโอนสิทธิ์ให้ Timelock คุม
  const targetContracts = [
    { name: "IdentityRegistry", address: "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef" },
    { name: "GUHU (Gold)", address: "0x73B9b3Ac81490459BcDe5B15c289DDAAd0A854b6" },
    { name: "SUHU (Silver)", address: "0x26bD22D072CC1F0A3a80f831f8f08AcF81D7bbCc" },
    { name: "MUHU (Mineral)", address: "0x183178fe4e9b6A4a4d1AE9Cf962FA60F23482e30" },
    { name: "RUHU (Real Estate)", address: "0xFd7f1f8962aAb02B98CC679dE1027fe8C1980b5C" },
    { name: "XUHU (AI Agent)", address: "0x83A89a32A7c2E82De060301A1cA2962e73f87F2f" },
    { name: "GasSponsor", address: "0xF7a143cBc57f0AD75cD30EE8dFba7F143fD278Bd" }
  ];

  for (const contractInfo of targetContracts) {
    console.log(`\n⏳ Transferring ${contractInfo.name}...`);
    const contract = await ethers.getContractAt("Ownable", contractInfo.address);
    
    const tx = await contract.transferOwnership(timelockAddress);
    await tx.wait();
    
    console.log(`✅ ${contractInfo.name} is now governed by Timelock!`);
  }

  console.log("\n🚀 ทุกฟันเฟืองถูกเชื่อมต่อเข้ากับระบบ Governance เรียบร้อยครับกัปตัน!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});