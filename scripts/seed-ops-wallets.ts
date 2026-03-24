import { ethers } from "hardhat";

async function main() {
  const [mainWallet] = await ethers.getSigners();

  // 📥 ที่อยู่กระเป๋าใหม่ของกัปตัน
  const relayerAddress = "0x9b60b400866A84E0fD87517a6fa7a97aE758DA0A";
  const distributorAddress = "0x3F1a3435eD959786b1844F34898d8367E73c1C97";

  const seedAmount = ethers.parseEther("10000"); // ใบละ 10,000 Native UHU

  console.log("\n🚀 --- SEEDING UHU OPERATIONAL WALLETS --- 🚀");
  console.log(`👨‍✈️ Main Vault: ${mainWallet.address}`);

  // 1. โอนให้ Relayer (สำหรับจ่ายค่าแก๊สแทน User ในบอท)
  console.log(`⏳ Sending 10,000 UHU to Relayer: ${relayerAddress}...`);
  const tx1 = await mainWallet.sendTransaction({
    to: relayerAddress,
    value: seedAmount,
  });
  await tx1.wait();
  console.log("✅ Relayer: READY!");

  // 2. โอนให้ Distributor (สำหรับโอนเหรียญ RWA ให้ลูกค้า)
  console.log(`⏳ Sending 10,000 UHU to Distributor: ${distributorAddress}...`);
  const tx2 = await mainWallet.sendTransaction({
    to: distributorAddress,
    value: seedAmount,
  });
  await tx2.wait();
  console.log("✅ Distributor: READY!");

  console.log("\n🎯 ทุกหน่วยได้รับกระสุนครบถ้วน พร้อมปฏิบัติการระดับมหาชนครับกัปตัน!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});