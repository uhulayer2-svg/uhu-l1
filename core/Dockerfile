# 🏗️ Build Stage: ใช้ Rust ตัวเต็มในการคอมไพล์โค้ดแบบรีดพลังสูงสุด (Release Mode)
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release -p uhu-core

# 🚀 Run Stage: ใช้ OS ขนาดเล็กจิ๋วเพื่อความเบาและเร็ว
FROM debian:bookworm-slim
WORKDIR /uhu
COPY --from=builder /app/target/release/uhu-core /uhu/
EXPOSE 3030 30333
CMD ["./uhu-core"]
