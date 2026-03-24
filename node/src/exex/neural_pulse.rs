use reth_exex::{ExExContext, ExExNotification};
use reth_node_api::FullNodeComponents;
use futures::StreamExt;
use tracing::info;

const UHU_RWA_ADDRESS: &str = "0xec144e845e0210e95c03eddcaecb0555be7df02b";

pub async fn neural_pulse_exex<Node: FullNodeComponents>(
    mut ctx: ExExContext<Node>,
) -> eyre::Result<()> {
    info!("🧠 Neural Pulse AI: Monitoring UHU Pulse L1...");

    while let Some(notification) = ctx.notifications.next().await {
        if let Ok(ExExNotification::ChainCommitted { new }) = notification {
            for block in new.blocks_iter() {
                for tx in block.block.body.transactions() {
                    if let Some(to) = tx.to() {
                        // ✅ ท่าไม้ตาย: แปลงค่าเป็นข้อความ (String) เพื่อเทียบค่า เลี่ยง Type Mismatch 100%
                        let to_str = format!("{:?}", to).to_lowercase();
                        if to_str.contains(UHU_RWA_ADDRESS) {
                            info!("🚀 [NEURAL PULSE] RWA Movement Detected!");
                            info!("📦 Hash: {:?}", tx.hash());
                        }
                    }
                }
            }
        }
    }
    Ok(())
}