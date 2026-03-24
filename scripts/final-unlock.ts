import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const rpcUrl = process.env.RPC_URL!;
    const privateKey = process.env.PRIVATE_KEY!;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey);

    const tokenAddr = "0xec144e845e0210e95c03eddcaecb0555be7df02b"; 
    const identityRegistry = process.env.IDENTITY_REGISTRY!;
    const targetWallet = "0xd7e2446D4eF2C9C824E8eb7dd143ee5215e9409f";

    console.log("--------------------------------------------------");
    console.log("🚀 เริ่มภารกิจ: FINAL UNLOCK (เปิดวาล์วเงินพันล้าน)");

    try {
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        // --- STEP 1: Link Token to IdentityRegistry ---
        console.log("🔗 1. กำลังเชื่อมต่อ Token เข้ากับ IdentityRegistry...");
        const tokenIface = new ethers.Interface(["function setIdentityRegistry(address _identityRegistry) external"]);
        const data1 = tokenIface.encodeFunctionData("setIdentityRegistry", [identityRegistry]);
        
        const nonce1 = await provider.send("eth_getTransactionCount", [wallet.address, "latest"]);
        const tx1 = {
            to: tokenAddr,
            nonce: parseInt(nonce1, 16),
            gasPrice: await provider.send("eth_gasPrice", []),
            gasLimit: 200000,
            data: data1,
            chainId: chainId,
            type: 0
        };
        const signedTx1 = await wallet.signTransaction(tx1);
        const hash1 = await provider.send("eth_sendRawTransaction", [signedTx1]);
        console.log(`✅ เชื่อมท่อสำเร็จ! TX: ${hash1}`);

        // --- STEP 2: Register Identity for 1B Wallet ---
        console.log("🆔 2. กำลังลงทะเบียนกระเป๋าพันล้านให้เป็น Verified Identity...");
        const regIface = new ethers.Interface(["function registerIdentity(address _user, address _identity) external"]);
        const data2 = regIface.encodeFunctionData("registerIdentity", [targetWallet, targetWallet]);
        
        const nonce2 = (parseInt(nonce1, 16) + 1); // เพิ่ม Nonce ต่อจากเมื่อกี้
        const tx2 = {
            to: identityRegistry,
            nonce: nonce2,
            gasPrice: await provider.send("eth_gasPrice", []),
            gasLimit: 200000,
            data: data2,
            chainId: chainId,
            type: 0
        };
        const signedTx2 = await wallet.signTransaction(tx2);
        const hash2 = await provider.send("eth_sendRawTransaction", [signedTx2]);
        console.log(`✅ ลงทะเบียนสำเร็จ! TX: ${hash2}`);

        console.log("--------------------------------------------------");
        console.log("🏁 ภารกิจเสร็จสิ้น!");
        console.log(`💰 กระเป๋า: ${targetWallet}`);
        console.log("🌟 สถานะ: UNLOCKED (พร้อมโอน 1,000,000,000 UHU แล้วครับ!)");
        console.log("--------------------------------------------------");

    } catch (err: any) {
        console.error("❌ พ่ายแพ้ระหว่างปลดล็อก:", err.message);
    }
}

main().catch(console.error);