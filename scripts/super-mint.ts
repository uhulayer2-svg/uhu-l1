import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const rpcUrl = "https://nonprovidently-instigative-deloris.ngrok-free.dev";
  const privateKey = "4c69c68d88d6f4ee55870e5d3b851e4cba8b47430963a37f63bc1f194580e77c"; 
  const tokenAddress = "0xec144e845e0210e95c03eddcaecb0555be7df02b"; 
  const toAddress = "0xd7e2446D4eF2C9C824E8eb7dd143ee5215e9409f"; 
  const amount = "1000000000.0"; 

  // ใช้ Provider แค่ดึงข้อมูลพื้นฐานแบบ Raw เท่านั้น
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey); // ไม่ต้องเชื่อม provider ตรงนี้เพื่อกันมัน Error

  const artifactPath = path.resolve(process.cwd(), "artifacts/contracts/UHUTokenV2.sol/UHUToken.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const iface = new ethers.Interface(artifact.abi);
  
  const mintData = iface.encodeFunctionData("mint", [toAddress, ethers.parseUnits(amount, 18)]);

  console.log("--------------------------------------------------");
  console.log("🚀 เข้าสู่โหมด: STEALTH BYPASS (ส่งตรงเข้า RPC ไม่ผ่าน Ethers Formatter)");
  
  try {
      // 1. ดึงข้อมูลดิบผ่าน RPC ตรงๆ (ข้ามด่านตรวจของ Ethers)
      console.log("📡 กำลังดึงข้อมูล Nonce และ Gas...");
      const nonce = await provider.send("eth_getTransactionCount", [wallet.address, "latest"]);
      const gasPrice = await provider.send("eth_gasPrice", []);
      const chainIdHex = await provider.send("eth_chainId", []);
      const chainId = parseInt(chainIdHex, 16);

      // 2. ประกอบร่าง Transaction แบบ Object ดิบ
      const tx = {
          to: tokenAddress,
          nonce: parseInt(nonce, 16),
          gasPrice: gasPrice,
          gasLimit: 200000, 
          data: mintData,
          chainId: chainId,
          type: 0 // Legacy
      };

      // 3. เซ็นชื่อด้วย Wallet (ขั้นตอนนี้ทำในคอมกัปตัน ไม่ต้องต่อเน็ต ไม่เจอ Error)
      console.log("✍️  กำลังเซ็นชื่อยืนยันความเป็นพระเจ้า...");
      const signedTx = await wallet.signTransaction(tx);

      // 4. ยิงเลขฐาน 16 ที่เซ็นแล้วเข้า RPC ตรงๆ!
      console.log("🚀 ยิงกระสุน Raw Hex เข้าสู่บล็อกเชน...");
      const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);

      console.log("--------------------------------------------------");
      console.log(`✅ ยิงสำเร็จ! TX HASH: ${txHash}`);
      console.log(`💰 ตรวจสอบยอดเงินที่: ${toAddress}`);
      console.log("--------------------------------------------------");
      console.log("💡 หมายเหตุ: ระบบจะไม่สามารถ 'Wait' ยืนยันได้เพราะบั๊กของ Ethers");
      console.log("💡 แต่ธุรกรรมถูกส่งไปแล้ว 100% กรุณาเช็คใน MetaMask หลังจากนี้ 10 วินาทีครับ");

  } catch (error: any) {
      console.error("❌ พ่ายแพ้ต่อระบบ:");
      console.error(error);
  }
}

main().catch(console.error);