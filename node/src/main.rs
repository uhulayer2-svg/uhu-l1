mod exex;
use crate::exex::neural_pulse::neural_pulse_exex;
use reth_node_ethereum::EthereumNode;

fn main() -> eyre::Result<()> {
    // 🚀 ใช้ Official CLI Wrapper ของ Reth ตัวท็อปสุด
    reth::cli::Cli::parse_args().run(|builder, _| async move {
        let handle = builder
            .node(EthereumNode::default())
            // ✅ Fix: ใส่กล่อง |ctx| async move { Ok(...) } หุ้ม AI ของเราไว้!
            .install_exex("NeuralPulse", |ctx| async move { 
                Ok(neural_pulse_exex(ctx)) 
            })
            .launch()
            .await?;

        // ปล่อยให้เครื่องรันต่อไปแบบไม่มีวันหยุด
        handle.wait_for_node_exit().await
    })
}