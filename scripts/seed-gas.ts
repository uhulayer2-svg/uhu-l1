import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const gasSponsorAddress = "0xF7a143cBc57f0AD75cD30EE8dFba7F143fD278Bd";
  const amount = ethers.parseEther("10000"); // จำนวน 10,000 Native UHU

  console.log(`\n⛽ --- SEEDING GAS SPONSOR POOL --- ⛽`);
  console.log(`👨‍✈️ From: ${deployer.address}`);
  console.log(`📥 To GasSponsor: ${gasSponsorAddress}`);

  const tx = await deployer.sendTransaction({
    to: gasSponsorAddress,
    value: amount,
  });

  await tx.wait();
  console.log(`✅ เติมน้ำมันสำเร็จ! TX: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});