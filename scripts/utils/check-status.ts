import { ethers, network } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    const networkInfo = await ethers.provider.getNetwork();

    console.log("\n🛸 --- UHU-L1 SHIP STATUS --- 🛸");
    console.log(`📡 Network Name: ${network.name}`);
    console.log(`🆔 Chain ID: ${networkInfo.chainId}`);
    console.log(`👨‍✈️ Captain Address: ${deployer.address}`);
    // แสดงผลเป็นหน่วย UHU แทน ETH
    console.log(`💰 Fuel Balance: ${ethers.formatEther(balance)} UHU`); 
    console.log("-------------------------------\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});