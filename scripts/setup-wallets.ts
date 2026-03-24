import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 📥 กัปตันวาง Address กระเป๋าใหม่ที่สร้างเมื่อกี้ตรงนี้ครับ
  const relayerAddress = "0x...Address_กระเป๋า_Relayer..."; 
  const distributorAddress = "0x...Address_กระเป๋า_Distributor...";

  const amount = ethers.parseEther("10000"); // ใบละ 10,000 Native UHU

  console.log("\n🚀 --- SEEDING OPERATIONAL WALLETS --- 🚀");

  // โอนให้ Relayer (คนยิงคำสั่งบอท)
  console.log(`⏳ Sending to Relayer: ${relayerAddress}`);
  const tx1 = await deployer.sendTransaction({ to: relayerAddress, value: amount });
  await tx1.wait();
  console.log("✅ Relayer Seeding Complete!");

  // โอนให้ Distributor (คนถือเหรียญโอนให้ลูกค้า)
  console.log(`⏳ Sending to Distributor: ${distributorAddress}`);
  const tx2 = await deployer.sendTransaction({ to: distributorAddress, value: amount });
  await tx2.wait();
  console.log("✅ Distributor Seeding Complete!");

  console.log("\n🎯 ทุกกระเป๋าพร้อมรบแล้วครับกัปตัน!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});