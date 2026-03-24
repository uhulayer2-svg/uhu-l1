import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n🏗️ --- DEPLOYING RWA INFRASTRUCTURE --- 🏗️");
  console.log(`👨‍✈️ Deploying with Captain: ${deployer.address}\n`);

  // 1. Deploy Identity Registry
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identity = await IdentityRegistry.deploy();
  await identity.waitForDeployment();
  console.log(`🆔 Identity Registry: ${await identity.getAddress()}`);

  // 2. Deploy Trusted Issuers
  const IssuersRegistry = await ethers.getContractFactory("TrustedIssuersRegistry");
  const issuers = await IssuersRegistry.deploy();
  await issuers.waitForDeployment();
  console.log(`📜 Trusted Issuers:  ${await issuers.getAddress()}`);

  console.log("\n✅ --- INFRASTRUCTURE READY --- ✅");
}

main().catch((error) => {
  console.error("❌ Deployment Failed:", error);
  process.exitCode = 1;
});