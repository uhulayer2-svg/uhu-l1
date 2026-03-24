pub fn scan_security(block_height: u64) -> &'static str {
    // โค้ดจำลองระบบ AI: สแกนหาความผิดปกติ (Anomaly)
    // ถ้าเลขบล็อกหาร 73 ลงตัว (จำลองว่าเจอพฤติกรรมน่าสงสัย) AI จะทำการบล็อคทันที!
    if block_height % 73 == 0 {
        return "⚠️ [THREAT NEUTRALIZED] Malicious Tx blocked in 0.001ms!";
    }
    "🛡️ [SECURE] 100% Data Integrity."
}
