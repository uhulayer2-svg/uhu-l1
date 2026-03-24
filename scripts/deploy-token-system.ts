import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--------------------------------------------------");
    console.log("🚀 PHASE 2: DEPLOYING COMPLIANCE & UHU TOKEN");
    console.log(`👤 Deployer: ${deployer.address}`);

    // 1. ดึงข้อมูลจากระบบเดิมที่กัปตันทำไว้
    const identityRegistryAddr = process.env.IDENTITY_REGISTRY;
    if (!identityRegistryAddr) throw new Error("❌ ไม่พบ IDENTITY_REGISTRY ใน .env");

    // 2. Deploy ModularCompliance (หัวใจของกฎระเบียบ)
    console.log("\n📡 Installing ModularCompliance (The Policy Engine)...");
    const Compliance = await ethers.getContractFactory("ModularCompliance");
    const compliance = await Compliance.deploy();
    await compliance.waitForDeployment();
    const complianceAddr = await compliance.getAddress();
    console.log(`✅ Compliance Module Deployed at: ${complianceAddr}`);

    // 3. Deploy UHU Token (ตัวเหรียญ RWA)
    console.log("\n🪙 Minting UHU Token (ERC-3643 Asset)...");
    const Token = await ethers.getContractFactory("Token");
    
    /**
     * Constructor Token(identityRegistry, compliance, name, symbol, decimals, onchainID)
     * หมายเหตุ: identityRegistryAddr ต้องผ่านการ Register ใน Trusted Issuers แล้ว
     */
    const token = await Token.deploy(
        identityRegistryAddr,
        complianceAddr,
        "UHU L1 Asset", // ชื่อเหรียญ
        "UHU",          // สัญลักษณ์
        18,             // Decimals
        ethers.ZeroAddress // ONCHAINID (ใช้ Zero ไปก่อนสำหรับ Devnet)
    );

    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();

    console.log("--------------------------------------------------");
    console.log(`🎯 UHU TOKEN ADDR: ${tokenAddr}`);
    console.log(`🛡️ COMPLIANCE ADDR: ${complianceAddr}`);
    console.log("--------------------------------------------------");

    // 4. บันทึกลง .env อัตโนมัติ
    let envContent = fs.readFileSync(".env", "utf8");
    const updates = `\nUHU_TOKEN=${tokenAddr}\nCOMPLIANCE_MODULE=${complianceAddr}`;
    
    // ป้องกันการบันทึกซ้ำ
    if (!envContent.includes("UHU_TOKEN=")) {
        fs.appendFileSync(".env", updates);
        console.log("💾 บันทึกพิกัดใหม่ลง .env เรียบร้อย!");
    } else {
        console.log("⚠️ มีข้อมูล Token ใน .env อยู่แล้ว โปรดเช็คด้วยตนเอง");
    }

    console.log("\n💡 กัปตันครับ! เหรียญถูกเสกขึ้นมาแล้ว!");
    console.log("👮 ขั้นตอนถัดไป: เราต้องทำการ Bind (ผูก) กฎ KYC เข้ากับ Compliance นี้ครับ");
}

main().catch(console.error);