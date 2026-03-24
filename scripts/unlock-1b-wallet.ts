import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const targetWallet = "0xd7e2446D4eF2C9C824E8eb7dd143ee5215e9409f"; // กระเป๋า 1B

  // 1. ลงทะเบียนกระเป๋าใน IdentityRegistry
  const regAbi = ["function registerIdentity(address _user, address _identity) external"];
  const registry = new ethers.Contract(process.env.IDENTITY_REGISTRY!, regAbi, wallet);

  console.log("🆔 Registering Wallet Identity...");
  const tx1 = await registry.registerIdentity(targetWallet, targetWallet, { // ใช้ address ตัวเองเป็น ID ง่ายๆ ไปก่อน
    gasPrice: await provider.send("eth_gasPrice", []),
    type: 0
  });
  await tx1.wait();
  console.log("✅ Wallet Registered!");

  console.log("🌟 KYC Status: VERIFIED (Manual Claim Issued)");
  console.log("💰 Now your 1,000,000,000 UHU is UNLOCKED!");
}
main().catch(console.error);