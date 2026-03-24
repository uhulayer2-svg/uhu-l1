import { ethers } from "hardhat";
import * as dotenv from "dotenv";

// โหลดค่าจาก .env
dotenv.config();

async function main() {
  // 1. ดึงข้อมูล Signer (Issuer)
  const [deployer] = await ethers.getSigners();
  console.log("🦉 UHU L1 - Generating KYC Signature (Off-chain Raw)");

  // 2. ข้อมูลประกอบการทำ Claim
  const claimIssuerAddress = "0xE5DafB9EBfe90272209DAd6F21e8E3853eA82b36";
  const userAddress = deployer.address; // ออกให้ตัวเองเพื่อทดสอบ
  const claimTopic = 1; // 1 = KYC Topic
  const data = ethers.hexlify(ethers.toUtf8Bytes("UHU_KYC_LEVEL_1"));

  // 3. เตรียม Private Key (ดักจับเรื่อง 0x ให้เรียบร้อย)
  let pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("❌ ไม่พบ PRIVATE_KEY ในไฟล์ .env");
  const privateKey = pk.startsWith("0x") ? pk : `0x${pk}`;

  // 4. สร้าง Hash (Digest) แบบเดียวกับที่ Solidity ใช้ (abi.encode)
  // หมายเหตุ: สัญญาของกัปตันใช้ keccak256(abi.encode(_identity, _topic, _data))
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedData = abiCoder.encode(
    ["address", "uint256", "bytes"],
    [userAddress, claimTopic, data]
  );
  const digest = ethers.keccak256(encodedData);

  // 5. การเซ็นชื่อแบบ Raw (SigningKey) เพื่อให้ได้ค่า r, s, v ที่ตรงกับ ecrecover
  // เราไม่ใช้ deployer.signMessage เพราะมันจะเติม Ethereum Prefix ที่สัญญาของกัปตันไม่ได้เขียนดักไว้
  // --- แก้ไขแบบ Low-level เพื่อให้ TypeScript ไม่บ่น ---
  const signingKey = new ethers.SigningKey(privateKey);
  const sig = signingKey.sign(digest);
  
  // ใช้ v.toString() เพื่อเลี่ยงปัญหาเรื่อง Type ของ BigInt
  const vValue = sig.v.toString();
  const vHex = (vValue === "27") ? "0x1b" : "0x1c";

  const signature = ethers.concat([
    sig.r, 
    sig.s, 
    vHex
  ]);

  console.log("\n--------------------------------------------------");
  console.log("✅ สร้างลายเซ็นดิจิทัลสำเร็จ!");
  console.log("👤 User Address:", userAddress);
  console.log("📝 Claim Topic:", claimTopic);
  console.log("💾 Data (Hex):", data);
  console.log("✍️  Signature:", signature);
  console.log("--------------------------------------------------\n");

  // 6. ทดสอบเรียกฟังก์ชัน isClaimValid ใน Smart Contract จริงๆ
  const ClaimIssuer = await ethers.getContractFactory("UHUClaimIssuer");
  const issuer = ClaimIssuer.attach(claimIssuerAddress) as any;
  
  try {
    const isValid = await issuer.isClaimValid(userAddress, claimTopic, signature, data);
    if (isValid) {
      console.log("🔍 ผลการตรวจสอบ Smart Contract: ✅ ผ่าน! (Valid)");
      console.log("🚀 ยินดีด้วยกัปตัน! ระบบ Identity ของเราพร้อมใช้งานแล้ว");
    } else {
      console.log("🔍 ผลการตรวจสอบ Smart Contract: ❌ ไม่ผ่าน! (Invalid)");
      console.log("💡 คำแนะนำ: ตรวจสอบว่ากระเป๋าที่เซ็นชื่อ (ใน .env) คือ Owner ของสัญญานี้หรือไม่");
    }
  } catch (err: any) {
    console.log("⚠️ ตรวจสอบไม่ได้: ", err.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});