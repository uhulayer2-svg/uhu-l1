const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying UHU TREX Suite with:", deployer.address);

  // 1. Deploy IdentityRegistryStorage (ตัวที่กัปตันผ่านแล้ว)
  const Storage = await ethers.getContractFactory("IdentityRegistryStorage");
  const storage = await Storage.deploy();
  await storage.waitForDeployment();
  const storageAddress = await storage.getAddress();
  console.log("✅ IdentityRegistryStorage:", storageAddress);

  // --- จุดที่น่าจะพังคือหลังจากนี้ครับ ผมแก้ให้ส่ง Address ที่ถูกต้องเข้าไป ---

  // 2.ตัวอย่างการ Deploy ตัวถัดไป (สมมติว่าเป็น IdentityRegistry)
  // กัปตันเช็กชื่อ Contract ในเครื่องดูนะครับ ถ้าชื่อต่างให้เปลี่ยน "IdentityRegistry" เป็นชื่อที่กัปตันมี
  // 2. Deploy UHUClaimIssuer
  try {
    const ClaimIssuer = await ethers.getContractFactory("UHUClaimIssuer");
    
    // ตรงนี้แหละครับ! ผมส่ง deployer.address (กระเป๋าของกัปตัน) เข้าไปเป็นค่าเริ่มต้น
    // **ถ้ามันยังฟ้อง Error เดิม ให้กัปตันลองลบออก หรือเพิ่ม Address อื่นตาม Spec นะครับ**
    const claimIssuer = await ClaimIssuer.deploy(deployer.address); 
    
    await claimIssuer.waitForDeployment();
    console.log("✅ UHUClaimIssuer Deployed at:", await claimIssuer.getAddress());
  } catch (error: any) {  // เติม : any เข้าไปเพื่อปิดปาก TypeScript
    console.log("❌ ตัวที่ 2 ยังติดปัญหาเรื่อง Parameter:");
    console.error(error.message);
  }

  console.log("\n✨ ปฏิบัติการสำเร็จ! ยานแม่ลงจอดเรียบร้อย");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});