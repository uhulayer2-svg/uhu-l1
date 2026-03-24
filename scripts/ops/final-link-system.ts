import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--------------------------------------------------");
    console.log("🔗 FINAL STEP: BINDING TOKEN TO COMPLIANCE");

    // ดึงค่าจาก .env
    const tokenAddr = process.env.UHU_TOKEN || "0x81E25f660Df93DfdaEf332AAcCb75e85f2C918BA";
    const complianceAddr = "0xec144E845E0210e95C03EdDCaecb0555Be7Df02b";

    console.log(`🪙  Target Token: ${tokenAddr}`);
    console.log(`🛡️   Policy Engine: ${complianceAddr}`);

    try {
        // เชื่อมต่อกับสัญญา Compliance
        const Compliance = await ethers.getContractAt("contracts/Compliance.sol:Compliance", complianceAddr);
        
        console.log("\n📡 กำลังทำพิธี Bind Token เข้ากับ Compliance...");
        
        // เรียกใช้ฟังก์ชันที่เราสแกนเจอ!
        const tx = await Compliance.bindToken(tokenAddr);
        await tx.wait();

        console.log("✅ Bind Token สำเร็จ!");

        // ตรวจสอบสถานะ
        const isBound = await Compliance.isTokenBound();
        const boundToken = await Compliance.token();

        console.log("--------------------------------------------------");
        console.log(`📊 Status: ${isBound ? "CONNECTED ✅" : "FAILED ❌"}`);
        console.log(`🔗 Bound to: ${boundToken}`);
        console.log("--------------------------------------------------");
        console.log("🏆 ยินดีด้วยกัปตัน! ระบบนิเวศ UHU-L1 สมบูรณ์ 100% แล้วครับ!");

    } catch (error: any) {
        console.error("\n❌ เกิดข้อผิดพลาดตอน Binding:");
        console.error(error.message);
    }
}

main().catch(console.error);