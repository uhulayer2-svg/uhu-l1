import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const rpcUrl = "https://nonprovidently-instigative-deloris.ngrok-free.dev";
  const privateKey = "4c69c68d88d6f4ee55870e5d3b851e4cba8b47430963a37f63bc1f194580e77c";
  const tokenAddress = "0xec144e845e0210e95c03eddcaecb0555be7df02b"; // Address V2
  
  const toAddress = "0x2Eeb0f207C8CF5Fe5F74F50D54572183FDF1087c"; // เสกให้ใคร?
  const amount = "500000.0"; // เสกเท่าไหร่?

  const ProviderClass = (ethers as any).JsonRpcProvider || (ethers as any).providers.JsonRpcProvider;
  const provider = new ProviderClass(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const artifact = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "artifacts/contracts/UHUTokenV2.sol/UHUTokenV2.json"), "utf8"));
  const contract = new ethers.Contract(tokenAddress, artifact.abi, wallet);

  console.log(`🪄 Minting ${amount} UHU to ${toAddress}...`);
  const tx = await contract.mint(toAddress, (ethers as any).utils?.parseEther(amount) || ethers.parseEther(amount), {
      gasPrice: await provider.send("eth_gasPrice", []),
      gasLimit: 100000,
      type: 0
  });
  await tx.wait();
  console.log("✅ Minting Successful!");
}
main().catch(console.error);