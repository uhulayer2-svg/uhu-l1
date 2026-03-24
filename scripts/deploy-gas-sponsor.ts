import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n⛽ --- DEPLOYING UHU GAS SPONSOR POOL --- ⛽");
  console.log(`👨‍✈️ Owner: ${deployer.address}`);

  const GasSponsor = await ethers.getContractFactory("GasSponsor");
  const sponsor = await GasSponsor.deploy();

  await sponsor.waitForDeployment();
  const sponsorAddress = await sponsor.getAddress();

  console.log(`✅ GasSponsor Deployed at: ${sponsorAddress}`);
  console.log(`💡 Tip: กัปตันสามารถโอน Native UHU เข้าที่อยู่นี้เพื่อเริ่มระบบ Sponsored Gas ได้เลยครับ`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});