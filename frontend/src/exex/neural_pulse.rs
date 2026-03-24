use reth_exex::{ExExContext, ExExNotification};
use reth_node_api::FullNodeComponents;
use reth_primitives::{Address, Chain};
use tracing::info;

/// 💎 ที่อยู่เหรียญ UHU Token V2 ของกัปตัน
const UHU_RWA_ADDRESS: &str = "0xec144e845e0210e95c03eddcaecb0555be7df02b";

pub async fn neural_pulse_exex<Node: FullNodeComponents>(
    mut ctx: ExExContext<Node>,
) -> eyre::Result<()> {
    info!("🧠 Neural Pulse AI: Monitoring UHU Pulse L1...");

    while let Some(notification) = ctx.notifications().await? {
        if let ExExNotification::ChainCommitted { new } = &notification {
            for block in new.blocks_iter() {
                for tx in block.body().transactions() {
                    // 🔍 ดักจับเฉพาะ Transaction ที่ส่งไปหา UHU Token
                    if let Some(to) = tx.to() {
                        if to == UHU_RWA_ADDRESS.parse::<Address>().unwrap() {
                            info!("🚀 [NEURAL PULSE] RWA Movement Detected!");
                            info!("📦 Hash: {:?}", tx.hash());
                            info!("👤 From: {:?}", tx.signer());
                            
                            // 🤖 ตรงนี้คือจุดที่เราจะใส่ Agent X AI Logic ในอนาคต
                            info!("🤖 AI Signal: Analyzing asset valuation...");
                        }
                    }
                }
            }
        }
    }
    Ok(())
}