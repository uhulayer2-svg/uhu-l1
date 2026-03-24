import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// 0. โหลดค่าคอนฟิก
dotenv.config();

async function main() {
    // ดึงค่าจาก .env
    const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545"; // ใส่ Default ไว้กันพัง
    const pk = process.env.PRIVATE_KEY;
    
    if (!pk) throw new Error("❌ ไม่พบ PRIVATE_KEY ใน .env");
    const privateKey = pk.startsWith("0x") ? pk : `0x${pk}`;

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey);

    console.log("--------------------------------------------------");
    console.log("🚀 เข้าสู่โหมด: THE NUCLEAR DEPLOY (UHU Identity Registry)");
    console.log(`👤 Deployer: ${wallet.address}`);

    // 1. โหลด Artifact (เช็ค Path ให้ชัวร์นะครับกัปตัน)
    const artifactPath = path.join("E:", "UHU-L1", "artifacts", "contracts", "TREX", "IdentityRegistry.sol", "IdentityRegistry.json");
    
    if (!fs.existsSync(artifactPath)) {
        throw new Error(`❌ ไม่พบไฟล์ Artifact ที่: ${artifactPath}`);
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // 2. เตรียม Constructor Arguments
    // ใช้ Address จาก .env ถ้าไม่มีให้ใช้ ZeroAddress (เพื่อไม่ให้ Transaction พัง)
    const claimTopics = process.env.CLAIM_TOPICS_REGISTRY || ethers.ZeroAddress;
    const trustedIssuers = process.env.TRUSTED_ISSUERS_REGISTRY || "0xE5DafB9EBfe90272209DAd6F21e8E3853eA82b36"; // ใช้ UHUClaimIssuer ที่เราเพิ่งทำ
    const storageAddress = process.env.IDENTITY_STORAGE || "0x95CBc0ce375A59BF49d56639801d5944ff354343";
    const owner = wallet.address;

    console.log("📦 Constructor Params:");
    console.log(`   - ClaimTopics: ${claimTopics}`);
    console.log(`   - TrustedIssuers: ${trustedIssuers}`);
    console.log(`   - Storage: ${storageAddress}`);

    // 3. Encode ข้อมูลสำหรับการ Deploy
    const iface = new ethers.Interface(artifact.abi);
    // หมายเหตุ: เช็ค Constructor ใน Solidity ของกัปตันว่ารับ Parameter กี่ตัว 
    // ปกติ TREX IdentityRegistry รับ (TrustedIssuers, ClaimTopics, IdentityStorage)
    const deployData = ethers.concat([
        artifact.bytecode,
        iface.encodeDeploy([trustedIssuers, claimTopics, storageAddress])
    ]);

    try {
        console.log("\n📡 กำลังตรวจสอบเครือข่าย...");
        
        // ดึง Nonce และ Gas แบบ Safe
        const rawNonce = await provider.send("eth_getTransactionCount", [wallet.address, "latest"]);
        const nonce = typeof rawNonce === "string" ? parseInt(rawNonce, 16) : rawNonce;
        
        const gasPrice = await provider.send("eth_gasPrice", []);
        const network = await provider.getNetwork();

        // 4. ประกอบร่าง Transaction (Legacy Type เพื่อความชัวร์บน Devnet)
        const tx = {
            nonce: nonce,
            gasPrice: gasPrice,
            gasLimit: 5000000, // เพิ่ม Limit กัน Out of Gas สำหรับ Registry ใหญ่ๆ
            data: deployData,
            chainId: network.chainId,
            type: 0 
        };

        console.log("✍️  กำลังเซ็นชื่อยืนยันการติดตั้ง...");
        const signedTx = await wallet.signTransaction(tx);

        console.log("🚀 ยิง Raw Transaction เข้าสู่ระบบ...");
        const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);

        console.log("--------------------------------------------------");
        console.log(`✅ ยิงสำเร็จ! TX HASH: ${txHash}`);
        
        // คำนวณหา Address ล่วงหน้า
        const deployedAddr = ethers.getCreateAddress({ from: wallet.address, nonce: nonce });
        console.log(`🎯 IdentityRegistry จะติดตั้งที่: ${deployedAddr}`);
        
        // 5. บันทึกลง .env
        let envContent = fs.readFileSync(".env", "utf8");
        const entry = `IDENTITY_REGISTRY=${deployedAddr}`;
        
        if (envContent.includes("IDENTITY_REGISTRY=")) {
            envContent = envContent.replace(/IDENTITY_REGISTRY=.*/, entry);
        } else {
            envContent += `\n${entry}`;
        }
        
        fs.writeFileSync(".env", envContent);
        console.log("💾 บันทึกที่อยู่ใหม่ลง .env เรียบร้อย!");
        console.log("--------------------------------------------------");
        console.log("💡 ภารกิจเสร็จสิ้น! กัปตันไปพักผ่อนได้เลยครับ ยานแม่กำลังรอการยืนยันบน Block...");

    } catch (err: any) {
        console.error("\n❌ ระบบนิวเคลียร์ขัดข้อง:");
        console.error(err.message);
        if (err.data) console.error("Error Data:", err.data);
    }
}

main().catch(console.error);