import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    // 🎯 เป้าหมาย: โอนอำนาจให้กุญแจ 0x9 (เจ้าของคนใหม่)
    const newOwnerAddress = "0x9C3A0a85e533e44281a805851269A9420D7E6ca8"; 

    console.log("🚀 MISSION: TRANSFER POWER TO NEW OWNER (0x9)");
    console.log(`🎯 New Owner: ${newOwnerAddress}`);

    const tokenAddr = process.env.UHU_TOKEN!;
    const complianceAddr = process.env.COMPLIANCE_MODULE!;

    // 1. โอนสิทธิ์ Token (เจาะจง V1 เพื่อเลี่ยง Error HH701)
    const token = await ethers.getContractAt("contracts/UHUToken.sol:UHUToken", tokenAddr);
    console.log("\n📡 Sending Tx: Transfer Token Ownership...");
    const tx1 = await token.transferOwnership(newOwnerAddress);
    await tx1.wait();
    console.log("✅ Token Ownership Transferred Successfully!");

    // 2. โอนสิทธิ์ Compliance 
    const compliance = await ethers.getContractAt("contracts/Compliance.sol:Compliance", complianceAddr);
    console.log("📡 Sending Tx: Transfer Compliance Ownership...");
    const tx2 = await compliance.transferOwnership(newOwnerAddress);
    await tx2.wait();
    console.log("✅ Compliance Ownership Transferred Successfully!");

    console.log("\n🏆 MISSION COMPLETE: กุญแจเก่าถูกปลดระเบิดเรียบร้อยแล้วครับกัปตัน!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});