require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // หรือเวอร์ชั่นที่กัปตันใช้
  networks: {
    // เปลี่ยนชื่อจาก 'localhost' หรือ 'ethereum' ให้เป็นชื่อยานแม่เรา
    uhuMainnet: {
      url: process.env.RPC_URL || "https://rpc.uhu-layer2.com",
      chainId: 1337,
      accounts: [process.env.PRIVATE_KEY],
      // กำหนดค่าเหล่านี้เพื่อให้ Hardhat เข้าใจว่าเป็น Chain เฉพาะ
      gasPrice: "auto",
    }
  },
  // ส่วนสำคัญ: ทำให้ Hardhat รู้จัก Explorer ของเรา (ถ้ามี)
  etherscan: {
    apiKey: {
      uhuMainnet: "uhu-secret-key" // ใส่ค่าหลอกไว้ก่อนได้ครับ
    },
    customChains: [
      {
        network: "uhuMainnet",
        chainId: 1337,
        urls: {
          apiURL: "https://explorer.uhu-layer2.com/api", // ใส่ URL Explorer ของกัปตัน
          browserURL: "https://explorer.uhu-layer2.com"
        }
      }
    ]
  }
};