import { ethers } from "hardhat";

async function main() {
  const [proposer] = await ethers.getSigners();
  const timelockAddress = "0x9aAD0ce0A3d89AA2C05997F2dcC961a1B34FCa11";
  const targetContract = "0x79B49F563661AB4e288Ddae2aAbE6642820b39ef"; // ตัวอย่าง: IdentityRegistry

  console.log("\n📜 --- PROPOSING OWNERSHIP RECLAIM --- 📜");

  const timelock = await ethers.getContractAt("UHUTimelock", timelockAddress);
  const contractInstance = await ethers.getContractAt("Ownable", targetContract);

  // เตรียมคำสั่ง: ให้ Timelock โอนสิทธิ์กลับมาที่กัปตัน
  const data = contractInstance.interface.encodeFunctionData("transferOwnership", [proposer.address]);

  const tx = await timelock.schedule(
    targetContract,
    0,
    data,
    ethers.ZeroHash,
    ethers.id("RECLAIM_OWNERSHIP_V1"),
    172800 // 2 วัน
  );

  await tx.wait();
  console.log(`✅ ส่งคำร้องขอคืนสิทธิ์แล้ว! อีก 48 ชม. กัปตันจะกลับมาสั่งการได้ทันทีครับ`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});