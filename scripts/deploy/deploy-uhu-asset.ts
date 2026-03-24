import { ethers } from "hardhat";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("--------------------------------------------------");
    console.log("🪙 PHASE 2: DEPLOYING UHU ASSET (CUSTOM CONTRACT)");
    console.log(`👤 Deployer: ${deployer.address}`);

    // ดึงค่า Compliance ที่เรา Deploy สำเร็จไปแล้วเมื่อกี้
    // ถ้ากัปตันยังไม่ได้แก้ .env ให้ใส่ค่าตรงๆ ไปก่อนได้ครับ
    const complianceAddr = "0xec144E845E0210e95C03EdDCaecb0555Be7Df02b";

    try {
        // 1. Deploy Token (ใช้ชื่อตามที่ Hardhat เจอ: UHUToken)
        console.log("\n🪙 Minting UHU Token...");
        const Token = await ethers.getContractFactory("contracts/UHUToken.sol:UHUToken");
        
        /**
         * ตาม Solidity: constructor(string memory _name, string memory _symbol, address _compliance)
         * ส่งไปแค่ 3 ตัวครับกัปตัน!
         */
        const token = await Token.deploy(
            "UHU Digital Asset", // _name
            "UHU",               // _symbol
            complianceAddr       // _compliance
        );

        await token.waitForDeployment();
        const tokenAddr = await token.getAddress();

        console.log("--------------------------------------------------");
        console.log(`🎯 UHU TOKEN ADDR: ${tokenAddr}`);
        console.log(`🛡️ COMPLIANCE ADDR: ${complianceAddr}`);
        console.log("--------------------------------------------------");

        // 2. บันทึกลง .env
        let envContent = fs.readFileSync(".env", "utf8");
        const updates = `\nUHU_TOKEN=${tokenAddr}\nCOMPLIANCE_MODULE=${complianceAddr}`;
        fs.appendFileSync(".env", updates);
        console.log("💾 บันทึกพิกัดลง .env เรียบร้อย!");

        console.log("\n🎊 ยินดีด้วยครับกัปตัน! เหรียญ UHU 1,000,000 เหรียญแรกอยู่ในกระเป๋าแล้ว!");

    } catch (error: any) {
        console.error("\n❌ เกิดข้อผิดพลาดตอนเสกเหรียญ:");
        console.error(error.message);
    }
}

main().catch(console.error);