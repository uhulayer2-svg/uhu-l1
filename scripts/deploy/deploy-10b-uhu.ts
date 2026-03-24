import { ethers } from "hardhat";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--------------------------------------------------");
    console.log("💰 THE BILLIONAIRE MINT: ISSUING 10B UHU TOKENS");
    console.log(`👤 Issuer Address: ${deployer.address}`);

    // ใช้ Compliance เดิมที่เรา Deploy ไว้แล้ว (หรือสร้างใหม่ถ้าต้องการ)
    const complianceAddr = process.env.COMPLIANCE_MODULE || "0xec144E845E0210e95C03EdDCaecb0555Be7Df02b";

    try {
        console.log("\n🚀 กำลังส่งคำสั่งสร้างเหรียญ 10,000,000,000 UHU...");
        const Token = await ethers.getContractFactory("contracts/UHUToken.sol:UHUToken");
        
        const token = await Token.deploy(complianceAddr);
        await token.waitForDeployment();
        
        const tokenAddr = await token.getAddress();
        const totalSupply = await token.totalSupply();

        console.log("--------------------------------------------------");
        console.log(`✅ SUCCESS! UHU Main Token is LIVE`);
        console.log(`🎯 Token Address: ${tokenAddr}`);
        console.log(`📊 Total Supply: ${ethers.formatUnits(totalSupply, 18)} UHU`);
        console.log("--------------------------------------------------");

        // อัปเดตพิกัดใน .env เป็นตัวจริง
        let envContent = fs.readFileSync(".env", "utf8");
        envContent = envContent.replace(/UHU_TOKEN=.*/, `UHU_TOKEN=${tokenAddr}`);
        fs.writeFileSync(".env", envContent);
        
        console.log("💾 บันทึกที่อยู่เหรียญ 10B ลง .env เรียบร้อย!");

    } catch (error: any) {
        console.error("\n❌ การสร้างเหรียญล้มเหลว:", error.message);
    }
}

main().catch(console.error);