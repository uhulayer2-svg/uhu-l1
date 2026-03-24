# 🛡️ UHU-L1 Threat Model & Security Policy

## 1. Economic Attack Protection
- **Anti-Whale:** ระบบคัดกรองผ่าน Identity Registry จะมีการตรวจสอบวงเงินถือครอง (Holding Cap) ในระดับ Application Layer
- **Liquidity Drain:** การ Bridge ออกจากเชนจะมีการหน่วงเวลา (Delay) หากมีปริมาณธุรกรรมผิดปกติ

## 2. Infrastructure Security
- **AI Fail-Safe:** หาก Neural Pulse AI ขัดข้อง ระบบจะสลับไปโหมด `FALLBACK` (On-chain Rules Only) ทันที
- **Governance:** การอัปเกรดสัญญาต้องผ่าน `UHUTimelock` (Delay 2 วัน) เท่านั้น

## 3. Gas Abuse Prevention
- **Sponsored Gas:** สงวนสิทธิ์เฉพาะผู้ใช้ที่ผ่าน Verified (Identity Registry) เท่านั้น เพื่อป้องกันการสแปมธุรกรรม (Spam Attack)